import { MomentumPoint, StreakData, ThreadProgress, MomentumStats, CalendarDate } from '../types';

const STORAGE_KEY = 'momentum_data_v1';

export class MomentumService {
  private STORAGE_KEY = 'momentum_data_v1';

  constructor() {}

  getPoints(): Map<string, MomentumPoint> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return new Map();
    }
    try {
      return new Map(
        JSON.parse(stored).map((item: any) => [
          item.date,
          {
            date: item.date,
            threadsUpdated: item.threadsUpdated,
            isStreakDay: item.isStreakDay ?? false,
            completionCount: item.completionCount ?? 0,
            createdAt: item.createdAt || new Date(item.date).toISOString(),
          } as MomentumPoint,
        ])
      );
    } catch {
      return new Map();
    }
  }

  savePoint(point: MomentumPoint): void {
    const points = this.getPoints();
    points.set(point.date, {
      ...point,
      isStreakDay: points.has(this.getPreviousDate(point.date)) || points.has(point.date),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(points.entries())));
  }

  getThreadProgress(): Map<string, ThreadProgress> {
    const stored = localStorage.getItem('thread_progress');
    if (!stored) {
      return new Map();
    }
    try {
      return new Map(
        JSON.parse(stored).map((item: any) => [
          item.threadId,
          item as ThreadProgress,
        ])
      );
    } catch {
      return new Map();
    }
  }

  saveThreadProgress(progress: ThreadProgress): void {
    const existing = this.getThreadProgress();
    existing.set(progress.threadId, {
      ...progress,
      isCompleted: progress.progressCount > 0,
    });
    localStorage.setItem('thread_progress', JSON.stringify(Array.from(existing.entries())));
  }

  getStreak(): StreakData {
    const points = this.getPoints();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = this.getPreviousDate(today);
    const lastCompletedDate = points.get(today)?.date || points.get(yesterday)?.'date' || null;

    const days = this.getCalendarRange(1095); // 3 years for streak calculation
    const completedDates = new Map<string, boolean>();

    days.forEach((day) => {
      const point = points.get(day.dateString);
      completedDates.set(day.dateString, !!point);
    });

    // Calculate current streak
    let streak = 0;
    let tempDate = new Date(today);

    while (completedDates.has(tempDate.toISOString().split('T')[0])) {
      streak++;
      tempDate.setDate(tempDate.getDate() - 1);
    }

    // Calculate longest streak
    let longestStreak = 0;
    let currentRun = 0;
    const dates = Array.from(completedDates.keys()).sort().reverse();

    for (const date of dates) {
      if (completedDates.has(date)) {
        currentRun++;
      } else {
        longestStreak = Math.max(longestStreak, currentRun);
        currentRun = 0;
      }
    }
    longestStreak = Math.max(longestStreak, currentRun);

    return {
      currentStreak: streak,
      longestStreak,
      lastCompletedDate,
      completedDates,
      streakStartDate: this.formatDate(new Date(today).setDate(new Date(today).getDate() - streak)),
    };
  }

  getStats(): MomentumStats {
    const streak = this.getStreak();
    const points = this.getPoints();
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    const totalDays = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1
    );
    const totalCompleted = points.size > 0 ? points.size : 0;

    return {
      totalDaysTracked: totalDays,
      totalCompletedDates: points.size,
      averageDailyProgress: totalDays > 0 ? points.size / totalDays : 0,
      currentStreak: streak.currentStreak,
      bestStreak: streak.longestStreak,
    };
  }

  getCalendarRange(days: number): CalendarDate[] {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - Math.floor(days / 2) + 1);
    const dates: CalendarDate[] = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const isToday = d.toDateString() === today.toDateString();
      const isFuture = d > today && !isToday;

      const dateString = d.toISOString().split('T')[0];
      const isCompleted = !!this.getPoints().get(dateString);

      dates.push({
        date: d,
        dateString,
        isToday,
        isFuture,
        isCompleted,
        streakValue: 0,
      });
    }

    return dates;
  }

  getPreviousDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getThreadProgressCount(): number {
    return this.getThreadProgress().size;
  }

  getTotalThreadProgress(): number {
    return this.getThreadProgress().reduce((sum, progress) => {
      return sum + progress.progressCount;
    }, 0);
  }

  addPoint(pointData: Omit<MomentumPoint, 'isStreakDay' | 'createdAt'>): void {
    const points = this.getPoints();
    const existing = points.get(pointData.date);

    if (existing) {
      points.set(pointData.date, {
        ...existing,
        completionCount: existing.completionCount + pointData.completionCount,
      });
    } else {
      points.set(pointData.date, {
        ...pointData,
        isStreakDay: points.has(this.getPreviousDate(pointData.date)) || false,
        createdAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(Array.from(points.entries()))
    );
  }
}

export const momentumService = new MomentumService();
export default momentumService;