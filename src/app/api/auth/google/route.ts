import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { decodeJwt } from 'jose';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let email = '';
    let fullName = '';
    let avatarUrl: string | null = null;

    if (body.credential) {
      // Google Identity Services JWT token
      try {
        const payload: any = decodeJwt(body.credential);
        email = payload.email;
        fullName = payload.name || payload.given_name || (email ? email.split('@')[0] : '');
        avatarUrl = payload.picture || null;
      } catch (e) {
        return NextResponse.json({ error: 'Invalid Google credential token' }, { status: 400 });
      }
    } else if (body.accessToken) {
      // Direct Google OAuth access token
      try {
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${body.accessToken}` },
        });
        if (googleRes.ok) {
          const gData = await googleRes.json();
          email = gData.email;
          fullName = gData.name || gData.given_name || (email ? email.split('@')[0] : '');
          avatarUrl = gData.picture || null;
        }
      } catch (err) {
        console.warn('Error fetching Google userinfo with access token:', err);
      }
    }

    if (!email && body.email) {
      email = body.email;
      fullName = body.fullName || body.name || email.split('@')[0];
      avatarUrl = body.avatarUrl || avatarUrl || null;
    } else if (!email) {
      return NextResponse.json({ error: 'Google credential, access token or email is required' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid Google email is required' }, { status: 400 });
    }

    email = email.toLowerCase().trim();

    // Check if user already exists
    let user = await db.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      // Generate a secure random password hash for OAuth user
      const randomPassword = await hashPassword(Math.random().toString(36).substring(2) + Date.now());
      user = await db.user.create({
        data: {
          email,
          fullName: fullName || email.split('@')[0],
          passwordHash: randomPassword,
          role: body.role === 'HOST' ? 'HOST' : 'USER',
          avatarUrl: avatarUrl,
          profile: {
            create: {
              onboardingCompleted: false,
            },
          },
        },
        include: { profile: true },
      });
    } else if (avatarUrl && !user.avatarUrl) {
      // Update avatarUrl if empty
      user = await db.user.update({
        where: { id: user.id },
        data: { avatarUrl },
        include: { profile: true },
      });
    }

    const token = await signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const savedCount = await db.bookmark.count({
      where: { userId: user.id },
    });

    const { passwordHash: _, ...safeUser } = user;

    const response = NextResponse.json({
      message: 'Google sign-in successful',
      user: {
        ...safeUser,
        name: user.fullName,
      },
      savedCount,
      isNewUser: !user.profile?.onboardingCompleted,
    });

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
    console.error('Google auth error:', err);
    return NextResponse.json(
      { error: 'Internal server error during Google sign in' },
      { status: 500 }
    );
  }
}
