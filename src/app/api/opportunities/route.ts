import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationUrl: z.string().url().optional().or(z.literal('')),
  organizationLogoUrl: z.string().optional().or(z.literal('')),
  categorySlug: z.string().min(1, 'Category is required'),
  opportunityType: z.string().min(1, 'Opportunity type is required'),
  workplaceMode: z.enum(['remote', 'onsite', 'hybrid']),
  location: z.string().optional().or(z.literal('')),
  compensationType: z.string().optional().or(z.literal('')),
  compensationAmount: z.string().optional().or(z.literal('')),
  applicationDeadline: z.string().optional().or(z.literal('')),
  duration: z.string().optional().or(z.literal('')),
  shortSummary: z.string().optional().or(z.literal('')),
  description: z.string().min(30, 'Description must be at least 30 characters'),
  eligibility: z.string().optional().or(z.literal('')),
  applicationUrl: z.string().url('Application URL must be a valid URL'),
  contactEmail: z.string().email().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const workplaceMode = searchParams.get('workplaceMode');
    const location = searchParams.get('location')?.trim();
    const deadline = searchParams.get('deadline');
    const compensation = searchParams.get('compensation');
    const sort = searchParams.get('sort') || 'deadline_asc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);

    const currentUser = await getCurrentUser();

    // Base filter: only approved listings for public feed
    const where: any = {
      status: 'approved',
    };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { shortSummary: { contains: q } },
        { organization: { name: { contains: q } } },
      ];
    }

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (type && type !== 'all') {
      where.opportunityType = { equals: type };
    }

    if (workplaceMode && workplaceMode !== 'all' && workplaceMode !== 'any') {
      where.workplaceMode = workplaceMode.toLowerCase();
    }

    if (location) {
      where.location = { contains: location };
    }

    if (compensation && compensation !== 'all') {
      where.compensationType = compensation;
    }

    const now = new Date();
    if (deadline === 'urgent') {
      const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      where.applicationDeadline = {
        gte: now,
        lte: in48h,
      };
    } else if (deadline === 'week') {
      const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      where.applicationDeadline = {
        gte: now,
        lte: in7d,
      };
    } else if (deadline === 'rolling') {
      where.applicationDeadline = null;
    }

    // Sorting
    let orderBy: any = { applicationDeadline: 'asc' };
    if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'popular') {
      orderBy = { viewCount: 'desc' };
    } else if (sort === 'bookmarks') {
      orderBy = { bookmarkCount: 'desc' };
    }

    const [total, opportunities] = await Promise.all([
      db.opportunity.count({ where }),
      db.opportunity.findMany({
        where,
        include: {
          organization: true,
          category: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    // Attach bookmark status if logged in
    let userBookmarks = new Set<string>();
    if (currentUser) {
      const bookmarks = await db.bookmark.findMany({
        where: { userId: currentUser.id },
        select: { opportunityId: true },
      });
      userBookmarks = new Set(bookmarks.map((b) => b.opportunityId));
    }

    const formattedOpportunities = opportunities.map((opp) => ({
      ...opp,
      isBookmarked: userBookmarks.has(opp.id),
    }));

    return NextResponse.json({
      opportunities: formattedOpportunities,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err: any) {
    console.error('Failed to fetch opportunities:', err);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const result = createOpportunitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Find or create organization
    const orgSlug = data.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let organization = await db.organization.findUnique({
      where: { slug: orgSlug },
    });

    if (!organization) {
      organization = await db.organization.create({
        data: {
          name: data.organizationName,
          slug: orgSlug,
          websiteUrl: data.organizationUrl || null,
          logoUrl: data.organizationLogoUrl || null,
          isVerified: false,
        },
      });
    }

    // Find category
    let category = await db.category.findUnique({
      where: { slug: data.categorySlug },
    });

    if (!category) {
      category = await db.category.findFirst({
        where: {
          OR: [
            { id: data.categorySlug },
            { name: { contains: data.categorySlug } },
            { slug: { contains: data.categorySlug } },
          ],
        },
      });
    }

    if (!category) {
      category = await db.category.findFirst();
    }

    if (!category) {
      return NextResponse.json({ error: 'No category available' }, { status: 400 });
    }

    const applicationDeadline = data.applicationDeadline
      ? new Date(data.applicationDeadline)
      : null;

    // Auto-approve user created opportunities in demo so they appear in feed and my-posts
    const opportunity = await db.opportunity.create({
      data: {
        userId: currentUser.id,
        organizationId: organization.id,
        categoryId: category.id,
        title: data.title,
        opportunityType: data.opportunityType,
        workplaceMode: data.workplaceMode,
        location: data.location || null,
        compensationType: data.compensationType || 'stipend',
        compensationAmount: data.compensationAmount || null,
        applicationDeadline,
        duration: data.duration || null,
        shortSummary: data.shortSummary || data.description.substring(0, 150),
        description: data.description,
        eligibility: data.eligibility || null,
        applicationUrl: data.applicationUrl,
        contactEmail: data.contactEmail || null,
        status: 'approved',
        isFeatured: false,
        isUrgent: false,
      },
      include: {
        organization: true,
        category: true,
      },
    });

    // Handle skills/tags
    if (data.skills && data.skills.length > 0) {
      for (const skillName of data.skills) {
        if (!skillName.trim()) continue;
        const skillSlug = skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let tag = await db.tag.findUnique({ where: { slug: skillSlug } });
        if (!tag) {
          tag = await db.tag.create({
            data: { name: skillName.trim(), slug: skillSlug },
          });
        }
        await db.opportunityTag.create({
          data: {
            opportunityId: opportunity.id,
            tagId: tag.id,
          },
        }).catch(() => {});
      }
    }

    // Create confirmation notification
    await db.notification.create({
      data: {
        userId: currentUser.id,
        type: 'STATUS',
        title: 'Opportunity published live!',
        message: `Your listing "${opportunity.title}" has been published and is now discoverable by thousands of students.`,
        actionUrl: `/opportunities/${opportunity.id}`,
      },
    });

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (err: any) {
    console.error('Create opportunity error:', err);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
