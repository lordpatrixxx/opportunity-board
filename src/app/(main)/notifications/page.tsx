'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    async function loadNotifications() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        } else {
          showToast('Failed to load notifications', 'error');
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadNotifications();
      }
    }
  }, [user, authLoading, router, showToast]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error('Error marking as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        showToast('All notifications marked as read', 'success');
      }
    } catch (err) {
      showToast('Error updating notifications', 'error');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return { icon: 'alarm', color: 'text-error bg-error-container/40' };
      case 'opportunity_approved':
        return { icon: 'check_circle', color: 'text-secondary bg-secondary-container/40' };
      case 'opportunity_rejected':
        return { icon: 'cancel', color: 'text-error bg-error-container/40' };
      case 'moderation_flagged':
        return { icon: 'flag', color: 'text-tertiary bg-tertiary-container/40' };
      case 'new_matching':
        return { icon: 'sparkles', color: 'text-primary bg-primary-fixed/50' };
      default:
        return { icon: 'notifications', color: 'text-on-surface-variant bg-surface-container-high' };
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="max-w-4xl mx-auto px-gutter-mobile py-space-2xl text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-margin-desktop py-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-md text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Deadline alerts, moderation updates, and matching opportunities for your profile.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-space-md border-b border-outline-variant/30 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <EmptyState
          type="no_notifications"
          title="All caught up!"
          description="You don't have any unread notifications right now. Check back when saved opportunity deadlines approach."
        />
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-xs divide-y divide-outline-variant/20 overflow-hidden">
          {filtered.map((item) => {
            const iconConfig = getNotificationIcon(item.type);

            return (
              <div
                key={item.id}
                className={`p-space-md flex items-start gap-space-md transition-colors ${
                  item.read
                    ? 'hover:bg-surface-container-low/40'
                    : 'bg-primary-fixed/15 hover:bg-primary-fixed/25'
                }`}
              >
                {/* Icon Badge */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconConfig.color}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {iconConfig.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-on-surface">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-on-surface-variant shrink-0">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-space-sm mt-2">
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    )}

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-[11px] font-bold text-on-surface-variant hover:text-on-surface"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>

                {/* Unread Indicator dot */}
                {!item.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
