import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const posts = await db.opportunity.findMany({
      where: { userId: currentUser.id },
      include: {
        organization: true,
        category: true,
        _count: {
          select: { bookmarks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ posts, opportunities: posts });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch your posts' }, { status: 500 });
  }
}
