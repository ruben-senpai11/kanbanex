'use client';

import React, { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Trash2,
  Edit2,
  X,
  Clock,
  ChevronRight,
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
  isDarkTheme?: boolean;
}

export function KanbanBoard({
  lists,
  onTaskClick,
  onTaskMove,
  onCreateTask,
  onCreateList,
  onDeleteList,
  onRenameList,
  isDarkTheme = false,
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

  // Column menu popover
  const [activeMenuColId, setActiveMenuColId] = useState<string | null>(null);

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
    if (!newTaskTitle.trim()) {
      setActiveNewTaskCol(null);
      return;
    }
    await onCreateTask(listId, newTaskTitle.trim());
    setNewTaskTitle('');
    setActiveNewTaskCol(null);
  };

  const handleCreateListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) {
      setIsAddingList(false);
      return;
    }
    await onCreateList(newListName.trim());
    setNewListName('');
    setIsAddingList(false);
  };

  const handleSaveRename = async (listId: string) => {
    if (!editingListName.trim()) {
      setEditingListId(null);
      return;
    }
    await onRenameList(listId, editingListName.trim());
    setEditingListId(null);
  };

  return (
    <div className="flex-1 flex overflow-x-auto overflow-y-hidden p-4 md:p-6 gap-3.5 select-none items-start horizontal-scroll-container">
      {lists.map((list) => {
        const isDragOver = dragOverListId === list.id;
        const taskCount = list.tasks.length;

        return (
          <div
            key={list.id}
            onDragOver={(e) => handleDragOver(e, list.id)}
            onDragLeave={() => {
              if (dragOverListId === list.id) setDragOverListId(null);
            }}
            onDrop={(e) => handleDrop(e, list.id)}
            className={`w-[280px] shrink-0 rounded-2xl flex flex-col max-h-[calc(100vh-140px)] transition-all duration-200 border ${
              isDragOver
                ? 'ring-2 ring-orange-500 bg-orange-50/80 border-orange-300'
                : 'bg-[#F1F2F4]/95 backdrop-blur-xs border-slate-200/80 shadow-xs'
            }`}
          >
            {/* Column Header: Title, Count Badge, Options */}
            <div className="px-3.5 py-3 flex items-center justify-between shrink-0 relative">
              {editingListId === list.id ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="text"
                    value={editingListName}
                    onChange={(e) => setEditingListName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(list.id);
                      if (e.key === 'Escape') setEditingListId(null);
                    }}
                    autoFocus
                    className="w-full text-xs font-bold px-2 py-1 rounded bg-white text-slate-900 border border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSaveRename(list.id)}
                    className="p-1 text-slate-600 hover:text-emerald-600"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingListId(null)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3
                    onDoubleClick={() => {
                      setEditingListId(list.id);
                      setEditingListName(list.name);
                    }}
                    className="font-bold text-xs md:text-sm text-slate-800 truncate cursor-pointer hover:text-slate-950"
                    title={list.name}
                  >
                    {list.name}
                  </h3>

                  {/* Count badge like in screenshot: 2, 10, 6, 4 */}
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200/80 text-slate-600 shrink-0">
                    {taskCount}
                  </span>
                </div>
              )}

              {/* Column options menu toggle */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenuColId(activeMenuColId === list.id ? null : list.id)
                  }
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
                  title="Actions de la liste"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {activeMenuColId === list.id && (
                  <div
                    className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-40 animate-fade-in text-slate-700"
                    onClick={() => setActiveMenuColId(null)}
                  >
                    <button
                      onClick={() => {
                        setEditingListId(list.id);
                        setEditingListName(list.name);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      Renommer la liste
                    </button>
                    <button
                      onClick={() => onDeleteList(list.id)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      Supprimer la liste
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Task Cards Container */}
            <div className="px-2.5 pb-2 flex-1 overflow-y-auto space-y-2 min-h-[40px]">
              {list.tasks.map((task) => {
                // Calculate checklist items count
                const totalChecklist =
                  task.checklists?.reduce((sum, c) => sum + (c.items?.length || 0), 0) || 0;
                const completedChecklist =
                  task.checklists?.reduce(
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
                    className="p-3 rounded-xl bg-white hover:bg-white border border-slate-200/90 hover:border-orange-500/50 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col gap-2 group active:cursor-grabbing active:scale-[0.98]"
                  >
                    {/* Top Labels row */}
                    {task.labels?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {task.labels.map((label) => (
                          <span
                            key={label.id}
                            className="px-2 py-0.5 rounded text-[10px] font-bold border"
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

                    {/* Task Title (High Legibility & Modern Font) */}
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-orange-600 transition-colors leading-relaxed">
                      {task.title}
                    </p>

                    {/* Metadata & Indicators footer */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={task.priority} />

                        {task.dueDate && (
                          <span
                            className={`flex items-center gap-1 text-[10px] font-semibold ${
                              isOverdue
                                ? 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded'
                                : 'text-slate-500'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}

                        {totalChecklist > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <CheckSquare className="w-3 h-3 text-slate-400" />
                            {completedChecklist}/{totalChecklist}
                          </span>
                        )}

                        {(task._count?.comments ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <MessageSquare className="w-3 h-3 text-slate-400" />
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
                              className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold text-[9px] border border-white flex items-center justify-center shadow-xs"
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
                <div className="p-2.5 rounded-xl bg-white border border-orange-500 shadow-sm space-y-2">
                  <textarea
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Saisissez un titre pour cette carte..."
                    rows={2}
                    className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
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
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleCreateTaskSubmit(list.id)}
                      className="px-3 py-1 rounded-md bg-gradient-warm text-white text-xs font-semibold hover:brightness-105 shadow-2xs"
                    >
                      Ajouter une carte
                    </button>
                    <button
                      onClick={() => setActiveNewTaskCol(null)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveNewTaskCol(list.id);
                    setNewTaskTitle('');
                  }}
                  className="w-full py-2 px-3 rounded-xl text-left text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4 text-slate-500" />
                  <span>Ajouter une carte</span>
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* + Ajouter une autre liste (Rightmost Column) */}
      <div className="w-[280px] shrink-0">
        {isAddingList ? (
          <form
            onSubmit={handleCreateListSubmit}
            className="p-3 rounded-2xl bg-[#F1F2F4] border border-slate-300/80 shadow-sm space-y-2.5"
          >
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Saisissez le titre de la liste..."
              autoFocus
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-orange-500 text-xs font-semibold text-slate-900 focus:outline-none shadow-2xs"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-gradient-warm text-white text-xs font-semibold hover:brightness-105 shadow-2xs"
              >
                Ajouter la liste
              </button>
              <button
                type="button"
                onClick={() => setIsAddingList(false)}
                className="p-1 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingList(true)}
            className="w-full py-3 px-4 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-xs border border-slate-200/80 hover:border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>Ajouter une autre liste</span>
          </button>
        )}
      </div>
    </div>
  );
}
