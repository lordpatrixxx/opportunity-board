import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, fullName } = result.data;

    // Check existing
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role: 'USER',
        profile: {
          create: {
            university: 'Stanford University',
            onboardingCompleted: false,
          },
        },
      },
      include: { profile: true },
    });

    const token = await signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const { passwordHash: _, ...safeUser } = user;

    const response = NextResponse.json(
      { message: 'Registration successful', user: safeUser },
      { status: 201 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
