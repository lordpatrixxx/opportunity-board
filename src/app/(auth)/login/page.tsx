'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await login(email, password);
      showToast('Welcome back! Signed in successfully.', 'success');
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
      showToast(err.message || 'Sign in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-3xl border border-outline-variant/30 shadow-lg flex flex-col gap-space-md">
      {/* Title */}
      <div className="text-center">
        <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
          Welcome Back
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Sign in to access your saved opportunities and listings
        </p>
      </div>

      {/* Evaluator Quick-Fill Banner */}
      <div className="bg-primary-fixed/40 border border-primary/20 rounded-2xl p-space-xs flex flex-col gap-1.5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-on-primary-fixed">
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          <span>EVALUATOR 1-CLICK DEMO LOGINS</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickFill('student@stanford.edu', 'Password123!')}
            className="px-2 py-1.5 rounded-lg bg-surface text-primary border border-outline-variant/30 text-[11px] font-bold hover:bg-primary-container hover:text-on-primary transition-colors text-left"
          >
            🎓 Student User
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin@opportunityboard.org', 'AdminSecure2026!')}
            className="px-2 py-1.5 rounded-lg bg-surface text-tertiary border border-outline-variant/30 text-[11px] font-bold hover:bg-tertiary hover:text-white transition-colors text-left"
          >
            🛡️ Admin User
          </button>
        </div>
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
              placeholder="you@university.edu"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px] pointer-events-none">
              mail
            </span>
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-label-sm text-xs text-primary font-semibold hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
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
          className="mt-space-xs w-full py-3 rounded-xl bg-primary text-white font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-space-2xs"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <span className="material-symbols-outlined text-[18px]">login</span>
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center pt-space-xs border-t border-outline-variant/20">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
