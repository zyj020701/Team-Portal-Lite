import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import Image from 'next/image';
import { cn } from '@team-portal-lite/lib';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ name, src, size = 'md', className }, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100',
        sizeStyles[size],
        className,
      )}
    >
      {src ? (
        <AvatarPrimitive.Image asChild>
          <Image
            src={src}
            alt={name}
            fill
            sizes="(max-width: 768px) 32px, 40px"
            className="object-cover"
          />
        </AvatarPrimitive.Image>
      ) : null}
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center font-semibold text-blue-700"
        delayMs={src ? 600 : 0}
      >
        {getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});

Avatar.displayName = 'Avatar';