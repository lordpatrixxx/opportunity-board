import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.string().optional(),
  university: z.string().optional(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.union([z.string(), z.number()]).optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
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

    const {
      email,
      password,
      fullName,
      role,
      university,
      degree,
      fieldOfStudy,
      graduationYear,
      location,
      bio,
    } = result.data;

    // Check existing user
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
        role: role === 'HOST' ? 'HOST' : 'USER',
        profile: {
          create: {
            university: university || null,
            degree: degree || null,
            fieldOfStudy: fieldOfStudy || null,
            graduationYear: graduationYear ? parseInt(graduationYear.toString(), 10) : null,
            location: location || null,
            bio: bio || null,
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
    const responseUser = {
      ...safeUser,
      name: user.fullName,
    };

    const response = NextResponse.json(
      { message: 'Registration successful', user: responseUser },
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
