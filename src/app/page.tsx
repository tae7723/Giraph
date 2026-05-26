'use client';

import React, { useState, useEffect } from 'react';
import MoodSlider from '@/components/MoodSlider';
import { moodService, MoodLog, getMoodState } from '@/lib/moodService';
import { Sparkles, Calendar, BookOpen, Trash2, CheckCircle, Database, ChevronDown, ChevronUp, ChevronsDown } from 'lucide-react';

export default function Home() {
  const [moodScore, setMoodScore] = useState(50);
  const [feeling, setFeeling] = useState('');
  const [reason, setReason] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [allLogs, setAllLogs] = useState<MoodLog[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [moreClicks, setMoreClicks] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const formattedDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  useEffect(() => {
    setIsDemo(moodService.isDemoMode());
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const logs = await moodService.getMoodLogs();
      setAllLogs(logs);
    } catch (e) {
      console.error(e);
    }
  };

  const renderedLogs = allLogs.slice(0, visibleCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await moodService.addMoodLog({
        mood_score: moodScore,
        feeling,
        reason,
        change_reason: changeReason,
      });

      setSubmitSuccess(true);
      // Reset form
      setFeeling('');
      setReason('');
      setChangeReason('');
      setMoodScore(50);

      // Refresh recent logs
      fetchLogs();

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      await moodService.deleteMoodLog(id);
      fetchLogs();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-violet-400 bg-violet-950/40 border border-violet-900/30 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3 h-3" />
            오늘의 기분 상태 기록
          </span>
          {isDemo && (
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 border border-zinc-700/50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Database className="w-2.5 h-2.5" />
              로컬 저장소 작동 중
            </span>
          )}
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">오늘 하루 어땠나요?</h1>
        <p className="text-xs text-zinc-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          {formattedDate}
        </p>
      </div>

      {/* Mood Entry Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Slider component */}
        <MoodSlider value={moodScore} onChange={setMoodScore} />

        {/* Detailed inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">오늘 어떤 기분이었나요?</label>
            <textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="예: 조금 들뜨기도 하고, 몸은 조금 나른했어요."
              rows={2}
              required
              className="w-full px-4 py-3 text-xs rounded-2xl border border-zinc-800 bg-zinc-900/30 focus:outline-none focus:border-violet-500 text-zinc-100 placeholder-zinc-600 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">기분의 주된 원인이 무엇이었나요?</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="예: 오랜만에 친구와 통화해서 좋았어요 / 과제가 많아서 스트레스 받았어요."
              rows={2}
              required
              className="w-full px-4 py-3 text-xs rounded-2xl border border-zinc-800 bg-zinc-900/30 focus:outline-none focus:border-violet-500 text-zinc-100 placeholder-zinc-600 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">기분 변화의 계기나 전환점이 있었나요?</label>
            <textarea
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="예: 저녁에 맛있는 떡볶이를 먹으면서 기분이 한결 나아졌어요."
              rows={2}
              className="w-full px-4 py-3 text-xs rounded-2xl border border-zinc-800 bg-zinc-900/30 focus:outline-none focus:border-violet-500 text-zinc-100 placeholder-zinc-600 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all duration-300 shadow-lg shadow-violet-500/20 active:scale-98 cursor-pointer flex justify-center items-center gap-2"
        >
          {isSubmitting ? '기록을 저장하고 있어요...' : '오늘 하루 기록 완료하기'}
        </button>

        {submitSuccess && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 animate-pulse text-xs font-medium">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>오늘의 기분이 정상적으로 저장되었습니다!</span>
          </div>
        )}
      </form>

      {/* Recent Records list */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-violet-400" />
          최근 기록한 나의 하루
        </h3>

        {renderedLogs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {renderedLogs.map((log) => {
              const mood = getMoodState(log.mood_score);
              const date = new Date(log.created_at);
              const formattedLogDate = `${date.getMonth() + 1}/${date.getDate()} ${date.toLocaleDateString(
                'ko-KR',
                { weekday: 'short' }
              )}`;

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm flex items-start justify-between gap-4 transition-all duration-300 hover:border-zinc-700"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 select-none shrink-0 flex items-center justify-center">
                      {mood.emoji.startsWith('/') ? (
                        <img src={mood.emoji} alt={mood.label} className="w-9 h-9 object-contain" />
                      ) : (
                        <span className="text-3xl">{mood.emoji}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{formattedLogDate}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mood.accentColor}`}>
                          {log.mood_score}점
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium line-clamp-1">{log.feeling}</p>
                      <p className="text-[10px] text-zinc-500 line-clamp-1">원인: {log.reason}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-1 text-zinc-600 hover:text-rose-400 transition-colors self-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {allLogs.length > 3 && (
              <div className="flex justify-center gap-3 mt-2">
                {/* Hide More Button */}
                {visibleCount > 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      setVisibleCount(3);
                      setMoreClicks(0);
                    }}
                    className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    더보기 숨기기
                  </button>
                )}

                {/* Show More / Show All Button */}
                {visibleCount < allLogs.length && (
                  moreClicks < 2 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleCount((prev) => prev + 3);
                        setMoreClicks((prev) => prev + 1);
                      }}
                      className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                      3개 더보기
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleCount(allLogs.length);
                      }}
                      className="px-4 py-2 rounded-xl border border-violet-900/40 bg-violet-950/20 hover:bg-violet-900/20 text-violet-300 hover:text-violet-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <ChevronsDown className="w-3.5 h-3.5" />
                      전체 더보기
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-xs">
            아직 기록이 없습니다. 오늘 하루를 첫 기록으로 채워보세요!
          </div>
        )}
      </div>
    </div>
  );
}
