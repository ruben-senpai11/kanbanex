'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ZoomIn,
  ZoomOut,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export interface GanttTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
  progressPercentage: number;
  assignees: Array<{ id: string; fullName: string; avatarUrl?: string }>;
  dependencies?: Array<{ fromTaskId: string; toTaskId: string; type: string }>;
}

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskClick: (taskId: string) => void;
  onUpdateDates: (taskId: string, startDate: string, dueDate: string, progress?: number) => Promise<void>;
}

type ZoomLevel = 'day' | 'week' | 'month';

export function GanttChart({ tasks, onTaskClick, onUpdateDates }: GanttChartProps) {
  const [zoom, setZoom] = useState<ZoomLevel>('day');
  const [timelineStartOffsetDays, setTimelineStartOffsetDays] = useState(0);

  // Dragging bar or resize handle state
  const [activeDrag, setActiveDrag] = useState<{
    taskId: string;
    mode: 'move' | 'resize-start' | 'resize-end';
    startX: number;
    initialStartMs: number;
    initialDueMs: number;
  } | null>(null);

  // Compute base reference date (start of timeline)
  const baseDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 3 + timelineStartOffsetDays);
    return d;
  }, [timelineStartOffsetDays]);

  const numUnits = zoom === 'day' ? 30 : zoom === 'week' ? 16 : 12;
  const unitWidthPx = zoom === 'day' ? 48 : zoom === 'week' ? 96 : 140;

  // Generate timeline headers
  const timelineUnits = useMemo(() => {
    const units: { label: string; subLabel: string; date: Date }[] = [];
    for (let i = 0; i < numUnits; i++) {
      const uDate = new Date(baseDate);
      if (zoom === 'day') {
        uDate.setDate(uDate.getDate() + i);
        units.push({
          label: uDate.toLocaleDateString('fr-FR', { weekday: 'short' }),
          subLabel: `${uDate.getDate()} ${uDate.toLocaleDateString('fr-FR', { month: 'short' })}`,
          date: uDate,
        });
      } else if (zoom === 'week') {
        uDate.setDate(uDate.getDate() + i * 7);
        units.push({
          label: `Semaine ${getWeekNumber(uDate)}`,
          subLabel: `${uDate.getDate()} ${uDate.toLocaleDateString('fr-FR', { month: 'short' })}`,
          date: uDate,
        });
      } else {
        uDate.setMonth(uDate.getMonth() + i);
        units.push({
          label: uDate.toLocaleDateString('fr-FR', { month: 'long' }),
          subLabel: `${uDate.getFullYear()}`,
          date: uDate,
        });
      }
    }
    return units;
  }, [baseDate, zoom, numUnits]);

  // Convert Date to pixel offset on the timeline
  const getPixelForDate = (d: Date): number => {
    const diffMs = d.getTime() - baseDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (zoom === 'day') {
      return diffDays * unitWidthPx;
    } else if (zoom === 'week') {
      return (diffDays / 7) * unitWidthPx;
    } else {
      return (diffDays / 30) * unitWidthPx;
    }
  };

  // Drag interaction handlers
  const handleMouseDown = (
    e: React.MouseEvent,
    taskId: string,
    mode: 'move' | 'resize-start' | 'resize-end',
    task: GanttTask
  ) => {
    e.stopPropagation();
    setActiveDrag({
      taskId,
      mode,
      startX: e.clientX,
      initialStartMs: new Date(task.startDate).getTime(),
      initialDueMs: new Date(task.dueDate).getTime(),
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeDrag) return;
    // Handled visually or on mouse up
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (!activeDrag) return;
    const dx = e.clientX - activeDrag.startX;

    let msPerPx = 0;
    if (zoom === 'day') {
      msPerPx = (24 * 3600 * 1000) / unitWidthPx;
    } else if (zoom === 'week') {
      msPerPx = (7 * 24 * 3600 * 1000) / unitWidthPx;
    } else {
      msPerPx = (30 * 24 * 3600 * 1000) / unitWidthPx;
    }

    const deltaMs = dx * msPerPx;

    let newStartMs = activeDrag.initialStartMs;
    let newDueMs = activeDrag.initialDueMs;

    if (activeDrag.mode === 'move') {
      newStartMs += deltaMs;
      newDueMs += deltaMs;
    } else if (activeDrag.mode === 'resize-start') {
      newStartMs = Math.min(newStartMs + deltaMs, newDueMs - 86400000);
    } else if (activeDrag.mode === 'resize-end') {
      newDueMs = Math.max(newDueMs + deltaMs, newStartMs + 86400000);
    }

    const taskId = activeDrag.taskId;
    setActiveDrag(null);

    await onUpdateDates(
      taskId,
      new Date(newStartMs).toISOString(),
      new Date(newDueMs).toISOString()
    );
  };

  function getWeekNumber(d: Date) {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  const todayX = getPixelForDate(new Date());

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0B0D11] overflow-hidden select-none"
    >
      {/* Gantt Control Toolbar */}
      <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTimelineStartOffsetDays((prev) => prev - (zoom === 'day' ? 7 : 14))}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimelineStartOffsetDays(0)}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1F29] dark:hover:bg-slate-800 text-xs font-semibold text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-slate-700"
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setTimelineStartOffsetDays((prev) => prev + (zoom === 'day' ? 7 : 14))}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#181D26] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setZoom('day')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              zoom === 'day'
                ? 'bg-gradient-warm text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Jours
          </button>
          <button
            onClick={() => setZoom('week')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              zoom === 'week'
                ? 'bg-gradient-warm text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Semaines
          </button>
          <button
            onClick={() => setZoom('month')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              zoom === 'month'
                ? 'bg-gradient-warm text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Mois
          </button>
        </div>
      </div>

      {/* Main Gantt Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Tasks Tree / Names */}
        <div className="w-72 md:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] shrink-0 flex flex-col overflow-hidden">
          <div className="h-12 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Tâches du projet ({tasks.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task.id)}
                className="h-14 px-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={task.status} />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {task.progressPercentage}%
                    </span>
                  </div>
                </div>

                {task.assignees.length > 0 && (
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                    {task.assignees[0].fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Timeline Canvas */}
        <div className="flex-1 overflow-x-auto overflow-y-auto relative bg-slate-50 dark:bg-[#0B0D11] horizontal-scroll-container">
          <div
            className="relative min-h-full"
            style={{ width: `${numUnits * unitWidthPx}px` }}
          >
            {/* Timeline Column Headers */}
            <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-[#15181F] flex sticky top-0 z-20">
              {timelineUnits.map((u, i) => (
                <div
                  key={i}
                  style={{ width: `${unitWidthPx}px` }}
                  className="border-r border-slate-200/80 dark:border-slate-800/80 px-2 flex flex-col justify-center text-center shrink-0"
                >
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase truncate">
                    {u.label}
                  </span>
                  <span className="text-[9px] text-slate-500 truncate">
                    {u.subLabel}
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical Today Marker */}
            {todayX >= 0 && todayX <= numUnits * unitWidthPx && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-10 pointer-events-none"
                style={{ left: `${todayX}px` }}
              >
                <div className="w-2 h-2 -ml-[3px] rounded-full bg-orange-500 animate-ping" />
              </div>
            )}

            {/* Grid Columns Background */}
            <div className="absolute inset-0 top-12 flex pointer-events-none">
              {timelineUnits.map((_, i) => (
                <div
                  key={i}
                  style={{ width: `${unitWidthPx}px` }}
                  className="border-r border-slate-200/60 dark:border-slate-800/40 h-full shrink-0"
                />
              ))}
            </div>

            {/* Task Bars Rows */}
            <div className="pt-0 divide-y divide-slate-200/60 dark:divide-slate-800/40 relative z-10">
              {tasks.map((task) => {
                const startDate = new Date(task.startDate);
                const dueDate = new Date(task.dueDate);

                const leftPx = Math.max(0, getPixelForDate(startDate));
                const rightPx = getPixelForDate(dueDate);
                const widthPx = Math.max(36, rightPx - leftPx);

                return (
                  <div key={task.id} className="h-14 relative flex items-center">
                    {/* The Interactive Gantt Bar */}
                    <div
                      style={{
                        left: `${leftPx}px`,
                        width: `${widthPx}px`,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, task.id, 'move', task)}
                      className="absolute h-8 rounded-xl bg-white dark:bg-[#1A1F29] border border-orange-500/50 hover:border-orange-500 shadow-md cursor-grab active:cursor-grabbing flex items-center group transition-colors overflow-hidden select-none"
                    >
                      {/* Left Resize Handle */}
                      <div
                        onMouseDown={(e) => handleMouseDown(e, task.id, 'resize-start', task)}
                        className="w-2 h-full bg-orange-500/20 hover:bg-orange-500 cursor-ew-resize shrink-0 transition-colors"
                        title="Ajuster la date de début"
                      />

                      {/* Progress Bar Fill */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/40 dark:from-amber-500/40 dark:to-orange-500/50 pointer-events-none"
                        style={{ width: `${task.progressPercentage}%` }}
                      />

                      {/* Bar Content */}
                      <div
                        onClick={() => onTaskClick(task.id)}
                        className="flex-1 px-2.5 flex items-center justify-between min-w-0 z-10 cursor-pointer"
                      >
                        <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                          {task.title}
                        </span>
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-300 ml-1 shrink-0">
                          {task.progressPercentage}%
                        </span>
                      </div>

                      {/* Right Resize Handle */}
                      <div
                        onMouseDown={(e) => handleMouseDown(e, task.id, 'resize-end', task)}
                        className="w-2 h-full bg-orange-500/20 hover:bg-orange-500 cursor-ew-resize shrink-0 transition-colors"
                        title="Ajuster la date d'échéance"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
