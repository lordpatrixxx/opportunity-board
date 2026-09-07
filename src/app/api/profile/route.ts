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

    if (!userWithProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash: _, ...safeUser } = userWithProfile;

    return NextResponse.json({
      user: {
        ...safeUser,
        name: safeUser.fullName,
      },
      profile: safeUser.profile,
    });
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
    const fullName = (body.fullName || body.name)?.trim();
    if (fullName) {
      await db.user.update({
        where: { id: currentUser.id },
        data: { fullName },
      });
    }

    // Process fields with aliases
    const university = body.university !== undefined ? body.university : body.education;
    const preferredWorkMode = body.preferredWorkMode !== undefined ? body.preferredWorkMode : body.workplacePreference;
    const preferredCategories = body.preferredCategories !== undefined
      ? body.preferredCategories
      : Array.isArray(body.interests)
      ? body.interests.join(',')
      : body.interests;
    const skills = body.skills !== undefined
      ? Array.isArray(body.skills)
        ? body.skills.join(',')
        : body.skills
      : undefined;
    const graduationYear = body.graduationYear !== undefined
      ? (body.graduationYear ? parseInt(body.graduationYear.toString(), 10) : null)
      : undefined;

    // Upsert profile info
    const profile = await db.profile.upsert({
      where: { userId: currentUser.id },
      create: {
        userId: currentUser.id,
        university: university || null,
        degree: body.degree || null,
        fieldOfStudy: body.fieldOfStudy || null,
        graduationYear: graduationYear || null,
        bio: body.bio || null,
        location: body.location || null,
        phone: body.phone || null,
        linkedinUrl: body.linkedinUrl || null,
        githubUrl: body.githubUrl || null,
        portfolioUrl: body.portfolioUrl || null,
        preferredWorkMode: preferredWorkMode || null,
        preferredCategories: preferredCategories || null,
        skills: skills || null,
        onboardingCompleted: true,
      },
      update: {
        university: university !== undefined ? university : undefined,
        degree: body.degree !== undefined ? body.degree : undefined,
        fieldOfStudy: body.fieldOfStudy !== undefined ? body.fieldOfStudy : undefined,
        graduationYear: graduationYear !== undefined ? graduationYear : undefined,
        bio: body.bio !== undefined ? body.bio : undefined,
        location: body.location !== undefined ? body.location : undefined,
        phone: body.phone !== undefined ? body.phone : undefined,
        linkedinUrl: body.linkedinUrl !== undefined ? body.linkedinUrl : undefined,
        githubUrl: body.githubUrl !== undefined ? body.githubUrl : undefined,
        portfolioUrl: body.portfolioUrl !== undefined ? body.portfolioUrl : undefined,
        preferredWorkMode: preferredWorkMode !== undefined ? preferredWorkMode : undefined,
        preferredCategories: preferredCategories !== undefined ? preferredCategories : undefined,
        skills: skills !== undefined ? skills : undefined,
      },
    });

    const updatedUser = await db.user.findUnique({
      where: { id: currentUser.id },
      include: { profile: true },
    });

    const { passwordHash: _, ...safeUpdatedUser } = updatedUser!;

    return NextResponse.json({
      message: 'Profile preferences saved successfully',
      profile,
      user: {
        ...safeUpdatedUser,
        name: safeUpdatedUser.fullName,
      },
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
