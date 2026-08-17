import * as React from 'react';
import { cn } from '@team-portal-lite/lib';
import { Skeleton } from './skeleton';

export interface AnnouncementCardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the author line skeleton.
   * Must match whether the real AnnouncementCard will show an author.
   */
  showAuthor?: boolean;
}

/**
 * Skeleton placeholder for AnnouncementCard.
 *
 * CLS 零偏差要求：宽高、边距、圆角必须与 AnnouncementCard 完全一致。
 * 复用同一套 Tailwind 类名，确保尺寸零偏差。
 */
export const AnnouncementCardSkeleton = React.forwardRef<
  HTMLDivElement,
  AnnouncementCardSkeletonProps
>(({ showAuthor = false, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
        className,
      )}
      {...props}
    >
      {/* 对应 <h3 className="text-base font-semibold text-gray-900"> */}
      <Skeleton className="h-6 w-2/3" />
      {/* 对应 <p className="mt-2 text-sm text-gray-600">：text-sm line-height=20px，两行=40px，无额外间距 */}
      <Skeleton className="mt-2 h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      {/* 对应 <div className="mt-3 flex items-center gap-2 text-xs text-gray-400"> */}
      <div className="mt-3 flex items-center gap-2">
        {showAuthor ? (
          <>
            <Skeleton className="h-4 w-16" />
            <span className="text-xs text-gray-400">·</span>
          </>
        ) : null}
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
});

AnnouncementCardSkeleton.displayName = 'AnnouncementCardSkeleton';