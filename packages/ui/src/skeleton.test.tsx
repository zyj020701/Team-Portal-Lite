import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('默认渲染 text 变体', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse', 'bg-gray-200', 'rounded', 'h-4');
  });

  it('circular 变体应用 rounded-full', () => {
    render(<Skeleton variant="circular" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-full');
  });

  it('rectangular 变体应用 rounded', () => {
    render(<Skeleton variant="rectangular" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded');
  });

  it('数字宽高转换为 px', () => {
    render(<Skeleton width={100} height={50} data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('字符串宽高直接使用', () => {
    render(<Skeleton width="50%" height="2rem" data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '50%', height: '2rem' });
  });

  it('自定义 className 被应用', () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('custom-class');
  });
});