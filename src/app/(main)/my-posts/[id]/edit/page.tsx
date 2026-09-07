'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import OpportunityForm from '@/components/forms/OpportunityForm';
import { Opportunity } from '@/types';
import EmptyState from '@/components/ui/EmptyState';

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const id = params?.id as string;
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadOpportunity() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/opportunities/${id}`);
        if (!res.ok) {
          setErrorMsg('Listing not found or you do not have permission to edit it.');
          return;
        }
        const data = await res.json();
        setOpportunity(data.opportunity);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load opportunity data.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadOpportunity();
      }
    }
  }, [id, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-gutter-mobile py-space-2xl text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (errorMsg || !opportunity) {
    return (
      <div className="max-w-xl mx-auto px-gutter-mobile py-space-2xl text-center">
        <EmptyState
          type="not_found"
          title="Cannot Edit Opportunity"
          description={errorMsg || 'This listing does not exist or you are not authorized to edit it.'}
          action={{
            label: 'Back to My Posts',
            href: '/my-posts',
            variant: 'primary',
          }}
        />
      </div>
    );
  }

  // Check ownership
  const isOwner = user?.id === opportunity.userId || user?.role === 'ADMIN';
  if (!isOwner) {
    return (
      <div className="max-w-xl mx-auto px-gutter-mobile py-space-2xl text-center">
        <EmptyState
          type="not_found"
          title="Access Denied"
          description="Only the listing author or an administrator can edit this opportunity."
          action={{
            label: 'Back to My Posts',
            href: '/my-posts',
            variant: 'primary',
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      <div className="mb-space-lg">
        <Link
          href="/my-posts"
          className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-space-xs"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to My Posts</span>
        </Link>
        <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
          Edit Opportunity Listing
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Update requirements, deadlines, or description. Changes will be updated across discovery.
        </p>
      </div>

      <OpportunityForm initialData={opportunity} isEditing={true} />
    </div>
  );
}
