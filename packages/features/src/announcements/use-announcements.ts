import { useQuery } from '@tanstack/react-query';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '欢迎使用团队门户',
    content: '这是团队内部门户的第一条公告，欢迎大家使用！',
    date: '2026-08-13',
    author: '管理员',
  },
  {
    id: '2',
    title: '本周例会通知',
    content: '本周例会将于周五下午 3 点在会议室 A 举行，请大家准时参加。',
    date: '2026-08-12',
    author: '项目经理',
  },
  {
    id: '3',
    title: '系统维护通知',
    content: '下周六凌晨 2 点至 4 点进行系统维护，期间服务可能中断。',
    date: '2026-08-10',
    author: '运维团队',
  },
];

async function fetchAnnouncements(): Promise<Announcement[]> {
  return mockAnnouncements;
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'] as const,
    queryFn: fetchAnnouncements,
  });
}