'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Select, SelectOption } from '@/components/ui/Select';
import { Search, FolderKanban, CheckSquare, Calendar, Tag, AlertCircle, ArrowRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_FILTER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Toute priorité' },
  { value: 'URGENT', label: 'Urgent', colorDot: '#EF4444' },
  { value: 'HIGH', label: 'Élevée', colorDot: '#F59E0B' },
  { value: 'MEDIUM', label: 'Moyenne', colorDot: '#3B82F6' },
  { value: 'LOW', label: 'Basse', colorDot: '#10B981' },
];

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tous statuts' },
  { value: 'TODO', label: 'À faire', colorDot: '#64748B' },
  { value: 'IN_PROGRESS', label: 'En cours', colorDot: '#3B82F6' },
  { value: 'IN_REVIEW', label: 'En revue', colorDot: '#8B5CF6' },
  { value: 'DONE', label: 'Terminé', colorDot: '#10B981' },
];

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { currentWorkspace } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isOverdueOnly, setIsOverdueOnly] = useState(false);

  const [results, setResults] = useState<{ projects: any[]; tasks: any[] }>({
    projects: [],
    tasks: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !currentWorkspace) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.globalSearch(currentWorkspace.id, {
          q: query,
          priority: priorityFilter || undefined,
          status: statusFilter || undefined,
          isOverdue: isOverdueOnly ? 'true' : undefined,
        });
        setResults(res);
      } catch {
        setResults({ projects: [], tasks: [] });
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, priorityFilter, statusFilter, isOverdueOnly, isOpen, currentWorkspace]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recherche globale KanbanEX"
      description="Trouvez instantanément un projet, une tâche ou une échéance"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par titre, description, mot-clé..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#15181F] border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80"
            autoFocus
          />
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] uppercase font-semibold">Filtres :</span>

          {/* Priority filter */}
          <div className="w-36">
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={PRIORITY_FILTER_OPTIONS}
            />
          </div>

          {/* Status filter */}
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
            />
          </div>

          {/* Overdue toggle */}
          <button
            onClick={() => setIsOverdueOnly(!isOverdueOnly)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              isOverdueOnly
                ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700/70'
                : 'bg-slate-100 dark:bg-[#181D26] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/80 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Tâches en retard
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Recherche dans votre univers de projets...
            </div>
          ) : (
            <>
              {/* Projects Matches */}
              {results.projects.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                    Projets ({results.projects.length})
                  </h4>
                  {results.projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        router.push(`/projects/${proj.id}`);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-[#15181F] hover:bg-slate-100 dark:hover:bg-[#1A1F29] border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: proj.customColor || '#F97316' }}
                        />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {proj.name}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks Matches */}
              {results.tasks.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                    Tâches ({results.tasks.length})
                  </h4>
                  {results.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        router.push(`/projects/${task.project.id}`);
                        onClose();
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-[#15181F] hover:bg-slate-100 dark:hover:bg-[#1A1F29] border border-slate-200 dark:border-slate-800 transition-colors flex flex-col gap-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={task.priority} />
                          <StatusBadge status={task.status} />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          <FolderKanban className="w-3 h-3 text-orange-500" />
                          {task.project.name}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty Search State */}
              {results.projects.length === 0 && results.tasks.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  {query
                    ? 'Aucun résultat ne correspond à votre recherche.'
                    : 'Commencez à taper un mot-clé pour chercher dans vos projets.'}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
