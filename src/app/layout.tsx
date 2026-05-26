import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'MindFlow - 기분 기록 & 마인드케어',
  description: '당신의 매일 기분을 기록하고 시각화하며 AI 기반의 마인드케어 분석 리포트를 제공하는 서비스입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} h-full dark`}>
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {/* Glow Effects in the background */}
        <div className="fixed top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none" />

        {/* Premium Mobile Frame */}
        <div className="relative w-full max-w-md h-full min-h-screen sm:min-h-[840px] sm:max-h-[900px] flex flex-col bg-zinc-950 border-0 sm:border border-zinc-900 sm:rounded-[40px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Inner Content Area */}
          <main className="flex-1 overflow-y-auto px-6 pt-8 pb-32 flex flex-col no-scrollbar">
            {children}
          </main>

          {/* Bottom Floating Navigation */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
