'use client';

import {
  useAnnouncements,
  useTodos,
  useToggleTodo,
} from '@team-portal-lite/features';

export function QueryDemo() {
  const {
    data: announcements,
    isLoading: announcementsLoading,
  } = useAnnouncements();

  const {
    data: todos,
    isLoading: todosLoading,
  } = useTodos();

  const { mutate: toggleTodo, isPending: toggling } = useToggleTodo();

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">公告</h2>
        {announcementsLoading && <p>加载中...</p>}
        {announcements && (
          <ul className="flex flex-col gap-2">
            {announcements.map((a) => (
              <li key={a.id} className="border-b pb-2 last:border-0">
                <span className="font-medium">{a.title}</span>
                <span className="ml-2 text-sm text-gray-500">
                  — {a.author} · {a.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">待办</h2>
        {todosLoading && <p>加载中...</p>}
        {todos && (
          <ul className="flex flex-col gap-2">
            {todos.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.completed}
                  disabled={toggling}
                  onChange={() => toggleTodo(t.id)}
                  className="h-4 w-4"
                />
                <span
                  className={
                    t.completed ? 'text-gray-400 line-through' : ''
                  }
                >
                  {t.title}
                </span>
                <span
                  className={
                    'ml-auto rounded px-2 py-0.5 text-xs ' +
                    (t.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : t.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700')
                  }
                >
                  {t.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}