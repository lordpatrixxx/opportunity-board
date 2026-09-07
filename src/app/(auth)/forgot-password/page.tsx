'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        showToast('Password recovery instructions sent!', 'success');
      } else {
        setErrorMsg(data.error || 'Failed to send recovery email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-3xl border border-outline-variant/30 shadow-lg flex flex-col gap-space-md">
      {/* Title */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary-fixed/50 text-primary mx-auto flex items-center justify-center mb-space-xs">
          <span className="material-symbols-outlined text-[26px]">lock_reset</span>
        </div>
        <h1 className="font-headline-md text-2xl font-black text-on-surface tracking-tight">
          Reset Your Password
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Enter your registered email and we will send you a recovery link
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col gap-space-md text-center py-space-sm">
          <div className="p-space-md bg-secondary-container/20 border border-secondary/30 rounded-2xl text-secondary">
            <span className="material-symbols-outlined text-3xl mb-1">mark_email_read</span>
            <p className="font-body-md text-body-md font-bold text-on-surface">
              Check your inbox
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              We have dispatched recovery instructions to <strong>{email}</strong>.
            </p>
          </div>

          <Link
            href="/login"
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center justify-center gap-1"
          >
            <span>Return to Sign In</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
          {errorMsg && (
            <div className="p-space-xs rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              Account Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-space-xs w-full py-3 rounded-xl bg-primary text-white font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-space-2xs"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Send Recovery Link</span>
            )}
          </button>

          <div className="text-center pt-space-xs">
            <Link
              href="/login"
              className="text-xs font-bold text-on-surface-variant hover:text-on-surface"
            >
              Remember password? Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
