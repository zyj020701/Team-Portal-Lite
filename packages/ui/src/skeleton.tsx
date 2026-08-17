import * as React from 'react';
import { cn } from '@team-portal-lite/lib';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

function toCssSize(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, className, style, ...props }, ref) => {
    const variantStyles: Record<SkeletonVariant, string> = {
      text: 'rounded h-4',
      circular: 'rounded-full',
      rectangular: 'rounded',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200',
          variantStyles[variant],
          className,
        )}
        style={{
          width: toCssSize(width),
          height: toCssSize(height),
          ...style,
        }}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';