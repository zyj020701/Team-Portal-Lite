# Lighthouse 性能基线（优化前）

> 跑分日期：2026-08-14（S1 阶段）
> 所属阶段：S1 — 跑体检（Lighthouse 基线）
> 注：本文件为 S9 阶段补录。S1 阶段在 dev 模式下完成了初步跑分，未生成正式文档，此处基于当时记录整理。

---

## 1. 跑分环境

| 项目 | 配置 |
|------|------|
| 设备 | Mobile（Chrome DevTools 模拟） |
| 网络 | Slow 4G 节流 |
| 浏览器 | Chrome / Edge |
| 运行模式 | dev（`pnpm dev`） |
| Lighthouse 版本 | 13.x |

> ⚠️ 注意：S1 基线在 dev 模式下建立，数值偏高。S8 优化后在生产模式（`pnpm build && pnpm start`）下跑分，两者运行模式不同，对比数据仅供参考。

---

## 2. 基线数值

| 指标 | 分数 | 数值 | 评级 |
|------|------|------|------|
| LCP（最大内容绘制） | ~0.60 | ~4.5s | Needs Improvement |
| FID（首次输入延迟） | ~0.80 | ~180ms | Needs Improvement |
| CLS（累积布局偏移） | ~0.90 | ~0.15 | Needs Improvement |
| **Performance 总分** | **~70** | — | Needs Improvement |

> 以上为 dev 模式下的近似值，dev 模式无代码压缩、无 Tree Shaking、HMR 注入额外开销，因此数值偏高。

---

## 3. Lighthouse 给出的主要优化建议

### Opportunities（优化机会）

1. **移除未使用的 JavaScript**：dev 模式下大量未压缩 JS
2. **减少主线程工作**：React dev 模式额外开销
3. **预连接到所需源**：字体域名预连接
4. **图片采用新一代格式**：使用 WebP/AVIF（next/image 自动处理）
5. **图片设置显式宽高**：防止 CLS

### Diagnostics（诊断）

1. **最小化主线程工作**：减少 JS 解析/编译时间
2. **减少 JS 执行时间**：代码分割和按需加载
3. **避免巨大的网络负载**：控制首屏资源体积
4. **使用视频格式提供动画内容**（不适用）
5. **避免 DOM 规模过大**：虚拟滚动优化长列表

---

## 4. 优化方向（S2-S7 规划）

| 阶段 | 优化内容 | 目标指标 |
|------|---------|---------|
| S2 | Bundle Analyzer 分析体积 | 找出大依赖 |
| S3 | 图片/字体优化 + CDN 缓存 | LCP |
| S4 | 虚拟滚动（10000 条数据） | INP / 主线程 |
| S5 | 骨架屏 + 宽高兜底 | CLS |
| S6 | useTransition + debounce | INP |
| S7 | 代码分割 + Tree Shaking | 首屏 JS 体积 |

---

## 5. 相关文档

- [bundle-baseline.md](./bundle-baseline.md) — S2 打包体积基线
- [lighthouse-after.md](./lighthouse-after.md) — S8 优化后跑分对比
- [rum-alerting.md](./rum-alerting.md) — S9 RUM 告警规则