'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getAppUrl } from '@/lib/urls';

export function InteractivePricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 select-none">
      {/* Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
          <Zap className="w-3.5 h-3.5" />
          Tarification Transparente
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Investissez dans l&apos;efficacité de votre équipe
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Commencez gratuitement. Évoluez au rythme de vos ambitions sans engagement ni frais cachés.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold transition-colors ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            Facturation Mensuelle
          </span>

          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/20 p-1 transition-colors relative"
            aria-label="Basculer facturation annuelle"
          >
            <div
              className={`w-6 h-6 rounded-full bg-gradient-warm shadow-md transition-transform duration-200 ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold transition-colors ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              Facturation Annuelle
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/40">
              -20% d&apos;économie
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Plan 1: Starter */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#12151C]/90 backdrop-blur-xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-300 dark:hover:border-white/25 transition-all shadow-xl">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Starter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pour les créateurs et indépendants</p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">0 FCFA</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">/toujours gratuit</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Tableaux Kanban illimités</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Vue calendrier et échéancier</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Arrière-plans signature KanbanEx</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Jusqu&apos;à 3 membres par espace</span>
              </div>
            </div>
          </div>

          <Link href={getAppUrl('/signup')} className="w-full">
            <Button variant="secondary" className="w-full font-bold">
              Démarrer gratuitement
            </Button>
          </Link>
        </div>

        {/* Plan 2: Pro (Featured) */}
        <div className="rounded-3xl border-2 border-orange-500 bg-white dark:bg-[#171B24] backdrop-blur-xl p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-orange-500/10 dark:shadow-orange-950/40 hover:scale-[1.02] transition-transform">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-warm text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md">
            Le plus populaire
          </div>

          <div className="space-y-4">
            <div className="space-y-1 pt-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Pro</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pour les équipes et studios en croissance</p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {isAnnual ? '7 900 FCFA' : '9 900 FCFA'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">/mois</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Toutes les fonctionnalités Starter</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Diagramme de Gantt interactif</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Membres et collaborateurs illimités</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Personnalisation cinématique complète</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Paiement sécurisé et instantané</span>
              </div>
            </div>
          </div>

          <Link href={getAppUrl('/signup')} className="w-full">
            <Button className="w-full brand-glow bg-gradient-warm text-white font-black shadow-lg">
              <span>Passer à la formule Pro</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Plan 3: Entreprise (Super Admin Default) */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#12151C]/90 backdrop-blur-xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-300 dark:hover:border-emerald-500/40 transition-all shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Entreprise</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                  Inclus pour le Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pour les grandes organisations & le Super Admin</p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {isAnnual ? '23 900 FCFA' : '29 900 FCFA'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">/mois</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Toutes les fonctionnalités Pro</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Console Super Admin centralisée</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Multi-espaces de travail illimités</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Gestion avancée de la tarification</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Support dédié et prioritaire 24/7</span>
              </div>
            </div>
          </div>

          <Link href={getAppUrl('/signup')} className="w-full">
            <Button variant="secondary" className="w-full font-bold">
              Rejoindre l&apos;Écosystème
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
