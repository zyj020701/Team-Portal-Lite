# Bundle 体积基线报告

> 记录日期：2026-08-14
> 分析工具：@next/bundle-analyzer + Next.js 14.2.33 build output
> 环境：Windows 11，生产构建（next build）

---

## 1. 首屏加载 JS 总大小

### 路由级 First Load JS

| 路由 | 路由代码大小 | First Load JS（含共享） |
|------|-------------|----------------------|
| `/`（首页） | 4.25 kB | **120 kB** |
| `/todos`（待办页） | 2.81 kB | **119 kB** |
| `/_not-found` | 873 B | 88.1 kB |

### 共享 Chunk（所有路由共用）

| Chunk 文件 | 大小 | 说明 |
|-----------|------|------|
| `chunks/cd474246-2d52ced4f6e31bbd.js` | 53.6 kB | 框架核心（React/Next.js 运行时） |
| `chunks/643-df0b72de6d505fea.js` | 31.7 kB | 共享 vendor/业务公共代码 |
| other shared chunks | 1.86 kB | 其他小型共享模块 |
| **共享总计** | **87.2 kB** | |

### 关键数值（优化前基线）

#### Next.js 构建输出报告值

| 指标 | 首页 `/` | 待办页 `/todos` |
|------|---------|----------------|
| Route Size | 4.25 kB | 2.81 kB |
| First Load JS（parsed） | **120 kB** | **119 kB** |
| Shared by all | 87.2 kB | 87.2 kB |

#### 实际 Chunk 文件测量值（gzip 前后）

通过对 `.next/static/chunks/` 下所有 JS 文件进行 gzip 压缩测量：

| 分类 | 原始大小 | gzip 后 |
|------|---------|---------|
| Core chunks（polyfills + framework + main + webpack） | 364.14 kB | 117.77 kB |
| Shared chunks（4 个异步共享包） | 375.80 kB | 111.73 kB |
| Layout chunk | 8.93 kB | 3.12 kB |
| 首页 route chunk | 9.96 kB | 4.16 kB |
| 待办页 route chunk | 6.20 kB | 2.74 kB |
| **首页 First Load 总计** | **758.83 kB** | **236.77 kB** |
| **待办页 First Load 总计** | **755.06 kB** | **235.36 kB** |

> ⚠️ **重要发现**：Next.js 构建输出报告的 First Load JS（120 kB）与实际所有 chunk 文件总和（759 kB raw / 237 kB gzip）存在差异。
> 这是因为 Next.js 报告值经过 webpack 内部统计口径处理，而实际文件测量包含了所有需要下载的 chunk。
> **S7 优化目标：首屏 JS gzip 后 < 200 kB。当前基线为 ~237 kB gzip，需要通过代码减负优化至 200 kB 以下。**

---

## 2. 体积 Top 5 大依赖

根据项目 `package.json` 依赖清单和 bundle analyzer 报告（`.next/analyze/client.html`），以下为主要依赖体积排名：

| 排名 | 依赖包 | 所属位置 | 估算体积 | 是否可优化 | 优化建议 |
|------|--------|---------|---------|-----------|---------|
| 1 | **Next.js 框架** (`next`) | apps/web | ~53.6 kB（共享 chunk） | ❌ 不可移除 | 框架必需，保持版本更新 |
| 2 | **React + ReactDOM** (`react`, `react-dom`) | apps/web | 包含在框架 chunk 中 | ❌ 不可移除 | 框架必需 |
| 3 | **TanStack Query** (`@tanstack/react-query`) | apps/web | ~12-15 kB（含在 31.7 kB chunk 中） | ⚠️ 可按需 | 已使用命名导入，tree-shaking 生效；确认只导入用到的 API |
| 4 | **nuqs** (`nuqs`) | apps/web | ~5-8 kB | ⚠️ 可按需 | URL 状态管理，确认只在需要的页面使用 |
| 5 | **Radix UI + shadcn 组件** | packages/ui | 分散在各路由 chunk | ✅ 可优化 | 确保每个 Radix 原语按需导入；未使用的组件不导出 |

### 其他需要关注的依赖

| 依赖包 | 状态 | 建议 |
|--------|------|------|
| `moment` | ❌ 未使用 | 项目中未引入 moment，无需替换 |
| `lodash` | ❌ 未使用 | 项目中未引入 lodash，无需替换 |
| `lucide-react` | ❌ 未使用 | 项目中未使用图标库 |
| `date-fns` / `dayjs` | ❌ 未使用 | 时间格式化使用自写的 `format-time.ts`，体积可控 |
| Storybook | devDependency | 仅开发环境，不影响生产包 |
| Tailwind CSS | devDependency | 构建时生成 CSS，不进入 JS bundle |

---

## 3. Tree Shaking 状态检查

### packages/ 包的 sideEffects 配置

| 包名 | package.json 中 `sideEffects` 字段 | 状态 |
|------|----------------------------------|------|
| `@team-portal-lite/ui` | 需检查 | 待确认 |
| `@team-portal-lite/lib` | 需检查 | 待确认 |
| `@team-portal-lite/features` | 需检查 | 待确认 |
| `@team-portal-lite/store` | 需检查 | 待确认 |

> 📌 S7 阶段需要为所有 packages 包添加 `"sideEffects": false`，确保 tree shaking 生效。

### 导入方式检查

- ✅ 项目全程使用 ESM `import` 语法
- ✅ 未发现 `require()` 混用
- ✅ `packages/ui/src/index.ts` 使用命名导出
- ✅ Radix UI 使用命名导入（`import { Checkbox } from '@radix-ui/react-checkbox'`）

---

## 4. Bundle Analyzer 报告位置

分析报告已生成至以下路径，可用浏览器打开查看 Treemap 可视化：

```
apps/web/.next/analyze/
├── client.html    ← 客户端 bundle（主要分析对象）
├── edge.html      ← Edge runtime bundle
└── nodejs.html    ← Node.js server bundle
```

打开方式：
```bash
# 在浏览器中打开客户端分析报告
start apps/web/.next/analyze/client.html
```

---

## 5. 优化方向（供 S7 参考）

1. **组件级按需加载**：
   - 待办页的虚拟滚动列表（S4 将引入）可用 `next/dynamic` 延迟加载
   - 任何弹窗/抽屉等非首屏组件用 `next/dynamic` 包裹

2. **packages 包 sideEffects**：
   - 为所有 `packages/*/package.json` 添加 `"sideEffects": false`

3. **Radix UI 按需导入**：
   - 确认每个 Radix 原语都是独立导入，不整包引入

4. **监控共享 chunk 体积**：
   - 当前共享 chunk 87.2 kB，持续关注是否有新依赖使其膨胀

5. **gzip 后目标**：
   - 当前首页 First Load JS 实际测量为 758.83 kB raw / **236.77 kB gzip**
   - S7 目标 < 200 kB gzip，当前超出约 37 kB，需要通过代码减负优化
   - 主要优化方向：检查 shared chunks 中是否有可延迟加载的依赖、确认 tree shaking 生效、非首屏组件 next/dynamic

---

## 6. 复现命令

```bash
# 安装依赖
pnpm install

# 普通构建（查看路由体积表）
pnpm --filter @team-portal-lite/web build

# 带 Bundle Analyzer 的构建
pnpm --filter @team-portal-lite/web analyze
# 或
cd apps/web && cross-env ANALYZE=true next build