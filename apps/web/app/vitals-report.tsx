'use client';

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * 上报单个性能指标到 /api/vitals
 * 使用 navigator.sendBeacon 确保页面卸载时也能可靠发送
 * （INP 在用户离开页面时才最终确定，sendBeacon 是最可靠的方式）
 */
function sendVitals(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // 优先使用 sendBeacon，页面卸载时也能发出
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/vitals', blob);
  } else {
    // 降级到 fetch（keepalive 确保卸载时发送）
    fetch('/api/vitals', {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {
      // 静默失败，不影响用户体验
    });
  }
}

/**
 * RUM 客户端上报组件
 * 监听 LCP / INP / CLS / FCP / TTFB 五项核心指标
 * 放在 apps/web 中（依赖浏览器 API 和后端接口），不放入 packages/
 */
export function VitalsReport() {
  // 使用 Next.js 内置的 useReportWebVitals（基于 web-vitals 库）
  // 它会自动监听所有 Core Web Vitals 并在指标更新时回调
  useReportWebVitals((metric) => {
    sendVitals(metric);
  });

  // 同时直接使用 web-vitals 库注册监听，确保 INP 等指标被捕获
  // useReportWebVitals 在某些 Next.js 版本中可能不包含 INP
  if (typeof window !== 'undefined') {
    onLCP(sendVitals);
    onINP(sendVitals);
    onCLS(sendVitals);
    onFCP(sendVitals);
    onTTFB(sendVitals);
  }

  // 该组件不渲染任何 UI
  return null;
}