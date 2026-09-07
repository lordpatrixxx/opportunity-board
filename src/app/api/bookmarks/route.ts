import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId: currentUser.id },
      include: {
        opportunity: {
          include: {
            organization: true,
            category: true,
            tags: {
              include: { tag: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = bookmarks.map((b) => ({
      ...b.opportunity,
      opportunityId: b.opportunityId,
      opportunity: b.opportunity,
      isBookmarked: true,
      bookmarkedAt: b.createdAt,
    }));

    return NextResponse.json({
      bookmarks: formatted,
      total: formatted.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
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
    const { opportunityId } = body;

    if (!opportunityId) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    const opportunity = await db.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Insert or ignore if duplicate
    const bookmark = await db.bookmark.upsert({
      where: {
        userId_opportunityId: {
          userId: currentUser.id,
          opportunityId,
        },
      },
      create: {
        userId: currentUser.id,
        opportunityId,
      },
      update: {},
    });

    // Increment bookmark counter on opportunity
    await db.opportunity.update({
      where: { id: opportunityId },
      data: { bookmarkCount: { increment: 1 } },
    });

    const currentCount = await db.bookmark.count({
      where: { userId: currentUser.id },
    });

    return NextResponse.json(
      { message: 'Saved to your Watchlist', bookmark, savedCount: currentCount },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Bookmark error:', err);
    return NextResponse.json(
      { error: 'Failed to save opportunity' },
      { status: 500 }
    );
  }
}
