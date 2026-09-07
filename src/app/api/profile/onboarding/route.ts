import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();

    // Map fields from onboarding wizard
    const university = body.university || body.education || undefined;
    const preferredWorkMode = body.preferredWorkMode || body.workplacePreference || undefined;
    const preferredCategories = body.preferredCategories
      ? body.preferredCategories
      : Array.isArray(body.interests)
      ? body.interests.join(',')
      : body.interests || undefined;
    const location = body.location || undefined;
    const graduationYear = body.graduationYear ? parseInt(body.graduationYear.toString(), 10) : undefined;
    const skills = body.skills
      ? Array.isArray(body.skills)
        ? body.skills.join(',')
        : body.skills
      : undefined;

    const profile = await db.profile.upsert({
      where: { userId: currentUser.id },
      create: {
        userId: currentUser.id,
        university: university || null,
        degree: body.degree || null,
        fieldOfStudy: body.fieldOfStudy || null,
        graduationYear: graduationYear || null,
        location: location || null,
        bio: body.bio || null,
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
        location: location !== undefined ? location : undefined,
        bio: body.bio !== undefined ? body.bio : undefined,
        preferredWorkMode: preferredWorkMode !== undefined ? preferredWorkMode : undefined,
        preferredCategories: preferredCategories !== undefined ? preferredCategories : undefined,
        skills: skills !== undefined ? skills : undefined,
        onboardingCompleted: true,
      },
    });

    const updatedUser = await db.user.findUnique({
      where: { id: currentUser.id },
      include: { profile: true },
    });

    const { passwordHash: _, ...safeUser } = updatedUser!;

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      profile,
      user: {
        ...safeUser,
        name: safeUser.fullName,
      },
    });
  } catch (err: any) {
    console.error('Onboarding save error:', err);
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}
