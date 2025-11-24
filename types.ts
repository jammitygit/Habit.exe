export enum HabitStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  status: HabitStatus;
  xpGained?: number;
}

export interface Habit {
  id: string;
  name: string;
  frequency: number; // 1 = Daily, 2 = Every other day, etc.
  history: HabitLog[];
  streak: number;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'ERROR' | 'AI' | 'ALERT';
}

export interface UserStats {
  xp: number;
  rankTitle: string;
  nextRankXp: number;
  level: number;
}
