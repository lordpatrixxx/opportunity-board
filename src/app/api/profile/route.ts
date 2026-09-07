import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userWithProfile = await db.user.findUnique({
      where: { id: currentUser.id },
      include: { profile: true },
    });

    return NextResponse.json({ user: userWithProfile });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();

    // Update user basic info
    if (body.fullName) {
      await db.user.update({
        where: { id: currentUser.id },
        data: { fullName: body.fullName },
      });
    }

    // Upsert profile info
    const profile = await db.profile.upsert({
      where: { userId: currentUser.id },
      create: {
        userId: currentUser.id,
        university: body.university || null,
        degree: body.degree || null,
        fieldOfStudy: body.fieldOfStudy || null,
        graduationYear: body.graduationYear ? parseInt(body.graduationYear, 10) : null,
        bio: body.bio || null,
        location: body.location || null,
        phone: body.phone || null,
        preferredWorkMode: body.preferredWorkMode || null,
        preferredCategories: body.preferredCategories || null,
        skills: body.skills || null,
      },
      update: {
        university: body.university !== undefined ? body.university : undefined,
        degree: body.degree !== undefined ? body.degree : undefined,
        fieldOfStudy: body.fieldOfStudy !== undefined ? body.fieldOfStudy : undefined,
        graduationYear: body.graduationYear !== undefined ? parseInt(body.graduationYear, 10) : undefined,
        bio: body.bio !== undefined ? body.bio : undefined,
        location: body.location !== undefined ? body.location : undefined,
        phone: body.phone !== undefined ? body.phone : undefined,
        preferredWorkMode: body.preferredWorkMode !== undefined ? body.preferredWorkMode : undefined,
        preferredCategories: body.preferredCategories !== undefined ? body.preferredCategories : undefined,
        skills: body.skills !== undefined ? body.skills : undefined,
      },
    });

    return NextResponse.json({
      message: 'Profile preferences saved successfully',
      profile,
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Permanently delete user and cascade records
    await db.user.delete({
      where: { id: currentUser.id },
    });

    const response = NextResponse.json({
      message: 'Account permanently deleted',
    });

    // Clear session cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
