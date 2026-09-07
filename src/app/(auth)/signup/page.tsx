'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'HOST'>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      await register({ fullName: name, email, password });
      showToast('Account created successfully! Set up your preferences.', 'success');
      router.push('/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
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
          className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
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
          className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            role === 'HOST'
              ? 'bg-surface text-secondary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
          <span>Opportunity Host</span>
        </button>
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
              placeholder="At least 6 characters"
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
