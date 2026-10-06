'use client';

import React, { useState } from 'react';
import {
  Plus,
  MoreVertical,
  Calendar,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Trash2,
  Edit2,
  X,
  Clock,
} from 'lucide-react';
import { PriorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export interface KanbanTask {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  status: string;
  priority: string;
  startDate?: string;
  dueDate?: string;
  assignees: Array<{ id: string; fullName: string; avatarUrl?: string }>;
  labels: Array<{ id: string; name: string; color: string }>;
  checklists?: Array<{ id: string; items: Array<{ id: string; isCompleted: boolean }> }>;
  _count?: { comments: number; attachments: number };
}

export interface KanbanList {
  id: string;
  name: string;
  position: number;
  color?: string;
  tasks: KanbanTask[];
}

interface KanbanBoardProps {
  lists: KanbanList[];
  onTaskClick: (taskId: string) => void;
  onTaskMove: (taskId: string, targetListId: string, targetPosition: number) => Promise<void>;
  onCreateTask: (listId: string, title: string) => Promise<void>;
  onCreateList: (name: string) => Promise<void>;
  onDeleteList: (listId: string) => Promise<void>;
  onRenameList: (listId: string, newName: string) => Promise<void>;
}

export function KanbanBoard({
  lists,
  onTaskClick,
  onTaskMove,
  onCreateTask,
  onCreateList,
  onDeleteList,
  onRenameList,
}: KanbanBoardProps) {
  // State for inline card creation
  const [activeNewTaskCol, setActiveNewTaskCol] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // State for adding a column
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Column renaming state
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    if (dragOverListId !== listId) {
      setDragOverListId(listId);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    setDragOverListId(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const targetList = lists.find((l) => l.id === targetListId);
    const newPosition = targetList ? (targetList.tasks.length + 1) * 1000 : 1000;

    await onTaskMove(taskId, targetListId, newPosition);
    setDraggedTaskId(null);
  };

  const handleCreateTaskSubmit = async (listId: string) => {
    if (!newTaskTitle.trim()) return;
    await onCreateTask(listId, newTaskTitle.trim());
    setNewTaskTitle('');
    setActiveNewTaskCol(null);
  };

  const handleCreateListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    await onCreateList(newListName.trim());
    setNewListName('');
    setIsAddingList(false);
  };

  const handleRenameListSubmit = async (listId: string) => {
    if (!editingListName.trim()) return;
    await onRenameList(listId, editingListName.trim());
    setEditingListId(null);
  };

  return (
    <div className="flex-1 flex gap-5 overflow-x-auto p-6 items-start h-full min-h-0 select-none horizontal-scroll-container">
      {lists.map((list) => {
        const isDragOver = dragOverListId === list.id;
        return (
          <div
            key={list.id}
            onDragOver={(e) => handleDragOver(e, list.id)}
            onDrop={(e) => handleDrop(e, list.id)}
            className={`w-[300px] shrink-0 bg-[#12151C] border rounded-2xl flex flex-col max-h-full transition-all duration-200 ${
              isDragOver ? 'border-orange-500 bg-[#151922] shadow-xl' : 'border-slate-800/80 shadow-md'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: list.color || '#94A3B8' }}
                />
                {editingListId === list.id ? (
                  <input
                    type="text"
                    value={editingListName}
                    onChange={(e) => setEditingListName(e.target.value)}
                    onBlur={() => handleRenameListSubmit(list.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameListSubmit(list.id)}
                    className="w-full bg-[#181D26] px-2 py-0.5 rounded text-xs text-white border border-slate-700 focus:outline-none focus:border-orange-500"
                    autoFocus
                  />
                ) : (
                  <h4
                    onClick={() => {
                      setEditingListId(list.id);
                      setEditingListName(list.name);
                    }}
                    className="text-xs font-bold text-slate-200 truncate cursor-pointer hover:text-white"
                  >
                    {list.name}
                  </h4>
                )}
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full shrink-0">
                  {list.tasks.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDeleteList(list.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
                  title="Supprimer la colonne"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Task Cards Container */}
            <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5 min-h-[80px]">
              {list.tasks.map((task) => {
                // Calculate checklist items count
                const totalChecklist = task.checklists?.reduce(
                  (sum, c) => sum + (c.items?.length || 0),
                  0
                ) || 0;
                const completedChecklist = task.checklists?.reduce(
                  (sum, c) => sum + (c.items?.filter((i) => i.isCompleted).length || 0),
                  0
                ) || 0;

                // Overdue status check
                const isOverdue =
                  task.dueDate &&
                  new Date(task.dueDate) < new Date() &&
                  task.status !== 'DONE';

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onTaskClick(task.id)}
                    className="p-3.5 rounded-xl bg-[#181D26] hover:bg-[#1E2430] border border-slate-800 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-950/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm flex flex-col gap-2 group active:cursor-grabbing active:scale-[0.98]"
                  >
                    {/* Top Labels row */}
                    {task.labels?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {task.labels.map((label) => (
                          <span
                            key={label.id}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                            style={{
                              backgroundColor: `${label.color}15`,
                              borderColor: `${label.color}40`,
                              color: label.color,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Task Title */}
                    <p className="text-xs font-semibold text-slate-100 group-hover:text-orange-300 transition-colors leading-snug">
                      {task.title}
                    </p>

                    {/* Metadata & Indicators footer */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 mt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <PriorityBadge priority={task.priority} />

                        {task.dueDate && (
                          <span
                            className={`flex items-center gap-1 font-medium ${
                              isOverdue ? 'text-rose-400 font-bold' : 'text-slate-400'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}

                        {totalChecklist > 0 && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <CheckSquare className="w-3 h-3" />
                            {completedChecklist}/{totalChecklist}
                          </span>
                        )}

                        {(task._count?.comments ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MessageSquare className="w-3 h-3" />
                            {task._count?.comments}
                          </span>
                        )}
                      </div>

                      {/* Assignee Avatar */}
                      {task.assignees?.length > 0 && (
                        <div className="flex items-center -space-x-1.5">
                          {task.assignees.slice(0, 2).map((a) => (
                            <div
                              key={a.id}
                              className="w-5 h-5 rounded-full bg-slate-700 border border-[#181D26] flex items-center justify-center text-[9px] font-bold text-white shadow"
                              title={a.fullName}
                            >
                              {a.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Inline Create Task Form */}
              {activeNewTaskCol === list.id ? (
                <div className="p-2.5 rounded-xl bg-[#181D26] border border-orange-500/80 space-y-2">
                  <textarea
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Saisissez le titre de la carte..."
                    rows={2}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCreateTaskSubmit(list.id);
                      }
                      if (e.key === 'Escape') {
                        setActiveNewTaskCol(null);
                      }
                    }}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveNewTaskCol(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCreateTaskSubmit(list.id)}
                      className="px-2.5 py-1 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveNewTaskCol(list.id);
                    setNewTaskTitle('');
                  }}
                  className="w-full py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter une carte
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Add New Column Button / Input */}
      <div className="w-[280px] shrink-0">
        {isAddingList ? (
          <form
            onSubmit={handleCreateListSubmit}
            className="p-3 rounded-2xl bg-[#12151C] border border-orange-500 space-y-2.5 shadow-xl"
          >
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Titre de la nouvelle colonne..."
              className="w-full bg-[#181D26] px-3 py-2 rounded-xl text-xs text-white border border-slate-700 focus:outline-none focus:border-orange-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingList(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600"
              >
                Créer la colonne
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingList(true)}
            className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-slate-800 hover:border-orange-500/50 bg-[#12151C]/40 hover:bg-[#15181F] text-xs font-semibold text-slate-400 hover:text-orange-400 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter une colonne
          </button>
        )}
      </div>
    </div>
  );
}
