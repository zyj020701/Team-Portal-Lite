import { NextResponse } from 'next/server';

/**
 * RUM 性能数据上报接口
 * 接收 web-vitals 采集的 LCP/INP/CLS/FCP/TTFB 指标
 * 教学项目：打印到服务端控制台，暂不接入数据库
 */

interface VitalsPayload {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  navigationType: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VitalsPayload;

    const { name, value, rating, id, navigationType } = body;

    // 服务端控制台打印收到的性能数据
    console.log('[Web Vitals]', {
      name,
      value: typeof value === 'number' ? value.toFixed(2) : value,
      rating,
      id,
      navigationType,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[Web Vitals] Failed to parse payload:', error);
    return NextResponse.json(
      { ok: false, error: 'Invalid payload' },
      { status: 400 }
    );
  }
}