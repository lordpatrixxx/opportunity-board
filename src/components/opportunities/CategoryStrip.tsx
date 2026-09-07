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
  categories: Category[];
  selectedCategory: string; // slug or 'all'
  onSelectCategory: (slug: string) => void;
}

export default function CategoryStrip({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryStripProps) {
  const allCategoryItem: Category = {
    id: 'all',
    name: 'All Opportunities',
    slug: 'all',
    icon: 'dashboard',
  };

  const list = [allCategoryItem, ...categories];

  return (
    <div className="w-full bg-surface-container-lowest border-b border-outline-variant/30 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-xs">
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar scroll-smooth py-1">
          {list.map((cat) => {
            const isSelected =
              selectedCategory === cat.slug ||
              (!selectedCategory && cat.slug === 'all');

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`flex-shrink-0 flex items-center gap-space-2xs px-space-sm py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/30'
                }`}
              >
                {cat.icon && (
                  <span className="material-symbols-outlined text-[18px]">
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
