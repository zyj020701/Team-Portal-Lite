import * as React from 'react';
import { cn } from '@team-portal-lite/lib';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary';
}

export function Button({
  label,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded px-4 py-2 text-sm font-medium text-white transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary'
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-gray-600 hover:bg-gray-700',
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
}