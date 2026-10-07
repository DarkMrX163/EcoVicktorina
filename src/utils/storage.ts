import { LeaderboardEntry, CategoryId, GameMode, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { PLAYER_RANKS } from '../data/districtInfo';

import { saveOnlineLeaderboardEntry } from '../firebase';

const LEADERBOARD_KEY = 'neftegorsk_eco_leaderboard_v1';
const ACHIEVEMENTS_KEY = 'neftegorsk_eco_achievements_v1';
const USER_PROFILE_KEY = 'neftegorsk_eco_user_profile_v1';

const SEED_LEADERBOARD: LeaderboardEntry[] = [];

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Clean out legacy seed IDs if any were present
        const filtered = parsed.filter((item: LeaderboardEntry) => 
          !item.id.startsWith('lead-1') && 
          !item.id.startsWith('lead-2') && 
          !item.id.startsWith('lead-3') && 
          !item.id.startsWith('lead-4') && 
          !item.id.startsWith('lead-5') && 
          !item.id.startsWith('lead-6') && 
          !item.id.startsWith('lead-7') && 
          !item.id.startsWith('lead-8')
        );
        if (filtered.length !== parsed.length) {
          localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(filtered));
        }
        return filtered;
      }
    }
  } catch (e) {
    console.error('Failed to load leaderboard', e);
  }
  return [];
}

export function saveLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    date: new Date().toISOString().split('T')[0],
  };
  
  const updated = [newEntry, ...current].sort((a, b) => b.score - a.score).slice(0, 100);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('leaderboard_updated'));
    }
  } catch (e) {
    console.error('Failed to save entry', e);
  }

  // Asynchronously sync to global Firestore database
  saveOnlineLeaderboardEntry(entry).catch((err) => {
    console.error('Failed to save score to global Firestore:', err);
  });

  return newEntry;
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('leaderboard_updated'));
    }
  } catch (e) {
    console.error('Failed to clear leaderboard', e);
  }
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
