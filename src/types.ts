/**
 * Types and interfaces for the Neftegorsky District Ecological Quiz Application
 */

export type CategoryId = 'tko' | 'water' | 'nature_neftegorsk';

export interface Category {
  id: CategoryId;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge: string;
  questionCount: number;
  color: {
    primary: string;
    bgLight: string;
    bgDark: string;
    border: string;
    text: string;
  };
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  categoryId: CategoryId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ecoTipHint: string; // Hint provided by Eco-Consultant
  legalReference?: string; // e.g. ФЗ №89, Водный кодекс РФ
  interestingFact?: string; // Regional fact about Neftegorsky district/Samara region
  difficulty: Difficulty;
  points: number;
}

export interface LifelineState {
  fiftyFiftyUsed: boolean;
  consultantUsed: boolean;
  timeFreezeUsed: boolean;
  skipUsed?: boolean;
}

export type GameMode = 'category' | 'marathon' | 'blitz' | 'practice';

export interface QuizSessionState {
  mode: GameMode;
  selectedCategory: CategoryId | 'all';
  questions: Question[];
  currentIndex: number;
  selectedOption?: number | null;
  isAnswerSubmitted?: boolean;
  score: number;
  correctAnswersCount: number;
  streak: number;
  maxStreak: number;
  lifelines?: LifelineState;
  eliminatedOptions?: number[]; // From 50/50
  timeLeft?: number;
  totalTimeSpent?: number;
  isTimeFrozen?: boolean;
  answersHistory: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    pointsEarned: number;
    timeSpent: number;
  }[];
  isFinished?: boolean;
  startTime?: number;
  endTime?: number | null;
}

export interface PlayerRank {
  id: string;
  title: string;
  minScore: number;
  description: string;
  badgeColor: string;
  icon: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  settlement: string; // e.g. г. Нефтегорск, с. Утёвка, с. Бариновка
  score: number;
  correctPercentage: number;
  category: CategoryId | 'all';
  mode: GameMode;
  date: string;
  rankTitle: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: { current: number; total: number };
  badgeCategory: 'tko' | 'water' | 'nature' | 'speed' | 'general';
}

export interface EcoTip {
  id: string;
  category: CategoryId | 'general' | 'safety';
  title: string;
  summary: string;
  details: string[];
  warning?: string;
  actionCall: string;
  icon: string;
  tags: string[];
}

export interface NatureSight {
  id: string;
  name: string;
  type: 'water' | 'reserve' | 'historical_nature' | 'spring' | 'steppe';
  settlementNearby: string;
  description: string;
  ecologicalImportance: string;
  visitingRules: string[];
  coordinates?: string;
  imageAlt: string;
}

export interface RecyclingPoint {
  id: string;
  name: string;
  address: string;
  settlement: string;
  acceptedMaterials: string[];
  schedule: string;
  contacts?: string;
  notes?: string;
}
