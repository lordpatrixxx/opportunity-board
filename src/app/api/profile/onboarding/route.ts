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

    const profile = await db.profile.upsert({
      where: { userId: currentUser.id },
      create: {
        userId: currentUser.id,
        university: body.university || 'Stanford University',
        degree: body.degree || 'B.S.',
        fieldOfStudy: body.fieldOfStudy || 'Computer Science',
        preferredWorkMode: body.preferredWorkMode || 'remote,hybrid',
        preferredCategories: body.preferredCategories || 'internships,fellowships',
        skills: body.skills || 'AI, Python, TypeScript',
        onboardingCompleted: true,
      },
      update: {
        university: body.university || undefined,
        degree: body.degree || undefined,
        fieldOfStudy: body.fieldOfStudy || undefined,
        preferredWorkMode: body.preferredWorkMode || undefined,
        preferredCategories: body.preferredCategories || undefined,
        skills: body.skills || undefined,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      profile,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}
