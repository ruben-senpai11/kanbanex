'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Inbox,
  Bell,
  Clock,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  User,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityTitle?: string;
  user?: { fullName: string };
  createdAt: string;
}

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activities?: ActivityItem[];
  projectId?: string;
  onNavigateToTask?: (taskId: string) => void;
}

export function InboxDrawer({
  isOpen,
  onClose,
  activities = [],
  projectId,
  onNavigateToTask,
}: InboxDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Boîte de réception & Activité</h2>
                <p className="text-[11px] text-slate-500">Flux d'activité récent sur ce tableau</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Activity Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activities.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Tout est à jour !</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Les modifications de cartes, commentaires et assignations apparaîtront ici en direct.
                </p>
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-orange-500" />
                      {act.user?.fullName || 'Utilisateur'}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(act.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <span className="font-medium text-slate-900">{act.action}</span>
                    {act.entityTitle && (
                      <span className="ml-1 font-semibold text-orange-600">
                        « {act.entityTitle} »
                      </span>
                    )}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Synchronisation temps réel</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
