import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { VitalsReport } from './vitals-report';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Team Portal Lite',
  description: '团队内部门户·简易版',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <VitalsReport />
      </body>
    </html>
  );
}