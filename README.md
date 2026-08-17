# Team Portal Lite

团队内部门户·简易版。

## 环境要求

- Node.js >= 18
- pnpm >= 8（`npm install -g pnpm`）

## 快速开始

```bash
pnpm install
pnpm dev
```

浏览器打开 http://localhost:3000 即可看到首页。

## 项目结构

```
team-portal-lite/
├── apps/
│   └── web/              # Next.js 14 主站（App Router）
│       ├── app/          # 页面目录
│       └── ...
├── packages/
│   ├── ui/               # 通用 UI 零件（无业务逻辑）
│   ├── lib/              # 工具函数（无 UI 依赖）
│   ├── features/         # 业务零件（含业务逻辑）
│   └── store/            # 全局状态管理（Zustand）
├── e2e/                  # Playwright E2E 测试
├── .github/workflows/    # GitHub Actions CI
├── .changeset/           # Changesets 版本管理
├── .husky/               # Git 钩子
├── pnpm-workspace.yaml
├── turbo.json
├── eslint.config.js
└── README.md
```

## 常用命令

### 开发与构建

- `pnpm dev`：启动开发服务器
- `pnpm build`：生产构建（Turbo 缓存加速）
- `pnpm start`：启动生产服务器

### 代码质量

- `pnpm lint`：ESLint 代码检查（含跨层引用规则）
- `pnpm typecheck`：TypeScript 类型检查（严格模式）
- `pnpm format`：Prettier 格式化代码

### 测试

- `pnpm test`：运行所有单元测试和集成测试（Vitest）
- `pnpm test:coverage`：运行测试并生成覆盖率报告
- `pnpm test:e2e`：运行 E2E 测试（Playwright）
- `pnpm test:e2e:ui`：以 UI 模式运行 E2E 测试
- `pnpm test:smoke`：运行冒烟测试

### Storybook

- `pnpm storybook`：启动组件展厅
- `pnpm build-storybook`：构建静态展厅

### 性能

- `pnpm lighthouse`：运行 Lighthouse 性能审计

### 版本管理

- `pnpm changeset`：创建版本变更记录
- `pnpm changeset version`：根据变更记录更新版本号
- `pnpm changeset publish`：发布包

## 提交规范

本项目使用 Conventional Commits 规范，提交信息必须以以下前缀开头：

- `feat:`：新功能
- `fix:`：修复 bug
- `docs:`：文档变更
- `style:`：代码格式（不影响功能）
- `refactor:`：重构
- `perf:`：性能优化
- `test:`：测试相关
- `chore:`：构建/工具变更

示例：

```bash
git commit -m "feat: add announcement card component"
git commit -m "fix: resolve todo filter URL state issue"
```

提交时 Husky 会自动运行：
1. **lint-staged**：只检查本次改动的文件（ESLint + Prettier）
2. **commitlint**：验证提交信息格式

## 技术栈

- **框架**：Next.js 14（App Router）
- **语言**：TypeScript（严格模式）
- **样式**：Tailwind CSS + shadcn/ui
- **状态**：Zustand（用户态）+ TanStack Query（服务端数据）+ nuqs（URL 状态）
- **测试**：Vitest（单元/集成）+ Playwright（E2E）
- **工程化**：Turbo + ESLint + Prettier + Husky + Changesets
- **CI/CD**：GitHub Actions + Vercel