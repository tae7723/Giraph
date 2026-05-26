'use client';

import React, { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { Sparkles, HeartPulse, ShieldAlert, Play, Pause, RefreshCw } from 'lucide-react';

type BreathingState = 'idle' | 'inhale' | 'hold' | 'exhale';

export default function HelpPage() {
  const [breathingState, setBreathingState] = useState<BreathingState>('idle');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (breathingState === 'idle') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Change state when countdown ends
          setBreathingState((curr) => {
            if (curr === 'inhale') return 'hold';
            if (curr === 'hold') return 'exhale';
            return 'inhale'; // loop from exhale back to inhale
          });
          return 4; // Reset to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingState]);

  const handleStartBreathing = () => {
    setBreathingState('inhale');
    setCountdown(4);
  };

  const handleStopBreathing = () => {
    setBreathingState('idle');
    setCountdown(4);
  };

  const getBreathingLabel = () => {
    switch (breathingState) {
      case 'inhale':
        return '숨을 깊게 들이쉬세요 (Inhale)';
      case 'hold':
        return '숨을 잠시 멈추세요 (Hold)';
      case 'exhale':
        return '숨을 천천히 내쉬세요 (Exhale)';
      default:
        return '마음의 평온을 돕는 4초 호흡법';
    }
  };

  const getBreathingColor = () => {
    switch (breathingState) {
      case 'inhale':
        return 'bg-teal-500/20 border-teal-400 scale-[1.3] shadow-[0_0_40px_rgba(20,184,166,0.3)]';
      case 'hold':
        return 'bg-violet-500/20 border-violet-400 scale-[1.3] shadow-[0_0_40px_rgba(139,92,246,0.3)]';
      case 'exhale':
        return 'bg-rose-500/20 border-rose-400 scale-[0.8] shadow-[0_0_40px_rgba(244,63,94,0.1)]';
      default:
        return 'bg-zinc-900/60 border-zinc-800 scale-100';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-violet-400 bg-violet-950/40 border border-violet-900/30 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <HeartPulse className="w-3 h-3" />
          마음 치유 센터
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">지금 힘들다면</h1>
        <p className="text-xs text-zinc-400">마음이 버거울 때, 4초 호흡과 AI 챗봇이 당신의 평온을 찾아드립니다.</p>
      </div>

      {/* 4-Second Breathing Exercise */}
      <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md flex flex-col items-center gap-5 shadow-xl">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 self-start">
          <RefreshCw className={`w-4 h-4 text-violet-400 ${breathingState !== 'idle' ? 'animate-spin' : ''}`} />
          4초 마인드 호흡 가이드
        </h3>

        {/* Breathing Circle */}
        <div className="h-40 flex items-center justify-center my-2 relative">
          <div
            className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out ${getBreathingColor()}`}
          >
            {breathingState !== 'idle' ? (
              <div className="text-center animate-fade-in">
                <span className="text-2xl font-black text-white">{countdown}</span>
                <p className="text-[8px] text-zinc-400 font-bold tracking-wider mt-1 uppercase">{breathingState}</p>
              </div>
            ) : (
              <HeartPulse className="w-10 h-10 text-zinc-600 animate-pulse" />
            )}
          </div>
        </div>

        {/* Subtext */}
        <div className="text-center flex flex-col gap-1">
          <p className="text-xs font-bold text-zinc-200 transition-colors duration-300">{getBreathingLabel()}</p>
          <p className="text-[10px] text-zinc-500">불안감과 분노를 완화하고 신경계를 조절하는 간단하고 검증된 호흡 방식입니다.</p>
        </div>

        {/* Action button */}
        {breathingState === 'idle' ? (
          <button
            onClick={handleStartBreathing}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 shadow-lg shadow-violet-500/10 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            호흡 가이드 시작하기
          </button>
        ) : (
          <button
            onClick={handleStopBreathing}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 border border-zinc-700 active:scale-95 transition-all cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            호흡 멈추기
          </button>
        )}
      </div>

      {/* AI Chatbot Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-violet-400" />
          AI 마음 치유 대화
        </h3>
        <ChatInterface />
      </div>
    </div>
  );
}
