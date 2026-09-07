import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null, savedCount: 0 }, { status: 401 });
    }

    const savedCount = await db.bookmark.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      user: {
        ...user,
        name: user.fullName || (user as any).name,
      },
      profile: user.profile,
      savedCount,
    });
  } catch (err) {
    return NextResponse.json({ user: null, savedCount: 0 }, { status: 500 });
  }
}
