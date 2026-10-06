import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    info: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    purple: 'bg-purple-950/70 text-purple-300 border-purple-800/60',
    orange: 'bg-orange-950/70 text-orange-300 border-orange-800/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PLANNING':
      return <Badge variant="info">Planification</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="orange">En cours</Badge>;
    case 'ON_HOLD':
      return <Badge variant="warning">En pause</Badge>;
    case 'COMPLETED':
      return <Badge variant="success">Terminé</Badge>;
    case 'ARCHIVED':
      return <Badge variant="default">Archivé</Badge>;
    // Task Statuses
    case 'TODO':
      return <Badge variant="default">À faire</Badge>;
    case 'IN_REVIEW':
      return <Badge variant="purple">En revue</Badge>;
    case 'BLOCKED':
      return <Badge variant="danger">Bloqué</Badge>;
    case 'DONE':
      return <Badge variant="success">Fait</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}

export function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case 'URGENT':
      return <Badge variant="danger">Urgent</Badge>;
    case 'HIGH':
      return <Badge variant="orange">Élevée</Badge>;
    case 'MEDIUM':
      return <Badge variant="info">Moyenne</Badge>;
    case 'LOW':
      return <Badge variant="default">Basse</Badge>;
    default:
      return <Badge variant="default">{priority}</Badge>;
  }
}
