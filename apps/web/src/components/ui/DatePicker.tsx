'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface DatePickerProps {
  value?: string | null; // Format YYYY-MM-DD or ISO
  onChange: (dateString: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  helperText?: string;
  id?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
}

const MONTH_NAMES_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const SHORT_MONTH_NAMES_FR = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

const WEEKDAYS_FR = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function parseDateString(str?: string | null): { year: number; month: number; day: number } | null {
  if (!str) return null;
  // If ISO string like 2026-10-10T00:00:00Z, take the YYYY-MM-DD portion
  const cleanStr = str.split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

function formatDateDisplay(parsed: { year: number; month: number; day: number } | null): string {
  if (!parsed) return '';
  return `${parsed.day} ${SHORT_MONTH_NAMES_FR[parsed.month]} ${parsed.year}`;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Choisir une date',
  className = '',
  error,
  helperText,
  id,
  minDate,
  maxDate,
  disabled = false,
  align = 'left',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const parsedValue = useMemo(() => parseDateString(value), [value]);

  const today = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    };
  }, []);

  // Current view in calendar (month & year)
  const [viewState, setViewState] = useState(() => {
    if (parsedValue) {
      return { year: parsedValue.year, month: parsedValue.month };
    }
    return { year: today.year, month: today.month };
  });

  // Keep view aligned when opening if value exists
  const handleOpen = () => {
    if (disabled) return;
    if (parsedValue) {
      setViewState({ year: parsedValue.year, month: parsedValue.month });
    }
    setIsOpen(!isOpen);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewState((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewState((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleSelectDay = (year: number, month: number, day: number) => {
    const formatted = `${year}-${pad(month + 1)}-${pad(day)}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleQuickPreset = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const y = target.getFullYear();
    const m = target.getMonth();
    const d = target.getDate();
    handleSelectDay(y, m, d);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  // Build the 42 cells grid (6 weeks)
  const calendarCells = useMemo(() => {
    const { year, month } = viewState;
    // 0 = Monday, 6 = Sunday
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      year: number;
      month: number;
      day: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      dateString: string;
    }[] = [];

    // Leading days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateString = `${prevYear}-${pad(prevMonth + 1)}-${pad(day)}`;
      cells.push({
        year: prevYear,
        month: prevMonth,
        day,
        isCurrentMonth: false,
        isToday:
          prevYear === today.year && prevMonth === today.month && day === today.day,
        isSelected:
          Boolean(parsedValue) &&
          prevYear === parsedValue?.year &&
          prevMonth === parsedValue?.month &&
          day === parsedValue?.day,
        dateString,
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateString = `${year}-${pad(month + 1)}-${pad(day)}`;
      cells.push({
        year,
        month,
        day,
        isCurrentMonth: true,
        isToday:
          year === today.year && month === today.month && day === today.day,
        isSelected:
          Boolean(parsedValue) &&
          year === parsedValue?.year &&
          month === parsedValue?.month &&
          day === parsedValue?.day,
        dateString,
      });
    }

    // Trailing days from next month
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateString = `${nextYear}-${pad(nextMonth + 1)}-${pad(day)}`;
      cells.push({
        year: nextYear,
        month: nextMonth,
        day,
        isCurrentMonth: false,
        isToday:
          nextYear === today.year && nextMonth === today.month && day === today.day,
        isSelected:
          Boolean(parsedValue) &&
          nextYear === parsedValue?.year &&
          nextMonth === parsedValue?.month &&
          day === parsedValue?.day,
        dateString,
      });
    }

    return cells;
  }, [viewState, parsedValue, today]);

  const displayDate = formatDateDisplay(parsedValue);

  return (
    <div ref={containerRef} className={`relative w-full space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      {/* Modern Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full h-11 px-3.5 flex items-center justify-between bg-slate-100/90 dark:bg-[#12151C] border rounded-xl text-sm transition-all select-none text-left ${
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/20 bg-white dark:bg-[#161B24]'
            : 'border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          error ? 'border-rose-500 ring-1 ring-rose-500/30' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon
            className={`w-4 h-4 shrink-0 transition-colors ${
              parsedValue
                ? 'text-orange-500 dark:text-orange-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          />
          <span
            className={`truncate font-medium ${
              parsedValue
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {displayDate || placeholder}
          </span>
        </div>

        {/* Clear Button or Subtle Indicator */}
        {parsedValue && !disabled ? (
          <span
            onClick={handleClear}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            title="Effacer la date"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
        )}
      </button>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 w-[300px] p-3.5 rounded-2xl bg-white/95 dark:bg-[#131720]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Calendar Header with Month/Year Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-900 dark:text-white capitalize tracking-tight">
              {MONTH_NAMES_FR[viewState.month]} {viewState.year}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 pt-2.5 pb-1 text-center">
            {WEEKDAYS_FR.map((wd) => (
              <span
                key={wd}
                className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {calendarCells.map((cell) => {
              const isSelected = cell.isSelected;
              const isToday = cell.isToday;
              const isCurrentMonth = cell.isCurrentMonth;

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  onClick={() =>
                    handleSelectDay(cell.year, cell.month, cell.day)
                  }
                  className={`h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-xl font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/30 scale-105'
                      : isToday
                      ? 'border border-orange-500/50 text-orange-600 dark:text-orange-400 font-bold hover:bg-orange-500/10'
                      : isCurrentMonth
                      ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                      : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts Footer */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickPreset(0)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Aujourd&apos;hui
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(1)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Demain
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(7)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                +7j
              </button>
            </div>

            {parsedValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline transition-colors"
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
