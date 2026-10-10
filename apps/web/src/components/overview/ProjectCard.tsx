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
  Zap,
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
  const color = project.customColor || theme.accentColor || '#FF7A00';

  // Determine the background layer style from project settings / theme
  const backgroundStyle: React.CSSProperties = {
    background: project.coverUrl
      ? `url(${project.coverUrl}) center/cover no-repeat`
      : theme.desktopBg
      ? `url(${theme.desktopBg}) center/cover no-repeat`
      : theme.previewBg || `linear-gradient(135deg, ${color}33 0%, #0F172A 100%)`,
  };

  const isOneThing = project.priority === 'URGENT';

  return (
    <div
      className={`w-[320px] md:w-[350px] lg:w-[370px] shrink-0 h-full flex flex-col rounded-3xl relative overflow-hidden card-hover-effect group select-none transition-all duration-300 ${
        isOneThing
          ? 'border-2 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40'
          : 'border border-white/20 shadow-2xl'
      }`}
    >
      {/* 1. Underlying Atmospheric Wallpaper / Color Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
        style={backgroundStyle}
      />

      {/* 2. Frosted Backdrop Blur & High-Contrast Scrim Layer */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-md pointer-events-none transition-colors duration-300 group-hover:bg-slate-950/60" />

      {/* 3. Deep Vignette Gradient for Crystal-Clear Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

      {/* 4. Top Accent Stripe using the project's primary color */}
      <div
        className="h-1.5 w-full shrink-0 relative z-10"
        style={{
          background: isOneThing
            ? 'linear-gradient(90deg, #F59E0B 0%, #FF7A00 100%)'
            : `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
        }}
      />

      {/* 5. Card Header: Badges, Theme Customizer & Title */}
      <div className="p-5 pb-2 relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            {isOneThing ? (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/80 text-amber-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <Zap className="w-3 h-3 fill-amber-300 text-amber-300 animate-pulse shrink-0" />
                <span>The One Thing</span>
              </div>
            ) : (
              <PriorityBadge priority={project.priority} />
            )}
          </div>

          {onOpenThemeSelector && (
            <button
              onClick={() => onOpenThemeSelector(project.id)}
              className="p-1.5 rounded-xl bg-black/40 hover:bg-black/70 text-slate-300 hover:text-orange-400 border border-white/15 backdrop-blur-sm transition-colors shadow-xs"
              title="Personnaliser l'identité visuelle de ce projet"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold tracking-tight leading-snug line-clamp-2 text-white group-hover:text-orange-300 drop-shadow-md transition-colors">
            {project.name}
          </h3>
          {project.description ? (
            <p className="text-xs mt-1 line-clamp-2 leading-relaxed text-slate-200 drop-shadow-xs">
              {project.description}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1 italic">
              Aucune description renseignée.
            </p>
          )}
        </div>
      </div>

      {/* 6. Body: Dates, Real Metrics, Progress */}
      <div className="px-5 py-2 flex-1 flex flex-col justify-between space-y-4 relative z-10">
        {/* Planned and Actual Dates (Frosted Glass Container) */}
        <div className="rounded-2xl p-3 bg-black/40 backdrop-blur-sm border border-white/10 text-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              Période planifiée :
            </span>
            <span className="font-semibold text-white drop-shadow-2xs">
              {project.plannedStartDate ? formatDate(project.plannedStartDate) : 'Non définie'}
              {project.plannedEndDate ? ` → ${formatDate(project.plannedEndDate)}` : ''}
            </span>
          </div>

          {(project.actualStartDate || project.actualEndDate) && (
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3 h-3 text-emerald-400" />
                Réel :
              </span>
              <span className="font-semibold text-emerald-400">
                {project.actualStartDate ? formatDate(project.actualStartDate) : ''}
                {project.actualEndDate ? ` → ${formatDate(project.actualEndDate)}` : ' (en cours)'}
              </span>
            </div>
          )}
        </div>

        {/* Real Task Metrics Grid (3 Frosted Glass Tiles) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl p-2.5 bg-black/35 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Tâches</span>
            <span className="text-base font-extrabold text-white mt-0.5 drop-shadow-xs">
              {project.metrics.totalTasks}
            </span>
          </div>

          <div className="rounded-xl p-2.5 bg-black/35 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Faites</span>
            <span className="text-base font-extrabold text-emerald-400 mt-0.5 drop-shadow-xs">
              {project.metrics.completedTasks}
            </span>
          </div>

          <div className="rounded-xl p-2.5 bg-black/35 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-orange-400 uppercase font-bold tracking-wider">En cours</span>
            <span className="text-base font-extrabold text-orange-400 mt-0.5 drop-shadow-xs">
              {project.metrics.inProgressTasks}
            </span>
          </div>
        </div>

        {/* Overdue Alert Pill if tasks are late */}
        {project.metrics.overdueTasks > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 backdrop-blur-sm border border-rose-500/40 text-rose-200 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>{project.metrics.overdueTasks} tâche{project.metrics.overdueTasks > 1 ? 's' : ''} en retard</span>
          </div>
        )}

        {/* Global Progression Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold drop-shadow-2xs">Progression globale</span>
            <span className="font-extrabold text-white drop-shadow-xs">
              {project.metrics.progressPercentage}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full overflow-hidden p-0.5 bg-black/50 border border-white/15">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{
                width: `${project.metrics.progressPercentage}%`,
                background: `linear-gradient(90deg, ${color}88 0%, ${color} 100%)`,
              }}
            />
          </div>
        </div>

        {/* Team Avatars & Next Deadline */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          {/* Members Avatars Stack */}
          <div className="flex items-center -space-x-2">
            {project.initiator && (
              <div
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                title={`Initiateur : ${project.initiator.fullName}`}
              >
                {project.initiator.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            {project.members.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="w-7 h-7 rounded-full bg-slate-700 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                title={m.fullName}
              >
                {m.fullName.slice(0, 2).toUpperCase()}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-300 shadow-md">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          {/* Next upcoming deadline */}
          {project.nextDeadline ? (
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block font-medium">Prochaine échéance</span>
              <span className="text-xs font-bold text-orange-400 drop-shadow-2xs">
                {formatDate(project.nextDeadline)}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">Aucune échéance</span>
          )}
        </div>

        {/* Labels chips */}
        {project.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
            {project.labels.slice(0, 4).map((l) => (
              <span
                key={l.id}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-xs"
                style={{
                  backgroundColor: `${l.color}25`,
                  borderColor: `${l.color}60`,
                  color: '#FFFFFF',
                }}
              >
                {l.name}
              </span>
            ))}
            {project.labels.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/40 text-slate-300 font-bold border border-white/10">
                +{project.labels.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 7. Footer / Direct Enter Project Action */}
      <div className="p-4 pt-3 border-t border-white/10 relative z-10 bg-black/40 backdrop-blur-sm">
        <Link
          href={`/projects/${project.id}`}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 group/btn bg-white/15 hover:bg-gradient-warm text-white border border-white/25 hover:border-transparent shadow-md active:scale-98"
        >
          <span>Ouvrir l&apos;espace Kanban</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
