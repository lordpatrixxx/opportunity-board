'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Strict role guard: only ADMIN or MODERATOR
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <Navbar />
        <main className="flex-1 pt-24 max-w-xl mx-auto px-gutter-mobile">
          <EmptyState
            type="not_found"
            title="403 — Administrator Access Restricted"
            description="The Admin Moderation Center is strictly protected and only accessible to verified administrators and moderators."
            action={{
              label: 'Return to Public Discovery',
              href: '/',
              variant: 'primary',
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
