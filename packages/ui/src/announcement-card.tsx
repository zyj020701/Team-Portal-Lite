import * as React from 'react';
import { cn } from '@team-portal-lite/lib';

export interface AnnouncementCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  content: string;
  date: string;
  author?: string;
}

export const AnnouncementCard = React.forwardRef<
  HTMLDivElement,
  AnnouncementCardProps
>(({ title, content, date, author, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
        className,
      )}
      {...props}
    >
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{content}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        {author ? (
          <>
            <span>{author}</span>
            <span>·</span>
          </>
        ) : null}
        <span>{date}</span>
      </div>
    </div>
  );
});

AnnouncementCard.displayName = 'AnnouncementCard';