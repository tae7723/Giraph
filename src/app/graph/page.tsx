'use client';

import React, { useState, useEffect } from 'react';
import MoodChart from '@/components/MoodChart';
import { moodService, MoodLog, getMoodState } from '@/lib/moodService';
import { TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

export default function GraphPage() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetched = await moodService.getMoodLogs();
        setLogs(fetched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const stats = React.useMemo(() => {
    if (logs.length === 0) return null;

    const scores = logs.map((l) => l.mood_score);
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    return {
      average,
      highest,
      lowest,
      count: logs.length,
    };
  }, [logs]);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-violet-400 bg-violet-950/40 border border-violet-900/30 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <TrendingUp className="w-3 h-3" />
          마음 흐름 분석
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">나의 감정 트렌드</h1>
        <p className="text-xs text-zinc-400">최근 작성하신 기록을 토대로 감정 상태 추이를 보여줍니다.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-3 text-zinc-500">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
          <p className="text-xs font-semibold text-zinc-400">기록 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* Recharts Mood Graph */}
          <MoodChart logs={logs} />

          {/* Emotional Statistics Summary */}
          {stats && (
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                감정 종합 요약
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Average Score */}
                <div className="p-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-zinc-500">평균 감정 점수</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white">{stats.average}</span>
                    <span className="text-xs text-zinc-400">/ 100</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${getMoodState(stats.average).color}`}>
                    {getMoodState(stats.average).label} 상태
                  </span>
                </div>

                {/* Total Counts */}
                <div className="p-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-zinc-500">총 기록 횟수</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white">{stats.count}</span>
                    <span className="text-xs text-zinc-400">회</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                    꾸준한 기록은 큰 힘이 돼요
                  </span>
                </div>

                {/* Highest Score */}
                <div className="p-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-zinc-500">최고 기분</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 select-none flex items-center justify-center">
                      {(() => {
                        const highestMood = getMoodState(stats.highest);
                        return highestMood.emoji.startsWith('/') ? (
                          <img src={highestMood.emoji} alt={highestMood.label} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-3xl">{highestMood.emoji}</span>
                        );
                      })()}
                    </div>
                    <div>
                      <span className="text-xl font-black text-white">{stats.highest}점</span>
                      <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                        <ArrowUpRight className="w-3 h-3" /> Peak
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lowest Score */}
                <div className="p-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-zinc-500">최저 기분</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 select-none flex items-center justify-center">
                      {(() => {
                        const lowestMood = getMoodState(stats.lowest);
                        return lowestMood.emoji.startsWith('/') ? (
                          <img src={lowestMood.emoji} alt={lowestMood.label} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-3xl">{lowestMood.emoji}</span>
                        );
                      })()}
                    </div>
                    <div>
                      <span className="text-xl font-black text-white">{stats.lowest}점</span>
                      <p className="text-[9px] text-rose-400 font-semibold flex items-center gap-0.5 mt-0.5">
                        <ArrowDownRight className="w-3 h-3" /> Bottom
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
