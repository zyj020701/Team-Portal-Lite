import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTodos, useToggleTodo } from './use-todos';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

describe('useTodos', () => {
  it('初始 loading 状态为 true', () => {
    const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('默认返回全部待办', async () => {
    const { result } = renderHook(() => useTodos('all'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.length).toBe(5);
  });

  it('filter=active 只返回未完成待办', async () => {
    const { result } = renderHook(() => useTodos('active'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const allUncompleted = result.current.data?.every((t) => !t.completed);
    expect(allUncompleted).toBe(true);
    expect(result.current.data?.length).toBe(3);
  });

  it('filter=completed 只返回已完成待办', async () => {
    const { result } = renderHook(() => useTodos('completed'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const allCompleted = result.current.data?.every((t) => t.completed);
    expect(allCompleted).toBe(true);
    expect(result.current.data?.length).toBe(2);
  });
});

describe('useToggleTodo', () => {
  it('mutation 触发后切换待办完成状态', async () => {
    const wrapper = createWrapper();
    const { result: todosResult } = renderHook(() => useTodos('all'), { wrapper });
    await waitFor(() => expect(todosResult.current.isSuccess).toBe(true));

    const targetId = todosResult.current.data?.[0]?.id;
    expect(targetId).toBeDefined();
    const originalCompleted = todosResult.current.data?.[0]?.completed;

    const { result: toggleResult } = renderHook(() => useToggleTodo(), { wrapper });
    act(() => {
      toggleResult.current.mutate(targetId as string);
    });

    await waitFor(() => expect(toggleResult.current.isSuccess).toBe(true));
    expect(toggleResult.current.data?.completed).toBe(!originalCompleted);
  });
});