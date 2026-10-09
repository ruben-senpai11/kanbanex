'use client';

import React from 'react';
import {
  Kanban,
  Wallpaper,
  BarChart2,
  Shield,
  CreditCard,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export function InteractiveBentoGrid() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 select-none">
      {/* Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Zap className="w-3.5 h-3.5" />
          Conçu pour l&apos;Excellence
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Tout ce dont vos équipes ont besoin pour performer
        </h2>
        <p className="text-sm md:text-base text-slate-400">
          Une infrastructure pensée pour éliminer la friction cognitive et propulser vos projets vers leur accomplissement.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Trello Pure & Zero Sidebar (Col span 2) */}
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-[#12151C] to-[#1A1F29]/60 p-7 md:p-9 relative overflow-hidden group hover:border-orange-500/40 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />

          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Kanban className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              Interface Kanban Pure & Plein Écran
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Fini les barres latérales encombrantes qui réduisent votre espace de travail. KabanEx libère 100% de la largeur de votre écran pour vos colonnes de tâches, vos cartes blanches contrastées et son mini-dock inférieur ultra-réactif.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Colonnes grises Trello (#F1F2F4)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Badges compteurs en temps réel
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Dock flottant rétractable
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Responsive Wallpapers (Col span 1) */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12151C] to-[#171B24] p-7 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallpaper className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              Wallpapers Cinématiques
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Arrière-plan signature KabanEx adaptatif : panorama 16:9 au lever du soleil sur grand écran et format 9:16 portrait immersif sur smartphone.
            </p>
          </div>

          <div className="pt-6">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-amber-300/90 flex items-center justify-between">
              <span>Mode automatique</span>
              <span className="text-[10px] text-emerald-400">Adapté au système</span>
            </div>
          </div>
        </div>

        {/* Card 3: Gantt Timeline (Col span 1) */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12151C] to-[#171B24] p-7 relative overflow-hidden group hover:border-sky-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BarChart2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              Gantt & Dépendances
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visualisez le chemin critique de vos projets, jalonnez vos livrables et ajustez les dates de sprint d&apos;un simple glissement.
            </p>
          </div>

          <div className="pt-6">
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-[70%]" />
            </div>
          </div>
        </div>

        {/* Card 4: Governance & Super Admin (Col span 2) */}
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-[#12151C] to-[#1A1F29]/60 p-7 md:p-9 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              Gouvernance & Formule Entreprise par Défaut
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Le premier utilisateur enregistré devient automatiquement le Super Administrateur de la plateforme et bénéficie d&apos;emblée du plan Entreprise illimité. Créez des espaces de travail cloisonnés et invitez vos collaborateurs en toute sérénité.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Plan Entreprise offert au Super Admin
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Gestion granulaire des membres
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Transactions & facturation sécurisées
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
