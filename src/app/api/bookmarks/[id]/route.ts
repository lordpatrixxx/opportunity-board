import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // opportunity ID
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await db.bookmark.deleteMany({
      where: {
        userId: currentUser.id,
        opportunityId: id,
      },
    });

    // Decrement counter safely
    await db.opportunity
      .update({
        where: { id },
        data: {
          bookmarkCount: {
            decrement: 1,
          },
        },
      })
      .catch(() => {});

    const currentCount = await db.bookmark.count({
      where: { userId: currentUser.id },
    });

    return NextResponse.json({
      message: 'Opportunity removed from Saved',
      savedCount: currentCount,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 });
  }
}
