'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Opportunity } from '@/types';
import { formatDate, formatTimeRemaining } from '@/lib/utils';
import { DeleteConfirmModal } from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';

export default function MyPostsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<Opportunity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadMyPosts() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/my-posts');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.opportunities || []);
        } else {
          showToast('Failed to load your posts', 'error');
        }
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadMyPosts();
      }
    }
  }, [user, authLoading, router, showToast]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/opportunities/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== itemToDelete.id));
        showToast('Listing removed permanently', 'removed');
        setItemToDelete(null);
      } else {
        showToast(data.error || 'Failed to delete listing', 'error');
      }
    } catch (err) {
      showToast('Network error while deleting', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-xl">
        <div className="animate-pulse flex flex-col gap-space-lg">
          <div className="h-8 w-48 bg-surface-container-high rounded-xl" />
          <div className="h-24 bg-surface-container-high rounded-3xl" />
          <div className="h-96 bg-surface-container-high rounded-3xl" />
        </div>
      </div>
    );
  }

  const totalViews = posts.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const activeCount = posts.filter((p) => p.status === 'approved').length;
  const pendingCount = posts.filter((p) => p.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
        <div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
            My Posts & Listing Manager
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Track performance, modify content, and manage applications for your posted opportunities.
          </p>
        </div>

        <Link
          href="/post-opportunity"
          className="px-space-lg py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-lg">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Total Listings
          </span>
          <p className="font-headline-md text-2xl font-black text-on-surface mt-1">
            {posts.length}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            Active / Live
          </span>
          <p className="font-headline-md text-2xl font-black text-secondary mt-1">
            {activeCount}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
            Under Review
          </span>
          <p className="font-headline-md text-2xl font-black text-tertiary mt-1">
            {pendingCount}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Total Views
          </span>
          <p className="font-headline-md text-2xl font-black text-primary mt-1">
            {totalViews}
          </p>
        </div>
      </div>

      {/* Listings Section */}
      {posts.length === 0 ? (
        <EmptyState
          type="no_posts"
          title="No listings published yet"
          description="You haven't posted any opportunities yet. Reach qualified students and developers by posting your first opportunity today."
          action={{
            label: 'Post an Opportunity',
            href: '/post-opportunity',
            variant: 'primary',
          }}
        />
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-space-md">Opportunity</th>
                  <th className="py-3 px-space-md">Category</th>
                  <th className="py-3 px-space-md">Status</th>
                  <th className="py-3 px-space-md">Deadline</th>
                  <th className="py-3 px-space-md">Views</th>
                  <th className="py-3 px-space-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-xs">
                {posts.map((opp) => {
                  const deadline = formatTimeRemaining(opp.applicationDeadline);
                  return (
                    <tr key={opp.id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Title & Org */}
                      <td className="py-space-sm px-space-md">
                        <div className="flex items-center gap-space-xs">
                          <div className="w-9 h-9 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-primary shrink-0">
                            {opp.organization.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <Link
                              href={`/opportunities/${opp.id}`}
                              className="font-bold text-sm text-on-surface hover:text-primary transition-colors line-clamp-1"
                            >
                              {opp.title}
                            </Link>
                            <p className="text-[11px] text-on-surface-variant">
                              {opp.organization.name} • <span className="capitalize">{opp.type}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-space-sm px-space-md text-on-surface-variant font-medium">
                        {opp.category?.name || 'General'}
                      </td>

                      {/* Status */}
                      <td className="py-space-sm px-space-md">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            opp.status === 'approved'
                              ? 'bg-secondary-container/40 text-secondary'
                              : opp.status === 'pending'
                              ? 'bg-tertiary-container/40 text-tertiary'
                              : opp.status === 'flagged'
                              ? 'bg-error-container/40 text-error'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              opp.status === 'approved'
                                ? 'bg-secondary'
                                : opp.status === 'pending'
                                ? 'bg-tertiary'
                                : opp.status === 'flagged'
                                ? 'bg-error'
                                : 'bg-outline'
                            }`}
                          />
                          <span>
                            {opp.status === 'approved'
                              ? 'Active'
                              : opp.status === 'pending'
                              ? 'In Review'
                              : opp.status === 'flagged'
                              ? 'Needs Changes'
                              : 'Rejected'}
                          </span>
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-space-sm px-space-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">
                            {formatDate(opp.applicationDeadline)}
                          </span>
                          <span
                            className={`text-[10px] font-semibold ${
                              deadline.isUrgent ? 'text-error' : 'text-on-surface-variant'
                            }`}
                          >
                            {deadline.text}
                          </span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-space-sm px-space-md font-bold text-on-surface">
                        {opp.viewsCount || 0}
                      </td>

                      {/* Actions */}
                      <td className="py-space-sm px-space-md text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/opportunities/${opp.id}`}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                            title="Preview Public Listing"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </Link>
                          <Link
                            href={`/my-posts/${opp.id}/edit`}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-colors"
                            title="Edit Listing"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(opp)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                            title="Delete Listing"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-outline-variant/20 p-space-sm flex flex-col gap-space-sm">
            {posts.map((opp) => (
              <div key={opp.id} className="pt-space-sm first:pt-0 flex flex-col gap-space-xs">
                <div className="flex items-start justify-between gap-space-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                      {opp.category?.name || 'General'}
                    </span>
                    <h3 className="font-bold text-sm text-on-surface">
                      {opp.title}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      opp.status === 'approved'
                        ? 'bg-secondary-container/40 text-secondary'
                        : 'bg-tertiary-container/40 text-tertiary'
                    }`}
                  >
                    {opp.status === 'approved' ? 'Active' : 'In Review'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>Deadline: {formatDate(opp.applicationDeadline)}</span>
                  <span>{opp.viewsCount || 0} views</span>
                </div>

                <div className="flex items-center justify-end gap-space-xs pt-1">
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="px-2.5 py-1 rounded-lg border border-outline-variant/30 text-xs font-bold text-on-surface"
                  >
                    View
                  </Link>
                  <Link
                    href={`/my-posts/${opp.id}/edit`}
                    className="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-bold text-on-surface"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(opp)}
                    className="px-2.5 py-1 rounded-lg bg-error-container/40 text-xs font-bold text-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <DeleteConfirmModal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Opportunity Listing"
          itemName={itemToDelete.title}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
