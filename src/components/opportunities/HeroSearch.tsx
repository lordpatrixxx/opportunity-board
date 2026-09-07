'use client';

import React, { useState } from 'react';

interface HeroSearchProps {
  initialQuery?: string;
  initialLocation?: string;
  totalCount?: number;
  onSearch: (filters: { query?: string; location?: string }) => void;
  onQuickFilter?: (tag: string) => void;
}

export default function HeroSearch({
  initialQuery = '',
  initialLocation = '',
  totalCount = 8,
  onSearch,
  onQuickFilter,
}: HeroSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query: query.trim(), location: location.trim() });
  };

  const handleClear = () => {
    setQuery('');
    setLocation('');
    onSearch({ query: '', location: '' });
  };

  const quickTags = [
    { label: 'Software Engineering', tag: 'software-engineering' },
    { label: 'AI & Data Science', tag: 'ai-data-science' },
    { label: 'Remote Only', tag: 'remote' },
    { label: 'Summer 2026', tag: 'summer-2026' },
    { label: 'Paid Stipend', tag: 'paid' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background border-b border-outline-variant/30 py-space-xl md:py-space-2xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop">
        <div className="max-w-3xl mx-auto text-center mb-space-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded-full bg-primary-fixed/60 border border-primary/20 text-on-primary-fixed mb-space-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-md text-label-md font-semibold">
              {totalCount}+ Verified Opportunities Active for 2026
            </span>
          </div>

          <h1 className="font-headline-lg text-3xl md:text-5xl font-black text-on-surface tracking-tight leading-tight mb-space-sm">
            Launch Your Career With Absolute Deadline Clarity.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Discover vetted internships, hackathons, and research fellowships. Never miss another application deadline.
          </p>
        </div>

        {/* Hero Search Box */}
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-surface-container-lowest p-space-xs md:p-space-sm rounded-2xl shadow-md border border-outline-variant/40 flex flex-col md:flex-row items-stretch gap-space-xs"
        >
          {/* Keyword Input */}
          <div className="flex-1 flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low md:bg-transparent rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, organization, or skills (e.g., Python, AI)..."
              className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <div className="hidden md:block w-px bg-outline-variant/40 my-2" />

          {/* Location Input */}
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low md:bg-transparent rounded-xl md:w-64">
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]">location_on</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or Remote"
              className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-space-2xs">
            {(query || location) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-space-sm py-3 rounded-xl font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Reset
              </button>
            )}
            <button
              type="submit"
              className="w-full md:w-auto px-space-lg py-3 rounded-xl bg-primary text-white font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-space-2xs"
            >
              <span>Explore</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Quick Tag Pills */}
        <div className="max-w-4xl mx-auto mt-space-md flex items-center justify-center flex-wrap gap-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant/80 font-medium">
            Popular searches:
          </span>
          {quickTags.map((qt) => (
            <button
              key={qt.tag}
              type="button"
              onClick={() => onQuickFilter && onQuickFilter(qt.tag)}
              className="px-space-sm py-1 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary transition-colors border border-outline-variant/30"
            >
              {qt.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
