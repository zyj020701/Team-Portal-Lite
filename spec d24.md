&#x20;Team Portal Lite

项目说明书

\#项目规格说明书 (spec d24.md) —— 工程化体系Day (Day 24)

\#项目信息

\-项目中文名：团队内部门户 - 简易版

\-项目英文名：team-portal-lite

\-项目定位：内部教学练习项目（非商用），用于演练前端工程化全流程。

\#1. 项目目的

今天的核心目标是：“给这间屋子装上‘监控摄像头’、‘自动安检门’和‘全自动传送带’

用 TypeScript 严格模式把代码质量的门槛提到最高，any 类型直接不允许通过。

建一套测试金字塔—— 从最小的工具函数到完整的用户操作流程，全部用代码自动验证。

配一套 CI/CD 流水线（5 道自动门禁），每次有人提交代码，自动检查、自动测试、自动拦截问题。

立一套团队协作规范 —— 代码风格统一、提交信息规范、版本号自动管理。

\#2. 项目功能

今天要产出 5 类具体资产：

|1|TypeScript 配置 | tsconfig.json，开启 strict:true + 额外严格选项（noUncheckedIndexedAccess、exactOptionalPropertyTypes），tsc --noEmit 零报错。

| + 冒烟测试（测核心入口）。

|2|测试金字塔| 单元测试（Vitest 测工具函数）+ 集成测试（Testing Library 测组件）+E2E 测试（Playwright 测完整流程）+ 冒烟测试（测核心入口）。

|3|CI/CD 5 道门禁|GitHub Actions 配置：Lint → TypeCheck → Test → Build → Lighthouse，全部通过才能合并 PR。

|4|代码规范 4 件套| ESLint + Prettier（统一风格）、Husky + lint-staged（提交前自动检查）、commitlint（提交信息规范）、Changesets（版本管理）。

|5|团队新人指南| 更新 README.md，加入 “如何安装、如何运行测试、如何提交代码” 的完整指引。

\#3. 核心约束

|1|零 any 政策| 项目中不允许出现任何 any。发现一个，tsc --noEmit 就报错一个，代码无法合并。

|2|测试覆盖率底线| 核心工具函数和组件的测试覆盖率必须 > 75%，低于阈值 CI 直接拦截。

|3|CI 全绿才能合并|5 道门禁（Lint/TypeCheck/Test/Build/Lighthouse）任何一道变红，PR 不允许合并。

|4|提交前自动检查| Husky+lint-staged 确保提交前自动运行检查和格式化，不允许 “先提交再修改” 的情况。

|5|提交信息必须规范| commitlint 强制要求 feat: /fix: /docs: 等格式，不允许出现 “更新”“修复” 这类模糊描述。

\#4. 技术限制

|TypeScript 配置| tsconfig.json 严格模式 | 开启 strict:true + noUncheckedIndexedAccess + exactOptionalPropertyTypes。第 25 天实战项目要求 TS strict + 0 any，今天配置完可直接复用。

|单元 / 集成测试| Vitest + @testing-library/react | Vitest 跑得飞快（毫秒级），Testing Library 让你测 “用户看到什么” 而不是 “代码内部怎么写”。

|E2E / 冒烟测试| Playwright | 模拟真实浏览器操作，支持多浏览器，失败时自动录屏和截图，调试体验好。

|代码风格检查| ESLint + Prettier | ESLint 检查逻辑错误，Prettier 自动格式化代码风格。两者配合，告别风格争论。

|Git 提交钩子| Husky + lint-staged | 提交前自动运行检查，且只检查本次改动的文件，速度快不烦人。

|提交信息规范| commitlint（Conventional Commits）| 强制feat、fix、docs等格式。第 25 天实战项目同样要求。

|版本管理| Changesets | 自动管理 Monorepo 多包的版本号，自动生成 CHANGELOG。第 25 天实战项目同样要求。

|CI/CD 流水线| GitHub Actions | 每次 PR 自动跑 5 道门禁，全部通过才能合并。第 25 天实战项目同样要求。

部署平台 | Vercel | PR 自动生成预览链接（方便 Review），合并 main 自动部署到生产环境。第 25 天实战项目同样要求。

\#5. 完成步骤

步骤 1｜配 TS 严格模式：tsconfig.json开启 strict:true 及所有额外严格选项，修掉所有 any；tsc --noEmit 零报错，全局搜不到 any 类型

步骤 2｜单元测试：用 Vitest 测试 packages/lib 里的工具函数（如时间格式化）；函数收敛覆盖率 > 80%，测试全部通过

步骤 3｜集成测试：用 Testing Library 测试公告卡片、待办项等组件的渲染和交互；组件测试全部通过，测用户行为而不测试细节

步骤 4｜写冒烟测试 + E2E：用 Playwright 写 1 个冒烟测试（首页能打开）+1 个核心流程（首页→筛选待办）；冒烟和 E2E 测试全部通过，失败自动录屏

步骤 5｜配 GitHub Actions：创建 .github/workflows/ci.yml，配置 5 道门禁｜PR 自动触发 5 道检查，全部变绿才能合并

步骤 6｜配 Vercel 部署：关联 GitHub 仓库，PR 自动生成预览链接，main 分支自动部署｜合并 PR 后自动部署到公网 URL

\#6. 验收指标

1｜TS 严格模式零报错｜运行 pnpm typecheck，无任何类型错误

2｜零 any 政策执行｜全局搜索 any 关键字，数量为 0（合理使用 unknown 代替）

3｜测试覆盖率达标｜运行 pnpm test:coverage，核心代码覆盖率 > 75%

4｜测试全部通过｜运行 pnpm test 和 pnpm test:e2e，全部绿色通过

5｜CI5 道门禁配置完成｜提交一个 PR，GitHub Actions 自动触发 5 道检查，全部显示绿色✅

6｜Vercel 预览链接生效｜PR 页面能看到 Vercel 自动生成的预览链接，点击能打开页面

7｜Husky+lint-staged 生效｜提交代码时自动运行检查和格式化，有错误时提交被拦截

8｜commitlint 生效｜提交信息不符合规范（如写 “更新”）时，提交被拦截

9｜Changesets 配置完成｜运行 pnpm changeset 能正常创建版本变更记录

10｜新人上手测试｜新同事按 README 指引，10 分钟内完成环境搭建并跑通所有检查

\#7. ⚠️ 常见陷阱

陷阱 1：TS 配置只开 strict:true 不够｜strict:true 只是总开关，但 noUncheckedIndexedAccess 和 exactOptionalPropertyTypes 不在 strict 的涵盖范围内，需要单独开启。它们能抓更多隐藏 bug，必须显式开启 noUncheckedIndexedAccess 和 exactOptionalPropertyTypes，这是 PDF 第 57 页强调的 2026 SOTA 做法。

陷阱 2：测试只测 “实现细节” 不测 “行为”｜用 Testing Library 时测了component.state.email，而不是测 “用户看到了什么”。一旦重构内部代码，测试全崩。永远测用户能看到 / 能操作的，不测组件内部状态。PDF 第 61 页明确说这是反例。

陷阱 3：CI 配了但没设阈值｜配了 GitHub Actions 但没设阈值（如测试覆盖率 <75% 不拦截），CI 永远是绿的，形同虚设。在 CI 配置中显式设阈值，低于阈值直接报红。PDF 第 64 页强调 “Lighthouse CI 性能预算”。

陷阱 4：Husky 装了但没配 lint-staged｜装了 Husky 但每次提交跑全量检查（检查全部文件），导致提交要等 30 秒以上，开发者嫌烦就跳过检查。必须配合 lint-staged，只检查本次改动的文件，提交从 30 秒变 1 秒。 PDF 第 65 页提到这个优化。

陷阱 5：commitlint 规则太松｜配了 commitlint 但只要求 “以字母开头”，结果所有人还是写update、fix bug，历史记录依然混乱。必须强制 Conventional Commits 格式（feat、fix、docs等），不给模糊描述留空间。

陷阱 6：Changesets 只在 Monorepo 里用，忘了配｜知道 Monorepo 多包发版要用 Changesets，但只在 Day21 搭了架构，Day24 忘了配。今天必须跑通一次pnpm changeset创建版本记录，确保工具链完整。

