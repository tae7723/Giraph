'use client';

import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { MoodLog, getMoodState } from '@/lib/moodService';
import { Calendar, AlertCircle } from 'lucide-react';

const CustomBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || height <= 0) return null;
  const score = payload.mood_score;

  let imgPath = '';
  if (score <= 20) {
    imgPath = '/necks/0~20 neck.png';
  } else if (score <= 40) {
    imgPath = '/necks/20~40 neck.png';
  } else if (score <= 60) {
    imgPath = '/necks/40~60 neck.png';
  } else if (score <= 80) {
    imgPath = '/necks/60~80 neck.png';
  } else {
    imgPath = '/necks/80~100 neck.png';
  }

  return (
    <image
      x={x}
      y={y}
      width={width}
      height={height}
      href={imgPath}
      preserveAspectRatio="none"
    />
  );
};

interface MoodChartProps {
  logs: MoodLog[];
}

type FilterType = '7days' | '30days' | 'all';

export default function MoodChart({ logs }: MoodChartProps) {
  const [filter, setFilter] = useState<FilterType>('7days');

  // Filter logs and sort them chronologically (oldest to newest) for chart plotting
  const filteredData = useMemo(() => {
    const sorted = [...logs].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const now = new Date();
    if (filter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return sorted.filter((log) => new Date(log.created_at) >= sevenDaysAgo);
    } else if (filter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return sorted.filter((log) => new Date(log.created_at) >= thirtyDaysAgo);
    }
    return sorted;
  }, [logs, filter]);

  // Format data for chart
  const chartData = useMemo(() => {
    return filteredData.map((log) => {
      const date = new Date(log.created_at);
      return {
        ...log,
        formattedDate: `${date.getMonth() + 1}/${date.getDate()}`,
        fullDate: date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    });
  }, [filteredData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MoodLog & { fullDate: string };
      const mood = getMoodState(data.mood_score);

      return (
        <div className="p-4 rounded-2xl border border-zinc-700 bg-zinc-950/95 backdrop-blur-md shadow-2xl text-xs max-w-[240px] text-zinc-300">
          <p className="font-semibold text-zinc-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {data.fullDate}
          </p>
          <div className="flex items-center gap-1.5 my-2">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              {mood.emoji.startsWith('/') ? (
                <img src={mood.emoji} alt={mood.label} className="w-7 h-7 object-contain" />
              ) : (
                <span className="text-2xl">{mood.emoji}</span>
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-white">{data.mood_score}점</p>
              <p className={`font-semibold ${mood.color}`}>{mood.label}</p>
            </div>
          </div>
          {data.feeling && (
            <p className="mt-1">
              <span className="text-zinc-500 font-medium">상태: </span>
              {data.feeling}
            </p>
          )}
          {data.reason && (
            <p className="mt-1">
              <span className="text-zinc-500 font-medium">원인: </span>
              {data.reason}
            </p>
          )}
          {data.change_reason && (
            <p className="mt-1">
              <span className="text-zinc-500 font-medium">계기: </span>
              {data.change_reason}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md shadow-xl flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">감정 흐름 곡선</h3>
          <p className="text-xs text-zinc-400">기록된 하루 기분의 변화를 한눈에 관찰해보세요.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex bg-zinc-800/80 p-1 rounded-xl self-stretch sm:self-auto">
          {(
            [
              { id: '7days', label: '7일' },
              { id: '30days', label: '30일' },
              { id: 'all', label: '전체' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`flex-1 sm:flex-none text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-300 ${
                filter === item.id
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis
                dataKey="formattedDate"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#52525b', strokeWidth: 1 }} />
              <ReferenceLine y={50} stroke="#3f3f46" strokeDasharray="5 5" />
              <Bar
                dataKey="mood_score"
                barSize={16}
                shape={<CustomBar />}
              />
              <Area
                type="monotone"
                dataKey="mood_score"
                stroke="#a78bfa"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMood)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-3 text-zinc-500">
            <AlertCircle className="w-10 h-10 text-zinc-600 animate-bounce" />
            <div>
              <p className="font-semibold text-sm text-zinc-400">데이터가 부족합니다</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                기간 내 기분 기록이 없습니다. 먼저 메인 페이지에서 오늘 기분을 기록해 주세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
