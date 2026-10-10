'use client';

import React from 'react';
import {
  Calendar,
  Columns,
  BarChart3,
} from 'lucide-react';

export type BoardActiveView = 'kanban' | 'gantt' | 'calendar';

interface BottomNavigationDockProps {
  activeView: BoardActiveView;
  onSelectView: (view: BoardActiveView) => void;
  isDarkTheme?: boolean;
}

export function BottomNavigationDock({
  activeView,
  onSelectView,
  isDarkTheme = false,
}: BottomNavigationDockProps) {
  const views: Array<{ id: BoardActiveView; label: string; icon: React.ElementType }> = [
    { id: 'kanban', label: 'Tableau', icon: Columns },
    { id: 'gantt', label: 'Gantt', icon: BarChart3 },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 select-none animate-fade-in">
      <nav
        className={`flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-xl border shadow-xl transition-all duration-200 ${
          isDarkTheme
            ? 'bg-black/60 border-white/15 text-white/90 shadow-black/40'
            : 'bg-white/90 border-slate-200/90 text-slate-800 shadow-slate-900/10'
        }`}
      >
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = activeView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelectView(v.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                isActive
                  ? isDarkTheme
                    ? 'bg-white text-slate-950 shadow-md ring-1 ring-white/30'
                    : 'bg-slate-950 text-white shadow-md ring-1 ring-slate-950/20'
                  : isDarkTheme
                  ? 'text-slate-300 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
              title={`Vue ${v.label}`}
            >
              <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{v.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
