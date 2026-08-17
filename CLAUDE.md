# CLAUDE.md —— Team Portal Lite 施工蓝图与总章程

> 本文件是 AI 编程助手执行项目任务的唯一指令来源。每个阶段（S1–S6）均可独立复制给 AI 执行。
> 执行顺序：S1 → S2 → S3 → S4 → S5 → S6，前一阶段验收通过后再进入下一阶段。

---

## 1. 项目概述

- **项目中文名**：团队内部门户·简易版
- **英文代号**：team-portal-lite
- **项目定位**：内部教学练习项目（非商用），用于演练前端架构设计全流程。
- **今日唯一目标**：搭起一个能容纳后续所有功能代码的"超级大框架"，确保未来在此项目上练习的同事能清晰理解"什么代码该放什么位置"。
- **产出物**：需求确认单、架构决策日志（ADR）、Monorepo 骨架、ESLint 跨层管制规则、第一个最小可运行 Feature、新人 README。

---

## 2. 技术栈约束

| 技术项 | 选型 | 强制要求 |
|--------|------|----------|
| 主框架 | Next.js 14（App Router） | 必须用 `app/` 目录模式，**禁止** `pages/` 旧模式 |
| 包管理 | pnpm + workspace 协议 | 内部包引用必须用 `workspace:*`，禁止 npm/yarn |
| 构建加速 | Turbo | 配置任务缓存，改过的文件才重新编译 |
| 代码检查 | ESLint | 必须启用 `import/no-restricted-paths` 执行单向依赖 |
| 编程语言 | TypeScript 严格模式 | 所有源码用 `.ts`/`.tsx`，禁止 `.js`（配置文件除外） |
| 代码风格 | Prettier | 与 ESLint 不冲突 |
| 项目结构 | Monorepo | 根目录必须包含 `apps/` 和 `packages/` |

**4 层架构职责**：

```
apps/web           → Next.js 主站，页面组装层（Page 要薄，≤100 行）
packages/features  → 业务零件层（包含具体业务逻辑）
packages/ui        → 通用 UI 零件（按钮、卡片等，无业务逻辑）
packages/lib       → 工具函数、通用逻辑（无 UI 依赖，最底层）
```

**依赖方向（单向，只能从上往下）**：

```
apps/web → packages/features → packages/ui → packages/lib
```

---

## 3. 代码规范

1. **单向依赖**：通用零件层绝对不能引用具体业务层。反向引用一律禁止。
2. **模块独立**：业务模块之间必须互相独立，不能直接调用对方内部数据，必须通过公共出口（`index.ts`）共享。
3. **Page 要薄**：页面文件只做组装，复杂业务逻辑不超过 100 行（S5 阶段要求 ≤30 行），逻辑下沉到 features 层。
4. **TypeScript 严格模式**：所有源码文件用 `.ts`/`.tsx`，`tsconfig.json` 中开启 `strict: true`。
5. **统一出口**：每个包必须有 `src/index.ts` 作为公共出口，禁止外部直接引用内部文件路径。
6. **包命名前缀**：所有内部包统一使用 `@team-portal-lite/` 前缀。

---

## 4. 开发流程

### S1：4 问开局（定需求）

**本阶段做什么**：

在项目根目录创建 `docs/requirements/` 目录，并在其中新建 `requirements-confirmation.md`。

文件内容必须包含以下 4 个问题，并针对本项目逐一回答：

1. **给谁用？**（目标用户）
2. **解决啥？**（核心痛点）
3. **做成啥样？**（核心形态/界面特征）
4. **怎么衡量成功？**（验收指标）

在文末另起一节"3 个核心用户使用场景"，按以下格式列出：

- 场景 1：看公告（用户故事 + 期望结果）
- 场景 2：看任务（用户故事 + 期望结果）
- 场景 3：看寿星（用户故事 + 期望结果）

**要求**：语言通俗，每个问题回答不超过 3 句话；仅创建 Markdown 文件，不需要做任何安装。

**验收标准**：

- [ ] 根目录下存在 `docs/requirements/requirements-confirmation.md`
- [ ] 文件包含 4 个问题 + 3 个用户场景，结构完整
- [ ] 任意一个回答缺失即视为不通过

> ⚠️ **本阶段陷阱提醒**：
> - **陷阱 4（ADR 写成流水账）**：虽然本阶段写的是需求而非 ADR，但同样要避免流水账——每个问题必须有实质回答，不能只写一句话敷衍。

---

### S2：写决策日志（ADR）

**本阶段做什么**：

在项目根目录创建 `docs/adr/` 目录，并在其中新建文件 `ADR-001-layered-architecture.md`。

ADR 必须严格按照以下 4 部分结构撰写：

```markdown
# ADR-001：分层架构决策

## 1. 背景（Context）
说明今天要解决的问题。

## 2. 考虑的其它方案（Considered Alternatives）
至少列出 2 个备选方案，并简述各自优缺点。

## 3. 最终选择（Decision）
明确选择"4 层 Monorepo 分层"：
- apps/web
- packages/features
- packages/ui
- packages/lib

## 4. 选择理由（Rationale）
说明为什么选这个方案，为什么不选其他方案。
```

**要求**：Markdown 格式，不超过 80 行；仅创建文件，不需要做任何安装。

**验收标准**：

- [ ] 根目录下存在 `docs/adr/ADR-001-layered-architecture.md`
- [ ] 文件结构严格包含"背景""考虑的其它方案""最终选择""选择理由"4 个二级标题
- [ ] 备选方案至少 2 个，且有优缺点对比
- [ ] 缺任意一部分即视为不通过

> ⚠️ **本阶段陷阱提醒**：
> - **陷阱 4（ADR 写成流水账）**：ADR 绝对不能只写"我们用了 pnpm"，必须包含"背景 → 考虑的其它方案 → 最终选择 → 选择理由"4 部分，哪怕每段只写 3 句话，结构必须全。选择理由中必须说明为什么选 pnpm 不选 npm/yarn、为什么用 App Router 不用 pages/。

---

### S3：搭建总仓库（Monorepo 骨架）

**本阶段做什么**：

1. 在项目根目录创建 `pnpm-workspace.yaml`，声明以下 workspace：
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/ui'
     - 'packages/features'
     - 'packages/lib'
   ```

2. 创建以下 4 个目录，每个目录下初始化 `package.json`：

   | 目录 | name 字段 |
   |------|-----------|
   | `apps/web/` | `@team-portal-lite/web` |
   | `packages/ui/` | `@team-portal-lite/ui` |
   | `packages/features/` | `@team-portal-lite/features` |
   | `packages/lib/` | `@team-portal-lite/lib` |

   每个 `package.json` 至少包含 `name` 和 `version` 字段。

3. 在根目录 `package.json` 中声明 `private: true`，并配置 workspace 引用。

4. 执行完后列出最终的目录树（文字树状图）。

**验收标准**：

- [ ] 根目录下可见 `apps/` 和 `packages/` 的明确区分
- [ ] `packages/` 下至少有 3 个不同子文件夹（ui、features、lib）
- [ ] `pnpm-workspace.yaml` 文件存在且配置正确
- [ ] 4 个 `package.json` 全部创建成功，name 字段使用 `@team-portal-lite/` 前缀

> ⚠️ **本阶段陷阱提醒**：
> - **陷阱 1（目录不清，混为一谈）**：必须在物理层面隔开——`apps/web` 放主站，`packages/` 放共享零件，绝对不能把所有代码塞进一个 `src/` 里靠口头约定。
> - **陷阱 2（循环依赖死锁）**：`packages/ui` 和 `packages/lib` 的 `package.json` 中不能引用 `@team-portal-lite/web` 或 `@team-portal-lite/features`，依赖方向只能是 `apps → features → ui → lib`。

---

### S4：贴"跨层"罚单（ESLint 规则）

**本阶段做什么**：

所有操作在项目根目录进行。

1. 创建 `turbo.json`，至少包含两个任务：
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "tasks": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": ["dist/**", ".next/**"]
       },
       "lint": {
         "dependsOn": ["^lint"]
       }
     }
   }
   ```

2. 在根目录安装 ESLint 及相关依赖：
   ```bash
   pnpm add -D -w eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-import-resolver-typescript
   ```

3. 在根目录创建 `.eslintrc.cjs`（必须用 `.cjs` 后缀），内容至少包含：
   - `parser: "@typescript-eslint/parser"`
   - `extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"]`
   - `plugins: ["import"]`
   - `rules` 中启用 `import/no-restricted-paths`，配置以下禁止区域：
     - `packages/lib` 禁止被 `packages/ui`、`packages/features`、`apps` 反向引用
     - `packages/ui` 禁止引用 `packages/features` 和 `apps`
     - `packages/features` 禁止被 `apps` 直接侵入内部
   - `ignorePatterns` 忽略 `node_modules`、`.next`、`dist`

4. 在根目录 `package.json` 的 `scripts` 中确保有：`"lint": "turbo run lint"`

5. 在每个子包（`packages/lib`、`packages/ui`、`packages/features`、`apps/web`）的 `package.json` 中添加 lint 脚本：
   ```json
   "lint": "eslint src --ext .ts,.tsx"
   ```

6. **自检测试（关键步骤）**：
   - 在 `packages/ui/src/` 下建一个 `test-violation.ts`，内容为：
     ```typescript
     import { xxx } from '../../apps/web/src/something';
     console.log('test');
     ```
   - 在根目录执行 `pnpm lint`，**必须看到 ESLint 报错**（包含 `no-restricted-paths` 字样）
   - 看到报错后，删除 `test-violation.ts`
   - 再执行 `pnpm lint`，不再报此错

**验收标准**：

- [ ] 根目录存在 `turbo.json` 和 `.eslintrc.cjs`
- [ ] 在 `packages/ui` 内故意写跨层引用（如 import 自 apps/web），执行 `pnpm lint` **必须报错**
- [ ] 报错后删除测试文件，再执行 `pnpm lint` 不再报此错

> ⚠️ **本阶段陷阱提醒**：
> - **陷阱 3（ESLint 只装不用）**：不能只装 ESLint 不配置 `import/no-restricted-paths` 规则！配完后必须故意写违规代码测试，确认它会报错才算生效。不报错算失败。
> - **陷阱 2（循环依赖死锁）**：规则配置要确保依赖方向单向 `apps → features → ui → lib`，反向引用一律禁止。如果两个模块必须互相调用，说明公共代码应抽到 `packages/lib`。

---

### S5：跑通第一个小流程（第一个 Feature）

**本阶段做什么**：

严格按以下 4 步，在 4 个包中分别写代码：

**第 1 步：packages/lib（工具函数）**

在 `packages/lib/src/` 下创建 `formatTime.ts`：
```typescript
export function formatTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
```
在 `packages/lib/src/index.ts` 中：`export { formatTime } from './formatTime';`

**第 2 步：packages/ui（通用零件）**

在 `packages/ui/src/` 下创建 `TimeCard.tsx`：
```typescript
import React from 'react';

export function TimeCard({ time }: { time: string }) {
  return (
    <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>当前时间</h2>
      <p style={{ fontSize: 24, fontFamily: 'monospace' }}>{time}</p>
    </div>
  );
}
```
在 `packages/ui/src/index.ts` 中：`export { TimeCard } from './TimeCard';`

**第 3 步：packages/features（业务零件）**

在 `packages/features/src/` 下创建 `time/feature.ts`：
```typescript
import { formatTime } from '@team-portal-lite/lib';

export function getCurrentFormattedTime(): string {
  return formatTime(new Date());
}
```
在 `packages/features/src/index.ts` 中：`export * from './time/feature';`

**第 4 步：apps/web（页面组装）**

- 创建 `apps/web/next.config.js`（配置 `transpilePackages`）
- 创建 `apps/web/tsconfig.json`（继承根目录配置，开启 `strict: true`）
- 创建 `apps/web/app/layout.tsx`（最小可用布局）
- 创建 `apps/web/app/page.tsx`：
```typescript
import { TimeCard } from '@team-portal-lite/ui';
import { getCurrentFormattedTime } from '@team-portal-lite/features';

export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>团队内部门户·简易版</h1>
      <TimeCard time={getCurrentFormattedTime()} />
    </main>
  );
}
```

确保各包 `package.json` 的 `dependencies` 中正确引用了下层包（使用 `workspace:*`）。

**验收标准**：

- [ ] `packages/lib/src/` 下能找到 `formatTime.ts`
- [ ] `packages/ui/src/` 下能找到 `TimeCard.tsx`
- [ ] `apps/web/app/` 下能找到 `page.tsx`，且代码量 ≤30 行
- [ ] 执行 `pnpm --filter @team-portal-lite/web dev`，浏览器访问 http://localhost:3000，能看到"当前时间"字样 + 动态时间字符串
- [ ] 跨层引用通过 ESLint 检查（无违规报错）

> ⚠️ **本阶段陷阱提醒**：
> - **陷阱 1（目录不清，混为一谈）**：formatTime 必须放 `packages/lib`，TimeCard 必须放 `packages/ui`，业务逻辑 `getCurrentFormattedTime` 必须放 `packages/features`，页面只做组装放 `apps/web`。不能图省事全写在一个文件里。
> - **陷阱 2（循环依赖死锁）**：`packages/lib` 不能引用 `packages/ui`，`packages/ui` 不能引用 `packages/features` 或 `apps/web`。依赖链路必须是 `apps/web → features → ui → lib`。

---

### S6：写新人说明书（README）

**本阶段做什么**：

在项目根目录创建 `README.md`，用不超过 10 句话写明以下内容：

1. **项目简介**：一句话说明这是什么
2. **环境要求**：需要安装什么（Node.js 版本、pnpm）
3. **安装依赖**：`pnpm install`
4. **启动项目**：`pnpm dev`
5. **项目结构图**：用文字树状图展示目录结构
6. **常用命令**：`pnpm dev`、`pnpm build`、`pnpm lint`

**验收标准**：

- [ ] 根目录 `README.md` 文件存在
- [ ] README 包含安装依赖、启动项目的说明
- [ ] README 包含文字树状图展示项目结构，清晰展示 `apps/` 和 `packages/` 的物理隔离
- [ ] README 正文不超过 10 句话
- [ ] 另一个同事拿到代码后，按 README 操作能在 10 分钟内跑起来并看到首页

> ⚠️ **本阶段陷阱提醒**：
> - **陷阱 1（目录不清，混为一谈）**：项目结构图必须清晰展示 `apps/` 和 `packages/` 的物理隔离，让新人一眼看懂代码该放哪。

---

## 5. 安全与合规

1. **内部项目**：本项目为内部教学练习项目，非商用，不得引入未经授权的第三方商业资源。
2. **依赖安全**：安装依赖时使用 pnpm 官方源，定期执行 `pnpm audit` 检查已知漏洞。
3. **无敏感数据**：项目中不得硬编码 API Key、密码、Token 等敏感信息。
4. **`.gitignore` 必须包含**：`node_modules/`、`.next/`、`dist/`、`*.log`、`.env*`。

---

## 6. AI 协作约定

1. **按阶段执行**：严格按 S1 → S6 顺序执行，每阶段验收通过后再进入下一阶段，不得跳步。
2. **一次一阶段**：每个阶段的指令可独立复制给 AI 执行，AI 不应跨阶段操作。
3. **验收驱动**：每阶段完成后，AI 必须对照验收标准逐项自检，全部通过才算完成。
4. **不擅自变更技术选型**：技术栈已在第 2 节锁定，AI 不得自行替换框架或工具。
5. **TypeScript 严格模式**：AI 生成的所有代码必须有明确类型标注，禁止使用 `any`。
6. **文件位置约束**：AI 必须将代码放在正确的层级（lib/ui/features/apps），不得为了方便混放。
7. **修改后验证**：AI 完成代码修改后，必须运行 `pnpm lint` 和 `pnpm build` 确认无报错。

---

## 7. 常见陷阱

以下 4 个陷阱来自 spec，任何阶段都可能踩中，务必警惕：

### 陷阱 1：目录不清，混为一谈

把所有代码全塞进一个 `src/` 里，分不清哪些是"通用零件"，哪些是"具体业务"。

**对策**：必须在物理层面隔开（放进 `packages/` 和 `apps/` 不同文件夹），不能只靠口头约定。

### 陷阱 2：循环依赖死锁

模块 A 引用了模块 B，模块 B 又引用了模块 A，导致编译时死循环卡死。

**对策**：严格执行"只能上层引用下层"。如果发现两个模块非得互相调用，说明这部分代码应该抽到更下层的 `packages/lib` 中。

### 陷阱 3：ESLint 只装不用

安装了 ESLint，但没有配置 `import/no-restricted-paths` 规则，导致"跨层引用"只是口头吓唬人。

**对策**：配置完规则后，必须像 S4 验收标准那样，故意写个违规代码测一下，确认它会报错才算生效。

### 陷阱 4：ADR 写成流水账

架构决策记录只写了"我们用了 pnpm"，没写"为什么不用 npm/yarn"。

**对策**：ADR 必须包含"背景 → 考虑的其它方案 → 最终选择 → 选择理由"这 4 部分，哪怕只写 3 句话都行，但结构必须全。

---

## 8. 决策日志（ADR）

所有架构决策记录存放在 `docs/adr/` 目录下，命名格式为 `ADR-NNN-简短描述.md`。

当前已有决策：

| 编号 | 文件 | 主题 |
|------|------|------|
| ADR-001 | `docs/adr/ADR-001-layered-architecture.md` | 4 层 Monorepo 分层架构决策 |

**新增 ADR 要求**：
- 必须包含 4 段结构：背景 → 考虑的其它方案 → 最终选择 → 选择理由
- 文件名递增编号（ADR-002、ADR-003……）
- 每个决策记录不超过 80 行

---

## 9. 测试要求

1. **ESLint 违规拦截测试（S4 必须执行）**：
   - 在 `packages/ui/src/` 下创建临时违规文件，故意跨层引用 `apps/web`
   - 执行 `pnpm lint`，必须看到 `no-restricted-paths` 报错
   - 确认报错后删除违规文件，再次 lint 必须通过

2. **构建验证（S5 必须执行）**：
   - 执行 `pnpm build`，必须编译成功无报错
   - 执行 `pnpm --filter @team-portal-lite/web dev`，浏览器访问 http://localhost:3000 必须能看到页面

3. **后续阶段测试原则**：
   - 每个 Feature 完成后必须通过 `pnpm lint` 和 `pnpm build`
   - 页面代码量不超过阶段规定行数（S5 ≤30 行，后续 ≤100 行）
   - 不引入快照测试或单元测试框架（当前阶段为架构搭建，非功能开发）

---

## 10. 文档要求

1. **需求文档**：`docs/requirements/requirements-confirmation.md`，包含 4 个问题 + 3 个用户场景。
2. **架构决策**：`docs/adr/` 目录下的 ADR 文件，每个必须含 4 段结构。
3. **项目说明**：根目录 `README.md`，不超过 10 句话，新人 10 分钟内能跑起来。
4. **文档语言**：中文为主，技术术语保留英文原文。
5. **文档更新原则**：代码结构发生变更时，必须同步更新 README 和相关 ADR。
6. **Markdown 规范**：所有文档使用 Markdown 格式，标题层级不超过 4 级。
