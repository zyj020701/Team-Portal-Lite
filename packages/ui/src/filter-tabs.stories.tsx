import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterTabs, type FilterTabsOption } from './filter-tabs';

type TodoFilter = 'all' | 'active' | 'completed';

const meta = {
  title: 'UI/FilterTabs',
  component: FilterTabs<TodoFilter>,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FilterTabs<TodoFilter>>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions: FilterTabsOption<TodoFilter>[] = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'completed' },
];

const noop = () => {};

export const Default: Story = {
  args: {
    value: 'all',
    options: defaultOptions,
    onChange: noop,
  },
};

export const ActiveSelected: Story = {
  args: {
    value: 'active',
    options: defaultOptions,
    onChange: noop,
  },
};

export const CompletedSelected: Story = {
  args: {
    value: 'completed',
    options: defaultOptions,
    onChange: noop,
  },
};

export const Interactive = {
  render: function Render() {
    const [value, setValue] = useState<TodoFilter>('all');
    return (
      <FilterTabs
        value={value}
        options={defaultOptions}
        onChange={(v) => setValue(v)}
      />
    );
  },
};