import * as React from 'react';
import { cn } from '@team-portal-lite/lib';

export interface FilterTabsOption<T extends string = string> {
  label: string;
  value: T;
}

export interface FilterTabsProps<T extends string = string> {
  options: FilterTabsOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function FilterTabs<T extends string = string>({
  options,
  value,
  onChange,
  className,
}: FilterTabsProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = options.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      const nextOption = options[nextIndex];
      if (nextOption) {
        onChange(nextOption.value);
      }
      const btn = e.currentTarget.parentElement?.children[nextIndex] as HTMLButtonElement | undefined;
      btn?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="筛选"
      className={cn(
        'inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1',
        className,
      )}
    >
      {options.map((option, index) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              isActive
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
