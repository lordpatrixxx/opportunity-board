import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await db.notification.updateMany({
      where: { userId: currentUser.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
