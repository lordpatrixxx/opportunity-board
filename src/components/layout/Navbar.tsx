'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, savedCount, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Opportunities', href: '/opportunities' },
    {
      label: 'Saved',
      href: '/saved',
      badge: savedCount > 0 ? savedCount : null,
      badgeClass: 'bg-primary-fixed text-on-primary-fixed',
      requiresAuth: true,
    },
    { label: 'My Posts', href: '/my-posts', requiresAuth: true },
    {
      label: 'Admin',
      href: '/admin',
      adminOnly: true,
      pill: 'ADMIN',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
      <div className="h-16 max-w-7xl mx-auto px-gutter-mobile lg:px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-space-xl">
          <Link href="/" className="flex items-center gap-space-xs focus:outline-none group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              Opportunity Board
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-space-xs">
            {navLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              if (link.adminOnly && (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR'))) return null;

              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-space-sm py-space-2xs rounded-lg font-label-lg text-label-lg transition-all inline-flex items-center gap-space-2xs ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span
                      className={`px-space-2xs py-0.5 rounded-full font-label-caps text-label-caps ${
                        isActive ? 'bg-white/20 text-white' : link.badgeClass
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                  {link.pill && (
                    <span
                      className={`px-space-2xs py-0.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {link.pill}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Auth Controls */}
        <div className="flex items-center gap-space-sm">
          {/* Quick Search trigger */}
          <button
            onClick={() => {
              router.push('/opportunities?focus=search');
            }}
            className="hidden sm:flex items-center gap-space-xs px-space-sm py-space-2xs rounded-lg bg-surface-container-low hover:bg-surface-container hover:text-on-surface text-on-surface-variant transition-all border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="font-body-sm text-body-sm">Search</span>
            <kbd className="px-space-2xs py-0.5 bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps rounded shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative p-space-xs rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface animate-pulse"></span>
          </Link>

          {/* Post Opportunity CTA */}
          <Link
            href={user ? '/post-opportunity' : '/login?redirect=/post-opportunity'}
            className="hidden md:inline-flex items-center gap-space-2xs px-space-md py-space-xs bg-primary-container hover:bg-primary text-on-primary rounded-lg font-label-lg text-label-lg transition-all shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Post Opportunity</span>
          </Link>

          {/* User Avatar or Auth Buttons */}
          {user ? (
            <div className="relative pl-space-2xs" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-space-2xs p-space-3xs rounded-full hover:bg-surface-container transition-all"
                type="button"
              >
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant"
                  src={
                    user.avatarUrl ||
                    'https://lh3.googleusercontent.com/aida/AEtjO1VarjAWepmyJwNKy0i-25BhzT5iCd2kKRPP_E-D9dXZmwf0f9l6bcxCC826lNIG_AFFodp59djWCVrde4tncxizCfzIUmkeG9PWE7p9KVQDLrj3Q-qgbhjrYfpI2GOOi385BOCeDbHRk5O3gfW0XuIupUEwezgNSh1XFZhyoe3fZRJEgzBlZjXhSxGftDW43LzB0d7UR_SGQc__V3m4QNLDxqv8fsEBjNw5aT3Pvl9iD3un8CsJCSIpEPc'
                  }
                />
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  {dropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-space-xs z-50 flex flex-col divide-y divide-surface-container">
                  <div className="px-space-md py-space-xs flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                      {user.fullName}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {user.email}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-space-sm px-space-md py-space-xs text-on-surface hover:bg-surface-container-low font-body-md text-body-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                      <span>Profile & Settings</span>
                    </Link>
                    <Link
                      href="/my-posts"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-space-sm px-space-md py-space-xs text-on-surface hover:bg-surface-container-low font-body-md text-body-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">folder_managed</span>
                      <span>My Listings</span>
                    </Link>
                    <Link
                      href="/saved"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-space-sm px-space-md py-space-xs text-on-surface hover:bg-surface-container-low font-body-md text-body-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">bookmark</span>
                      <span>Saved Watchlist ({savedCount})</span>
                    </Link>
                    {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-space-sm px-space-md py-space-xs text-primary hover:bg-primary-fixed/30 font-body-md text-body-sm transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                        <span>Admin Moderation</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-space-sm px-space-md py-space-xs text-error hover:bg-error-container/40 font-body-md text-body-sm transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-space-xs">
              <Link
                href="/login"
                className="px-space-sm py-space-2xs rounded-lg font-label-lg text-label-lg text-on-surface hover:bg-surface-container transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-space-sm py-space-2xs rounded-lg font-label-lg text-label-lg bg-primary-container text-on-primary hover:bg-primary transition-colors shadow-xs"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-gutter-mobile py-space-md flex flex-col gap-space-sm">
          {navLinks.map((link) => {
            if (link.requiresAuth && !user) return null;
            if (link.adminOnly && (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR'))) return null;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-space-sm py-space-xs rounded-lg font-label-lg text-label-lg text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.badge !== null && link.badge !== undefined && (
                  <span className={`px-space-2xs py-0.5 rounded-full font-label-caps text-label-caps ${link.badgeClass}`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <Link
            href={user ? '/post-opportunity' : '/login'}
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-space-xs bg-primary-container text-on-primary rounded-lg font-label-lg text-label-lg text-center font-bold mt-2"
          >
            + Post Opportunity
          </Link>
        </div>
      )}
    </header>
  );
}
