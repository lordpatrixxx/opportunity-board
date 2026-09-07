'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Opportunity } from '@/types';
import { formatDate, formatTimeRemaining } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface OpportunityCardProps {
  opportunity: Opportunity;
  layout?: 'grid' | 'list';
  onBookmarkChange?: (opportunityId: string, isSaved: boolean) => void;
}

export default function OpportunityCard({
  opportunity,
  layout = 'grid',
  onBookmarkChange,
}: OpportunityCardProps) {
  const { user, setSavedCount } = useAuth();
  const { showToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(!!opportunity.isBookmarked);
  const [bookmarking, setBookmarking] = useState(false);

  const deadlineInfo = formatTimeRemaining(opportunity.applicationDeadline);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please sign in to save opportunities to your Watchlist', 'info');
      return;
    }

    if (bookmarking) return;
    setBookmarking(true);

    const nextState = !isBookmarked;
    setIsBookmarked(nextState); // optimistic UI update

    try {
      if (nextState) {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId: opportunity.id }),
        });
        const data = await res.json();
        if (res.ok) {
          setSavedCount(data.savedCount);
          showToast('Opportunity saved to your Watchlist', 'saved');
          onBookmarkChange?.(opportunity.id, true);
        } else {
          setIsBookmarked(false);
          showToast(data.error || 'Failed to save', 'error');
        }
      } else {
        const res = await fetch(`/api/bookmarks/${opportunity.id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          setSavedCount(data.savedCount);
          showToast('Opportunity removed from Saved', 'removed');
          onBookmarkChange?.(opportunity.id, false);
        } else {
          setIsBookmarked(true);
          showToast(data.error || 'Failed to remove', 'error');
        }
      }
    } catch (err) {
      setIsBookmarked(!nextState);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setBookmarking(false);
    }
  };

  const orgInitials = opportunity.organization.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (layout === 'list') {
    return (
      <article className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm hover:shadow-md transition-all duration-200 border border-outline-variant/20 hover:border-primary/40 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div className="flex items-start gap-space-md min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm shrink-0 shadow-xs overflow-hidden">
            {opportunity.organization.logoUrl ? (
              <img
                src={opportunity.organization.logoUrl}
                alt={opportunity.organization.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              orgInitials
            )}
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                {opportunity.organization.name}
              </span>
              {opportunity.organization.isVerified && (
                <span className="material-symbols-outlined text-[16px] text-primary" title="Verified Partner">
                  verified
                </span>
              )}
              <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-bold">
                {opportunity.opportunityType}
              </span>
              {deadlineInfo.isUrgent && (
                <span className="px-space-xs py-0.5 rounded-full bg-error-container text-error font-label-caps text-label-caps font-bold inline-flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  {deadlineInfo.text}
                </span>
              )}
            </div>
            <Link href={`/opportunities/${opportunity.id}`}>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-1">
                {opportunity.title}
              </h4>
            </Link>
            <div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm flex-wrap">
              {opportunity.location && (
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {opportunity.location}
                </span>
              )}
              {opportunity.compensationAmount && (
                <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[14px]">payments</span>
                  {opportunity.compensationAmount}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-space-sm shrink-0 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-container">
          <div className="flex flex-col text-left sm:text-right">
            <span className="font-label-caps text-label-caps text-outline uppercase">Deadline</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {formatDate(opportunity.applicationDeadline)}
            </span>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              onClick={toggleBookmark}
              aria-label="Save to bookmarks"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isBookmarked
                  ? 'bg-primary-fixed text-primary'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary'
              }`}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                bookmark
              </span>
            </button>

            <Link
              href={`/opportunities/${opportunity.id}`}
              className="px-space-md py-space-xs rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-bold shadow-xs transition-all"
            >
              View
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Grid layout (Default canonical Stitch card)
  return (
    <article className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between gap-space-md hover:-translate-y-0.5 group border border-outline-variant/20 hover:border-primary/40">
      <div className="flex flex-col gap-space-sm">
        {/* Top Row Meta & Bookmark */}
        <div className="flex items-start justify-between gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm shadow-xs overflow-hidden shrink-0">
              {opportunity.organization.logoUrl ? (
                <img
                  src={opportunity.organization.logoUrl}
                  alt={opportunity.organization.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                orgInitials
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-3xs">
                <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                  {opportunity.organization.name}
                </span>
                {opportunity.organization.isVerified && (
                  <span className="material-symbols-outlined text-[18px] text-primary" title="Verified Host">
                    verified
                  </span>
                )}
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-3xs">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                <span className="truncate">{opportunity.location || 'Remote'}</span>
              </span>
            </div>
          </div>

          <button
            onClick={toggleBookmark}
            aria-label="Save to bookmarks"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-90 ${
              isBookmarked
                ? 'bg-primary-fixed text-primary'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              bookmark
            </span>
          </button>
        </div>

        {/* Title & Category Tags */}
        <div className="flex flex-col gap-space-3xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            {deadlineInfo.isUrgent && (
              <span className="px-space-xs py-space-3xs rounded-full bg-error-container text-error font-label-caps text-label-caps font-bold inline-flex items-center gap-space-3xs animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                {deadlineInfo.text}
              </span>
            )}
            <span className="px-space-xs py-space-3xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-bold">
              {opportunity.opportunityType}
            </span>
            <span className="px-space-xs py-space-3xs rounded-full bg-surface-container-high text-secondary font-label-caps text-label-caps">
              99% Match
            </span>
          </div>

          <Link href={`/opportunities/${opportunity.id}`}>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-2 mt-1">
              {opportunity.title}
            </h4>
          </Link>
        </div>

        {/* Compensation & Summary */}
        {opportunity.compensationAmount && (
          <div className="flex items-center gap-space-xs text-secondary font-label-lg text-label-lg font-bold">
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>{opportunity.compensationAmount}</span>
          </div>
        )}

        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
          {opportunity.shortSummary || opportunity.description}
        </p>
      </div>

      {/* Footer & CTA */}
      <div className="pt-space-xs border-t border-surface-container flex items-center justify-between gap-space-xs">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-outline uppercase">Deadline</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            {formatDate(opportunity.applicationDeadline)}
          </span>
        </div>
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="px-space-md py-space-xs rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-xs transition-all active:scale-95"
        >
          View Opportunity
        </Link>
      </div>
    </article>
  );
}
