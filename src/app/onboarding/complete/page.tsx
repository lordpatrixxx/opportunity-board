'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Opportunity } from '@/types';
import OpportunityCard from '@/components/opportunities/OpportunityCard';

export default function OnboardingCompletePage() {
  const [topOpportunities, setTopOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch('/api/opportunities?limit=3');
        const data = await res.json();
        if (data.opportunities) {
          setTopOpportunities(data.opportunities);
        }
      } catch (err) {
        console.error('Failed to load initial matches', err);
      }
    }
    loadMatches();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-space-sm sm:p-space-lg relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-primary/10 to-transparent blur-3xl -z-10" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-space-xs">
        <Link href="/" className="flex items-center gap-space-xs group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[20px]">explore</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Opportunity Board
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-space-md">
        <div className="text-center max-w-xl mx-auto mb-space-lg">
          {/* Animated Celebration Icon */}
          <div className="w-16 h-16 rounded-3xl bg-secondary-container text-secondary mx-auto flex items-center justify-center shadow-md mb-space-sm animate-bounce">
            <span className="material-symbols-outlined text-4xl">rocket_launch</span>
          </div>

          <h1 className="font-headline-lg text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
            You&apos;re All Set!
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Your preferences have been saved. We&apos;ve customized your discovery feed with verified internships and fellowships matching your profile.
          </p>

          <div className="mt-space-md flex items-center justify-center gap-space-sm">
            <Link
              href="/"
              className="px-space-xl py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Enter Discovery Dashboard</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Handpicked Initial Matches */}
        {topOpportunities.length > 0 && (
          <div className="w-full mt-space-md">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-title-sm text-title-sm font-bold text-on-surface">
                Recommended For Your Profile:
              </span>
              <Link href="/" className="text-xs font-bold text-primary hover:underline">
                View All Listings
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {topOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-space-xs text-xs text-on-surface-variant/70">
        <p>&copy; 2026 Opportunity Board. All rights reserved.</p>
      </footer>
    </div>
  );
}
