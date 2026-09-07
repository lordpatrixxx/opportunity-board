import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return 'Rolling Admission';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'Rolling Admission';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeRemaining(deadline: Date | string | null | undefined): {
  text: string;
  isUrgent: boolean;
  isExpiringSoon: boolean;
  isExpired: boolean;
} {
  if (!deadline) {
    return {
      text: 'Rolling Admission',
      isUrgent: false,
      isExpiringSoon: false,
      isExpired: false,
    };
  }

  const now = new Date();
  const d = new Date(deadline);
  const diffMs = d.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return {
      text: 'Applications Closed',
      isUrgent: false,
      isExpiringSoon: false,
      isExpired: true,
    };
  }

  if (diffHours <= 48) {
    return {
      text: `Closing in ${diffHours}h`,
      isUrgent: true,
      isExpiringSoon: true,
      isExpired: false,
    };
  }

  if (diffDays <= 7) {
    return {
      text: `Closing in ${diffDays} days`,
      isUrgent: false,
      isExpiringSoon: true,
      isExpired: false,
    };
  }

  return {
    text: `Ends ${formatDate(d)}`,
    isUrgent: false,
    isExpiringSoon: false,
    isExpired: false,
  };
}

export function formatRelativeAgo(dateInput: Date | string): string {
  const d = new Date(dateInput);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}
