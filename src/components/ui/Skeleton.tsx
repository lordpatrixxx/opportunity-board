import React from 'react';

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md animate-pulse">
      <div className="flex flex-col gap-space-sm">
        {/* Header Shimmer */}
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm w-full">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high shrink-0"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 bg-surface-container-high rounded-md w-3/4"></div>
              <div className="h-3 bg-surface-container rounded-md w-1/2"></div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container shrink-0"></div>
        </div>

        {/* Tags Shimmer */}
        <div className="flex gap-space-xs my-space-xs">
          <div className="h-6 w-24 bg-surface-container-high rounded-full"></div>
          <div className="h-6 w-20 bg-surface-container rounded-full"></div>
        </div>

        {/* Title & Body Shimmer */}
        <div className="flex flex-col gap-2 mb-space-sm">
          <div className="h-5 bg-surface-container-high rounded w-5/6"></div>
          <div className="h-3 bg-surface-container rounded w-full"></div>
          <div className="h-3 bg-surface-container rounded w-4/5"></div>
        </div>
      </div>

      {/* Footer Shimmer */}
      <div className="flex items-center justify-between pt-space-xs border-t border-surface-container">
        <div className="h-4 w-28 bg-surface-container-high rounded"></div>
        <div className="h-8 w-24 bg-surface-container-highest rounded-lg"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg gap-space-md animate-pulse border border-outline-variant/10">
      <div className="flex items-center gap-space-sm w-1/3">
        <div className="w-8 h-8 rounded-lg bg-surface-container-high shrink-0"></div>
        <div className="h-3.5 bg-surface-container-high rounded w-full"></div>
      </div>
      <div className="h-3 bg-surface-container rounded w-20 hidden sm:block"></div>
      <div className="h-5 bg-surface-container-high rounded-full w-24"></div>
      <div className="h-6 w-16 bg-surface-container-highest rounded"></div>
    </div>
  );
}

export function CountdownBannerSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm animate-pulse border border-outline-variant/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high"></div>
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 bg-surface-container-high rounded w-36"></div>
            <div className="h-2.5 bg-surface-container rounded w-48"></div>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <div className="h-10 w-12 bg-surface-container rounded-lg"></div>
          <div className="h-10 w-12 bg-surface-container rounded-lg"></div>
          <div className="h-10 w-12 bg-surface-container rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
