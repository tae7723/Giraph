'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { moodService, MoodLog, getMoodState } from '@/lib/moodService';
import { ClipboardList, Lock, Sparkles, Download, CheckSquare, Brain, HelpCircle } from 'lucide-react';

export default function ReportPage() {
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

  const reportData = useMemo(() => {
    if (logs.length < 2) return null;

    // Calculate statistics
    const scores = logs.map((l) => l.mood_score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Categorize feelings
    const feelingCounts: Record<string, number> = {};
    logs.forEach((log) => {
      const state = getMoodState(log.mood_score);
      feelingCounts[state.label] = (feelingCounts[state.label] || 0) + 1;
    });

    const dominantFeeling = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1])[0][0];

    // Formulate personalized recommendations
    let patternText = '';
    let actionPlan: string[] = [];

    if (avgScore <= 40) {
      patternText = '최근 감정 배터리가 바닥나 심리적 피로도가 쌓여 있는 시기입니다. 외부 자극을 차단하고 충분한 개인적 휴식을 보장해야 합니다.';
      actionPlan = [
        '하루 최소 7시간 이상 규칙적인 뇌/몸 수면 확보하기',
        '모든 SNS나 메신저 알림 일시적으로 무음 처리하기',
        '따뜻한 반신욕이나 족욕을 통해 근육 긴장 완화하기',
      ];
    } else if (avgScore <= 70) {
      patternText = '감정의 고저차가 적고 비교적 평온한 균형을 유지하고 있습니다. 현재의 안정적인 리듬을 긍정적인 자기 계발이나 취미로 확장해 보세요.';
      actionPlan = [
        '소소한 성공을 맛볼 수 있는 하루 할 일 3가지 완수하기',
        '미뤄두었던 힐링 도서 읽기 또는 오디오북 감상',
        '주 3회 20분씩 가벼운 근력 운동이나 스트레칭 시도',
      ];
    } else {
      patternText = '긍정적 에너지가 최상으로 충전되어 삶의 몰입도가 매우 높은 활력기입니다. 이 좋은 활기를 주변 사람들과 나누거나 새로운 창의적 도전에 활용해 보세요.';
      actionPlan = [
        '오늘 느낀 소중한 행복의 이유를 한 문장으로 액자에 적어두듯 기록하기',
        '가까운 사람에게 안부를 묻거나 가벼운 고마움 선물 전달하기',
        '새로운 배움이나 프로젝트 계획을 한 단계 실행해 보기',
      ];
    }

    return {
      avgScore,
      dominantFeeling,
      patternText,
      actionPlan,
    };
  }, [logs]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-violet-400 bg-violet-950/40 border border-violet-900/30 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <ClipboardList className="w-3 h-3" />
          정밀 심리 분석
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">앞으로는 이렇게!</h1>
        <p className="text-xs text-zinc-400">축적된 감정 데이터 기반으로 나만을 위한 종합 마인드 솔루션을 제안합니다.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-3 text-zinc-500">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
          <p className="text-xs font-semibold text-zinc-400">데이터 연산 중...</p>
        </div>
      ) : !reportData ? (
        /* Locked Preview State (Requires >= 2 entries) */
        <div className="relative rounded-3xl border border-zinc-800 bg-zinc-900/10 p-6 flex flex-col items-center text-center gap-6 shadow-xl overflow-hidden min-h-[400px] justify-center">
          {/* Glassmorphic Lock Badge */}
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 shadow-lg">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex flex-col gap-2 max-w-xs">
            <h3 className="text-sm font-bold text-white tracking-wide">분석 분석 리포트 잠김</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              심층 마인드 리포트를 생성하려면 <strong>최소 2회 이상</strong>의 오늘 기분 기록이 누적되어야 합니다.
            </p>
            <p className="text-[10px] text-zinc-600">현재 기록 수: {logs.length} / 2</p>
          </div>

          {/* Background Blurred Mock Preview Card */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex items-end justify-center pb-6">
            <a
              href="/"
              className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-500/10 active:scale-95 cursor-pointer"
            >
              오늘 기분 기록하러 가기
            </a>
          </div>
        </div>
      ) : (
        /* Premium Detailed Report State */
        <div className="flex flex-col gap-6">
          {/* Main Summary Panel */}
          <div className="p-6 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-950 border-t-violet-500/20 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">AI 감정 패턴 요약</h3>
            </div>
            
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {reportData.patternText}
            </p>

            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold">주요 감정 분포</span>
                <span className="text-xs font-bold text-zinc-300 mt-0.5">{reportData.dominantFeeling}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 font-bold">평균 웰빙 스코어</span>
                <span className="text-xs font-bold text-violet-400 mt-0.5">{reportData.avgScore}점</span>
              </div>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-violet-400" />
              마음 성장을 위한 실천 가이드
            </h3>

            <ul className="flex flex-col gap-3">
              {reportData.actionPlan.map((action, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 text-xs text-zinc-300"
                >
                  <input
                    type="checkbox"
                    id={`action-${idx}`}
                    className="w-4 h-4 accent-violet-500 border-zinc-700 bg-zinc-800 rounded-md focus:ring-0 cursor-pointer shrink-0 mt-0.5"
                  />
                  <label htmlFor={`action-${idx}`} className="cursor-pointer select-none font-medium leading-relaxed">
                    {action}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Download/Print Action Button */}
          <button
            onClick={handlePrint}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-md active:scale-98 cursor-pointer flex justify-center items-center gap-2"
          >
            <Download className="w-4 h-4 text-violet-400" />
            리포트 인쇄 및 PDF 저장
          </button>
        </div>
      )}
    </div>
  );
}
