import React from 'react';
import { CalendarDay } from '../types';

export interface CalendarDayProps {
  day: CalendarDay;
  onClick?: () => void;
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = React.memo(
  ({ day, onClick, showTooltip, setShowTooltip }) => {
    const baseClasses =
      'flex flex-col items-center justify-center min-h-[50px] w-10 border rounded-lg transition-all duration-200 cursor-pointer';

    const statusClasses =
      'hover:scale-105 hover:shadow-md active:scale-95';

    const colorClasses =
      day.completed
        ? `bg-gradient-to-br from-green-400 to-green-500 ${
            day.isToday ? 'ring-2 ring-green-300' : ''
          }`
        : day.isFuture
        ? 'bg-slate-50'
        : 'bg-slate-200/50';

    const iconClasses = day.completed
      ? 'text-white/90 bg-clip-text text-sm'
      : '';

    return (
      <div
        className={baseClasses}
        style={{
          backgroundColor: 'transparent',
        }}
      >
        {day.isToday && <div className="absolute inset-0 border border-green-400/50 rounded-lg" />}

        <button
          onClick={onClick}
          className={`h-full w-full rounded-lg transition-transform duration-200 ${
            day.completed ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-slate-200/50'
          } flex flex-col items-center justify-center p-1`}
        >
          <div className="relative">
            {day.completed && (
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 16.17L4.83 12l-1.42 1.41L12 21.24l7.59-7.59L13.41 12z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}

            {!day.completed && !day.isFuture && (
              <span className="text-slate-400 text-xs font-medium">
                {day.date.getDate()}
              </span>
            )}

            {day.isFuture && (
              <span className="text-slate-300 text-xs">
                {day.date.getDate()}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }
);

CalendarDay.displayName = 'CalendarDay';

export default CalendarDay;