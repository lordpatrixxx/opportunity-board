'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { triggerGoogleSignIn } from '@/lib/google-auth';

export default function SignUpPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'HOST'>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle OAuth redirect token in hash if redirect flow was triggered
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const token = params.get('access_token');
      if (token) {
        window.history.replaceState(null, '', window.location.pathname);
        setGoogleLoading(true);
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then(async (info) => {
            if (info.email) {
              const res = await loginWithGoogle({
                email: info.email,
                fullName: info.name || info.given_name || info.email.split('@')[0],
                avatarUrl: info.picture,
                accessToken: token,
                role,
              });
              showToast(`Welcome, ${info.name || 'User'}! Signed in with Google.`, 'success');
              if (res?.isNewUser) {
                router.push('/onboarding');
              } else {
                router.push('/');
              }
            }
          })
          .catch((err) => {
            console.error('Failed to get userinfo from hash token:', err);
            showToast('Failed to complete Google authentication', 'error');
          })
          .finally(() => setGoogleLoading(false));
      }
    }
  }, [loginWithGoogle, role, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await register({ fullName: name, email, password, role });
      showToast('Account created successfully! Set up your preferences.', 'success');
      router.push('/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUpClick = async () => {
    setGoogleLoading(true);
    setErrorMsg('');

    try {
      // Direct Google Account Auth - fetches email, name, and picture directly from Google
      const profile = await triggerGoogleSignIn();
      const res = await loginWithGoogle({
        email: profile.email,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        accessToken: profile.accessToken,
        credential: profile.credential,
        role,
      });

      showToast(`Account ready for ${profile.fullName}! Signed in with Google.`, 'success');
      if (res?.isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Google Sign-Up error:', err);
      showToast(err.message || 'Google sign-up was cancelled or failed.', 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-3xl border border-outline-variant/30 shadow-lg flex flex-col gap-space-md">
      {/* Title */}
      <div className="text-center">
        <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
          Join Opportunity Board
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Discover verified opportunities with transparent deadlines
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
        <button
          type="button"
          onClick={() => setRole('USER')}
          className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            role === 'USER'
              ? 'bg-surface text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span>Student / Seeker</span>
        </button>
        <button
          type="button"
          onClick={() => setRole('HOST')}
          className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            role === 'HOST'
              ? 'bg-surface text-secondary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
          <span>Opportunity Host</span>
        </button>
      </div>

      {/* Google Sign-Up Button */}
      <button
        type="button"
        disabled={googleLoading}
        onClick={handleGoogleSignUpClick}
        className="w-full py-3 px-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {googleLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{googleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-outline-variant/30 w-full" />
        <span className="bg-surface-container-lowest px-3 text-[11px] text-on-surface-variant font-bold uppercase tracking-wider shrink-0">
          or sign up with email
        </span>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-space-xs rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        {/* Name Field */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px] pointer-events-none">
              person
            </span>
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@stanford.edu"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px] pointer-events-none">
              mail
            </span>
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            Create Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-space-xs w-full py-3 rounded-xl bg-primary text-white font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-space-2xs cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Free Account</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="text-center pt-space-xs border-t border-outline-variant/20">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
