import * as React from 'react';
import { cn } from '@team-portal-lite/lib';
import { Skeleton } from './skeleton';

export interface TodoItemSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton placeholder for TodoItem.
 *
 * CLS 零偏差要求：宽高、边距、圆角必须与 TodoItem 完全一致。
 * 复用同一套 Tailwind 类名，确保尺寸零偏差。
 */
export const TodoItemSkeleton = React.forwardRef<
  HTMLDivElement,
  TodoItemSkeletonProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm',
        className,
      )}
      {...props}
    >
      {/* 对应 CheckboxPrimitive.Root: h-5 w-5 */}
      <Skeleton variant="rectangular" className="h-5 w-5 shrink-0 rounded" />
      {/* 对应 title span: flex-1 text-sm */}
      <Skeleton className="h-5 flex-1" />
      {/* 对应 priority badge: rounded px-2 py-0.5 text-xs */}
      <Skeleton className="h-5 w-8 rounded" />
    </div>
  );
});

TodoItemSkeleton.displayName = 'TodoItemSkeleton';