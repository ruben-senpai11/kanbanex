'use client';

import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  Layers,
  Crown,
  Clock,
  ExternalLink,
  X,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationsPopover({
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useClickOutside(popoverRef, () => {
    if (isOpen) onClose();
  });

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNotifications();
      const list = data || [];
      setNotifications(list);
      const unread = list.filter((n: NotificationItem) => !n.isRead).length;
      onUnreadCountChange?.(unread);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      const remainingUnread = notifications.filter(
        (n) => n.id !== id && !n.isRead
      ).length;
      onUnreadCountChange?.(remainingUnread);
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onUnreadCountChange?.(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'WELCOME':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'SUBSCRIPTION':
        return <Crown className="w-4 h-4 text-emerald-500" />;
      case 'PROJECT':
        return <Layers className="w-4 h-4 text-sky-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden animate-fade-in select-none text-slate-800 dark:text-slate-100"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
              title="Tout marquer comme lu"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tout lire</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
        {isLoading && notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Chargement de vos notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2 stroke-1" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Aucune notification
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Vous êtes parfaitement à jour !
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkAsRead(n.id)}
              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                n.isRead
                  ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 opacity-80'
                  : 'bg-slate-100/60 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(n.createdAt)}
                  </span>
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      className="font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Marquer lu
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
