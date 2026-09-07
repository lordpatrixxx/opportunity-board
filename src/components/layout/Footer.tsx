import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto bg-surface-container-low border-t border-outline-variant/30 text-on-surface-variant">
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-2xl flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-xl">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <Link href="/" className="flex items-center gap-space-xs">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white font-bold">
                <span className="material-symbols-outlined text-[20px]">explore</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                Opportunity Board
              </span>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
              The high-trust discovery platform empowering students, early-career researchers, and ambitious builders with deadline clarity and curated opportunities.
            </p>
            <div className="flex items-center gap-space-xs mt-space-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Live 2026 Sync
              </span>
              <span className="text-xs text-outline">•</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Verified Listings
              </span>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold">
              Discover
            </span>
            <Link href="/opportunities?type=Internship" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Internships
            </Link>
            <Link href="/opportunities?type=Hackathon" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Hackathons
            </Link>
            <Link href="/opportunities?type=Fellowship" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Research Fellowships
            </Link>
            <Link href="/opportunities?deadline=urgent" className="font-body-sm text-body-sm text-error hover:underline transition-colors font-medium">
              Closing in 48h 🔥
            </Link>
          </div>

          {/* Col 3: Community */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold">
              Community
            </span>
            <Link href="/post-opportunity" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Post an Opportunity
            </Link>
            <Link href="/saved" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Saved Watchlist
            </Link>
            <Link href="/onboarding" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Student Onboarding
            </Link>
            <Link href="/profile" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Profile & Preferences
            </Link>
          </div>

          {/* Col 4: Platform */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold">
              Platform
            </span>
            <Link href="/admin" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Admin Moderation Center
            </Link>
            <Link href="/notifications" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              Notifications
            </Link>
            <a href="https://github.com/lordpatrixxx/opportunity-board" target="_blank" rel="noopener noreferrer" className="font-body-sm text-body-sm hover:text-primary transition-colors">
              GitHub Repository
            </a>
          </div>
        </div>

        <div className="h-px bg-surface-container"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md text-xs font-body-sm text-on-surface-variant">
          <p>© 2026 Opportunity Board. All rights reserved. Built with precision for the Agentic Development Workshop.</p>
          <div className="flex items-center gap-space-md">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Trust & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
