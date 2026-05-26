'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Smile, LineChart, BookOpen, Sparkles, ClipboardList } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: '기록', href: '/', icon: Smile },
  { label: '그래프', href: '/graph', icon: LineChart },
  { label: '분석', href: '/analysis', icon: BookOpen },
  { label: '치유', href: '/help', icon: Sparkles },
  { label: '리포트', href: '/report', icon: ClipboardList },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <nav className="flex items-center justify-around py-3 px-4 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 group py-1 px-3 rounded-2xl transition-all duration-300"
            >
              <div
                className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-400 scale-110 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : 'text-zinc-400 group-hover:text-zinc-200 group-hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight transition-colors duration-300 ${
                  isActive ? 'text-violet-300 font-semibold' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
