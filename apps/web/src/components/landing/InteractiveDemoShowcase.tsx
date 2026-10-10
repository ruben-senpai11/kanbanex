'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Columns,
  BarChart3,
  Calendar as CalendarIcon,
  Layers,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Filter,
} from 'lucide-react';

export function InteractiveDemoShowcase() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'gantt' | 'calendar' | 'overview'>('kanban');
  const contentRef = useRef<HTMLDivElement>(null);

  // Trigger GSAP animation on tab change
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 14, scale: 0.99 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
    );
  }, [activeTab]);

  // Demo interactive checklist toggling state
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    'task-1': true,
    'task-2': false,
    'task-3': false,
  });

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="showcase" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-8 select-none">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-xs">
          <Play className="w-3.5 h-3.5 fill-current" />
          Démonstration Interactive
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Passez d&apos;une vue à l&apos;autre sans aucune friction
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Chaque projet vit selon vos besoins. Basculez instantanément entre la fluidité du Kanban, la rigueur temporelle du Gantt et la clarté du calendrier.
        </p>
      </div>

      {/* Interactive Tabs Switcher */}
      <div className="flex items-center justify-center">
        <div className="p-1.5 rounded-xl bg-slate-200/80 dark:bg-black/60 backdrop-blur-xl border border-slate-300 dark:border-white/10 flex items-center gap-1 shadow-md dark:shadow-2xl flex-wrap justify-center">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
              activeTab === 'kanban'
                ? 'bg-gradient-warm text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/5'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>Tableau Kanban</span>
          </button>

          <button
            onClick={() => setActiveTab('gantt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
              activeTab === 'gantt'
                ? 'bg-gradient-warm text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Diagramme de Gantt</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
              activeTab === 'calendar'
                ? 'bg-gradient-warm text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/5'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Agenda & Calendrier</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-warm text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Vue Panoramique</span>
          </button>
        </div>
      </div>

      {/* Interactive Mockup Frame */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#12151C]/90 backdrop-blur-2xl shadow-xl dark:shadow-2xl overflow-hidden relative">
        {/* Frame Topbar */}
        <div className="h-11 px-4 border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
              kanbanex.app/workspace/studio-alpha
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Simulation en direct</span>
          </div>
        </div>

        {/* Dynamic Interactive Body */}
        <div ref={contentRef} className="p-4 sm:p-6 min-h-[460px]">
          {/* TAB 1: KANBAN VIEW */}
          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1: À faire */}
              <div className="rounded-2xl bg-[#F1F2F4] dark:bg-[#1A1F29] border border-slate-200/80 dark:border-white/5 p-3 space-y-3 shadow-xs">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">À faire</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      2
                    </span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#12151C] border border-slate-200/70 dark:border-white/10 shadow-sm space-y-2 cursor-pointer hover:scale-[1.02] transition-transform">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/60">
                      Haute Priorité
                    </span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Rédiger les spécifications d&apos;architecture
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        14 oct.
                      </span>
                      <div className="w-5 h-5 rounded-full bg-gradient-warm text-white font-bold flex items-center justify-center text-[9px]">
                        AL
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#12151C] border border-slate-200/70 dark:border-white/10 shadow-sm space-y-2 cursor-pointer hover:scale-[1.02] transition-transform">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60">
                      Recherche
                    </span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Analyser les retours utilisateurs beta
                    </p>
                  </div>
                </div>

                <button className="w-full py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une carte</span>
                </button>
              </div>

              {/* Column 2: En cours (Interactive Checkbox) */}
              <div className="rounded-2xl bg-[#F1F2F4] dark:bg-[#1A1F29] border border-slate-200/80 dark:border-white/5 p-3 space-y-3 shadow-xs">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">En cours</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      1
                    </span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#12151C] border border-orange-500/50 shadow-md space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                      En revue agile
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-500">80% prêt</span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Intégrer les animations GSAP du Dashboard
                  </p>

                  <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
                    <div
                      onClick={() => toggleTask('task-1')}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checkedTasks['task-1']}
                        onChange={() => {}}
                        className="rounded accent-orange-500 cursor-pointer"
                      />
                      <span className={checkedTasks['task-1'] ? 'line-through text-slate-400' : ''}>
                        Animations d&apos;entrée panoramique
                      </span>
                    </div>

                    <div
                      onClick={() => toggleTask('task-2')}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checkedTasks['task-2']}
                        onChange={() => {}}
                        className="rounded accent-orange-500 cursor-pointer"
                      />
                      <span className={checkedTasks['task-2'] ? 'line-through text-slate-400' : ''}>
                        Interactions drag-and-drop sans délai
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Terminé */}
              <div className="rounded-2xl bg-[#F1F2F4] dark:bg-[#1A1F29] border border-slate-200/80 dark:border-white/5 p-3 space-y-3 shadow-xs">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Terminé</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      2
                    </span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#12151C] border border-emerald-500/30 shadow-xs space-y-1 opacity-80">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-through text-slate-500">
                      Mise en place de la base PostgreSQL Neon
                    </p>
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Validé & déployé
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#12151C] border border-emerald-500/30 shadow-xs space-y-1 opacity-80">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-through text-slate-500">
                      Intégration du logo officiel KanbanEx
                    </p>
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Validé
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GANTT TIMELINE VIEW */}
          {activeTab === 'gantt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                <span className="font-bold text-white">Tâches & Jalons de livraison</span>
                <span className="font-mono">Octobre 2026 • Sprint 4</span>
              </div>

              <div className="space-y-3 font-medium">
                {/* Timeline Row 1 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Architecture du Workspace & Neon DB</span>
                    <span className="text-emerald-400 font-bold">100%</span>
                  </div>
                  <div className="h-6 w-full rounded-lg bg-black/40 border border-white/5 relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg w-full flex items-center px-3 text-[11px] text-white font-bold">
                      Jalon 1 • Terminé
                    </div>
                  </div>
                </div>

                {/* Timeline Row 2 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Refonte Trello & Mini-Dock Inférieur</span>
                    <span className="text-orange-400 font-bold">85%</span>
                  </div>
                  <div className="h-6 w-full rounded-lg bg-black/40 border border-white/5 relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg w-[85%] flex items-center px-3 text-[11px] text-white font-bold">
                      En cours d&apos;exécution
                    </div>
                  </div>
                </div>

                {/* Timeline Row 3 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Lancement Public & Déploiement Vercel</span>
                    <span className="text-sky-400 font-bold">À venir</span>
                  </div>
                  <div className="h-6 w-full rounded-lg bg-black/40 border border-white/5 relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg w-[45%] ml-[40%] flex items-center px-3 text-[11px] text-white font-bold">
                      Semaine prochaine
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CALENDAR VIEW */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 border-b border-white/10 pb-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mer</span>
                <span>Jeu</span>
                <span>Ven</span>
                <span>Sam</span>
                <span>Dim</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-xs">
                {[12, 13, 14, 15, 16, 17, 18].map((day, i) => (
                  <div
                    key={day}
                    className={`h-24 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      day === 14
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-white/5 bg-black/20 text-slate-400'
                    }`}
                  >
                    <span className="font-bold">{day} oct.</span>
                    {day === 14 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white truncate shadow-xs">
                        🚀 Release KanbanEx
                      </span>
                    )}
                    {day === 16 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white truncate shadow-xs">
                        Audit Super Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PANORAMIC OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span className="font-bold text-white">Vos projets orchestrés en cartes panoramiques</span>
                <span className="text-orange-400 font-semibold">Style Trello épuré</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/40 shadow-xl space-y-3 hover:border-orange-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Actif
                    </span>
                    <span className="text-xs text-orange-400 font-bold">95%</span>
                  </div>
                  <h4 className="text-sm font-black text-white">Refonte Plateforme KanbanEx</h4>
                  <p className="text-xs text-slate-400">
                    Expérience immersive sans sidebar, Kanban pur et arrière-plans cinématiques.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-xl space-y-3 hover:border-white/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-400 border border-sky-800">
                      Planification
                    </span>
                    <span className="text-xs text-slate-400 font-bold">20%</span>
                  </div>
                  <h4 className="text-sm font-black text-white">Stratégie Marketing Q4</h4>
                  <p className="text-xs text-slate-400">
                    Acquisition de nouveaux utilisateurs et accélération de la croissance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
