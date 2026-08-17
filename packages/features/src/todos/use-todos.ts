import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
}

let mockTodos: Todo[] = [
  { id: '1', title: '完成项目文档', completed: false, priority: 'high' },
  { id: '2', title: '代码审查', completed: false, priority: 'medium' },
  { id: '3', title: '更新依赖版本', completed: true, priority: 'low' },
  { id: '4', title: '编写单元测试', completed: false, priority: 'high' },
  { id: '5', title: '部署测试环境', completed: true, priority: 'medium' },
];

async function fetchTodos(filter: TodoFilter = 'all'): Promise<Todo[]> {
  const filtered =
    filter === 'active'
      ? mockTodos.filter((t) => !t.completed)
      : filter === 'completed'
        ? mockTodos.filter((t) => t.completed)
        : mockTodos;
  // 返回新对象引用，确保 TanStack Query 能检测到变化并触发重渲染
  return filtered.map((t) => ({ ...t }));
}

async function toggleTodo(id: string): Promise<Todo> {
  const todo = mockTodos.find((t) => t.id === id);
  if (!todo) {
    throw new Error(`Todo ${id} not found`);
  }
  // 不可变更新：创建新对象和新数组，不修改原数据
  const updated = { ...todo, completed: !todo.completed };
  mockTodos = mockTodos.map((t) => (t.id === id ? updated : t));
  return { ...updated };
}

export function useTodos(filter: TodoFilter = 'all') {
  return useQuery({
    queryKey: ['todos', filter] as const,
    queryFn: () => fetchTodos(filter),
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}