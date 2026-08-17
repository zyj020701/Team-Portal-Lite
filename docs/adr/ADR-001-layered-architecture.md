# ADR-001：分层架构决策

## 1. 背景（Context）

本项目是一个内部教学练习项目，目标是搭起一个能容纳后续所有功能代码的前端框架。项目需要支持公告卡片、待办清单、寿星展示等多个业务模块，且要求代码结构清晰、模块独立、新人 10 分钟内能上手。如果不做分层，所有代码混在一个目录里，后期必然出现循环依赖、模块耦合、改一处崩三处的问题。

## 2. 考虑的其它方案（Considered Alternatives）

### 方案 A：单仓单应用（Single Repo）

将所有代码放在一个 `src/` 目录下，不做物理隔离。

- 优点：初期搭建快，无需配置 workspace。
- 缺点：通用组件和业务逻辑混在一起，无法强制分层；随着模块增多，循环依赖风险高；新人难以判断代码该放哪。

### 方案 B：多仓库（Multi-Repo）

每个模块独立一个 Git 仓库，通过 npm 发布共享包。

- 优点：物理隔离最彻底，各包独立版本管理。
- 缺点：跨仓库调试困难，改一个通用组件需要发版再升级；教学项目场景下配置成本远大于收益；pnpm workspace 已能在单仓内实现同等隔离。

## 3. 最终选择（Decision）

选择 **4 层 Monorepo 分层架构**，使用 pnpm workspace 管理：

```
apps/web           → Next.js 主站，页面组装层
packages/features  → 业务零件层（公告、待办、寿星等具体业务逻辑）
packages/ui        → 通用 UI 零件（按钮、卡片、头像等无业务逻辑的组件）
packages/lib       → 工具函数、通用逻辑（无 UI 依赖，最底层）
```

依赖方向严格单向：`apps/web → packages/features → packages/ui → packages/lib`。

## 4. 选择理由（Rationale）

1. **物理隔离优于口头约定**：`apps/` 和 `packages/` 在目录层面强制分开，配合 ESLint `import/no-restricted-paths` 规则自动拦截跨层引用，比文档约定更可靠。
2. **pnpm 而非 npm/yarn**：pnpm 使用硬链接和符号链接节省磁盘空间，安装速度快；其 `workspace:*` 协议能精确引用内部包，避免版本不一致问题。
3. **Next.js 14 App Router 而非 pages/**：App Router 是 Next.js 的未来方向，支持 React Server Components，布局和嵌套路由更清晰，与后续实战项目保持一致。
4. **Monorepo 而非 Multi-Repo**：教学项目需要频繁跨包调试，单仓内修改即时生效，无需发版；Turbo 提供任务缓存，构建速度不受影响。