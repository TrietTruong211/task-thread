import { useEffect, useState } from 'react';
import { momentumService, type MomentumPoint } from '../services/momentumService';
import { useThreadStore } from 'stores/threadStore';
import { useMicroStepStore } from 'stores/microstepStore';

export function useMomentumTracker() {
  const threadProgress = useThreadStore((state) => state.threadProgress);
  const { updateThread } = useThreadStore();
  const [points, setPoints] = useState<Map<string, MomentumPoint>>(new Map());
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(false);

  // Load momentum data
  useEffect(() => {
    const loadData = () => {
      try {
        setPoints(momentumService.getPoints());
        setStats(momentumService.getStats());
        setError(null);
      } catch (err) {
        console.error('Failed to load momentum data:', err);
        setError('Failed to load momentum history');
      }
    };

    loadData();
  }, [refetch]);

  // Sync thread progress with momentum
  useEffect(() => {
    momentumService.saveThreadProgress(threadProgress);
  }, [threadProgress]);

  // Watch for thread updates and notify momentum tracker
  useEffect(() => {
    const subscription = useThreadStore.subscribe((state) => {
      momentumService.saveThreadProgress(state.threadProgress);
      setPoints(momentumService.getPoints());
      setStats(momentumService.getStats());
    });

    return () => subscription.unsubscribe();
  }, []);

  const notifyProgress = async (threadId: string, microstepId: string) => {
    try {
      await updateThread(threadId);
      return true;
    } catch (err) {
      console.error('Failed to notify progress:', err);
      return false;
    }
  };

  const getRecentStreakDays = (limit: number = 100): CalendarDay[] => {
    const today = new Date();
    const days: CalendarDay[] = [];
    let tempDate = new Date(today);
    let currentStreak = 0;

    for (let i = 0; i < limit; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const hasPoint = points.has(dateString);
      const progress = points.get(dateString);
      isStreakDay = hasPoint;

      if (isStreakDay && !days.at(-1)?.completed) {
        currentStreak++;
      }

      days.push({
        date: date,
        dateString,
        isToday: date.toDateString() === today.toDateString(),
        isFuture: date > today,
        completed: hasPoint,
        streakValue: hasPoint ? currentStreak : 0,
      });
    }

    return days;
  };

  const getCalendarRange = (days: number = 30): CalendarDay[] => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - Math.floor(days / 2) + 1);
    const dates: CalendarDay[] = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const isCompleted = !!points.get(dateString);

      dates.push({
        date: d,
        dateString,
        isToday: d.toDateString() === today.toDateString(),
        isFuture: d > today && !d.toDateString() === today.toDateString(),
        completed: isCompleted,
        streakValue: 0,
      });
    }

    return dates;
  };

  const markDayCompleted = (dateString: string, progressCount: number = 1) => {
    points.set(dateString, {
      date: dateString,
      threadsUpdated: progressCount,
      isStreakDay: true,
      completionCount: progressCount,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('momentum_data_v1', JSON.stringify(Array.from(points.entries())));
    setPoints(points);
    setStats(momentumService.getStats());
  };

  const resetStreak = () => {
    localStorage.removeItem('momentuo_data_v1');
    setPoints(new Map());
    setStats(null);
    setError('Streak reset');
  };

  return {
    points,
    stats,
    error,
    refetch,
    setRefetch,
    recentDays: getRecentStreakDays(100),
    calendarDays: getCalendarRange(30),
    markDayCompleted,
    resetStreak,
    isLoading: true,
  };
}
