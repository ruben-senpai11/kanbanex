'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BoardSubHeader } from '@/components/kanban/BoardSubHeader';
import { BottomNavigationDock, BoardActiveView } from '@/components/kanban/BottomNavigationDock';
import { InboxDrawer } from '@/components/kanban/InboxDrawer';
import { BoardFilterModal } from '@/components/kanban/BoardFilterModal';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { GanttChart } from '@/components/gantt/GanttChart';
import { ProjectCalendar } from '@/components/calendar/ProjectCalendar';
import { TaskDrawer } from '@/components/task/TaskDrawer';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { ThemeSelectorModal } from '@/components/overview/ThemeSelectorModal';
import { PlanModal } from '@/components/overview/PlanModal';
import { CreateProjectModal } from '@/components/overview/CreateProjectModal';
import { getThemeById } from '@/lib/themes';
import { KanbanColumnSkeleton } from '@/components/ui/Skeleton';
import { animateViewTransition } from '@/lib/animations';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params?.id as string;
  const router = useRouter();
  const { user, currentWorkspace, isLoading: isAuthLoading } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<BoardActiveView>('kanban');
  const [isLoading, setIsLoading] = useState(true);
  const viewContainerRef = React.useRef<HTMLDivElement>(null);

  // Switch view with GSAP animation
  const switchView = (newView: BoardActiveView) => {
    setActiveView(newView);
    if (viewContainerRef.current) {
      animateViewTransition(viewContainerRef.current);
    }
  };

  // Drawer & Modal States
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Filter States
  const [searchFilter, setSearchFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [labelFilter, setLabelFilter] = useState('');

  // Active filter count
  const activeFilterCount = (searchFilter ? 1 : 0) + (priorityFilter ? 1 : 0) + (labelFilter ? 1 : 0);

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

  const loadAllProjects = async () => {
    if (!currentWorkspace) return;
    try {
      const list = await api.getProjectsOverview(currentWorkspace.id);
      setAllProjects(list);
    } catch (err) {
      console.error('Failed to load workspace projects', err);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
      return;
    }
    loadProject();
    loadAllProjects();
  }, [projectId, user, isAuthLoading, currentWorkspace]);

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
          if (labelFilter && !t.labels?.some((l: any) => l.labelId === labelFilter || l.label?.id === labelFilter)) {
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
  }, [currentBoard, searchFilter, priorityFilter, labelFilter]);

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

  // Available labels in project
  const projectLabels = useMemo(() => {
    const map = new Map<string, any>();
    currentBoard?.lists?.forEach((l: any) => {
      l.tasks?.forEach((t: any) => {
        t.labels?.forEach((lb: any) => {
          if (lb.label) map.set(lb.label.id, lb.label);
        });
      });
    });
    return Array.from(map.values());
  }, [currentBoard]);

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

  const handleCreateProject = async (data: any) => {
    if (!currentWorkspace) return;
    const res = await api.createProject(currentWorkspace.id, data);
    setIsNewProjectOpen(false);
    if (res?.id) {
      router.push(`/projects/${res.id}`);
    }
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        <div className="h-12 bg-white/70 border-b border-slate-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-24 h-5 rounded bg-slate-200 shimmer-effect" />
            <div className="h-4 w-px bg-slate-200" />
            <div className="w-32 h-5 rounded bg-slate-200 shimmer-effect" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-6 rounded bg-slate-200 shimmer-effect" />
            <div className="w-6 h-6 rounded-full bg-slate-200 shimmer-effect" />
          </div>
        </div>
        <div className="flex-1 p-6 flex gap-4 overflow-hidden">
          <KanbanColumnSkeleton />
          <KanbanColumnSkeleton />
          <KanbanColumnSkeleton />
        </div>
      </div>
    );
  }

  const theme = getThemeById(project.backgroundTheme);
  const isDark = theme.isDark ?? false;

  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden relative transition-colors duration-300 ${
        theme.backgroundClass
      }`}
      style={theme.backgroundStyle}
    >
      {/* Responsive Wallpaper Layer for KanbanEx official brand backgrounds */}
      {theme.isWallpaper && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          {/* Mobile Wallpaper: 9:16 Portrait (Img 2) */}
          <div
            className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/images/kanbanex-mobile.jpg')` }}
          />
          {/* Desktop Wallpaper: 16:9 Landscape (Img 3) */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/images/kanbanex-desktop.jpg')` }}
          />
          {/* Subtle atmospheric scrim for crisp contrast on Trello cards */}
          <div className="absolute inset-0 bg-black/15" />
        </div>
      )}

      {/* Unified Board Header (KanbanEx brand logo, Project title, switcher, avatars, filters, share, theme, notifications, Pro upgrade) */}
      <BoardSubHeader
        projectName={project.name}
        projectId={project.id}
        allProjects={allProjects}
        onSelectProject={(id) => router.push(`/projects/${id}`)}
        members={project.members?.map((m: any) => m.user) || []}
        onOpenFilter={() => setIsFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenPlanModal={() => setIsPlanModalOpen(true)}
        isDarkTheme={isDark}
      />

      {/* Main Workspace Area: Kanban, Gantt, or Calendar */}
      <main className="flex-1 flex flex-col h-[calc(100vh-48px)] overflow-hidden relative">
        <div ref={viewContainerRef} className="flex-1 flex overflow-hidden relative">
          {activeView === 'kanban' && (
            <KanbanBoard
              lists={lists}
              onTaskClick={(tId) => setActiveTaskId(tId)}
              onTaskMove={handleTaskMove}
              onCreateTask={handleCreateTask}
              onCreateList={handleCreateList}
              onRenameList={handleRenameList}
              onDeleteList={handleDeleteList}
              isDarkTheme={isDark}
            />
          )}

          {activeView === 'gantt' && (
            <div className="flex-1 p-4 md:p-6 overflow-hidden">
              <GanttChart
                tasks={allTasks}
                onTaskClick={(tId) => setActiveTaskId(tId)}
                onUpdateDates={handleUpdateGanttDates}
              />
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="flex-1 p-4 md:p-6 overflow-hidden">
              <ProjectCalendar
                tasks={allTasks}
                onTaskClick={(tId) => setActiveTaskId(tId)}
              />
            </div>
          )}
        </div>

        {/* Floating Navigation Dock: Tableau | Gantt | Calendrier */}
        <BottomNavigationDock
          activeView={activeView}
          onSelectView={switchView}
          isDarkTheme={isDark}
        />
      </main>

      {/* Task Drawer */}
      <TaskDrawer
        taskId={activeTaskId}
        onClose={() => setActiveTaskId(null)}
        onTaskUpdated={loadProject}
        availableMembers={project.members?.map((m: any) => m.user) || []}
      />

      {/* Slide-out Inbox / Activity Drawer */}
      <InboxDrawer
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        activities={project.activities || []}
        projectId={project.id}
        onNavigateToTask={(tId) => {
          setIsInboxOpen(false);
          setActiveTaskId(tId);
        }}
      />

      {/* Filter Popover Modal */}
      <BoardFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        searchQuery={searchFilter}
        onSearchChange={setSearchFilter}
        selectedPriority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        labels={projectLabels}
        selectedLabelId={labelFilter}
        onLabelChange={setLabelFilter}
        onReset={() => {
          setSearchFilter('');
          setPriorityFilter('');
          setLabelFilter('');
        }}
      />

      {/* Theme Selector Modal (White, Gradients, Silk Waves...) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        projectId={project.id}
        initialThemeId={project.backgroundTheme}
        initialColor={project.customColor}
        onSaveTheme={handleSaveTheme}
      />

      {/* Plan / Subscription Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />

      {/* Create New Project Modal */}
      <CreateProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Global Search (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
