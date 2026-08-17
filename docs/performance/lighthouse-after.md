# Lighthouse 优化后跑分报告（S8）

> 跑分日期：2026-08-14
> 跑分环境：Windows 11 + Microsoft Edge，Mobile 模拟（412×823, DPR 1.75）
> 网络节流：Slow 4G（RTT 150ms, 吞吐量 1638.4 Kbps, CPU 4x slowdown）
> 运行模式：**生产模式**（`next build` + `next start`）
> 跑分工具：Lighthouse 13.4.1（通过 chrome-launcher 自动化）

---

## 一、优化后跑分结果

| 指标 | 数值 | 评分 | 是否达标 | 阈值 |
|------|------|------|----------|------|
| **Performance 总分** | **99 / 100** | — | ✅ | > 90 |
| **LCP**（最大内容绘制） | **2.1 s** | 0.95 | ✅ | < 2.5 s |
| **FCP**（首次内容绘制） | 0.8 s | 1.00 | ✅ | < 1.8 s |
| **TBT**（总阻塞时间，INP 实验室代理） | **60 ms** | 1.00 | ✅ | < 200 ms |
| **CLS**（累积布局偏移） | **0.007** | 1.00 | ✅ | < 0.1 |
| **SI**（速度指数） | 0.9 s | 1.00 | ✅ | < 3.4 s |

---

## 二、优化前后对比

| 指标 | S1 基线（开发模式） | S8 优化后（生产模式） | 提升幅度 |
|------|---------------------|----------------------|----------|
| Performance 总分 | ~60-70（dev 模式无优化） | **99** | ↑ ~30-40 分 |
| LCP | 未精确记录（dev 模式较慢） | **2.1 s** | ✅ 达标 |
| CLS | 未精确记录 | **0.007** | ✅ 接近零偏移 |
| TBT（INP 代理） | 未精确记录 | **60 ms** | ✅ 极低阻塞 |
| 首屏 JS（First Load JS） | 未记录 | **127 kB**（gzip 前） | ✅ < 200 KB |

> **说明**：S1 基线在开发模式（`pnpm dev`）下建立，开发模式无代码压缩、Tree Shaking 和缓存优化，与生产模式差异较大。本次 S8 在生产模式下跑分，所有优化（S3-S7）均已生效。

---

## 三、S3-S7 优化措施回顾

### S3：LCP 优化
- 所有 `<img>` 替换为 `next/image`，全局搜索确认数量为 **0**
- 字体通过 `next/font` 加载，配置 `display: 'swap'`，无 `@font-face`
- 静态资源配置 `Cache-Control: public, max-age=31536000, immutable`
- 图片配置 `minimumCacheTTL: 60`

### S4：虚拟滚动
- 10000 条待办数据，DOM 只渲染可见区域约 20-30 个元素
- 使用 `@tanstack/react-virtual`，滚动容器固定高度 600px

### S5：CLS 优化
- 所有 `<Image>` 组件有明确宽高或 `fill` + 固定尺寸父容器
- 头像组件 size 属性映射到明确像素值（sm=32, md=40, lg=56）
- 公告列表骨架屏与真实卡片使用完全一致的 Tailwind 类名
- 字体配置 `display: 'swap'`

### S6：INP 优化
- 待办筛选使用 `useTransition`，筛选标记为低优先级
- `useDebounce` Hook（200ms）应用于搜索框
- 虚拟列表行渲染使用 `useMemo` 缓存

### S7：Bundle 优化
- 虚拟列表使用 `dynamic(() => import(...), { ssr: false })`
- 所有 `packages/` 包配置 `"sideEffects": false`
- 全程 ESM import，无 `require()` 混用
- 首屏 First Load JS：**127 kB**（< 200 KB 目标）

---

## 四、构建产物详情

```
Route (app)                              Size     First Load JS
┌ ○ /                                    16.6 kB         127 kB
├ ○ /_not-found                          873 B          88.2 kB
└ ○ /todos                               3.81 kB         114 kB
+ First Load JS shared by all            87.4 kB
  ├ chunks/643-264a84503e45e6e8.js       31.7 kB
  ├ chunks/cd474246-c09720aaef2ec8a4.js  53.6 kB
  └ other shared chunks (total)          1.99 kB
```

- 首页 First Load JS：**127 kB** ✅（< 200 KB）
- `/todos` 页面因虚拟列表动态加载，First Load JS 仅 **114 kB**
- 所有路由均为静态预渲染（○ Static）

---

## 五、验收结论

| 验收项 | 标准 | 实际 | 结果 |
|--------|------|------|------|
| 生产构建成功 | `pnpm build` 无报错 | ✓ Compiled successfully | ✅ |
| `pnpm start` 正常运行 | Ready in 1310ms | http://localhost:3000 | ✅ |
| LCP | < 2.5 s | 2.1 s | ✅ |
| INP（TBT 代理） | < 200 ms | 60 ms | ✅ |
| CLS | < 0.1 | 0.007 | ✅ |
| Performance 总分 | > 90 | 99 | ✅ |
| 原生 `<img>` 数量 | 0 | 0 | ✅ |
| `@font-face` 数量 | 0 | 0 | ✅ |

**所有指标均达标，S8 阶段完成。**

---

## 六、后续建议

1. **接入 RUM（S9）**：Lighthouse 是实验室数据，需通过 `web-vitals` 采集真实用户数据，关注 P75/P95。
2. **LCP 仍有优化空间**：当前 2.1s 接近 2.5s 阈值，可考虑：
   - 为 LCP 候选元素添加 `priority` 属性
   - 检查是否有阻塞渲染的第三方脚本
3. **持续监控**：每次发版前跑一次 Lighthouse，建立性能预算（Performance Budget）。