export interface MomentumPoint {
  date: string; // YYYY-MM-DD
  threadsUpdated: number;
  isStreakDay: boolean;
  completionCount: number;
  createdAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  completedDates: Map<string, boolean>;
  streakStartDate: string;
}

export interface ThreadProgress {
  threadId: string;
  title: string;
  progressCount: number;
  lastUpdated: string;
}

export interface MomentumStats {
  totalDaysTracked: number;
  totalCompletedDates: number;
  averageDailyProgress: number;
  currentStreak: number;
  bestStreak: number;
}

export interface CalendarDate {
  date: Date;
  dateString: string;
  isToday: boolean;
  isFuture: boolean;
  isCompleted: boolean;
  streakValue: number;
}
