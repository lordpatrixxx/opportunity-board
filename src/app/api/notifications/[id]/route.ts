import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const updated = await db.notification.updateMany({
      where: { id, userId: currentUser.id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
