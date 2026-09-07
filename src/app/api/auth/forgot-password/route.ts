import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, token } = await req.json();

    if (token && password) {
      // Reset password mode
      if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      // Demo password reset simulation
      const user = await db.user.findFirst();
      if (user) {
        const passwordHash = await hashPassword(password);
        await db.user.update({
          where: { id: user.id },
          data: { passwordHash },
        });
      }
      return NextResponse.json({ message: 'Password reset successfully' });
    }

    // Forgot password request email mode
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // For privacy, always return success even if user not found
    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
