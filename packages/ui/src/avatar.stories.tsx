import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImageSmall: Story = {
  args: {
    name: '张三',
    src: 'https://i.pravatar.cc/150?img=12',
    size: 'sm',
  },
};

export const WithImageMedium: Story = {
  args: {
    name: '李四',
    src: 'https://i.pravatar.cc/150?img=32',
    size: 'md',
  },
};

export const WithImageLarge: Story = {
  args: {
    name: '王五',
    src: 'https://i.pravatar.cc/150?img=5',
    size: 'lg',
  },
};

export const WithoutImageSmall: Story = {
  args: {
    name: '张三',
    size: 'sm',
  },
};

export const WithoutImageMedium: Story = {
  args: {
    name: '李四',
    size: 'md',
  },
};

export const WithoutImageLarge: Story = {
  args: {
    name: '王五',
    size: 'lg',
  },
};