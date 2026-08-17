const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@team-portal-lite/ui', '@team-portal-lite/lib', '@team-portal-lite/features'],
  images: {
    // 允许的远程图片域名（CDN）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 图片缓存时间（秒），建议 60 秒以上
    minimumCacheTTL: 3600,
  },
  // 静态资源长期缓存
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);