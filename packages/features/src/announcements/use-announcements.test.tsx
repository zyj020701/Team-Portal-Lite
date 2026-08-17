import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useAnnouncements } from './use-announcements';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

describe('useAnnouncements', () => {
  it('初始 loading 状态为 true', () => {
    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('数据获取成功后返回公告列表', async () => {
    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.data?.[0]?.title).toBe('欢迎使用团队门户');
  });

  it('返回的公告包含 id/title/content/date/author 字段', async () => {
    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    const item = result.current.data?.[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('content');
    expect(item).toHaveProperty('date');
    expect(item).toHaveProperty('author');
  });
});