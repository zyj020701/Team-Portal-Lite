'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TodoItem } from '@team-portal-lite/ui';
import type { Todo } from '@team-portal-lite/features';

interface VirtualTodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
}

const ROW_HEIGHT = 64;
const CONTAINER_HEIGHT = 600;
const OVERSCAN = 5;

export function VirtualTodoList({ todos, onToggle }: VirtualTodoListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: todos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  return (
    <div
      ref={parentRef}
      role="list"
      aria-label="待办事项列表"
      className="h-[600px] overflow-auto rounded-lg border border-gray-200"
      data-testid="virtual-list-container"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const todo = todos[virtualItem.index];
          if (!todo) return null;
          return (
            <div
              key={todo.id}
              role="listitem"
              aria-label={todo.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                padding: '4px 8px',
                boxSizing: 'border-box',
              }}
            >
              <TodoItem
                title={todo.title}
                completed={todo.completed}
                priority={todo.priority}
                onToggle={() => onToggle(todo.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}