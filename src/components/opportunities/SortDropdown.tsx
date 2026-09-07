'use client';

import React from 'react';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const options = [
    { value: 'deadline_asc', label: 'Closing Soonest (Default)' },
    { value: 'newest', label: 'Recently Added' },
    { value: 'deadline_desc', label: 'Latest Deadline' },
    { value: 'title_asc', label: 'Title (A to Z)' },
  ];

  return (
    <div className="flex items-center gap-space-2xs">
      <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">
        Sort by:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-space-sm py-2 pr-8 text-xs font-bold text-on-surface hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
          arrow_drop_down
        </span>
      </div>
    </div>
  );
}
