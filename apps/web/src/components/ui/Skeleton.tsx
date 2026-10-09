import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shimmer-effect rounded-xl', className)}
      {...props}
    />
  );
}

/**
 * Skeleton Loader for the signature Projects Overview cards
 */
export function ProjectCardSkeleton() {
  return (
    <div className="w-[320px] md:w-[350px] lg:w-[370px] shrink-0 h-full flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#12151C] overflow-hidden p-5 space-y-5 select-none shadow-sm">
      {/* Top Banner Stripe */}
      <Skeleton className="h-1.5 w-full rounded-full" />

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <Skeleton className="h-7 w-7 rounded-xl" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>

      {/* Body: Dates placeholder */}
      <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-black/30 border border-slate-200/60 dark:border-white/5 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-3.5 w-28 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-3.5 w-24 rounded" />
        </div>
      </div>

      {/* 3 Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-3.5 w-8 rounded" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Avatars and action */}
      <div className="flex-1 flex flex-col justify-end space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-7 h-7 rounded-full" />
          </div>
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Skeleton Loader for Kanban columns and cards
 */
export function KanbanColumnSkeleton() {
  return (
    <div className="w-[300px] shrink-0 bg-[#F1F2F4] dark:bg-[#15181F] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex flex-col p-3 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <Skeleton className="w-2.5 h-2.5 rounded-full" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>

      <div className="space-y-2.5 flex-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3.5 rounded-xl bg-white dark:bg-[#1A1F29] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs">
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <Skeleton className="h-4 w-4/5 rounded" />
            <div className="flex justify-between pt-1">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton Loader for Gantt View
 */
export function GanttChartSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0B0D11] overflow-hidden">
      <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] flex items-center justify-between">
        <Skeleton className="h-7 w-48 rounded-xl" />
        <Skeleton className="h-7 w-36 rounded-xl" />
      </div>
      <div className="flex-1 flex">
        <div className="w-72 md:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] p-4 space-y-4">
          <Skeleton className="h-4 w-32 rounded mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
          ))}
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded" />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 relative">
              <Skeleton
                className="h-8 rounded-xl"
                style={{
                  width: `${25 + (i * 15) % 50}%`,
                  marginLeft: `${(i * 12) % 40}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Loader for Calendar View
 */
export function CalendarSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0B0D11] overflow-hidden">
      <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] flex items-center justify-between">
        <Skeleton className="h-7 w-40 rounded-xl" />
        <Skeleton className="h-7 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#15181F] p-2 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-4 w-12 mx-auto rounded" />
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-slate-200 dark:bg-slate-850 p-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#0E1117] p-2 space-y-2 rounded-lg">
            <Skeleton className="w-5 h-5 rounded-full" />
            {i % 3 === 0 && <Skeleton className="h-4 w-full rounded" />}
          </div>
        ))}
      </div>
    </div>
  );
}
