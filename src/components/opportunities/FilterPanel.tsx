'use client';

import React from 'react';

export interface FilterState {
  type?: string;
  workplaceMode?: string;
  experienceLevel?: string;
  paidOnly?: boolean;
  urgentOnly?: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalFilteredCount?: number;
}

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  totalFilteredCount,
}: FilterPanelProps) {
  const opportunityTypes = [
    { value: '', label: 'All Types' },
    { value: 'internship', label: 'Internships' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'fellowship', label: 'Fellowships' },
    { value: 'scholarship', label: 'Scholarships' },
    { value: 'grant', label: 'Grants' },
  ];

  const workplaceModes = [
    { value: '', label: 'All Modes' },
    { value: 'remote', label: 'Remote Only' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'in_person', label: 'In-Person' },
  ];

  const experienceLevels = [
    { value: '', label: 'Any Level' },
    { value: 'beginner', label: 'Beginner / First-Year' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced / Grad' },
  ];

  const hasActiveFilters = Boolean(
    filters.type ||
    filters.workplaceMode ||
    filters.experienceLevel ||
    filters.paidOnly ||
    filters.urgentOnly
  );

  return (
    <aside className="w-full bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
        <div className="flex items-center gap-space-2xs">
          <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
          <h2 className="font-title-md text-title-md font-bold text-on-surface">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Opportunity Type */}
      <div className="flex flex-col gap-space-2xs">
        <label className="font-label-md text-label-md font-bold text-on-surface">
          Opportunity Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {opportunityTypes.map((t) => {
            const isSelected = (filters.type || '') === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onChange({ ...filters, type: t.value || undefined })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workplace Mode */}
      <div className="flex flex-col gap-space-2xs">
        <label className="font-label-md text-label-md font-bold text-on-surface">
          Workplace Mode
        </label>
        <div className="flex flex-wrap gap-1.5">
          {workplaceModes.map((wm) => {
            const isSelected = (filters.workplaceMode || '') === wm.value;
            return (
              <button
                key={wm.value}
                type="button"
                onClick={() => onChange({ ...filters, workplaceMode: wm.value || undefined })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-secondary text-white font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {wm.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="flex flex-col gap-space-2xs">
        <label className="font-label-md text-label-md font-bold text-on-surface">
          Experience Level
        </label>
        <div className="flex flex-wrap gap-1.5">
          {experienceLevels.map((el) => {
            const isSelected = (filters.experienceLevel || '') === el.value;
            return (
              <button
                key={el.value}
                type="button"
                onClick={() => onChange({ ...filters, experienceLevel: el.value || undefined })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-tertiary text-white font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {el.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/20">
        <label className="flex items-center gap-space-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.paidOnly}
            onChange={(e) => onChange({ ...filters, paidOnly: e.target.checked })}
            className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="font-body-md text-body-md text-on-surface font-medium">
            Paid / Funded Only
          </span>
        </label>

        <label className="flex items-center gap-space-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.urgentOnly}
            onChange={(e) => onChange({ ...filters, urgentOnly: e.target.checked })}
            className="w-4 h-4 rounded border-outline text-error focus:ring-error/20 accent-error"
          />
          <span className="font-body-md text-body-md text-on-surface font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-error text-[18px]">alarm</span>
            Closing Soon (&lt; 14 days)
          </span>
        </label>
      </div>

      {/* Filtered count badge */}
      {totalFilteredCount !== undefined && (
        <div className="pt-space-xs text-center border-t border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Showing <strong className="text-on-surface">{totalFilteredCount}</strong> matching listings
          </span>
        </div>
      )}
    </aside>
  );
}
