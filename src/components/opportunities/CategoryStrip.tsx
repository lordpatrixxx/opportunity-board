'use client';

import React from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  count?: number;
}

interface CategoryStripProps {
  categories?: Category[];
  selectedCategory: string; // slug or 'all'
  onSelectCategory: (slug: string) => void;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Internships', slug: 'internships', icon: 'work' },
  { id: 'cat-2', name: 'Hackathons', slug: 'hackathons', icon: 'code_blocks' },
  { id: 'cat-3', name: 'Fellowships', slug: 'fellowships', icon: 'biotech' },
  { id: 'cat-4', name: 'Workshops', slug: 'workshops', icon: 'handyman' },
  { id: 'cat-5', name: 'Competitions', slug: 'competitions', icon: 'emoji_events' },
  { id: 'cat-6', name: 'Scholarships', slug: 'scholarships', icon: 'school' },
  { id: 'cat-7', name: 'Early Jobs', slug: 'early-jobs', icon: 'rocket_launch' },
  { id: 'cat-8', name: 'Conferences', slug: 'conferences', icon: 'groups' },
];

export default function CategoryStrip({
  categories = [],
  selectedCategory,
  onSelectCategory,
}: CategoryStripProps) {
  const allCategoryItem: Category = {
    id: 'all',
    name: 'All Opportunities',
    slug: 'all',
    icon: 'dashboard',
  };

  const activeCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const list = [allCategoryItem, ...activeCategories];

  return (
    <div className="w-full bg-surface-container-lowest border-b border-outline-variant/30 py-3">
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop">
        {/* Wrap layout without sliding/scrolling */}
        <div className="flex flex-wrap items-center gap-2">
          {list.map((cat) => {
            const isSelected =
              selectedCategory === cat.slug ||
              (!selectedCategory && cat.slug === 'all') ||
              (selectedCategory === 'all' && cat.slug === 'all');

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs scale-[1.02]'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/30'
                }`}
              >
                {cat.icon && (
                  <span className="material-symbols-outlined text-[17px]">
                    {cat.icon}
                  </span>
                )}
                <span>{cat.name}</span>
                {cat.count !== undefined && cat.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
