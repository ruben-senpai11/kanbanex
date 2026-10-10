'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AppLogo } from '@/components/ui/AppLogo';
import { getLandingUrl } from '@/lib/urls';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <Link href={getLandingUrl('/')} className="flex items-center gap-2.5">
          <AppLogo size="md" withText textClassName="font-extrabold text-base text-white" />
        </Link>

        <Link href={getLandingUrl('/')}>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Retour à l&apos;accueil
          </Button>
        </Link>
      </header>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8">
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-950/60 text-orange-400 border border-orange-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            Document Contractuel
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Conditions Générales d&apos;Utilisation (CGU)
          </h1>
          <p className="text-sm text-slate-400">
            Dernière mise à jour : 9 octobre 2026 • Plateforme KanbanEx
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-bold text-white">1. Objet et Présentation du Service</h2>
          <p>
            KanbanEx est une solution logicielle SaaS de gestion de projets collaborative développée pour offrir une expérience panoramique, intuitive et cinématique. Les présentes Conditions Générales d&apos;Utilisation régissent l&apos;accès et l&apos;utilisation de la plateforme KanbanEx accessible via le web et tout service associé.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Création de Compte et Rôles</h2>
          <p>
            L&apos;accès aux fonctionnalités requiert la création d&apos;un compte utilisateur. Le premier utilisateur enregistré sur la plateforme se voit attribuer de plein droit le statut de Super Administrateur (Super Admin) avec la formule Entreprise par défaut. L&apos;utilisateur est responsable du maintien de la confidentialité de ses identifiants.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">3. Utilisation de la Plateforme</h2>
          <p>
            L&apos;utilisateur s&apos;engage à utiliser KanbanEx conformément aux lois applicables et à ne pas perturber l&apos;intégrité de l&apos;infrastructure, ni diffuser de contenus illicites ou malveillants au sein des tableaux, cartes, commentaires et pièces jointes.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Abonnements et Facturation Sécurisée</h2>
          <p>
            KanbanEx propose différents niveaux d&apos;abonnements (Starter, Pro, Entreprise). Les paiements sont traités via des passerelles bancaires et financières cryptées certifiées garantissant une totale confidentialité et sécurité des transactions.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">5. Propriété Intellectuelle</h2>
          <p>
            Les marques, interfaces, visuels officiels, codes sources et architectures de KanbanEx demeurent la propriété exclusive de leurs ayants droit. Les contenus et données de projet créés par les utilisateurs restent leur entière propriété.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">6. Modification des Services</h2>
          <p>
            KanbanEx se réserve le droit de faire évoluer, mettre à jour ou optimiser ses fonctionnalités à tout moment pour garantir la meilleure expérience de collaboration et de sécurité.
          </p>
        </section>
      </main>
    </div>
  );
}
