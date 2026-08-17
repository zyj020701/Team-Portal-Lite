import type { Todo, TodoPriority } from './use-todos';

const titlePrefixes = [
  '完成', '审查', '更新', '编写', '部署', '修复', '优化', '设计',
  '测试', '重构', '整理', '排查', '对接', '评审', '调研', '搭建',
  '迁移', '归档', '同步', '验证',
];

const titleSubjects = [
  '项目文档', '代码审查', '依赖版本', '单元测试', '测试环境',
  '登录模块', '首页布局', 'API 接口', '数据库迁移', '性能优化',
  '用户反馈', '安全补丁', 'CI/CD 流水线', '组件库', '状态管理',
  '路由配置', '权限控制', '日志系统', '监控告警', '数据备份',
  '缓存策略', '搜索功能', '表单验证', '文件上传', '消息推送',
  '国际化', '无障碍', '响应式适配', '暗色模式', '错误边界',
];

const priorities: TodoPriority[] = ['low', 'medium', 'high'];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * 生成 10000 条真实可信的待办 mock 数据
 */
export function generateMockTodos(count: number = 10000): Todo[] {
  const random = seededRandom(42);
  const todos: Todo[] = [];

  for (let i = 0; i < count; i++) {
    const prefix = titlePrefixes[Math.floor(random() * titlePrefixes.length)];
    const subject = titleSubjects[Math.floor(random() * titleSubjects.length)];
    const priority = priorities[Math.floor(random() * priorities.length)] ?? 'medium';
    const completed = random() < 0.3;

    todos.push({
      id: `mock-${i + 1}`,
      title: `${prefix}${subject} #${i + 1}`,
      completed,
      priority,
    });
  }

  return todos;
}