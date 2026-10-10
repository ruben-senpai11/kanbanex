'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProjectCalendar } from '@/components/calendar/ProjectCalendar';
import { TaskDrawer } from '@/components/task/TaskDrawer';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { CalendarSkeleton } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Select';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0E121A] dark:text-slate-100 flex flex-col overflow-hidden">
      <AppHeader onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1 flex overflow-hidden">

        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100 dark:from-[#0E121A] dark:via-[#131722] dark:to-[#0B0E14]">
          {/* Calendar Header with Project Filter */}
          <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] shrink-0 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Calendrier global
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualisez et anticipez les échéances de vos projets
              </p>
            </div>

            {projects.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Projet :</span>
                <div className="w-56">
                  <Select
                    value={selectedProjectId}
                    onChange={setSelectedProjectId}
                    options={projects.map((p) => ({ value: p.id, label: p.name }))}
                  />
                </div>
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
