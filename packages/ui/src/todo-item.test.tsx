import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './todo-item';

describe('TodoItem', () => {
  const defaultProps = {
    title: '完成项目报告',
    completed: false,
    priority: 'medium' as const,
  };

  it('正常渲染：显示标题和优先级标签', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('完成项目报告')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
  });

  it('未完成状态：checkbox 未选中，标题无删除线', () => {
    render(<TodoItem {...defaultProps} completed={false} />);
    const checkbox = screen.getByRole('checkbox', { name: /标记为已完成/ });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('完成项目报告')).not.toHaveClass('line-through');
  });

  it('已完成状态：checkbox 选中，标题有删除线', () => {
    render(<TodoItem {...defaultProps} completed={true} />);
    const checkbox = screen.getByRole('checkbox', { name: /标记为未完成/ });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('完成项目报告')).toHaveClass('line-through');
  });

  it('点击 checkbox 触发 onToggle 回调', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<TodoItem {...defaultProps} onToggle={onToggle} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('disabled 状态：checkbox 不可点击', () => {
    render(<TodoItem {...defaultProps} disabled={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('高优先级显示"高"标签', () => {
    render(<TodoItem {...defaultProps} priority="high" />);
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  it('低优先级显示"低"标签', () => {
    render(<TodoItem {...defaultProps} priority="low" />);
    expect(screen.getByText('低')).toBeInTheDocument();
  });
});