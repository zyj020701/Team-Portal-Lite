import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterTabs } from './filter-tabs';

const options = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'completed' },
];

describe('FilterTabs', () => {
  it('正常渲染所有选项', () => {
    render(<FilterTabs options={options} value="all" onChange={() => {}} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '全部' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '未完成' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '已完成' })).toBeInTheDocument();
  });

  it('当前选中项有 aria-selected=true', () => {
    render(<FilterTabs options={options} value="active" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: '未完成' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: '全部' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('点击选项触发 onChange 回调', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterTabs options={options} value="all" onChange={onChange} />);
    await user.click(screen.getByRole('tab', { name: '已完成' }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });

  it('键盘右箭头切换到下一项', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterTabs options={options} value="all" onChange={onChange} />);
    const firstTab = screen.getByRole('tab', { name: '全部' });
    firstTab.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('active');
  });
});