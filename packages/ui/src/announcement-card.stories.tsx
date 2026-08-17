import type { Meta, StoryObj } from '@storybook/react';
import { AnnouncementCard } from './announcement-card';

const meta = {
  title: 'UI/AnnouncementCard',
  component: AnnouncementCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnnouncementCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '系统维护通知',
    content: '本周六凌晨 2:00-4:00 进行系统维护，期间服务可能短暂中断。',
    date: '2026-08-13',
    author: '运维组',
  },
};

export const LongContent: Story = {
  args: {
    title: '季度工作总结报告',
    content:
      '本季度团队完成了多项重要任务，包括前端架构升级、组件库建设、状态管理方案落地等。在架构方面，我们采用了 Monorepo 分层架构，将通用组件、工具函数、业务模块分别放在独立的 packages 中，提高了代码复用性和可维护性。在状态管理方面，我们引入了 Zustand 管理全局用户状态，TanStack Query 管理服务端数据缓存，nuqs 管理 URL 筛选状态，三者职责清晰不混用。在组件库方面，我们基于 Radix UI 和 Tailwind CSS 构建了一套无障碍、可定制的基础组件。此外，我们还搭建了 Storybook 组件展厅，每个组件都配有完整的 stories 文档。下季度我们将继续完善测试覆盖、性能优化和开发者体验。',
    date: '2026-08-13',
    author: '技术负责人',
  },
};

export const MissingAuthor: Story = {
  args: {
    title: '匿名公告',
    content: '这是一条没有作者信息的公告，仅显示日期。',
    date: '2026-08-13',
  },
};