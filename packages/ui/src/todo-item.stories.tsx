import type { Meta, StoryObj } from '@storybook/react';
import { TodoItem } from './todo-item';

const meta = {
  title: 'UI/TodoItem',
  component: TodoItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LowPriority: Story = {
  args: {
    title: '阅读团队周报',
    completed: false,
    priority: 'low',
  },
};

export const MediumPriority: Story = {
  args: {
    title: '完成代码审查',
    completed: false,
    priority: 'medium',
  },
};

export const HighPriority: Story = {
  args: {
    title: '修复线上紧急 Bug',
    completed: false,
    priority: 'high',
  },
};

export const Completed: Story = {
  args: {
    title: '提交季度报告',
    completed: true,
    priority: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    title: '已归档的待办事项',
    completed: false,
    priority: 'low',
    disabled: true,
  },
};