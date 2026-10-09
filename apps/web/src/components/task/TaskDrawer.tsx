'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckSquare,
  MessageSquare,
  Users,
  Tag,
  Trash2,
  Plus,
  Send,
  Link as LinkIcon,
  Activity,
  Check,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate, formatDateTime } from '@/lib/utils';
import { animateDrawerSlideIn, animateCheckmarkPop } from '@/lib/animations';

interface TaskDrawerProps {
  taskId: string | null;
  onClose: () => void;
  onTaskUpdated?: () => void;
  availableMembers?: Array<{ id: string; fullName: string; avatarUrl?: string }>;
}

export function TaskDrawer({
  taskId,
  onClose,
  onTaskUpdated,
  availableMembers = [],
}: TaskDrawerProps) {
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taskId && drawerRef.current) {
      animateDrawerSlideIn(drawerRef.current);
    }
  }, [taskId]);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number | ''>('');
  const [actualHours, setActualHours] = useState<number | ''>('');
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Comment input
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // New Checklist state
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [activeChecklistInput, setActiveChecklistInput] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');

  // Load Task Details
  useEffect(() => {
    if (!taskId) {
      setTask(null);
      return;
    }

    const loadTask = async () => {
      setIsLoading(true);
      try {
        const data = await api.getTaskDetails(taskId);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status);
        setPriority(data.priority);
        setStartDate(data.startDate ? data.startDate.split('T')[0] : '');
        setDueDate(data.dueDate ? data.dueDate.split('T')[0] : '');
        setDueTime(data.dueTime || '');
        setEstimatedHours(data.estimatedHours ?? '');
        setActualHours(data.actualHours ?? '');
        setProgressPercentage(data.progressPercentage || 0);
      } catch (err) {
        console.error('Failed to load task', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  if (!taskId) return null;

  // Handle Updates
  const handleSaveFields = async (customPatch?: any) => {
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        dueTime: dueTime || undefined,
        estimatedHours: estimatedHours !== '' ? Number(estimatedHours) : undefined,
        actualHours: actualHours !== '' ? Number(actualHours) : undefined,
        progressPercentage: Number(progressPercentage),
        ...customPatch,
      };
      await api.updateTask(taskId, payload);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  // Checklists handlers
  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    try {
      await api.addChecklist(taskId, newChecklistTitle.trim());
      setNewChecklistTitle('');
      const updated = await api.getTaskDetails(taskId);
      setTask(updated);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChecklistItem = async (checklistId: string) => {
    if (!newItemText.trim()) return;
    try {
      await api.addChecklistItem(checklistId, newItemText.trim());
      setNewItemText('');
      setActiveChecklistInput(null);
      const updated = await api.getTaskDetails(taskId);
      setTask(updated);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklistItem = async (itemId: string, current: boolean) => {
    try {
      await api.toggleChecklistItem(itemId, !current);
      const updated = await api.getTaskDetails(taskId);
      setTask(updated);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // Comment submission
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      await api.addComment(taskId, newComment.trim());
      setNewComment('');
      const updated = await api.getTaskDetails(taskId);
      setTask(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Assignee toggle
  const handleToggleAssignee = async (userId: string) => {
    const isAssigned = task?.assignees?.some((a: any) => a.userId === userId);
    try {
      if (isAssigned) {
        await api.unassignUser(taskId, userId);
      } else {
        await api.assignUser(taskId, userId);
      }
      const updated = await api.getTaskDetails(taskId);
      setTask(updated);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel with GSAP */}
      <div ref={drawerRef} className="relative w-full max-w-xl bg-white dark:bg-[#12151C] border-l border-slate-200 dark:border-slate-800/90 shadow-2xl h-full flex flex-col z-10 text-slate-900 dark:text-slate-100">
        {/* Header Bar */}
        <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#0E1117]">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Colonne :</span>
            <span className="font-semibold text-orange-500 dark:text-orange-400">
              {task?.list?.name || 'Tableau'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading || !task ? (
          <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-500">
            Chargement des détails de la tâche...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title Input */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleSaveFields()}
                className="w-full text-xl font-bold bg-transparent border-0 border-b border-transparent focus:border-orange-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none pb-1"
                placeholder="Titre de la tâche..."
              />
            </div>

            {/* Quick Status / Priority Selector Badges */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Statut
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    handleSaveFields({ status: e.target.value });
                  }}
                  className="w-full bg-white dark:bg-[#1A1F29] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="TODO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="IN_REVIEW">En revue</option>
                  <option value="BLOCKED">Bloqué</option>
                  <option value="DONE">Terminé</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Priorité
                </label>
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    handleSaveFields({ priority: e.target.value });
                  }}
                  className="w-full bg-white dark:bg-[#1A1F29] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Élevée</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            {/* Dates & Estimation (Essential for Gantt synchronization) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                Planification temporelle & Gantt
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      handleSaveFields({
                        startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      });
                    }}
                    className="w-full bg-white dark:bg-[#1A1F29] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      handleSaveFields({
                        dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      });
                    }}
                    className="w-full bg-white dark:bg-[#1A1F29] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Progress Slider */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Progression</span>
                  <span className="font-bold text-orange-500 dark:text-orange-400">{progressPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={(e) => setProgressPercentage(Number(e.target.value))}
                  onMouseUp={() => handleSaveFields({ progressPercentage })}
                  onTouchEnd={() => handleSaveFields({ progressPercentage })}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Assignees Selector */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-500" />
                Collaborateurs assignés
              </h4>

              <div className="flex flex-wrap gap-2">
                {availableMembers.map((member) => {
                  const isAssigned = task?.assignees?.some((a: any) => a.userId === member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => handleToggleAssignee(member.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                        isAssigned
                          ? 'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-orange-600 dark:text-orange-300 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#15181F] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-700 dark:text-white">
                        {member.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{member.fullName}</span>
                      {isAssigned && <Check className="w-3 h-3 text-orange-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description (Markdown) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</h4>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleSaveFields()}
                rows={4}
                placeholder="Ajoutez une description détaillée de la tâche..."
                className="w-full p-3 bg-slate-50 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500/80 leading-relaxed resize-none"
              />
            </div>

            {/* Checklists Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-orange-500" />
                  Listes de contrôle
                </h4>
              </div>

              {task.checklists?.map((cl: any) => {
                const total = cl.items?.length || 0;
                const completed = cl.items?.filter((i: any) => i.isCompleted).length || 0;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div key={cl.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{cl.title}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{completed}/{total} ({pct}%)</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Items */}
                    <div className="space-y-2 pt-1">
                      {cl.items?.map((item: any) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleChecklistItem(item.id, item.isCompleted)}
                          className="flex items-center gap-2.5 text-xs cursor-pointer group"
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              item.isCompleted
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent'
                            }`}
                          >
                            {item.isCompleted && <Check className="w-3 h-3" />}
                          </div>
                          <span
                            className={item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}
                          >
                            {item.content}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Add Item to Checklist */}
                    {activeChecklistInput === cl.id ? (
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={newItemText}
                          onChange={(e) => setNewItemText(e.target.value)}
                          placeholder="Nouvel élément..."
                          className="flex-1 bg-white dark:bg-[#1A1F29] border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem(cl.id)}
                        />
                        <Button size="sm" onClick={() => handleAddChecklistItem(cl.id)}>
                          Ajouter
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveChecklistInput(cl.id);
                          setNewItemText('');
                        }}
                        className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 font-medium flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        Ajouter un élément
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Add New Checklist Form */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder="Titre de la nouvelle checklist..."
                  className="flex-1 bg-slate-50 dark:bg-[#15181F] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                />
                <Button size="sm" variant="secondary" onClick={handleAddChecklist}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Créer checklist
                </Button>
              </div>
            </div>

            {/* Comments Thread */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                Discussion & Commentaires
              </h4>

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  className="flex-1 bg-slate-50 dark:bg-[#15181F] border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                <Button size="sm" type="submit" isLoading={isSubmittingComment}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>

              {/* Comments list */}
              <div className="space-y-2.5 pt-2">
                {task.comments?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun commentaire pour le moment.</p>
                ) : (
                  task.comments?.map((c: any) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-100 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-900 dark:text-white">{c.user?.fullName}</span>
                        <span className="text-slate-400 dark:text-slate-500">{formatDateTime(c.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer / Delete Task */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={async () => {
                  if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
                    await api.deleteTask(taskId);
                    if (onTaskUpdated) onTaskUpdated();
                    onClose();
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer cette tâche
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
