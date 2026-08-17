# Team Portal Lite —— Agent 指令手册

> **使用方式**：每个阶段都是一条独立指令，按顺序复制给 AI 编程助手执行即可。
> 执行顺序：S1 → S2 → … → S6，前一阶段验收通过后再进入下一阶段。
> 本手册综合 Day21（架构骨架）、Day22（组件/状态）、Day23（性能优化）、Day24（工程化体系）四天规格说明书编写。

---

## 1. 项目概述

- **项目中文名**：团队内部门户·简易版
- **项目英文代号**：team-portal-lite
- **项目定位**：内部教学练习项目（非商用），用于演练前端架构设计→组件开发→性能优化→工程化全流程。
- **分层架构**：
  - `apps/web`：Next.js 14 主站，页面组装层
  - `packages/ui`：通用 UI 零件（无业务逻辑）
  - `packages/lib`：工具函数（无 UI 依赖）
  - `packages/features`：业务零件层（含业务逻辑的模块）
  - `packages/store`：全局状态管理（Zustand）

---

## 2. 技术栈约束

| 类别 | 技术 | 说明 |
|------|------|------|
| 主框架 | Next.js 14（App Router） | 必须用 `app/` 目录，禁止 `pages/` |
| 包管理 | pnpm + workspace 协议 | 禁止 npm/yarn，内部包用 `workspace:*` |
| 构建加速 | Turbo | 配置任务缓存，改过才重新编译 |
| 代码检查 | ESLint + Prettier | ESLint 查逻辑错误，Prettier 管风格 |
| 编程语言 | TypeScript 严格模式 | `strict:true` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`，禁止 `any` |
| 全局状态 | Zustand | 管"当前用户"等应用级数据 |
| 服务端数据 | TanStack Query | 管公告/待办等后端数据，自带缓存 |
| URL 状态 | nuqs | 筛选/排序/分页存进网址，刷新不丢 |
| 样式方案 | Tailwind CSS | 必须配置 `tailwind.config.js` |
| 组件基础 | Radix UI + shadcn/ui | Radix 无头逻辑 + shadcn Tailwind 样式 |
| 组件展厅 | Storybook | 每个组件配 `.stories.tsx` |
| 性能优化 | next/image + next/font + next/dynamic + useTransition + @tanstack/react-virtual | LCP/INP/CLS 三大指标达标 |
| 真实监控 | web-vitals | RUM 采集 P75/P95 |
| 单元测试 | Vitest | 毫秒级，测工具函数 |
| 集成测试 | Vitest + @testing-library/react | 测组件渲染和用户交互 |
| E2E/冒烟测试 | Playwright | 模拟真实浏览器，失败自动录屏截图 |
| Git 钩子 | Husky + lint-staged | 提交前只检查改动文件，1 秒完成 |
| 提交规范 | commitlint | 强制 Conventional Commits 格式 |
| 版本管理 | Changesets | Monorepo 多包版本号 + CHANGELOG |
| CI/CD | GitHub Actions | 5 道门禁全绿才能合并 PR |
| 部署平台 | Vercel | PR 自动预览，main 自动部署 |

---

## 3. 十条避坑指南（全阶段通用）

> 每个 Agent 指令末尾都会附上与该阶段相关的避坑提醒编号。

| 编号 | 避坑指南 |
|------|----------|
| P01 | **目录不清，混为一谈**：所有代码必须物理隔开（`apps/` vs `packages/`），不能全塞进一个 `src/`。测试文件也要跟着源码走，`__tests__/` 就近放置。 |
| P02 | **循环依赖死锁**：依赖只能从上往下走，公共代码抽到 `packages/lib`。ESLint 规则必须实测报错才算生效。 |
| P03 | **ESLint 只装不用**：配完规则必须故意写违规代码确认报错，不能只装不验。CI 中必须把 lint 作为第一道门禁。 |
| P04 | **ADR 写成流水账**：ADR 必须含"背景→备选方案→最终选择→选择理由"4 段结构。 |
| P05 | **组件写得太死 / 组件内取数**：通用组件用组合模式设计，只接收 props，内部禁止 `fetch`/`useQuery`。测试时只测"用户看到什么"，不测内部 state。 |
| P06 | **把服务端数据塞进 Zustand**：Zustand 只管全局用户态，公告/待办等服务端数据用 TanStack Query。 |
| P07 | **筛选状态不用 URL**：凡是筛选/排序/分页/搜索关键词，一律用 nuqs 存进 URL，不许用 useState。E2E 测试要验证 URL 状态。 |
| P08 | **Storybook 只建不用**：每新建一个通用组件，必须同时写 `.stories.tsx`。集成测试可复用 Storybook 的 stories。 |
| P09 | **只优化 Lighthouse，不管真实用户**：Lighthouse 是实验室数据，必须同时接 RUM（web-vitals）看 P75/P95。CI 中 Lighthouse 预算不达标直接报红。 |
| P10 | **工程化细节陷阱**：① TS 只开 `strict:true` 不够，必须额外开 `noUncheckedIndexedAccess` 和 `exactOptionalPropertyTypes`；② 测试测行为不测实现细节；③ CI 必须设阈值（覆盖率<75% 直接拦截）；④ Husky 必须配 lint-staged 只查改动文件；⑤ commitlint 必须强制 Conventional Commits；⑥ Changesets 必须跑通一次 `pnpm changeset`。 |

---

## 4. 开发流程

> 以下 6 个阶段按顺序执行。每个阶段的指令可以直接复制给 AI 执行。

---

### S1：项目骨架与架构设计（Day21）

**本阶段做什么：**

1. **4 问开局（定需求）**：在 `docs/requirements/` 下创建 `requirements-confirmation.md`，回答：
   - 给谁用？（目标用户）
   - 解决啥？（核心痛点）
   - 做成啥样？（核心形态/界面特征）
   - 怎么衡量成功？（验收指标）
   - 文末列出 3 个核心用户场景：看公告、看任务、看寿星。

2. **写决策日志（ADR）**：在 `docs/adr/` 下创建 `ADR-001-layered-architecture.md`，严格按 4 段结构：
   - 背景（Context）
   - 考虑的其它方案（Considered Alternatives，至少 2 个）
   - 最终选择（Decision）：4 层 Monorepo 分层
   - 选择理由（Rationale）

3. **搭建 Monorepo 骨架**：
   - 创建 `pnpm-workspace.yaml`，声明 `apps/` 和 `packages/` 下的 workspace。
   - 创建 4 个包并初始化 `package.json`：
     - `apps/web`（name: `@team-portal-lite/web`）
     - `packages/ui`（name: `@team-portal-lite/ui`）
     - `packages/features`（name: `@team-portal-lite/features`）
     - `packages/lib`（name: `@team-portal-lite/lib`）
   - 后续 Day22 还需新增 `packages/store`（name: `@team-portal-lite/store`）。

4. **配置 Turbo + ESLint 跨层交通管制**：
   - 创建 `turbo.json`，包含 `build` 和 `lint` 任务。
   - 安装 ESLint 及相关插件。
   - 创建 ESLint 配置，启用 `import/no-restricted-paths` 规则：
     - `packages/lib` 不能被 `packages/ui`、`packages/features`、`apps` 反向引用
     - `packages/ui` 不能引用 `packages/features`、`apps`
     - `packages/features` 不能被 `apps` 直接侵入内部
   - 各包添加 `lint` 脚本。
   - **自检测试**：故意写违规跨层引用，`pnpm lint` 必须报错；报错后删除测试文件。

5. **跑通第一个最小流程**：
   - `packages/lib/src/formatTime.ts`：时间格式化工具函数。
   - `packages/ui/src/TimeCard.tsx`：显示文字的纯展示组件。
   - `packages/features/src/time/feature.ts`：调用 lib 的业务函数。
   - `apps/web/app/page.tsx`：首页组装，代码量 ≤30 行。
   - 配置 Next.js 14 App Router（`next.config.js`、`layout.tsx`、`tsconfig.json`）。
   - 启动后浏览器能看到当前时间，证明 4 层全串通。

6. **写新人 README**：在根目录 `README.md` 中写明安装依赖、启动项目、项目结构图（文字树状图）。

**验收标准：**
- [ ] `docs/requirements/requirements-confirmation.md` 存在，包含 4 个问题 + 3 个用户场景
- [ ] `docs/adr/ADR-001-layered-architecture.md` 存在，包含背景/备选方案/最终选择/选择理由 4 段
- [ ] 根目录有 `apps/` 和 `packages/`，4 个 `package.json` 全部创建
- [ ] `pnpm-workspace.yaml` 配置正确
- [ ] `turbo.json` 和 ESLint 配置存在
- [ ] 故意在 `packages/ui` 写跨层引用，`pnpm lint` 必须报错；删除后不再报错
- [ ] `packages/lib/src/formatTime.ts` 存在
- [ ] `packages/ui/src/TimeCard.tsx` 存在
- [ ] `apps/web/app/page.tsx` 代码量 ≤30 行
- [ ] `pnpm --filter web dev` 启动后访问 `http://localhost:3000` 能看到当前时间
- [ ] `README.md` 包含安装、启动、项目结构图

**⚠️ 避坑提醒：**
- **P01**：所有代码必须物理隔开（`apps/` vs `packages/`），不能全塞进一个 `src/`。
- **P02**：依赖只能从上往下走。如果两个模块非得互相调用，说明代码应抽到 `packages/lib`。
- **P03**：ESLint 配完 `import/no-restricted-paths` 后必须故意写违规代码验证报错，不能只配不验。
- **P04**：ADR 必须包含"背景→备选方案→最终选择→选择理由"4 段，哪怕只写 3 句话都行，结构必须全。

---

### S2：组件开发与状态管理（Day22）

**本阶段做什么：**

1. **装齐工具箱**：安装 Zustand、TanStack Query、nuqs、Storybook、Tailwind CSS、Radix UI + shadcn/ui 等依赖。

2. **配置 Tailwind CSS**：
   - 安装并配置 `tailwind.config.js`。
   - 配置 PostCSS。
   - 在全局 CSS 中引入 Tailwind 指令。
   - shadcn/ui 组件依赖 Tailwind，不配置则所有组件无样式。

3. **配置 Radix UI + shadcn/ui**：
   - 初始化 shadcn/ui。
   - Radix 提供无头逻辑（键盘操作、无障碍），shadcn 提供 Tailwind 样式，缺一不可。

4. **管登录状态（Zustand）**：
   - 在 `packages/store` 里用 Zustand 建 `userStore`，存用户名并提供登录/登出方法。
   - 首页能显示当前用户名，点切换按钮后名字同步更新。

5. **建数据客户端（TanStack Query）**：
   - 在 `apps/web` 里配置 `QueryClientProvider`，用 Provider 包裹整个应用。
   - 应用内任意组件都能用 `useQuery` 和 `useMutation` 取数据。

6. **写取数函数（Features 层）**：
   - 在 `packages/features` 里写 `useAnnouncements` 和 `useTodos` 两个自定义 Hook。
   - 先用假数据（mock data），调用 Hook 能返回公告列表和待办列表。

7. **造通用零件（UI 层）**：
   - 用 shadcn 做基础，写以下通用组件：
     - **公告卡片（AnnouncementCard）**：显示标题、时间、内容
     - **待办项（TodoItem）**：显示待办文本、Checkbox、完成状态
     - **头像（Avatar）**：不同 size、图片加载失败时显示 fallback
     - **标签页切换器（FilterTabs）**：标签切换、选中状态
     - **按钮（Button）**：不同 variant、disabled 状态
   - 每个组件有完整的 TypeScript 类型定义，无 `any`。
   - 用组合模式（Compound Components）或插槽（Slot）设计，让父组件能自由决定内容。
   - **纯展示原则**：组件只接收 props，内部禁止 `fetch`/`useQuery`。
   - 样式通过 Tailwind 类名控制，禁止内联 `style={}` 或单独 `.css` 覆盖。

8. **搭组件展厅（Storybook）**：
   - 为每个通用组件创建对应的 `.stories.tsx` 文件。
   - 展示不同状态：正常、加载中、已完成、置灰等。
   - 运行 `pnpm storybook` 能在浏览器看到所有组件陈列。

9. **接 URL 状态（nuqs）**：
   - 在待办列表页用 nuqs 把筛选条件存进网址（如 `?filter=active`）。
   - 点击筛选后网址变化，刷新页面后筛选状态保持不变。

10. **组装首页**：
    - 在 `apps/web` 首页整合 Zustand 用户名、Query 公告和待办、nuqs 筛选功能。
    - 首页完整显示用户名、公告列表、可筛选的待办列表。
    - 页面文件只做组装，复杂逻辑下沉到 features 层。

**验收标准：**
- [ ] Zustand、TanStack Query、nuqs、Storybook、Tailwind、Radix+shadcn 全部安装成功
- [ ] `tailwind.config.js` 存在，Tailwind 样式生效
- [ ] `packages/store` 中 `userStore` 能存用户名并提供登录/登出
- [ ] 首页显示当前用户名，切换后同步更新
- [ ] `QueryClientProvider` 包裹整个应用
- [ ] `useAnnouncements` 和 `useTodos` 两个 Hook 能返回数据
- [ ] 公告卡片、待办项、头像、标签页、按钮 5 个通用组件全部创建
- [ ] 每个组件有完整 TypeScript 类型，无 `any`
- [ ] 每个组件有对应的 `.stories.tsx` 文件
- [ ] `pnpm storybook` 能打开看到所有组件
- [ ] 待办筛选条件存进 URL，刷新后保持
- [ ] 首页完整显示用户名、公告列表、可筛选的待办列表
- [ ] `packages/ui` 组件不引用 `packages/features` 的任何代码
- [ ] 组件内无 `fetch`/`useQuery`，无内联 `style={}`

**⚠️ 避坑提醒：**
- **P05**：通用组件用组合模式设计，只接收 props，内部禁止 `fetch`/`useQuery`。组件写得太死会导致换需求就得重写。
- **P06**：Zustand 只管"当前用户"等应用级状态，公告/待办等服务端数据必须用 TanStack Query，不许塞进 Zustand。
- **P07**：凡是筛选/排序/分页/搜索关键词，一律用 nuqs 存进 URL，不许用 useState。刷新不丢是核心验收点。
- **P08**：每新建一个通用组件，必须同时写 `.stories.tsx`，否则算没做完。
- **P01**：`packages/ui` 和 `packages/features` 必须物理隔离，通用组件不能认识"公告"或"待办"这些业务概念。

---

### S3：性能优化（Day23）

**本阶段做什么：**

1. **跑体检（Lighthouse 基线）**：
   - 用 Lighthouse 跑当前页面，记录 LCP/INP/CLS 三项分数和总得分。
   - 产出"优化前体检报告"，存放在 `docs/performance/lighthouse-baseline.md`。

2. **分析打包体积**：
   - 安装配置 `@next/bundle-analyzer`。
   - 跑一次构建查看当前打包体积，找出最大的文件，确定优化目标。
   - 产出 `docs/performance/bundle-baseline.md`。

3. **修 LCP（首屏提速）**：
   - 把所有 `<img>` 换成 `next/image`，配置 `width`/`height` 或 `fill`。
   - 用 `next/font` 加载字体，配置 `display: swap`，禁止 CSS `@font-face`。
   - 在 `next.config.js` 中配置远程图片域名（CDN）。

4. **修 CLS（页面稳定）**：
   - 所有图片必须有固定宽高，或使用 `fill` 配合父容器。
   - 公告列表加骨架屏（Skeleton）占位，骨架屏尺寸必须与真实内容完全一致。
   - 字体配置 `display: swap` 防止文字跳动（FOIT）。

5. **练虚拟滚动（必做）**：
   - 造 10000 条待办数据。
   - 用 `@tanstack/react-virtual` 实现只渲染可见区 20-30 条。
   - 滚动顺滑不卡顿，为后续大数据量列表打底。

6. **修 INP（操作跟手）**：
   - 给"筛选待办"加 `useTransition`，标记为低优先级操作。
   - 搜索框加防抖（`useDebounce`，停手 200ms 后才触发）。
   - 滚动用节流（每 16ms 最多触发一次）。
   - 确保所有交互操作响应 < 200ms。

7. **修 Bundle（代码减负）**：
   - 用 `next/dynamic` 做路由代码分割和组件按需加载（弹窗、图表等）。
   - 用 Bundle Analyzer 找到大库并替换（如 moment → dayjs）。
   - 启用 Tree Shaking：`package.json` 配置 `"sideEffects": false`，全程使用 `import` 语法。
   - 首屏 JS 总大小 < 200KB（gzip 后）。

8. **再跑一次 Lighthouse**：
   - 验证优化效果，记录优化后分数。
   - 产出"优化后报告"（`docs/performance/lighthouse-after.md`），对比前后差异。

9. **接 RUM（真实用户监控）**：
   - 安装 `web-vitals`，在 `layout.tsx` 中监听 LCP/INP/CLS。
   - 上报到自建 `/api/vitals` 接口。
   - 建立告警机制：当线上用户 P75 档位 LCP 超过 2.5s 时自动告警。
   - 产出 `docs/performance/rum-alerting.md`。

**验收标准：**
- [ ] LCP < 2.5s（Lighthouse 跑分）
- [ ] INP < 200ms（Lighthouse 跑分）
- [ ] CLS < 0.1（Lighthouse 跑分）
- [ ] Lighthouse Performance 总分 > 90
- [ ] 全局搜索 `<img>` 标签数量为 0，全部用 `next/image`
- [ ] 全局搜索 `@font-face` 数量为 0，全部用 `next/font`
- [ ] 每个 `page.tsx` 是独立打包入口，路由分割生效
- [ ] 首屏 JS 总大小 < 200KB（gzip 后）
- [ ] 10000 条待办数据虚拟滚动正常，只渲染可见区
- [ ] 骨架屏生效：刷新时公告列表位置先显示灰色占位条
- [ ] 骨架屏与真实内容尺寸完全一致，无跳动
- [ ] 访问页面后 `/api/vitals` 能收到性能数据
- [ ] RUM 告警机制配置完成
- [ ] 优化前后 Lighthouse 报告均已产出

**⚠️ 避坑提醒：**
- **P09**：Lighthouse 是实验室数据，必须同时接 RUM（web-vitals）看真实用户 P75/P95，两者都达标才算真优化。
- **P05**：INP 优化不只管点击，搜索框输入、下拉框切换等所有交互都要测，输入框必须加 debounce。
- **P10**：Tree Shaking 必须配置 `"sideEffects": false` 且全程用 `import`，禁止 `require` 混用。
- **P01**：骨架屏必须与真实内容复用同一套 CSS 样式，尺寸完全统一，杜绝加载后页面跳动。
- **P09**：接入监控后必须配置告警规则，不能只上报不查看。

---

### S4：TypeScript 严格模式与单元测试（Day24 上半）

**本阶段做什么：**

1. **配 TS 严格模式**：
   - 根目录和各包的 `tsconfig.json` 开启：
     - `"strict": true`
     - `"noUncheckedIndexedAccess": true`
     - `"exactOptionalPropertyTypes": true`
   - 修掉所有 `any` 类型，用 `unknown` 代替。
   - 运行 `pnpm typecheck`（`tsc --noEmit`）零报错。
   - 全局搜索 `any` 关键字数量为 0。

2. **配 Vitest 单元测试**：
   - 在 `packages/lib` 安装配置 Vitest。
   - 测试工具函数：`formatTime`、`cn`、`useDebounce` 等。
   - 测试文件就近放置（`__tests__/` 或 `*.test.ts`）。
   - 核心工具函数覆盖率 > 80%。

3. **配集成测试**：
   - 在 `packages/ui` 和 `packages/features` 安装 Vitest + @testing-library/react。
   - 测试公告卡片、待办项、头像、标签页、按钮等组件的渲染和交互。
   - 测试 `useAnnouncements`、`useTodos` Hook。
   - **测行为不测实现细节**：只测"用户看到什么/能操作什么"，不测内部 state。
   - 可复用 Storybook 的 stories 作为测试素材。

**验收标准：**
- [ ] `pnpm typecheck` 零报错
- [ ] 全局搜索 `any` 关键字数量为 0
- [ ] `tsconfig.json` 包含 `strict:true` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`
- [ ] `packages/lib` 工具函数单元测试全部通过
- [ ] `packages/ui` 组件集成测试全部通过
- [ ] `packages/features` Hook 测试全部通过
- [ ] 核心代码测试覆盖率 > 75%
- [ ] 测试文件就近放置，不集中在根目录
- [ ] 测试中不出现组件内部 state 断言

**⚠️ 避坑提醒：**
- **P10**：TS 只开 `strict:true` 不够，必须额外开 `noUncheckedIndexedAccess` 和 `exactOptionalPropertyTypes`。
- **P10**：测试测行为不测实现细节，永远测用户能看到/能操作的，不测组件内部状态。
- **P05**：通用组件测试只测"用户看到什么"，不测内部 state。
- **P01**：测试文件跟着源码走，`__tests__/` 就近放置，不能全塞进一个根目录。

---

### S5：E2E 测试与 CI/CD 流水线（Day24 下半）

**本阶段做什么：**

1. **写冒烟测试 + E2E 测试**：
   - 安装 Playwright。
   - 写 1 个冒烟测试：首页能打开、能看到核心内容。
   - 写 1 个核心流程 E2E：首页 → 筛选待办 → 验证 URL 变化 → 刷新页面验证状态保持。
   - 失败时自动录屏和截图。

2. **配 GitHub Actions 5 道门禁**：
   - 创建 `.github/workflows/ci.yml`。
   - 5 道门禁按顺序：
     1. **Lint**：`pnpm lint`
     2. **TypeCheck**：`pnpm typecheck`
     3. **Test**：`pnpm test`（单元+集成）+ `pnpm test:e2e`（E2E）
     4. **Build**：`pnpm build`
     5. **Lighthouse**：Lighthouse CI 性能预算检查
   - 覆盖率 < 75% 直接拦截。
   - Lighthouse 预算不达标直接报红。
   - PR 自动触发，全部变绿才能合并。

3. **配 Vercel 部署**：
   - 关联 GitHub 仓库。
   - PR 自动生成预览链接。
   - main 分支自动部署到生产环境。

**验收标准：**
- [ ] `pnpm test:e2e` 全部通过
- [ ] 冒烟测试验证首页可打开
- [ ] E2E 测试验证筛选待办流程和 URL 状态保持
- [ ] Playwright 失败时自动录屏截图
- [ ] `.github/workflows/ci.yml` 存在且包含 5 道门禁
- [ ] 提交 PR 后 GitHub Actions 自动触发 5 道检查
- [ ] 覆盖率 < 75% 时 CI 报红拦截
- [ ] Lighthouse 预算不达标时 CI 报红
- [ ] PR 页面能看到 Vercel 预览链接
- [ ] 合并 main 后自动部署到公网 URL

**⚠️ 避坑提醒：**
- **P03**：CI 中必须把 lint 作为第一道门禁。
- **P07**：E2E 测试必须验证 URL 状态（筛选/排序存进网址，刷新不丢）。
- **P09**：CI 中 Lighthouse 预算不达标必须直接报红，不能只跑不拦。
- **P10**：CI 必须设阈值（覆盖率 < 75% 直接拦截），否则形同虚设。

---

### S6：代码规范与团队协作（Day24 收尾）

**本阶段做什么：**

1. **配 ESLint + Prettier**：
   - ESLint 检查逻辑错误，Prettier 自动格式化代码风格。
   - 两者配合，解决风格争论。
   - 确保 ESLint 跨层规则在 CI 中生效。

2. **配 Husky + lint-staged**：
   - 安装 Husky，配置 `pre-commit` 钩子。
   - 配合 lint-staged，**只检查本次改动的文件**。
   - 提交前自动运行 lint 和格式化，有错误时提交被拦截。
   - 提交检查从 30 秒变 1 秒。

3. **配 commitlint**：
   - 强制 Conventional Commits 格式：`feat:`、`fix:`、`docs:` 等。
   - 不允许"更新""修复"这类模糊描述。
   - 配置 `commit-msg` 钩子。

4. **配 Changesets**：
   - 安装配置 Changesets。
   - 管理 Monorepo 多包版本号。
   - 自动生成 CHANGELOG。
   - 跑通一次 `pnpm changeset` 创建版本记录。

5. **更新新人 README**：
   - 加入完整指引：
     - 如何安装依赖
     - 如何启动项目
     - 如何运行测试（单元/集成/E2E）
     - 如何提交代码（commit 规范）
     - 项目结构图
   - 新同事按 README 10 分钟内完成环境搭建并跑通所有检查。

**验收标准：**
- [ ] Husky + lint-staged 生效：提交代码时自动运行检查和格式化
- [ ] 有错误时提交被拦截
- [ ] lint-staged 只检查改动文件，不跑全量
- [ ] commitlint 生效：提交信息不符合规范时提交被拦截
- [ ] 提交信息必须以 `feat:`/`fix:`/`docs:` 等开头
- [ ] Changesets 配置完成
- [ ] `pnpm changeset` 能正常创建版本变更记录
- [ ] `README.md` 包含安装、启动、测试、提交规范完整指引
- [ ] 新同事按 README 10 分钟内跑通所有检查

**⚠️ 避坑提醒：**
- **P10**：Husky 必须配 lint-staged 只查改动文件，不能每次提交跑全量检查（30 秒→1 秒）。
- **P10**：commitlint 必须强制 Conventional Commits 格式，不能只要求"以字母开头"。
- **P10**：Changesets 必须跑通一次 `pnpm changeset`，确保工具链完整。
- **P03**：ESLint 规则必须在 CI 中作为第一道门禁，不能只装不用。
- **P01**：README 必须保证新人 10 分钟内能跑起来，项目结构图要清晰。

---

## 5. 阶段总验收清单

全部 6 个阶段完成后，确认以下总验收项：

- [ ] **架构**：Monorepo 4+1 层结构清晰，ESLint 跨层规则实测报错
- [ ] **组件**：5 个通用组件 + Storybook 展厅，纯展示无业务耦合
- [ ] **状态**：Zustand 管用户态、TanStack Query 管服务端数据、nuqs 管 URL 状态
- [ ] **性能**：LCP < 2.5s、INP < 200ms、CLS < 0.1、Lighthouse > 90、RUM 已接入
- [ ] **虚拟滚动**：10000 条数据流畅滚动
- [ ] **类型安全**：TS 严格模式零报错、零 `any`
- [ ] **测试**：单元+集成+E2E 全绿，覆盖率 > 75%
- [ ] **CI/CD**：5 道门禁全绿才能合并，Vercel 自动预览/部署
- [ ] **规范**：Husky + lint-staged + commitlint + Changesets 全部生效
- [ ] **文档**：README 新人 10 分钟上手
