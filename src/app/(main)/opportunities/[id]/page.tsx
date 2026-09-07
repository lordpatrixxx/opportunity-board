'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Opportunity } from '@/types';
import { formatDate, formatTimeRemaining } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApplyInterstitialModal } from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import OpportunityCard from '@/components/opportunities/OpportunityCard';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, setSavedCount } = useAuth();
  const { showToast } = useToast();

  const id = params?.id as string;
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/opportunities/${id}`);
        if (!res.ok) {
          setOpportunity(null);
          return;
        }
        const data = await res.json();
        setOpportunity(data.opportunity);
        setIsBookmarked(!!data.opportunity.isBookmarked);

        // Fetch related opportunities from same category
        if (data.opportunity.categoryId) {
          const relRes = await fetch(`/api/opportunities?category=${data.opportunity.category?.slug || ''}&limit=3`);
          const relData = await relRes.json();
          if (relData.opportunities) {
            setRelatedOpportunities(
              relData.opportunities.filter((o: Opportunity) => o.id !== id)
            );
          }
        }
      } catch (err) {
        console.error('Failed to load opportunity', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  const toggleBookmark = async () => {
    if (!user) {
      showToast('Please sign in to save opportunities', 'info');
      router.push('/login');
      return;
    }

    if (!opportunity || bookmarking) return;
    setBookmarking(true);

    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

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
          showToast('Removed from your Saved listings', 'removed');
        } else {
          setIsBookmarked(true);
          showToast(data.error || 'Failed to remove', 'error');
        }
      }
    } catch (err) {
      setIsBookmarked(!nextState);
      showToast('Network error updating saved status', 'error');
    } finally {
      setBookmarking(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing URL copied to clipboard!', 'info');
    }
  };

  const handleConfirmApply = () => {
    setApplyModalOpen(false);
    if (opportunity?.applicationUrl) {
      window.open(opportunity.applicationUrl, '_blank', 'noopener,noreferrer');
      showToast(`Redirected to ${opportunity.organization.name}'s portal`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-xl">
        <div className="animate-pulse flex flex-col gap-space-lg">
          <div className="h-6 w-36 bg-surface-container-high rounded-md" />
          <div className="h-32 bg-surface-container-high rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
            <div className="lg:col-span-2 h-96 bg-surface-container-high rounded-3xl" />
            <div className="h-96 bg-surface-container-high rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-2xl">
        <EmptyState
          type="not_found"
          title="Opportunity Not Found"
          description="This opportunity post may have expired, been removed, or is currently under moderation."
          action={{
            label: 'Browse All Opportunities',
            href: '/',
            variant: 'primary',
          }}
        />
      </div>
    );
  }

  const deadline = formatTimeRemaining(opportunity.applicationDeadline);
  const isExpired = deadline.isExpired;

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between mb-space-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Opportunities</span>
        </Link>

        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={toggleBookmark}
            disabled={bookmarking}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-primary-container text-on-primary border-primary/30 shadow-xs'
                : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isBookmarked ? 'fill-current' : ''}`}>
              bookmark
            </span>
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-xl rounded-3xl border border-outline-variant/30 shadow-sm mb-space-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          {/* Org & Title info */}
          <div className="flex items-start gap-space-md">
            {/* Org Logo Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-xl sm:text-2xl text-primary flex-shrink-0 shadow-xs">
              {opportunity.organization.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                  {opportunity.organization.name}
                </span>
                {opportunity.organization.verified && (
                  <span className="material-symbols-outlined text-secondary text-[18px]" title="Verified Host">
                    verified
                  </span>
                )}
                {opportunity.category && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-surface-container text-on-surface-variant">
                    {opportunity.category.name}
                  </span>
                )}
              </div>

              <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                {opportunity.title}
              </h1>

              <div className="flex items-center gap-space-md flex-wrap text-xs text-on-surface-variant mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>{opportunity.location || 'Remote'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">work</span>
                  <span className="capitalize">{opportunity.workplaceMode.replace('_', ' ')}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>{opportunity.compensation || 'Unpaid / Stipend details below'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>{opportunity.viewsCount || 0} views</span>
                </span>
              </div>
            </div>
          </div>

          {/* CTA Action Bar */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-space-xs flex-shrink-0">
            {isExpired ? (
              <div className="px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-bold text-xs flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">event_busy</span>
                <span>Applications Closed</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="px-space-xl py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-space-2xs"
              >
                <span>Apply on Official Portal</span>
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </button>
            )}
            <span className="text-[11px] text-on-surface-variant text-center md:text-right">
              Free direct applicant hand-off
            </span>
          </div>
        </div>

        {/* Deadline Urgency Banner */}
        <div
          className={`mt-space-md p-space-sm rounded-2xl border flex items-center justify-between flex-wrap gap-space-xs ${
            isExpired
              ? 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant'
              : deadline.isUrgent
              ? 'bg-error-container/40 border-error/30 text-error'
              : 'bg-secondary-container/30 border-secondary/20 text-secondary'
          }`}
        >
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[22px]">
              {isExpired ? 'timer_off' : deadline.isUrgent ? 'alarm' : 'event_upcoming'}
            </span>
            <div>
              <p className="text-xs font-bold text-on-surface">
                Application Deadline: {formatDate(opportunity.applicationDeadline)}
              </p>
              <p className="text-[11px] font-semibold">
                {deadline.text}
              </p>
            </div>
          </div>

          {!isExpired && (
            <div className="text-xs font-bold">
              Target Cohort: {opportunity.term || 'Summer 2026'}
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-start">
        {/* Main Content (Left, 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-space-lg">
          {/* Overview / Description */}
          <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface mb-space-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">description</span>
              <span>Overview & Description</span>
            </h2>
            <div className="prose text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </div>
          </div>

          {/* Required Skills */}
          {opportunity.tags && opportunity.tags.length > 0 && (
            <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs">
              <h2 className="font-title-lg text-title-lg font-bold text-on-surface mb-space-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">code</span>
                <span>Required Skills & Tech Stack</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((t) => (
                  <span
                    key={t.tag.id}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-surface-container-high text-on-surface border border-outline-variant/30"
                  >
                    {t.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements & Eligibility */}
          {opportunity.requirements && (
            <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs">
              <h2 className="font-title-lg text-title-lg font-bold text-on-surface mb-space-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">checklist</span>
                <span>Requirements & Eligibility</span>
              </h2>
              <div className="prose text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
                {opportunity.requirements}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {opportunity.benefits && (
            <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs">
              <h2 className="font-title-lg text-title-lg font-bold text-on-surface mb-space-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">card_giftcard</span>
                <span>Compensation, Perks & Mentorship</span>
              </h2>
              <div className="prose text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
                {opportunity.benefits}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info (Right, 1 col) */}
        <div className="flex flex-col gap-space-lg sticky top-24">
          {/* Quick Facts Card */}
          <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-sm">
            <h3 className="font-title-md text-title-md font-bold text-on-surface pb-space-xs border-b border-outline-variant/20">
              Quick Facts
            </h3>

            <div className="flex flex-col gap-space-xs text-xs">
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Opportunity Type</span>
                <span className="font-bold text-on-surface capitalize">{opportunity.type}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Workplace Mode</span>
                <span className="font-bold text-on-surface capitalize">{opportunity.workplaceMode.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Experience Level</span>
                <span className="font-bold text-on-surface capitalize">{opportunity.experienceLevel}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Compensation</span>
                <span className="font-bold text-on-surface text-right">{opportunity.compensation || 'Unpaid'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">Target Cohort</span>
                <span className="font-bold text-on-surface">{opportunity.term || 'Summer 2026'}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-on-surface-variant">Posted Date</span>
                <span className="font-bold text-on-surface">{formatDate(opportunity.createdAt)}</span>
              </div>
            </div>

            {!isExpired && (
              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="mt-space-xs w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center justify-center gap-1.5"
              >
                <span>Apply Now</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            )}
          </div>

          {/* Host Organization Card */}
          <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-xs">
            <h3 className="font-title-md text-title-md font-bold text-on-surface pb-space-xs border-b border-outline-variant/20">
              About the Host
            </h3>

            <div className="flex items-center gap-space-xs mt-1">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-on-surface">
                {opportunity.organization.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-xs text-on-surface">
                  {opportunity.organization.name}
                </p>
                {opportunity.organization.location && (
                  <p className="text-[11px] text-on-surface-variant">
                    {opportunity.organization.location}
                  </p>
                )}
              </div>
            </div>

            {opportunity.organization.description && (
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                {opportunity.organization.description}
              </p>
            )}

            {opportunity.organization.website && (
              <a
                href={opportunity.organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Visit Organization Website</span>
                <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Related Opportunities Section */}
      {relatedOpportunities.length > 0 && (
        <section className="mt-space-2xl pt-space-xl border-t border-outline-variant/30">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md">
            Similar Opportunities You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {relatedOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </section>
      )}

      {/* Apply Interstitial Modal */}
      {opportunity.applicationUrl && (
        <ApplyInterstitialModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          onConfirm={handleConfirmApply}
          title={opportunity.title}
          organizationName={opportunity.organization.name}
          applicationUrl={opportunity.applicationUrl}
          compensation={opportunity.compensation}
          location={opportunity.location}
        />
      )}
    </div>
  );
}
