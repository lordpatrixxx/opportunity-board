import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-space-sm sm:p-space-lg relative overflow-hidden">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/8 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[400px] bg-secondary/8 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Header with Brand Logo */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-space-xs">
        <Link href="/" className="flex items-center gap-space-xs group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">explore</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Opportunity Board
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Card Container */}
      <main className="w-full flex-1 flex items-center justify-center py-space-md">
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center py-space-xs text-xs text-on-surface-variant/70">
        <p>&copy; 2026 Opportunity Board. All rights reserved.</p>
      </footer>
    </div>
  );
}
