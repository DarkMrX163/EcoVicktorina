import { LeaderboardEntry, CategoryId, GameMode, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { PLAYER_RANKS } from '../data/districtInfo';

const LEADERBOARD_KEY = 'neftegorsk_eco_leaderboard_v1';
const ACHIEVEMENTS_KEY = 'neftegorsk_eco_achievements_v1';
const USER_PROFILE_KEY = 'neftegorsk_eco_user_profile_v1';

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    playerName: 'Алексей Смирнов',
    settlement: 'г. Нефтегорск',
    score: 2950,
    correctPercentage: 95,
    category: 'all',
    mode: 'marathon',
    date: '2026-09-18',
    rankTitle: 'Главный общественный эко-инспектор Нефтегорского района',
  },
  {
    id: 'lead-2',
    playerName: 'Елена Кузнецова',
    settlement: 'с. Утёвка',
    score: 2780,
    correctPercentage: 90,
    category: 'tko',
    mode: 'category',
    date: '2026-09-19',
    rankTitle: 'Мастер ресурсосбережения',
  },
  {
    id: 'lead-3',
    playerName: 'Дмитрий Волков',
    settlement: 'с. Бариновка',
    score: 2640,
    correctPercentage: 85,
    category: 'nature_neftegorsk',
    mode: 'category',
    date: '2026-09-20',
    rankTitle: 'Мастер ресурсосбережения',
  },
  {
    id: 'lead-4',
    playerName: 'Мария Васильева',
    settlement: 'с. Богдановка',
    score: 2450,
    correctPercentage: 80,
    category: 'water',
    mode: 'category',
    date: '2026-09-20',
    rankTitle: 'Мастер ресурсосбережения',
  },
  {
    id: 'lead-5',
    playerName: 'Иван Морозов',
    settlement: 'с. Кулешовка',
    score: 2280,
    correctPercentage: 80,
    category: 'water',
    mode: 'category',
    date: '2026-09-21',
    rankTitle: 'Мастер ресурсосбережения',
  },
  {
    id: 'lead-6',
    playerName: 'Анна Соколова',
    settlement: 'п. Ветлянка',
    score: 1980,
    correctPercentage: 75,
    category: 'water',
    mode: 'category',
    date: '2026-09-21',
    rankTitle: 'Знаток экологии Нефтегорска',
  },
  {
    id: 'lead-7',
    playerName: 'Сергей Попов',
    settlement: 'с. Зуевка',
    score: 1850,
    correctPercentage: 70,
    category: 'tko',
    mode: 'category',
    date: '2026-09-22',
    rankTitle: 'Знаток экологии Нефтегорска',
  },
  {
    id: 'lead-8',
    playerName: 'Татьяна Федорова',
    settlement: 'с. Дмитриевка',
    score: 1620,
    correctPercentage: 65,
    category: 'nature_neftegorsk',
    mode: 'category',
    date: '2026-09-22',
    rankTitle: 'Знаток экологии Нефтегорска',
  },
];

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load leaderboard', e);
  }
  return SEED_LEADERBOARD;
}

export function saveLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: 'lead-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
  };
  
  const updated = [newEntry, ...current].sort((a, b) => b.score - a.score).slice(0, 50);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save entry', e);
  }
  return newEntry;
}

export function getRankForScore(score: number) {
  for (let i = PLAYER_RANKS.length - 1; i >= 0; i--) {
    if (score >= PLAYER_RANKS[i].minScore) {
      return PLAYER_RANKS[i];
    }
  }
  return PLAYER_RANKS[0];
}

export function getUserProfile(): { name: string; settlement: string } {
  try {
    const saved = localStorage.getItem(USER_PROFILE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return { name: '', settlement: 'г. Нефтегорск' };
}

export function saveUserProfile(profile: { name: string; settlement: string }) {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getAchievements(): Achievement[] {
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      const parsed: Achievement[] = JSON.parse(saved);
      return INITIAL_ACHIEVEMENTS.map((item) => {
        const found = parsed.find((p) => p.id === item.id);
        return found ? { ...item, unlocked: found.unlocked } : item;
      });
    }
  } catch {
    // fallback
  }
  return INITIAL_ACHIEVEMENTS;
}

export function unlockAchievement(achievementId: string): boolean {
  try {
    const current = getAchievements();
    let justUnlocked = false;
    const updated = current.map((item) => {
      if (item.id === achievementId && !item.unlocked) {
        justUnlocked = true;
        return { ...item, unlocked: true };
      }
      return item;
    });
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
    return justUnlocked;
  } catch {
    return false;
  }
}
