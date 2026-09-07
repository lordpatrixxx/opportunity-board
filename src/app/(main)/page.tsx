'use client';

import React, { useState, useEffect, useCallback } from 'react';
import HeroSearch from '@/components/opportunities/HeroSearch';
import CategoryStrip, { Category } from '@/components/opportunities/CategoryStrip';
import FilterPanel, { FilterState } from '@/components/opportunities/FilterPanel';
import SortDropdown from '@/components/opportunities/SortDropdown';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import { OpportunityCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Opportunity } from '@/types';

export default function HomePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('deadline_asc');
  const [filters, setFilters] = useState<FilterState>({
    type: undefined,
    workplaceMode: undefined,
    experienceLevel: undefined,
    paidOnly: false,
    urgentOnly: false,
  });

  // Fetch categories once on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch opportunities whenever query params or page change
  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (locationQuery) params.set('location', locationQuery);
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (filters.type) params.set('type', filters.type);
      if (filters.workplaceMode) params.set('workplaceMode', filters.workplaceMode);
      if (filters.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
      if (filters.paidOnly) params.set('paidOnly', 'true');
      if (filters.urgentOnly) params.set('urgentOnly', 'true');
      if (sortBy) params.set('sortBy', sortBy);
      params.set('page', currentPage.toString());
      params.set('limit', '9');

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const data = await res.json();

      if (data.opportunities) {
        setOpportunities(data.opportunities);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.pages);
      }
    } catch (err) {
      console.error('Failed to fetch opportunities', err);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    locationQuery,
    selectedCategory,
    filters,
    sortBy,
    currentPage,
  ]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleSearch = ({ query, location }: { query?: string; location?: string }) => {
    setSearchQuery(query || '');
    setLocationQuery(location || '');
    setCurrentPage(1);
  };

  const handleQuickFilter = (tag: string) => {
    if (tag === 'remote') {
      setFilters((prev) => ({ ...prev, workplaceMode: 'remote' }));
    } else if (tag === 'paid') {
      setFilters((prev) => ({ ...prev, paidOnly: true }));
    } else if (tag === 'summer-2026') {
      setSearchQuery('Summer 2026');
    } else {
      setSelectedCategory(tag);
    }
    setCurrentPage(1);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory('all');
    setFilters({
      type: undefined,
      workplaceMode: undefined,
      experienceLevel: undefined,
      paidOnly: false,
      urgentOnly: false,
    });
    setSortBy('deadline_asc');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    locationQuery ||
    (selectedCategory && selectedCategory !== 'all') ||
    filters.type ||
    filters.workplaceMode ||
    filters.experienceLevel ||
    filters.paidOnly ||
    filters.urgentOnly
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Hero Search Section */}
      <HeroSearch
        initialQuery={searchQuery}
        initialLocation={locationQuery}
        totalCount={totalCount > 0 ? totalCount : 8}
        onSearch={handleSearch}
        onQuickFilter={handleQuickFilter}
      />

      {/* 2. Category Filter Options (No slider, clean wrap) */}
      <CategoryStrip
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* 3. Main Discovery Feed Area */}
      <section className="max-w-7xl mx-auto w-full px-gutter-mobile lg:px-margin-desktop py-space-md lg:py-space-xl">
        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
          <div className="flex items-center gap-space-xs flex-wrap">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Explore Listings
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant">
              {totalCount} {totalCount === 1 ? 'Opportunity' : 'Opportunities'}
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-primary hover:underline ml-2"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-space-xs justify-between sm:justify-end">
            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            {/* Layout Toggle (Grid / List) */}
            <div className="hidden sm:flex items-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === 'grid'
                    ? 'bg-surface text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Grid View"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === 'list'
                    ? 'bg-surface text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="List View"
              >
                <span className="material-symbols-outlined text-[18px]">view_list</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Feed Layout: 2-column on desktop, 1-column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-space-lg items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-32">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalFilteredCount={totalCount}
            />
          </div>

          {/* Cards Grid / Feed */}
          <div className="lg:col-span-3">
            {loading ? (
              <div
                className={`grid gap-space-md ${
                  viewLayout === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <OpportunityCardSkeleton key={i} />
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <EmptyState
                type="no_results"
                title="No opportunities found"
                description="Try broadening your search criteria, clearing filters, or browsing other categories."
                action={{
                  label: 'Clear All Filters',
                  onClick: handleResetFilters,
                  variant: 'primary',
                }}
              />
            ) : (
              <div
                className={`grid gap-space-md ${
                  viewLayout === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    layout={viewLayout}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-space-xl flex items-center justify-center gap-space-xs">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-space-sm py-2 rounded-xl text-xs font-bold border border-outline-variant/30 bg-surface-container-low text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-space-sm py-2 rounded-xl text-xs font-bold border border-outline-variant/30 bg-surface-container-low text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full sm:max-w-md max-h-[85vh] bg-surface rounded-t-3xl sm:rounded-2xl p-space-md shadow-xl flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Filter Listings
              </h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-space-sm">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                totalFilteredCount={totalCount}
              />
            </div>
            <div className="pt-space-xs border-t border-outline-variant/30 flex gap-space-xs">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90"
              >
                Apply Filters ({totalCount} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
