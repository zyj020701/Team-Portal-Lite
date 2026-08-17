import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AnnouncementCardSkeleton } from './announcement-card-skeleton';
import { TodoItemSkeleton } from './todo-item-skeleton';
import { TextDisplay } from './TextDisplay';

describe('AnnouncementCardSkeleton', () => {
  it('默认渲染骨架卡片（无作者行）', () => {
    const { container } = render(React.createElement(AnnouncementCardSkeleton));
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('rounded-lg', 'border', 'bg-white');
    // 默认 showAuthor=false，不应包含作者分隔点
    expect(root.textContent).not.toContain('·');
  });

  it('showAuthor=true 时包含作者分隔点', () => {
    const { container } = render(
      React.createElement(AnnouncementCardSkeleton, { showAuthor: true }),
    );
    const root = container.firstChild as HTMLElement;
    expect(root.textContent).toContain('·');
  });

  it('应用自定义 className', () => {
    const { container } = render(
      React.createElement(AnnouncementCardSkeleton, { className: 'custom-class' }),
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('custom-class');
  });
});

describe('TodoItemSkeleton', () => {
  it('渲染待办项骨架（flex 布局）', () => {
    const { container } = render(React.createElement(TodoItemSkeleton));
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('flex', 'items-center', 'gap-3', 'rounded-lg');
  });

  it('应用自定义 className', () => {
    const { container } = render(
      React.createElement(TodoItemSkeleton, { className: 'my-skel' }),
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('my-skel');
  });
});

describe('TextDisplay', () => {
  it('渲染传入的文本', () => {
    render(React.createElement(TextDisplay, { text: 'Hello World' }));
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('应用自定义 className', () => {
    const { container } = render(
      React.createElement(TextDisplay, { text: 'x', className: 'text-red' }),
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('text-red');
  });
});