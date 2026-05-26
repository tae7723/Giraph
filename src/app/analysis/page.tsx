'use client';

import React from 'react';
import AnalysisCard from '@/components/AnalysisCard';
import { BookOpen, CheckCircle, Info } from 'lucide-react';

export default function AnalysisPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-violet-400 bg-violet-950/40 border border-violet-900/30 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <BookOpen className="w-3 h-3" />
          마인드 처방 카드 뉴스
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">감정별 셀프 케어</h1>
        <p className="text-xs text-zinc-400">각 감정에 알맞은 대처법과 마음 챙김 팁을 카드로 만나보세요.</p>
      </div>

      {/* Analysis Card News Carousel */}
      <div className="flex flex-col items-center justify-center">
        <AnalysisCard />
      </div>

      {/* Helpful details / Info Box */}
      <div className="p-5 rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm flex flex-col gap-3 mt-2">
        <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-violet-400 shrink-0" />
          감정 처방전은 어떻게 활용하나요?
        </h4>
        <div className="flex flex-col gap-2 text-[11px] text-zinc-400 leading-relaxed font-medium">
          <div className="flex gap-2">
            <span className="text-violet-400 mt-0.5 shrink-0">✦</span>
            <p>
              슬프거나 불안할 때 카드의 좌우 화살표를 눌러 <strong>나에게 맞는 처방</strong>을 찾아봅니다.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-violet-400 mt-0.5 shrink-0">✦</span>
            <p>
              제안된 행동 중 <strong>당장 실천할 수 있는 한 가지</strong>를 정해 작게 시도해 봅니다.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-violet-400 mt-0.5 shrink-0">✦</span>
            <p>
              행동한 후 기분이 5점이라도 나아졌다면, 메인 기록 창의 <strong>&quot;기분 변화 계기&quot;</strong>에 메모해 보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
