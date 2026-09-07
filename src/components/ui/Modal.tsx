'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/45 backdrop-blur-md transition-opacity">
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// 1. External Application Interstitial Modal (From Stitch Section 04)
interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  organizationName: string;
  applicationUrl: string;
  compensation?: string | null;
  location?: string | null;
}

export function ApplyInterstitialModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  organizationName,
  applicationUrl,
  compensation,
  location,
}: ApplyModalProps) {
  let hostname = 'External Application Portal';
  try {
    hostname = new URL(applicationUrl).hostname;
  } catch (e) {
    // ignore
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-space-xl flex flex-col gap-space-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined text-[24px]">open_in_new</span>
            </div>
            <div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                Direct Partner Hand-off
              </span>
              <h3 className="font-headline-lg text-headline-md text-on-surface font-bold">
                Ready to apply?
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Verified Host Box */}
        <div className="bg-surface-container-low p-space-md rounded-lg flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-on-surface">
            {organizationName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                {title}
              </p>
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
            </div>
            <p className="font-body-sm text-label-md text-on-surface-variant">
              {organizationName} {location ? `• ${location}` : ''} {compensation ? `• ${compensation}` : ''}
            </p>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          You will be redirected to <strong className="text-on-surface">{organizationName}&apos;s</strong> verified application portal (<span className="font-mono text-primary">{hostname}</span>). The initial intake form takes approximately ~10 minutes.
        </p>

        {/* Destination URL Preview Pill */}
        <div className="flex items-center gap-space-2xs bg-surface-container px-space-sm py-space-2xs rounded-lg text-on-surface-variant font-mono text-label-md overflow-hidden truncate">
          <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
          <span className="truncate">{applicationUrl}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            onClick={onClose}
            className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-label-lg transition-all"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-space-lg py-space-xs bg-primary-container hover:bg-primary text-on-primary rounded-lg font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-space-2xs active:scale-95 font-bold"
            type="button"
          >
            <span>Continue to Application</span>
            <span className="material-symbols-outlined text-[16px]">north_east</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 2. Destructive Deletion Confirmation Modal
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isDeleting,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-space-xl flex flex-col gap-space-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">delete</span>
            </div>
            <div>
              <span className="font-label-caps text-label-caps uppercase text-error font-bold">
                Destructive Action
              </span>
              <h3 className="font-headline-lg text-headline-md text-on-surface font-bold">
                {title}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-sm bg-error-container/40 rounded-lg text-on-error-container text-body-sm flex items-start gap-space-xs">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">warning</span>
          <span>
            This action permanently deletes {itemName ? <strong className="font-bold">&quot;{itemName}&quot;</strong> : 'this item'}. This cannot be undone.
          </span>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-label-lg transition-all"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-space-lg py-space-xs bg-error hover:bg-on-error-container text-on-error rounded-lg font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-space-2xs active:scale-95 font-bold"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">delete_forever</span>
            <span>{isDeleting ? 'Deleting...' : 'Permanently Delete'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
