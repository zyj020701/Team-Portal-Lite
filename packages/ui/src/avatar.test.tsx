import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';

// Mock next/image 以在 jsdom 中渲染为普通 img
vi.mock('next/image', () => ({
  default: (props: { src?: string | object; alt?: string; className?: string }) =>
    React.createElement('img', {
      src: typeof props.src === 'string' ? props.src : '',
      alt: props.alt,
      className: props.className,
    }),
}));

// Mock @radix-ui/react-avatar：jsdom 中图片不会真正 onLoad，
// 导致 Radix 的 Image 一直不渲染。这里让 Image 直接渲染 children。
vi.mock('@radix-ui/react-avatar', () => {
  const Root = ({ children, className }: { children?: React.ReactNode; className?: string }) =>
    React.createElement('span', { className }, children);
  const Image = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);
  const Fallback = ({ children, className }: { children?: React.ReactNode; className?: string }) =>
    React.createElement('span', { className }, children);
  return { Root, Image, Fallback };
});

import { Avatar } from './avatar';

describe('Avatar', () => {
  it('无 src 时显示姓名首字母', () => {
    const { container } = render(React.createElement(Avatar, { name: '张三' }));
    expect(screen.getByText('张')).toBeInTheDocument();
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('rounded-full');
  });

  it('有 src 时渲染图片', () => {
    render(React.createElement(Avatar, { name: '李四', src: '/avatar.png' }));
    const img = screen.getByRole('img', { name: '李四' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/avatar.png');
  });

  it('size=sm 应用小尺寸样式', () => {
    const { container } = render(React.createElement(Avatar, { name: '王', size: 'sm' }));
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('h-8', 'w-8', 'text-xs');
  });

  it('size=lg 应用大尺寸样式', () => {
    const { container } = render(React.createElement(Avatar, { name: '王', size: 'lg' }));
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('h-14', 'w-14', 'text-lg');
  });

  it('默认 size=md', () => {
    const { container } = render(React.createElement(Avatar, { name: '赵' }));
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('h-10', 'w-10', 'text-sm');
  });

  it('图片加载失败时显示 fallback 首字母', () => {
    render(React.createElement(Avatar, { name: '钱', src: '/broken.png' }));
    const img = screen.getByRole('img', { name: '钱' });
    expect(img).toBeInTheDocument();
    fireEvent.error(img);
    expect(screen.getByText('钱')).toBeInTheDocument();
  });
});