'use client';

import React from 'react';
import {
  Inbox,
  Calendar,
  Columns,
  BarChart3,
  Layers,
} from 'lucide-react';

export type BoardActiveView = 'kanban' | 'gantt' | 'calendar';

interface BottomNavigationDockProps {
  activeView: BoardActiveView;
  onSelectView: (view: BoardActiveView) => void;
  onOpenInbox: () => void;
  onOpenBoardSwitcher: () => void;
  inboxBadgeCount?: number;
}

export function BottomNavigationDock({
  activeView,
  onSelectView,
  onOpenInbox,
  onOpenBoardSwitcher,
  inboxBadgeCount = 0,
}: BottomNavigationDockProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 select-none animate-fade-in">
      <nav className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-lg border border-slate-200/90 shadow-lg shadow-slate-900/10 text-slate-700">
        {/* 1. Boîte de réception (Inbox) */}
        <button
          onClick={onOpenInbox}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          title="Boîte de réception & Activités"
        >
          <Inbox className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Boîte de réception</span>
          {inboxBadgeCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1.5 right-1.5" />
          )}
        </button>

        {/* 2. Agenda (Calendar) */}
        <button
          onClick={() => onSelectView('calendar')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeView === 'calendar'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Vue Calendrier"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Agenda</span>
        </button>

        {/* 3. Tableau (Board - Active) */}
        <button
          onClick={() => onSelectView('kanban')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all relative ${
            activeView === 'kanban'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Vue Tableau Kanban"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Tableau</span>
          {activeView === 'kanban' && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
          )}
        </button>

        {/* 4. Gantt Timeline */}
        <button
          onClick={() => onSelectView('gantt')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeView === 'gantt'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Vue Gantt & Dépendances"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gantt</span>
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* 5. Changer de tableau (Overview / Switcher) */}
        <button
          onClick={onOpenBoardSwitcher}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50/80 transition-all"
          title="Changer de tableau (Tous mes projets)"
        >
          <Layers className="w-3.5 h-3.5 text-orange-500" />
          <span className="hidden sm:inline">Changer de tableau</span>
        </button>
      </nav>
    </div>
  );
}
