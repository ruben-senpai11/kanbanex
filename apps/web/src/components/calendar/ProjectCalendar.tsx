'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';

export interface CalendarTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  startDate?: string;
  dueDate?: string;
  dueTime?: string;
  progressPercentage: number;
  assignees: Array<{ id: string; fullName: string; avatarUrl?: string }>;
  labels: Array<{ id: string; name: string; color: string }>;
}

interface ProjectCalendarProps {
  tasks: CalendarTask[];
  onTaskClick: (taskId: string) => void;
}

type ViewMode = 'month' | 'week' | 'day';

export function ProjectCalendar({ tasks, onTaskClick }: ProjectCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Month navigation
  const prevPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  // Month days generation
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Prepend days from previous month to align Monday (0 is Sun, 1 is Mon)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    for (let i = startDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Fill remaining days to reach full week grid
    while (days.length % 7 !== 0) {
      const nextDate = new Date(year, month + 1, days.length - lastDay.getDate() - startDayOfWeek + 1);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  }, [currentDate]);

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0B0D11] overflow-hidden select-none">
      {/* Calendar Toolbar */}
      <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={prevPeriod}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white capitalize min-w-[160px] text-center">
            {currentDate.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            onClick={nextPeriod}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1F29] dark:hover:bg-slate-800 text-xs font-semibold text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-slate-700 ml-2"
          >
            Aujourd'hui
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#181D26] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'month'
                ? 'bg-gradient-warm text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'week'
                ? 'bg-gradient-warm text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'day'
                ? 'bg-gradient-warm text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Jour
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-[#15181F] shrink-0">
        {daysOfWeek.map((day, i) => (
          <div
            key={i}
            className="py-2.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6 overflow-y-auto divide-x divide-y divide-slate-200/80 dark:divide-slate-800/60 bg-slate-200/40 dark:bg-[#0B0D11]">
        {monthDays.map((d, index) => {
          const isToday =
            d.date.toDateString() === new Date().toDateString();

          // Match tasks that fall on this day
          const dayTasks = tasks.filter((t) => {
            if (!t.dueDate) return false;
            const taskDue = new Date(t.dueDate);
            return taskDue.toDateString() === d.date.toDateString();
          });

          return (
            <div
              key={index}
              className={`p-2 flex flex-col justify-between min-h-[90px] transition-colors ${
                d.isCurrentMonth
                  ? 'bg-white dark:bg-[#0E1117]'
                  : 'bg-slate-50/80 dark:bg-[#08090C]/80 opacity-60 dark:opacity-40'
              } hover:bg-slate-50 dark:hover:bg-[#12151C]`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-gradient-warm text-white shadow-md shadow-orange-500/30'
                      : d.isCurrentMonth
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {d.date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/40 px-1.5 py-0.2 rounded-md">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Tasks for this day */}
              <div className="flex-1 space-y-1 overflow-y-auto">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task.id)}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-800 hover:text-orange-950 dark:bg-[#181D26] dark:hover:bg-orange-500/20 dark:border-slate-800 dark:hover:border-orange-500/50 dark:text-slate-200 dark:hover:text-white text-[11px] font-medium cursor-pointer truncate transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        task.status === 'DONE' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-orange-500 dark:bg-orange-400'
                      }`}
                    />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-1 block">
                    +{dayTasks.length - 3} autres
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
