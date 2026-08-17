'use client';

import { Suspense, useEffect, useMemo, useState, useTransition } from 'react';
import { useQueryState, parseAsStringLiteral, parseAsString } from 'nuqs';
import {
  generateMockTodos,
  useToggleTodo,
  type Todo,
  type TodoFilter,
} from '@team-portal-lite/features';
import { FilterTabs, TodoItemSkeleton } from '@team-portal-lite/ui';
import { useDebounce } from '@team-portal-lite/lib';
import dynamic from 'next/dynamic';

// 虚拟滚动依赖 DOM 测量，禁用 SSR
const VirtualTodoList = dynamic(
  () => import('./virtual-todo-list').then((mod) => mod.VirtualTodoList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <TodoItemSkeleton key={i} />
        ))}
      </div>
    ),
  },
);

const FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
] as const;

type FilterValue = (typeof FILTERS)[number]['value'];

function TodosContent() {
  // 生成 10000 条 mock 数据（useMemo 确保只生成一次）
  const allTodos = useMemo<Todo[]>(() => generateMockTodos(10000), []);

  // 本地状态管理勾选（mock 数据不经过后端）
  const [todos, setTodos] = useState<Todo[]>(allTodos);
  const toggleTodoMutation = useToggleTodo();

  // 筛选状态用 nuqs 存进 URL（P07）
  const [filter, setFilter] = useQueryState<FilterValue>(
    'filter',
    parseAsStringLiteral(FILTERS.map((f) => f.value)).withDefault('all'),
  );

  // useTransition：筛选切换标记为低优先级，输入框/按钮立即响应
  const [isPending, startTransition] = useTransition();

  // 搜索关键词存进 URL（P07），防抖延迟写入 URL 时机
  const [searchUrl, setSearchUrl] = useQueryState(
    'q',
    parseAsString.withDefault(''),
  );
  // 输入框立即响应（高优先级），防抖后才写入 URL
  const [searchInput, setSearchInput] = useState(searchUrl);
  const debouncedSearch = useDebounce(searchInput, 200);

  // 防抖值变化后写入 URL（startTransition 标记为低优先级）
  useEffect(() => {
    if (debouncedSearch !== searchUrl) {
      startTransition(() => {
        setSearchUrl(debouncedSearch || null);
      });
    }
  }, [debouncedSearch, searchUrl, setSearchUrl]);

  const handleFilterChange = (value: string) => {
    startTransition(() => {
      setFilter(value as TodoFilter);
    });
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
    // 同时触发 mutation（TanStack Query 缓存更新）
    toggleTodoMutation.mutate(id);
  };

  // useMemo 缓存过滤结果，避免每次渲染重新计算 10000 条
  const filteredTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      if (
        debouncedSearch &&
        !todo.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
        return false;
      return true;
    });
  }, [todos, filter, debouncedSearch]);

  const activeCount = useMemo(
    () => todos.filter((t: Todo) => !t.completed).length,
    [todos],
  );
  const completedCount = todos.length - activeCount;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">待办事项</h1>
        <span className="text-sm text-gray-500">
          共 {todos.length} 条 · 进行中 {activeCount} · 已完成 {completedCount}
        </span>
      </div>

      {/* 搜索框：输入立即响应，过滤防抖 200ms */}
      <div>
        <label htmlFor="todo-search" className="sr-only">
          搜索待办事项
        </label>
        <input
          id="todo-search"
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="搜索待办事项..."
          aria-label="搜索待办事项"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <FilterTabs
        options={FILTERS.map((f) => ({ value: f.value, label: f.label }))}
        value={filter}
        onChange={handleFilterChange}
      />

      <div
        // 过渡期间轻微降低透明度，但不阻塞交互
        className={`transition-opacity duration-150 ${isPending ? 'opacity-60' : 'opacity-100'}`}
      >
        <VirtualTodoList todos={filteredTodos} onToggle={handleToggle} />
      </div>
    </div>
  );
}

export default function TodosPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl space-y-6 p-6">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <TodoItemSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <TodosContent />
    </Suspense>
  );
}