'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import OpportunityForm from '@/components/forms/OpportunityForm';

export default function PostOpportunityPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-gutter-mobile py-space-2xl text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-gutter-mobile py-space-2xl text-center">
        <div className="bg-surface-container-lowest p-space-xl rounded-3xl border border-outline-variant/30 shadow-md flex flex-col items-center gap-space-md">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed/50 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-2xl font-black text-on-surface">
              Sign In to Post an Opportunity
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Create a listing for an internship, fellowship, hackathon, or scholarship to reach thousands of ambitious candidates.
            </p>
          </div>
          <div className="flex items-center gap-space-xs">
            <Link
              href="/login"
              className="px-space-lg py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90"
            >
              Sign In Now
            </Link>
            <Link
              href="/signup"
              className="px-space-md py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-xs hover:bg-surface-container-high"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      <div className="mb-space-lg">
        <Link
          href="/my-posts"
          className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-space-xs"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>View My Posts</span>
        </Link>
        <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
          Post an Opportunity
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Publish your internship, fellowship, grant, or hackathon listing directly to candidates.
        </p>
      </div>

      <OpportunityForm />
    </div>
  );
}
