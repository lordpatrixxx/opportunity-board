import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
