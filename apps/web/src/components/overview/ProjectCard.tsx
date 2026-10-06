'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  ArrowRight,
  Palette,
  Layers,
  Sparkles,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { getThemeById } from '@/lib/themes';

export interface ProjectOverviewData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  priority: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  customColor?: string;
  customGradient?: string;
  backgroundTheme?: string;
  coverUrl?: string;
  initiator?: { id: string; fullName: string; avatarUrl?: string };
  members: Array<{ id: string; fullName: string; avatarUrl?: string; role: string }>;
  metrics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    progressPercentage: number;
  };
  nextDeadline?: string | null;
  lastActivity?: { action: string; createdAt: string; user?: { fullName: string } };
  labels: Array<{ id: string; name: string; color: string }>;
}

interface ProjectCardProps {
  project: ProjectOverviewData;
  onOpenThemeSelector?: (projectId: string) => void;
}

export function ProjectCard({ project, onOpenThemeSelector }: ProjectCardProps) {
  const theme = getThemeById(project.backgroundTheme);
  const color = project.customColor || theme.accentColor;

  return (
    <div
      className="w-[320px] md:w-[350px] lg:w-[370px] shrink-0 h-full flex flex-col rounded-3xl border border-slate-800/90 relative overflow-hidden card-hover-effect group select-none shadow-2xl"
      style={{
        background: '#12151C',
      }}
    >
      {/* Cinematic Background Atmosphere */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
        style={{
          background: theme.previewBg,
        }}
      />
      {/* Dark Vignette Overlay for maximum text contrast and legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-[#0E1117]/85 to-[#0B0D11]/60 pointer-events-none" />

      {/* Top Banner Accent Stripe */}
      <div
        className="h-1.5 w-full shrink-0 relative z-10"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, #FF7A00 100%)`,
        }}
      />

      {/* Card Header */}
      <div className="p-5 pb-3 relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>

          {onOpenThemeSelector && (
            <button
              onClick={() => onOpenThemeSelector(project.id)}
              className="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-400 hover:text-orange-400 transition-colors border border-white/5"
              title="Personnaliser l'identité visuelle (Thème cinématographique)"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug line-clamp-2 group-hover:text-orange-300 transition-colors">
            {project.name}
          </h3>
          {project.description ? (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          ) : (
            <p className="text-xs text-slate-600 mt-1 italic">
              Aucune description renseignée.
            </p>
          )}
        </div>
      </div>

      {/* Body: Dates, Metrics, Progress */}
      <div className="px-5 py-2 flex-1 flex flex-col justify-between space-y-4 relative z-10">
        {/* Planned and Actual Dates */}
        <div className="bg-black/35 rounded-2xl p-3 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              Période planifiée :
            </span>
            <span className="font-medium text-slate-200">
              {project.plannedStartDate ? formatDate(project.plannedStartDate) : 'Non définie'}
              {project.plannedEndDate ? ` → ${formatDate(project.plannedEndDate)}` : ''}
            </span>
          </div>

          {(project.actualStartDate || project.actualEndDate) && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3 h-3 text-emerald-400" />
                Réel :
              </span>
              <span className="font-medium text-emerald-400">
                {project.actualStartDate ? formatDate(project.actualStartDate) : ''}
                {project.actualEndDate ? ` → ${formatDate(project.actualEndDate)}` : ' (en cours)'}
              </span>
            </div>
          )}
        </div>

        {/* Real Task Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Tâches</span>
            <span className="text-base font-bold text-white mt-0.5">
              {project.metrics.totalTasks}
            </span>
          </div>

          <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold">Faites</span>
            <span className="text-base font-bold text-emerald-300 mt-0.5">
              {project.metrics.completedTasks}
            </span>
          </div>

          <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-orange-400 uppercase font-semibold">En cours</span>
            <span className="text-base font-bold text-orange-300 mt-0.5">
              {project.metrics.inProgressTasks}
            </span>
          </div>
        </div>

        {/* Overdue Alert Pill if tasks are late */}
        {project.metrics.overdueTasks > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>{project.metrics.overdueTasks} tâche{project.metrics.overdueTasks > 1 ? 's' : ''} en retard</span>
          </div>
        )}

        {/* Global Progression Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Progression globale</span>
            <span className="font-bold text-white">{project.metrics.progressPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${project.metrics.progressPercentage}%`,
                background: `linear-gradient(90deg, #FF7A00 0%, ${color} 100%)`,
              }}
            />
          </div>
        </div>

        {/* Team Avatars & Next Deadline */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          {/* Members Avatars Stack */}
          <div className="flex items-center -space-x-2">
            {project.initiator && (
              <div
                className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-[#12151C] flex items-center justify-center text-[10px] font-bold text-white shadow"
                title={`Initiateur : ${project.initiator.fullName}`}
              >
                {project.initiator.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            {project.members.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="w-7 h-7 rounded-full bg-slate-700 border-2 border-[#12151C] flex items-center justify-center text-[10px] font-semibold text-slate-200 shadow"
                title={m.fullName}
              >
                {m.fullName.slice(0, 2).toUpperCase()}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#12151C] flex items-center justify-center text-[9px] font-semibold text-slate-300">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          {/* Next upcoming deadline */}
          {project.nextDeadline ? (
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Prochaine échéance</span>
              <span className="text-xs font-medium text-orange-300">
                {formatDate(project.nextDeadline)}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 italic">Aucune échéance</span>
          )}
        </div>

        {/* Labels chips */}
        {project.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
            {project.labels.slice(0, 4).map((l) => (
              <span
                key={l.id}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
                style={{
                  backgroundColor: `${l.color}15`,
                  borderColor: `${l.color}40`,
                  color: l.color,
                }}
              >
                {l.name}
              </span>
            ))}
            {project.labels.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-400">
                +{project.labels.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / Direct Enter Project Action */}
      <div className="p-4 pt-3 border-t border-slate-800/80 bg-black/40 relative z-10">
        <Link
          href={`/projects/${project.id}`}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1A1F29] hover:bg-gradient-warm text-slate-200 hover:text-white text-xs font-semibold tracking-wide transition-all duration-300 group/btn border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-orange-950/40"
        >
          <span>Entrer dans le projet</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
