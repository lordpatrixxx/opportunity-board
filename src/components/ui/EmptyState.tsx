import React from 'react';
import Link from 'next/link';

export type EmptyStateType =
  | 'search'
  | 'saved'
  | 'posts'
  | 'moderation'
  | 'notifications'
  | 'not_found'
  | 'no_results'
  | 'no_posts'
  | 'no_saved'
  | 'no_notifications';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: string;
  };
}

export default function EmptyState({
  type,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  action,
}: EmptyStateProps) {
  let icon = 'sentiment_dissatisfied';
  let iconBg = 'bg-surface-container text-primary';
  let badgeText = 'Notice';
  let defaultTitle = 'Nothing here yet';
  let defaultDesc = 'Check back later or adjust your filters.';
  let defaultAction = 'Go to Home';
  let defaultHref = '/';

  if (type === 'search' || type === 'no_results') {
    icon = 'manage_search';
    iconBg = 'bg-surface-container text-primary';
    badgeText = 'Query Filter';
    defaultTitle = 'No opportunities found';
    defaultDesc =
      'Try adjusting your search keywords, clearing selected domain filters, or expanding your workplace radius.';
    defaultAction = 'Clear All Filters';
  } else if (type === 'saved' || type === 'no_saved') {
    icon = 'bookmark_border';
    iconBg = 'bg-primary-fixed text-primary';
    badgeText = 'Saved Stash';
    defaultTitle = 'You haven’t saved anything yet';
    defaultDesc =
      'Save high-impact internships, hackathons, and research grants you want to revisit before upcoming cutoffs.';
    defaultAction = 'Explore Opportunities';
    defaultHref = '/';
  } else if (type === 'posts' || type === 'no_posts') {
    icon = 'campaign';
    iconBg = 'bg-surface-container-high text-primary';
    badgeText = 'Listing Manager';
    defaultTitle = 'You haven’t posted any opportunities';
    defaultDesc =
      'Share a valuable internship, hackathon, lab fellowship, or competition with ambitious students.';
    defaultAction = 'Post an Opportunity';
    defaultHref = '/post-opportunity';
  } else if (type === 'moderation') {
    icon = 'verified_user';
    iconBg = 'bg-secondary-container text-secondary';
    badgeText = 'Staff Portal';
    defaultTitle = 'No moderation needed';
    defaultDesc =
      'All submitted partner listings have been audited, approved, or resolved.';
    defaultAction = 'Refresh Queue';
    defaultHref = '/admin';
  } else if (type === 'notifications' || type === 'no_notifications') {
    icon = 'notifications_off';
    iconBg = 'bg-surface-container text-on-surface-variant';
    badgeText = 'Inbox Clear';
    defaultTitle = 'All caught up!';
    defaultDesc =
      'You have no new notifications. We’ll notify you when saved opportunity deadlines approach.';
    defaultAction = 'Browse Opportunities';
    defaultHref = '/';
  } else if (type === 'not_found') {
    icon = 'search_off';
    iconBg = 'bg-error-container text-error';
    badgeText = '404 Error';
    defaultTitle = 'Page or Resource Not Found';
    defaultDesc = 'The requested resource may have expired or been removed.';
    defaultAction = 'Return to Home';
    defaultHref = '/';
  }

  const finalTitle = title || defaultTitle;
  const finalDesc = description || defaultDesc;
  const finalAction = action?.label || actionText || defaultAction;
  const finalHref = action?.href || actionHref || defaultHref;
  const finalOnClick = action?.onClick || onAction;

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-space-xl shadow-xs flex flex-col items-center text-center justify-between py-12 border border-outline-variant/30 max-w-lg mx-auto my-8">
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-space-md shadow-xs`}>
          <span className="material-symbols-outlined text-[32px]">{icon}</span>
        </div>
        <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps uppercase mb-space-xs font-bold tracking-wider">
          {badgeText}
        </span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
          {finalTitle}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
          {finalDesc}
        </p>
      </div>

      {(finalOnClick || finalHref) && (
        <div className="pt-space-lg mt-space-sm w-full max-w-xs">
          {finalOnClick ? (
            <button
              onClick={finalOnClick}
              className="w-full py-2.5 px-space-md bg-primary text-white rounded-xl font-label-lg text-label-lg font-bold transition-all shadow-xs hover:bg-primary/90 active:scale-95 flex items-center justify-center gap-space-2xs"
              type="button"
            >
              <span>{finalAction}</span>
            </button>
          ) : (
            <Link
              href={finalHref}
              className="w-full py-2.5 px-space-md bg-primary text-white rounded-xl font-label-lg text-label-lg font-bold transition-all shadow-xs hover:bg-primary/90 active:scale-95 flex items-center justify-center gap-space-2xs"
            >
              <span>{finalAction}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
