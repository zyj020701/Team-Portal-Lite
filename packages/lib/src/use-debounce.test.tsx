// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('正常输入', () => {
    it('初始值立即返回', () => {
      const { result } = renderHook(() => useDebounce('hello', 200));
      expect(result.current).toBe('hello');
    });

    it('值变化后，延迟期内仍返回旧值', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string }) => useDebounce(value, 200),
        {
          initialProps: { value: 'a' },
        },
      );

      rerender({ value: 'b' });
      expect(result.current).toBe('a');
    });

    it('延迟到期后返回新值', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string }) => useDebounce(value, 200),
        {
          initialProps: { value: 'a' },
        },
      );

      rerender({ value: 'b' });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe('b');
    });
  });

  describe('边界输入', () => {
    it('默认延迟为 200ms', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: number }) => useDebounce(value),
        {
          initialProps: { value: 1 },
        },
      );

      rerender({ value: 2 });
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(result.current).toBe(1);

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe(2);
    });

    it('连续快速变化只在最后一次变化后更新', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: number }) => useDebounce(value, 300),
        {
          initialProps: { value: 0 },
        },
      );

      rerender({ value: 1 });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      rerender({ value: 2 });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      rerender({ value: 3 });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      // 还没到 300ms（从最后一次变化算起）
      expect(result.current).toBe(0);

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe(3);
    });

    it('支持数字类型', () => {
      const { result } = renderHook(() => useDebounce(42, 100));
      expect(result.current).toBe(42);
    });
  });

  describe('异常/清理', () => {
    it('组件卸载时清除定时器，不抛出错误', () => {
      const { unmount } = renderHook(() => useDebounce('x', 200));
      expect(() => {
        unmount();
        act(() => {
          vi.advanceTimersByTime(500);
        });
      }).not.toThrow();
    });
  });
});