import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const opportunity = await db.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
        category: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    db.opportunity
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    // Check bookmark status
    let isBookmarked = false;
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const bookmark = await db.bookmark.findUnique({
        where: {
          userId_opportunityId: {
            userId: currentUser.id,
            opportunityId: id,
          },
        },
      });
      isBookmarked = !!bookmark;
    }

    // Find related opportunities
    const related = await db.opportunity.findMany({
      where: {
        categoryId: opportunity.categoryId,
        id: { not: id },
        status: 'approved',
      },
      include: {
        organization: true,
        category: true,
      },
      take: 2,
    });

    return NextResponse.json({
      opportunity: {
        ...opportunity,
        isBookmarked,
      },
      related,
    });
  } catch (err: any) {
    console.error('Fetch opportunity details error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const opportunity = await db.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Server-side ownership authorization check
    if (opportunity.userId !== currentUser.id && currentUser.role !== 'ADMIN' && currentUser.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden: You do not own this listing' }, { status: 403 });
    }

    const body = await req.json();

    const updated = await db.opportunity.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : opportunity.title,
        opportunityType: body.opportunityType !== undefined ? body.opportunityType : opportunity.opportunityType,
        workplaceMode: body.workplaceMode !== undefined ? body.workplaceMode : opportunity.workplaceMode,
        location: body.location !== undefined ? body.location : opportunity.location,
        compensationType: body.compensationType !== undefined ? body.compensationType : opportunity.compensationType,
        compensationAmount: body.compensationAmount !== undefined ? body.compensationAmount : opportunity.compensationAmount,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : opportunity.applicationDeadline,
        duration: body.duration !== undefined ? body.duration : opportunity.duration,
        shortSummary: body.shortSummary !== undefined ? body.shortSummary : opportunity.shortSummary,
        description: body.description !== undefined ? body.description : opportunity.description,
        eligibility: body.eligibility !== undefined ? body.eligibility : opportunity.eligibility,
        applicationUrl: body.applicationUrl !== undefined ? body.applicationUrl : opportunity.applicationUrl,
        contactEmail: body.contactEmail !== undefined ? body.contactEmail : opportunity.contactEmail,
        status: body.status !== undefined ? body.status : opportunity.status,
      },
      include: {
        organization: true,
        category: true,
      },
    });

    return NextResponse.json({
      message: 'Listing updated successfully',
      opportunity: updated,
    });
  } catch (err: any) {
    console.error('Update opportunity error:', err);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const opportunity = await db.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Server-side ownership authorization check
    if (opportunity.userId !== currentUser.id && currentUser.role !== 'ADMIN' && currentUser.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden: You do not own this listing' }, { status: 403 });
    }

    // Delete cascading relations and opportunity
    await db.bookmark.deleteMany({ where: { opportunityId: id } });
    await db.opportunityTag.deleteMany({ where: { opportunityId: id } });
    await db.report.deleteMany({ where: { opportunityId: id } });
    await db.moderationRecord.deleteMany({ where: { opportunityId: id } });
    await db.opportunity.delete({ where: { id } });

    return NextResponse.json({
      message: 'Opportunity deleted successfully',
      deletedId: id,
    });
  } catch (err: any) {
    console.error('Delete opportunity error:', err);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
