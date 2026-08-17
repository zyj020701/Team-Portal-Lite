'use client';

import { Suspense } from 'react';
import { useUserStore } from '@team-portal-lite/store';
import { useAnnouncements, useTodos, useToggleTodo } from '@team-portal-lite/features';
import { AnnouncementCard, TodoItem, Avatar, FilterTabs, AnnouncementCardSkeleton, TodoItemSkeleton } from '@team-portal-lite/ui';
import { useQueryState, parseAsString } from 'nuqs';

type TodoFilter = 'all' | 'active' | 'completed';

function isValidFilter(v: string): v is TodoFilter {
  return v === 'all' || v === 'active' || v === 'completed';
}

const filterParser = parseAsString.withOptions({ history: 'push' }).withDefault('all');
const filterOptions = [
  { label: '全部', value: 'all' as const },
  { label: '未完成', value: 'active' as const },
  { label: '已完成', value: 'completed' as const },
];

function HomeContent() {
  const username = useUserStore((s) => s.username);
  const login = useUserStore((s) => s.login);
  const logout = useUserStore((s) => s.logout);
  const [rawFilter, setFilter] = useQueryState('filter', filterParser);
  const filter: TodoFilter = isValidFilter(rawFilter) ? rawFilter : 'all';
  const { data: announcements, isLoading: aLoading } = useAnnouncements();
  const { data: todos, isLoading: tLoading } = useTodos(filter);
  const { mutate: toggleTodo } = useToggleTodo();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Team Portal Lite</h1>
        <div className="flex min-h-[36px] items-center gap-3">
          {username ? (
            <>
              <Avatar name={username} size="sm" />
              <span className="text-sm font-medium text-gray-700">{username}</span>
              <button type="button" onClick={logout} className="rounded-md bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-700">登出</button>
            </>
          ) : (
            <button type="button" onClick={() => login('Alice')} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">登录</button>
          )}
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-900">公告</h2>
        {aLoading ? (
          <>
            <AnnouncementCardSkeleton />
            <AnnouncementCardSkeleton showAuthor />
            <AnnouncementCardSkeleton />
          </>
        ) : announcements?.map((a) => <AnnouncementCard key={a.id} {...a} />)}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">待办</h2>
          <FilterTabs value={filter} options={filterOptions} onChange={(v) => setFilter(v)} />
        </div>
        {tLoading ? (
          <>
            <TodoItemSkeleton />
            <TodoItemSkeleton />
            <TodoItemSkeleton />
          </>
        ) : todos?.map((t) => (
          <TodoItem key={t.id} title={t.title} completed={t.completed} priority={t.priority} onToggle={() => toggleTodo(t.id)} />
        ))}
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-500">加载中…</div>}>
      <HomeContent />
    </Suspense>
  );
}