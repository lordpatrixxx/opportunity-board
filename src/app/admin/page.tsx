'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { Opportunity } from '@/types';
import { formatDate, formatTimeRemaining } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

export default function AdminModerationPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'flagged' | 'rejected' | 'all'>('pending');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Reject / Flag Modal State
  const [modalMode, setModalMode] = useState<'reject' | 'flag' | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');

  const loadAdminOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeTab === 'all'
        ? '/api/admin/opportunities'
        : `/api/admin/opportunities?status=${activeTab}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      } else {
        showToast('Failed to load moderation queue', 'error');
      }
    } catch (err) {
      console.error('Error loading admin listings', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, showToast]);

  useEffect(() => {
    loadAdminOpportunities();
  }, [loadAdminOpportunities]);

  const handleUpdateStatus = async (
    id: string,
    status: 'approved' | 'flagged' | 'rejected',
    notes?: string
  ) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedbackNotes: notes }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          status === 'approved'
            ? 'Listing approved and published to Discover!'
            : status === 'flagged'
            ? 'Changes requested and author notified.'
            : 'Listing rejected and archived.',
          status === 'approved' ? 'success' : 'info'
        );

        // Update local list
        setOpportunities((prev) =>
          activeTab === 'all'
            ? prev.map((o) => (o.id === id ? { ...o, status } : o))
            : prev.filter((o) => o.id !== id)
        );

        setModalMode(null);
        setSelectedOpp(null);
        setModerationNotes('');
      } else {
        showToast(data.error || 'Moderation action failed', 'error');
      }
    } catch (err) {
      showToast('Network error during moderation', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = opportunities.filter((o) => o.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-error-container text-on-error-container uppercase tracking-wider">
              Staff Portal
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">
              Security Level 3
            </span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight mt-1">
            Admin Moderation Center
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Audit newly posted listings, prevent scam opportunities, and verify host credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAdminOpportunities}
            className="px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-lg">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
            Pending Review
          </span>
          <p className="font-headline-md text-2xl font-black text-tertiary mt-1">
            {activeTab === 'pending' ? opportunities.length : '—'}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            Verified Hosts
          </span>
          <p className="font-headline-md text-2xl font-black text-secondary mt-1">
            100%
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Review Turnaround
          </span>
          <p className="font-headline-md text-2xl font-black text-primary mt-1">
            &lt; 2 hours
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Safety Score
          </span>
          <p className="font-headline-md text-2xl font-black text-on-surface mt-1">
            99.8%
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-outline-variant/30 pb-2 mb-space-md overflow-x-auto no-scrollbar">
        {[
          { id: 'pending', label: 'Pending Audit', icon: 'hourglass_top' },
          { id: 'approved', label: 'Active & Approved', icon: 'check_circle' },
          { id: 'flagged', label: 'Needs Changes', icon: 'flag' },
          { id: 'rejected', label: 'Rejected', icon: 'cancel' },
          { id: 'all', label: 'All Listings', icon: 'list' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-space-sm py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Queue Content */}
      {loading ? (
        <div className="py-space-2xl text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-on-surface-variant mt-2 font-semibold">
            Loading moderation queue...
          </p>
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          type="no_posts"
          title="Queue is completely clear!"
          description="There are no opportunities matching the selected moderation status. High five!"
        />
      ) : (
        <div className="flex flex-col gap-space-md">
          {opportunities.map((opp) => {
            const deadline = formatTimeRemaining(opp.applicationDeadline);
            const isProcessing = processingId === opp.id;

            return (
              <div
                key={opp.id}
                className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-space-md"
              >
                {/* Details */}
                <div className="flex items-start gap-space-md flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-primary shrink-0">
                    {opp.organization.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-bold text-xs text-on-surface-variant">
                        {opp.organization.name}
                      </span>
                      {opp.category && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-container text-on-surface-variant">
                          {opp.category.name}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          opp.status === 'approved'
                            ? 'bg-secondary-container/40 text-secondary'
                            : opp.status === 'pending'
                            ? 'bg-tertiary-container/40 text-tertiary'
                            : opp.status === 'flagged'
                            ? 'bg-error-container/40 text-error'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {opp.status}
                      </span>
                    </div>

                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="font-bold text-base text-on-surface hover:text-primary transition-colors"
                    >
                      {opp.title}
                    </Link>

                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {opp.description}
                    </p>

                    <div className="flex items-center gap-space-md flex-wrap text-[11px] text-on-surface-variant mt-1">
                      <span>Submitted: {formatDate(opp.createdAt)}</span>
                      {opp.applicationUrl && (
                        <span>
                          Portal:{' '}
                          <a
                            href={opp.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {(() => {
                              try {
                                return new URL(opp.applicationUrl).hostname;
                              } catch {
                                return 'Application Link';
                              }
                            })()}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center">
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="px-3 py-2 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    View
                  </Link>

                  {opp.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(opp.id, 'approved')}
                      className="px-3 py-2 rounded-xl bg-secondary text-white font-bold text-xs shadow-xs hover:bg-secondary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Approve</span>
                    </button>
                  )}

                  {opp.status !== 'flagged' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => {
                        setSelectedOpp(opp);
                        setModalMode('flag');
                      }}
                      className="px-3 py-2 rounded-xl bg-tertiary text-white font-bold text-xs shadow-xs hover:bg-tertiary/90 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      <span>Request Changes</span>
                    </button>
                  )}

                  {opp.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => {
                        setSelectedOpp(opp);
                        setModalMode('reject');
                      }}
                      className="px-3 py-2 rounded-xl bg-error-container text-error font-bold text-xs hover:bg-error hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject / Flag Feedback Modal */}
      {modalMode && selectedOpp && (
        <Modal isOpen={Boolean(modalMode)} onClose={() => setModalMode(null)}>
          <div className="p-space-xl flex flex-col gap-space-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    modalMode === 'reject'
                      ? 'bg-error-container text-error'
                      : 'bg-tertiary-container text-tertiary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {modalMode === 'reject' ? 'cancel' : 'flag'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-title-lg font-bold text-on-surface">
                    {modalMode === 'reject' ? 'Reject Opportunity' : 'Request Changes'}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {selectedOpp.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Feedback / Reason for the Host:
              </label>
              <textarea
                rows={4}
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder={
                  modalMode === 'reject'
                    ? 'e.g. Broken application URL, duplicate listing, or violates quality standards...'
                    : 'e.g. Please clarify compensation stipend and specify graduation years...'
                }
                className="w-full px-space-md py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-space-md py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    selectedOpp.id,
                    modalMode === 'reject' ? 'rejected' : 'flagged',
                    moderationNotes
                  )
                }
                className={`px-space-lg py-2 rounded-xl text-xs font-bold text-white shadow-xs ${
                  modalMode === 'reject'
                    ? 'bg-error hover:bg-error/90'
                    : 'bg-tertiary hover:bg-tertiary/90'
                }`}
              >
                {modalMode === 'reject' ? 'Confirm Rejection' : 'Send Feedback'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
