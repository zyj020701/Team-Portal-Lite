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
│       └── app/          # 页面目录
├── packages/
│   ├── ui/               # 通用 UI 零件（无业务逻辑）
│   ├── lib/              # 工具函数（无 UI 依赖）
│   └── features/         # 业务零件（预留）
├── pnpm-workspace.yaml
├── turbo.json
├── eslint.config.js
└── README.md
```

## 常用命令

- `pnpm dev`：启动开发服务器
- `pnpm build`：生产构建（Turbo 缓存加速）
- `pnpm lint`：ESLint 代码检查（含跨层引用规则）