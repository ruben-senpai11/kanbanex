'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { GanttChart } from '@/components/gantt/GanttChart';
import { ProjectCalendar } from '@/components/calendar/ProjectCalendar';
import { TaskDrawer } from '@/components/task/TaskDrawer';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { ThemeSelectorModal } from '@/components/overview/ThemeSelectorModal';
import {
  Columns,
  BarChart3,
  Calendar,
  ChevronLeft,
  Palette,
  Filter,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getThemeById } from '@/lib/themes';
import {
  KanbanColumnSkeleton,
  GanttChartSkeleton,
  CalendarSkeleton,
} from '@/components/ui/Skeleton';
import { animateViewTransition } from '@/lib/animations';

type ActiveView = 'kanban' | 'gantt' | 'calendar';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params?.id as string;
  const router = useRouter();
  const { user, currentWorkspace, isLoading: isAuthLoading } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [activeView, setActiveView] = useState<ActiveView>('kanban');
  const [isLoading, setIsLoading] = useState(true);
  const viewContainerRef = React.useRef<HTMLDivElement>(null);

  // Switch view with GSAP animation
  const switchView = (newView: ActiveView) => {
    setActiveView(newView);
    if (viewContainerRef.current) {
      animateViewTransition(viewContainerRef.current);
    }
  };

  // Task Drawer & Modals state
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Filter state
  const [searchFilter, setSearchFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const loadProject = async () => {
    if (!projectId) return;
    try {
      const data = await api.getProjectDetails(projectId);
      setProject(data);
    } catch (err) {
      console.error('Failed to load project details', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
      return;
    }
    loadProject();
  }, [projectId, user, isAuthLoading]);

  // Extract lists and flat tasks for Kanban, Gantt, and Calendar
  const currentBoard = project?.boards?.[0];

  const lists = useMemo(() => {
    if (!currentBoard?.lists) return [];
    return currentBoard.lists.map((list: any) => ({
      id: list.id,
      name: list.name,
      position: list.position,
      color: list.color,
      tasks: (list.tasks || [])
        .filter((t: any) => {
          if (searchFilter && !t.title.toLowerCase().includes(searchFilter.toLowerCase())) {
            return false;
          }
          if (priorityFilter && t.priority !== priorityFilter) {
            return false;
          }
          return true;
        })
        .map((t: any) => ({
          id: t.id,
          listId: t.listId,
          title: t.title,
          description: t.description,
          position: t.position,
          status: t.status,
          priority: t.priority,
          startDate: t.startDate,
          dueDate: t.dueDate,
          assignees: t.assignees?.map((a: any) => a.user) || [],
          labels: t.labels?.map((l: any) => l.label) || [],
          checklists: t.checklists || [],
          _count: t._count,
        })),
    }));
  }, [currentBoard, searchFilter, priorityFilter]);

  // Flat tasks across all columns for Gantt & Calendar (Single Source of Truth)
  const allTasks = useMemo(() => {
    const arr: any[] = [];
    lists.forEach((list: any) => {
      list.tasks.forEach((t: any) => {
        arr.push(t);
      });
    });
    return arr;
  }, [lists]);

  // Handlers for Kanban operations
  const handleTaskMove = async (taskId: string, targetListId: string, targetPosition: number) => {
    await api.moveTask(taskId, {
      targetListId,
      targetPosition,
    });
    await loadProject();
  };

  const handleCreateTask = async (listId: string, title: string) => {
    await api.createTask(listId, { title });
    await loadProject();
  };

  const handleCreateList = async (name: string) => {
    if (!currentBoard) return;
    await api.createList(currentBoard.id, { name });
    await loadProject();
  };

  const handleRenameList = async (listId: string, newName: string) => {
    await api.updateList(listId, { name: newName });
    await loadProject();
  };

  const handleDeleteList = async (listId: string) => {
    await api.deleteList(listId);
    await loadProject();
  };

  // Handler for Gantt interactive timeline date updates
  const handleUpdateGanttDates = async (
    taskId: string,
    startDate: string,
    dueDate: string,
    progress?: number
  ) => {
    await api.updateGanttDates(taskId, {
      startDate,
      dueDate,
      progressPercentage: progress,
    });
    await loadProject();
  };

  const handleSaveTheme = async (_pId: string, themeId: string, customColor: string) => {
    await api.updateTheme(projectId, {
      backgroundTheme: themeId,
      customColor,
    });
    await loadProject();
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex items-center justify-center text-xs text-slate-500">
        Chargement du projet...
      </div>
    );
  }

  const theme = getThemeById(project.backgroundTheme);
  const color = project.customColor || theme.accentColor;

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col overflow-hidden">
      <AppHeader onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <AppSidebar
          projects={[{ id: project.id, name: project.name, customColor: color }]}
        />

        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0B0D11]">
          {/* Project Header Bar */}
          <div className="h-16 px-6 border-b border-slate-800 bg-[#12151C] shrink-0 flex items-center justify-between">
            {/* Left: Back & Project Identity */}
            <div className="flex items-center gap-4">
              <Link
                href="/overview"
                className="p-1.5 rounded-xl bg-[#1A1F29] hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Retour à tous mes projets"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                    {project.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                  </div>
                </div>
              </div>
            </div>

            {/* Center: View Switcher (Kanban, Gantt, Calendar) */}
            <div className="flex items-center gap-1 bg-[#181D26] p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => switchView('kanban')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all interactive-scale ${
                  activeView === 'kanban'
                    ? 'bg-gradient-warm text-white shadow-md shadow-orange-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Kanban Classic</span>
              </button>

              <button
                onClick={() => switchView('gantt')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all interactive-scale ${
                  activeView === 'gantt'
                    ? 'bg-gradient-warm text-white shadow-md shadow-orange-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Gantt</span>
              </button>

              <button
                onClick={() => switchView('calendar')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all interactive-scale ${
                  activeView === 'calendar'
                    ? 'bg-gradient-warm text-white shadow-md shadow-orange-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendrier</span>
              </button>
            </div>

            {/* Right: Theme button & Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="p-2 rounded-xl bg-[#1A1F29] hover:bg-slate-800 text-slate-400 hover:text-orange-400 border border-slate-800 transition-colors interactive-scale"
                title="Personnaliser l'identité du projet"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Render Active Synchronized View with GSAP animation container */}
          <div ref={viewContainerRef} className="flex-1 overflow-hidden relative">
            {activeView === 'kanban' && (
              <KanbanBoard
                lists={lists}
                onTaskClick={(tId) => setActiveTaskId(tId)}
                onTaskMove={handleTaskMove}
                onCreateTask={handleCreateTask}
                onCreateList={handleCreateList}
                onRenameList={handleRenameList}
                onDeleteList={handleDeleteList}
              />
            )}

            {activeView === 'gantt' && (
              <GanttChart
                tasks={allTasks}
                onTaskClick={(tId) => setActiveTaskId(tId)}
                onUpdateDates={handleUpdateGanttDates}
              />
            )}

            {activeView === 'calendar' && (
              <ProjectCalendar
                tasks={allTasks}
                onTaskClick={(tId) => setActiveTaskId(tId)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Task Drawer */}
      <TaskDrawer
        taskId={activeTaskId}
        onClose={() => setActiveTaskId(null)}
        onTaskUpdated={loadProject}
        availableMembers={project.members?.map((m: any) => m.user) || []}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        projectId={project.id}
        initialThemeId={project.backgroundTheme}
        initialColor={project.customColor}
        onSaveTheme={handleSaveTheme}
      />

      {/* Global Search */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
