import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnnouncementCard } from './announcement-card';

describe('AnnouncementCard', () => {
  const defaultProps = {
    title: '测试公告标题',
    content: '这是测试公告的内容。',
    date: '2026-08-15',
    author: '张三',
  };

  it('正常渲染：显示标题、内容、作者和日期', () => {
    render(<AnnouncementCard {...defaultProps} />);
    expect(screen.getByText('测试公告标题')).toBeInTheDocument();
    expect(screen.getByText('这是测试公告的内容。')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('2026-08-15')).toBeInTheDocument();
  });

  it('没有作者时不显示作者区域', () => {
    const { author: _author, ...propsWithoutAuthor } = defaultProps;
    render(<AnnouncementCard {...propsWithoutAuthor} />);
    expect(screen.queryByText('张三')).not.toBeInTheDocument();
  });

  it('点击卡片触发 onClick 回调', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<AnnouncementCard {...defaultProps} onClick={handleClick} />);
    await user.click(screen.getByText('测试公告标题'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('自定义 className 被应用', () => {
    render(<AnnouncementCard {...defaultProps} className="custom-class" data-testid="card" />);
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });
});