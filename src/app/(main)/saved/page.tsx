'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Opportunity } from '@/types';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import EmptyState from '@/components/ui/EmptyState';
import { OpportunityCardSkeleton } from '@/components/ui/Skeleton';

export default function SavedOpportunitiesPage() {
  const router = useRouter();
  const { user, loading: authLoading, setSavedCount } = useAuth();
  const { showToast } = useToast();

  const [savedListings, setSavedListings] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadSaved() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/bookmarks');
        if (res.ok) {
          const data = await res.json();
          // Map bookmarks to opportunity objects
          const opportunities = data.bookmarks.map((b: any) => ({
            ...b.opportunity,
            isBookmarked: true,
          }));
          setSavedListings(opportunities);
          setSavedCount(opportunities.length);
        } else {
          showToast('Failed to load saved opportunities', 'error');
        }
      } catch (err) {
        console.error('Failed to load saved items', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadSaved();
      }
    }
  }, [user, authLoading, router, showToast, setSavedCount]);

  const handleBookmarkChange = (opportunityId: string, isSaved: boolean) => {
    if (!isSaved) {
      setSavedListings((prev) => prev.filter((o) => o.id !== opportunityId));
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-xl">
        <div className="animate-pulse flex flex-col gap-space-lg">
          <div className="h-8 w-60 bg-surface-container-high rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {Array.from({ length: 6 }).map((_, i) => (
              <OpportunityCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredListings = savedListings.filter((opp) => {
    const matchesQuery =
      !searchQuery ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.name.toLowerCase().includes(searchQuery.toLowerCase());

    const currentType = opp.opportunityType || opp.type || '';
    const matchesType =
      filterType === 'all' || currentType.toLowerCase() === filterType.toLowerCase();

    return matchesQuery && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              Saved Opportunities
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-fixed text-on-primary-fixed">
              {savedListings.length}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Track deadlines and application deadlines for your bookmarked roles.
          </p>
        </div>

        <Link
          href="/"
          className="px-space-md py-2.5 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">explore</span>
          <span>Discover More</span>
        </Link>
      </div>

      {savedListings.length === 0 ? (
        <EmptyState
          type="no_saved"
          title="No saved opportunities yet"
          description="Click the bookmark icon on any opportunity card across the platform to keep track of its application deadline here."
          action={{
            label: 'Explore Opportunities',
            href: '/',
            variant: 'primary',
          }}
        />
      ) : (
        <div className="flex flex-col gap-space-md">
          {/* Quick Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs bg-surface-container-lowest p-space-xs rounded-2xl border border-outline-variant/30 shadow-xs">
            {/* Search within saved */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl flex-1">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter saved listings..."
                className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            {/* Type selector */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { value: 'all', label: 'All' },
                { value: 'internship', label: 'Internships' },
                { value: 'hackathon', label: 'Hackathons' },
                { value: 'fellowship', label: 'Fellowships' },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setFilterType(t.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    filterType === t.value
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-space-xl">
              <p className="font-bold text-sm text-on-surface">No matching saved opportunities</p>
              <p className="text-xs text-on-surface-variant mt-1">Try changing your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {filteredListings.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onBookmarkChange={handleBookmarkChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
