import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('正常渲染：显示 label 文本', () => {
    render(<Button label="点击我" />);
    expect(screen.getByRole('button', { name: '点击我' })).toBeInTheDocument();
  });

  it('primary variant 默认样式', () => {
    render(<Button label="主按钮" />);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('secondary variant 样式', () => {
    render(<Button label="次按钮" variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-600');
  });

  it('disabled 状态不可点击', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button label="禁用" disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: '禁用' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('点击触发 onClick 回调', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button label="可点击" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: '可点击' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('自定义 className 被应用', () => {
    render(<Button label="自定义" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});