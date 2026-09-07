'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'saved' | 'removed' | 'published' | 'synced' | 'deleted' | 'error' | 'info' | 'success';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, options?: { title?: string; actionUrl?: string; actionLabel?: string }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', options?: { title?: string; actionUrl?: string; actionLabel?: string }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = {
        id,
        type,
        message,
        title: options?.title,
        actionUrl: options?.actionUrl,
        actionLabel: options?.actionLabel,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast viewport matching Stitch bottom-right stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-space-xs max-w-sm w-full pointer-events-none transition-all duration-300">
        {toasts.map((toast) => {
          let icon = 'info';
          let iconBg = 'bg-surface-container';
          let iconColor = 'text-primary';
          let badgeText = 'System';
          let badgeColor = 'text-on-surface-variant';

          if (toast.type === 'saved' || toast.type === 'success') {
            icon = 'check_circle';
            iconBg = 'bg-secondary-container';
            iconColor = 'text-secondary';
            badgeText = toast.type === 'saved' ? 'Saved' : 'Success';
            badgeColor = 'text-secondary';
          } else if (toast.type === 'removed') {
            icon = 'bookmark_remove';
            iconBg = 'bg-surface-container-high';
            iconColor = 'text-on-surface-variant';
            badgeText = 'Stash Updated';
            badgeColor = 'text-on-surface-variant';
          } else if (toast.type === 'published') {
            icon = 'rocket_launch';
            iconBg = 'bg-secondary-container';
            iconColor = 'text-secondary';
            badgeText = 'Published';
            badgeColor = 'text-secondary';
          } else if (toast.type === 'synced') {
            icon = 'done_all';
            iconBg = 'bg-secondary-container';
            iconColor = 'text-secondary';
            badgeText = 'Synced';
            badgeColor = 'text-secondary';
          } else if (toast.type === 'deleted') {
            icon = 'delete';
            iconBg = 'bg-error-container';
            iconColor = 'text-error';
            badgeText = 'Deleted';
            badgeColor = 'text-error';
          } else if (toast.type === 'error') {
            icon = 'warning';
            iconBg = 'bg-error-container';
            iconColor = 'text-error';
            badgeText = 'Alert';
            badgeColor = 'text-error';
          }

          return (
            <div
              key={toast.id}
              className="pointer-events-auto bg-surface-container-lowest shadow-xl rounded-xl p-space-md flex items-center justify-between gap-space-sm transform translate-y-0 opacity-100 transition-all duration-300 border border-outline-variant/30"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div className={`w-9 h-9 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-label-caps text-label-caps uppercase font-bold ${badgeColor}`}>
                    {toast.title || badgeText}
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface leading-tight truncate">
                    {toast.message}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-2xs shrink-0">
                {toast.actionUrl && (
                  <a
                    href={toast.actionUrl}
                    className="font-label-md text-label-md text-primary font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{toast.actionLabel || 'View'}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </a>
                )}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
