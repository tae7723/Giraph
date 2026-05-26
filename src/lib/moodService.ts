import { supabase } from './supabase';

export interface MoodLog {
  id: string;
  user_id?: string;
  mood_score: number;
  feeling: string;
  reason: string;
  change_reason: string;
  created_at: string;
}

export interface MoodState {
  emoji: string;
  label: string;
  color: string;
  gradient: string;
  description: string;
  accentColor?: string;
}

export const getMoodState = (score: number): MoodState & { accentColor: string } => {
  if (score <= 20) {
    return {
      emoji: '/emojis/0~20.png',
      label: '우울함/힘듦',
      color: 'text-rose-500',
      gradient: 'from-rose-600/30 to-orange-600/10',
      description: '마음이 많이 가라앉고 힘들어요. 위로가 필요해요.',
      accentColor: 'bg-rose-500/20 text-rose-300',
    };
  }
  if (score <= 40) {
    return {
      emoji: '/emojis/20~40.png',
      label: '답답함/지침',
      color: 'text-orange-400',
      gradient: 'from-orange-500/30 to-amber-500/10',
      description: '몸과 마음이 무겁고 조금 피곤해요.',
      accentColor: 'bg-orange-500/20 text-orange-300',
    };
  }
  if (score <= 60) {
    return {
      emoji: '/emojis/40~60.png',
      label: '보통/평온',
      color: 'text-amber-400',
      gradient: 'from-amber-500/20 to-teal-500/10',
      description: '크게 특별할 것 없는 잔잔하고 무난한 하루예요.',
      accentColor: 'bg-amber-500/20 text-amber-300',
    };
  }
  if (score <= 80) {
    return {
      emoji: '/emojis/60~80.png',
      label: '좋음/만족',
      color: 'text-emerald-400',
      gradient: 'from-emerald-500/30 to-cyan-500/10',
      description: '기분 좋은 에너지가 돌며 전반적으로 편안해요.',
      accentColor: 'bg-emerald-500/20 text-emerald-300',
    };
  }
  return {
    emoji: '/emojis/80~100.png',
    label: '최고/행복',
    color: 'text-violet-400',
    gradient: 'from-violet-500/40 to-fuchsia-500/15',
    description: '더할 나위 없이 행복하고 기분이 날아갈 것 같아요!',
    accentColor: 'bg-violet-500/20 text-violet-300',
  };
};

const STORAGE_KEY = 'mood_logs_local';

const defaultSeedLogs: MoodLog[] = [
  { id: 's1', mood_score: 35, feeling: '하루 종일 몸이 무겁고 피곤함', reason: '과도한 프로젝트 업무와 야근', change_reason: '따뜻한 차를 마시며 명상함', created_at: '2026-04-20T11:00:00Z' },
  { id: 's2', mood_score: 50, feeling: '평범하고 무난한 월요일', reason: '특별한 일 없이 일상적인 코딩 진행', change_reason: '동료들과 가벼운 수다', created_at: '2026-04-21T12:30:00Z' },
  { id: 's3', mood_score: 75, feeling: '기분 좋고 에너지가 넘침', reason: '친구와 오랜만에 저녁 약속을 잡음', change_reason: '맛있는 음식을 먹으며 힐링', created_at: '2026-04-22T19:00:00Z' },
  { id: 's4', mood_score: 60, feeling: '차분하고 편안한 상태', reason: '비가 내려서 집에서 음악을 들음', change_reason: '조용한 재즈 플레이리스트', created_at: '2026-04-23T15:00:00Z' },
  { id: 's5', mood_score: 40, feeling: '몸이 지치고 약간 답답함', reason: '갑작스러운 요구사항 변경으로 삽질', change_reason: '초콜릿을 먹으며 단것 보충', created_at: '2026-04-24T18:20:00Z' },
  { id: 's6', mood_score: 85, feeling: '매우 행복하고 뿌듯함', reason: '한 주간의 목표 기능을 모두 완성함', change_reason: '주말이 시작되어 해방감', created_at: '2026-04-25T17:00:00Z' },
  { id: 's7', mood_score: 90, feeling: '기분이 날아갈 것 같음', reason: '가족들과 근교로 드라이브를 다녀옴', change_reason: '시원한 바람과 맛있는 식사', created_at: '2026-04-26T14:15:00Z' },
  { id: 's8', mood_score: 55, feeling: '월요병 때문에 약간 무기력함', reason: '다시 시작된 월요일 업무 회의', change_reason: '달달한 바닐라 라떼 수혈', created_at: '2026-04-27T09:30:00Z' },
  { id: 's9', mood_score: 65, feeling: '집중이 잘 되고 뿌듯함', reason: '오전 중에 밀린 할 일들을 속전속결 처리', change_reason: '뿌듯함에 기분이 한층 좋아짐', created_at: '2026-04-28T16:00:00Z' },
  { id: 's10', mood_score: 30, feeling: '두통이 있고 피곤함', reason: '환절기 감기 기운 때문에 컨디션 난조', change_reason: '약 먹고 일찍 누워서 휴식', created_at: '2026-04-29T21:00:00Z' },
  { id: 's11', mood_score: 45, feeling: '그저 그렇고 조금 나른함', reason: '날씨가 우중충해서 몸이 안 움직임', change_reason: '가벼운 스트레칭으로 순환', created_at: '2026-04-30T14:00:00Z' },
  { id: 's12', mood_score: 70, feeling: '만족스럽고 여유로움', reason: '오랜만에 서점에 가서 마음에 드는 책을 삼', change_reason: '카페에서 독서 타임', created_at: '2026-05-01T15:45:00Z' },
  { id: 's13', mood_score: 80, feeling: '신나고 즐거움', reason: '주말을 맞아 친구들과 보드게임을 함', change_reason: '배꼽 잡고 웃으며 스트레스 해소', created_at: '2026-05-02T19:30:00Z' },
  { id: 's14', mood_score: 60, feeling: '평화롭고 고요함', reason: '늦잠을 자고 일어나 집 청소를 마침', change_reason: '깨끗해진 방을 보며 개운함', created_at: '2026-05-03T11:00:00Z' },
  { id: 's15', mood_score: 48, feeling: '회사 일로 약간 스트레스', reason: '회의 일정이 길어져 머리가 복잡함', change_reason: '저녁에 한강 산책 30분', created_at: '2026-05-04T18:00:00Z' },
  { id: 's16', mood_score: 52, feeling: '잔잔한 기분', reason: '오후 업무가 생각보다 일찍 끝남', change_reason: '퇴근길 노을 감상하며 힐링', created_at: '2026-05-05T17:40:00Z' },
  { id: 's17', mood_score: 20, feeling: '의욕이 없고 많이 우울함', reason: '사소한 일로 친한 사람과 갈등이 생김', change_reason: '속상한 마음을 일기에 솔직하게 기록', created_at: '2026-05-06T20:10:00Z' },
  { id: 's18', mood_score: 38, feeling: '마음이 복잡하고 지침', reason: '미래에 대한 걱정이 불쑥 찾아옴', change_reason: '따뜻한 우유를 마시고 명상 음악 청취', created_at: '2026-05-07T22:00:00Z' },
  { id: 's19', mood_score: 55, feeling: '조금씩 나아지는 상태', reason: '상대방과 솔직하게 대화하여 오해를 풂', change_reason: '마음의 짐이 덜어져 안도함', created_at: '2026-05-08T15:30:00Z' },
  { id: 's20', mood_score: 75, feeling: '성취감이 들고 가벼움', reason: '까다로운 버그를 하루 종일 붙잡아 드디어 해결', change_reason: '유튜브 코딩 힐링 영상 시청', created_at: '2026-05-09T18:50:00Z' },
  { id: 's21', mood_score: 85, feeling: '매우 기쁘고 기분 좋음', reason: '부모님 생신을 맞아 맛있는 케이크를 선물함', change_reason: '고맙다는 말씀에 마음이 훈훈함', created_at: '2026-05-10T13:00:00Z' },
  { id: 's22', mood_score: 62, feeling: '차분한 기분', reason: '다시 힘내서 다음 한 주를 기획함', change_reason: '다이어리에 이달의 목표 작성', created_at: '2026-05-11T19:15:00Z' },
  { id: 's23', mood_score: 50, feeling: '적당히 평온한 일상', reason: '회사 업무 루틴대로 성실하게 보냄', change_reason: '유튜브 숏츠 보며 가벼운 웃음', created_at: '2026-05-12T16:30:00Z' },
  { id: 's24', mood_score: 40, feeling: '피로가 누적된 상태', reason: '잠을 깊게 자지 못해 오전 내내 헤맴', change_reason: '낮잠 20분을 자며 충전', created_at: '2026-05-13T13:00:00Z' },
  { id: 's25', mood_score: 68, feeling: '기분이 한결 상쾌함', reason: '저녁에 헬스장에 가서 땀을 흘리며 운동함', change_reason: '운동 후 개운한 샤워', created_at: '2026-05-14T21:00:00Z' },
  { id: 's26', mood_score: 72, feeling: '마음이 든든함', reason: '멘토링 세션에서 긍정적인 피드백을 받음', change_reason: '더 잘해봐야겠다는 동기부여', created_at: '2026-05-15T15:20:00Z' },
  { id: 's27', mood_score: 95, feeling: '인생이 행복하고 활력 넘침', reason: '해커톤 팀 매칭이 성공적으로 완료됨', change_reason: '팀원들과 대화가 너무 잘 통함', created_at: '2026-05-16T17:50:00Z' },
  { id: 's28', mood_score: 80, feeling: '편안하고 충만함', reason: '주말을 맞아 캠핑을 다녀옴', change_reason: '불멍을 하며 일상 속 스트레스 아웃', created_at: '2026-05-17T12:00:00Z' },
  { id: 's29', mood_score: 58, feeling: '월요일 복귀 준비 완료', reason: '집에서 푹 쉬면서 맛있는 집밥을 먹음', change_reason: '좋아하는 넷플릭스 드라마 몰아보기', created_at: '2026-05-18T20:30:00Z' },
  { id: 's30', mood_score: 70, feeling: '오늘은 아주 기분 좋은 날', reason: '새로운 기능 구현이 빠르게 끝나서 정시 퇴근', change_reason: '치맥으로 하루를 맛있게 마무리', created_at: '2026-05-19T18:10:00Z' }
];

const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!supabase &&
    !!url &&
    url !== 'your_supabase_project_url' &&
    url !== '' &&
    !!key &&
    key !== 'your_supabase_anon_key' &&
    key !== ''
  );
};

// Local storage helpers
const getLocalLogs = (): MoodLog[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // If local storage is empty, auto-seed with default logs so graph & reports look amazing immediately!
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedLogs));
    return defaultSeedLogs;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedLogs));
      return defaultSeedLogs;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse local mood logs', e);
    return [];
  }
};

const saveLocalLogs = (logs: MoodLog[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

export const moodService = {
  async getMoodLogs(): Promise<MoodLog[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('mood_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          // If Supabase has 0 logs, we can suggest seeding or fallback, but for now we just return empty list.
          return data as MoodLog[];
        }
      } catch (e) {
        console.error('Supabase query failed, falling back to localStorage:', e);
      }
    }

    // Fallback to localStorage
    return getLocalLogs().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async addMoodLog(log: Omit<MoodLog, 'id' | 'created_at'>): Promise<MoodLog> {
    const newLog: MoodLog = {
      ...log,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('mood_logs')
          .insert([newLog])
          .select();

        if (error) throw error;
        if (data && data[0]) return data[0] as MoodLog;
      } catch (e) {
        console.error('Supabase insert failed, saving to localStorage:', e);
      }
    }

    // Fallback to localStorage
    const localLogs = getLocalLogs();
    localLogs.push(newLog);
    saveLocalLogs(localLogs);
    return newLog;
  },

  async deleteMoodLog(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('mood_logs')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (e) {
        console.error('Supabase delete failed, applying to localStorage:', e);
      }
    }

    // Fallback to localStorage
    const localLogs = getLocalLogs();
    const filtered = localLogs.filter((log) => log.id !== id);
    saveLocalLogs(filtered);
    return true;
  },

  isDemoMode(): boolean {
    return !isSupabaseConfigured();
  },

  // Helper method if the user wants to force-import mock data to Supabase
  async seedSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      // Map seed logs to remove ID so Supabase generates UUID
      const mapped = defaultSeedLogs.map(({ mood_score, feeling, reason, change_reason, created_at }) => ({
        mood_score,
        feeling,
        reason,
        change_reason,
        created_at
      }));

      const { error } = await supabase
        .from('mood_logs')
        .insert(mapped);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to seed Supabase database:', e);
      return false;
    }
  }
};
