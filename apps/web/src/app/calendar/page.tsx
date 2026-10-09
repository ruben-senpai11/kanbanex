'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProjectCalendar } from '@/components/calendar/ProjectCalendar';
import { TaskDrawer } from '@/components/task/TaskDrawer';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { CalendarSkeleton } from '@/components/ui/Skeleton';

export default function WorkspaceCalendarPage() {
  const { currentWorkspace } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!currentWorkspace) return;
      try {
        const overview = await api.getProjectsOverview(currentWorkspace.id);
        setProjects(overview);
        if (overview.length > 0) {
          setSelectedProjectId(overview[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [currentWorkspace]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!selectedProjectId) return;
      try {
        const data = await api.getCalendarTasks(selectedProjectId);
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadTasks();
  }, [selectedProjectId]);

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col overflow-hidden">
      <AppHeader onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1 flex overflow-hidden">

        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0B0D11]">
          {/* Calendar Header with Project Filter */}
          <div className="h-16 px-6 border-b border-slate-800 bg-[#12151C] shrink-0 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                Calendrier global
              </h1>
              <p className="text-xs text-slate-400">
                Visualisez et anticipez les échéances de vos projets
              </p>
            </div>

            {projects.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Projet :</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-[#181D26] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <CalendarSkeleton />
            ) : projects.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                Créez d'abord un projet pour planifier vos tâches.
              </div>
            ) : (
              <ProjectCalendar
                tasks={tasks}
                onTaskClick={(tId) => setActiveTaskId(tId)}
              />
            )}
          </div>
        </main>
      </div>

      <TaskDrawer
        taskId={activeTaskId}
        onClose={() => setActiveTaskId(null)}
        onTaskUpdated={async () => {
          if (selectedProjectId) {
            const data = await api.getCalendarTasks(selectedProjectId);
            setTasks(data);
          }
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
