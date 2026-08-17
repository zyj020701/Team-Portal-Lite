import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@team-portal-lite/lib';

export type TodoPriority = 'low' | 'medium' | 'high';

export interface TodoItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  completed: boolean;
  priority: TodoPriority;
  onToggle?: () => void;
  disabled?: boolean;
}

const priorityStyles: Record<TodoPriority, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const priorityLabels: Record<TodoPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export const TodoItem = React.forwardRef<HTMLDivElement, TodoItemProps>(
  (
    { title, completed, priority, onToggle, disabled, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Root
          checked={completed}
          {...(onToggle ? { onCheckedChange: () => onToggle() } : {})}
          disabled={disabled}
          aria-label={`${completed ? '标记为未完成' : '标记为已完成'}：${title}`}
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            'data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600',
            disabled && 'cursor-not-allowed',
          )}
        >
          <CheckboxPrimitive.Indicator className="text-white">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        <span
          className={cn(
            'flex-1 text-sm text-gray-900',
            completed && 'text-gray-500 line-through',
          )}
        >
          {title}
        </span>

        <span
          className={cn(
            'rounded px-2 py-0.5 text-xs font-medium',
            priorityStyles[priority],
          )}
          aria-label={`优先级：${priorityLabels[priority]}`}
        >
          {priorityLabels[priority]}
        </span>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';