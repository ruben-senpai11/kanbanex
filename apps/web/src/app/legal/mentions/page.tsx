'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AppLogo } from '@/components/ui/AppLogo';
import { getLandingUrl } from '@/lib/urls';

export default function MentionsPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950/60 text-sky-400 border border-sky-800/50">
            <FileText className="w-3.5 h-3.5" />
            Informations Légales
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Mentions Légales
          </h1>
          <p className="text-sm text-slate-400">
            KabanEx • Écosystème Expansion
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-bold text-white">1. Éditeur du Service</h2>
          <p>
            Le service KabanEx est édité par l&apos;organisation Expansion Ecosystem, dédiée au développement d&apos;outils et de solutions logicielles de haute productivité pour les créateurs, entreprises et équipes agiles.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Hébergement de la Plateforme</h2>
          <p>
            La plateforme logicielle et les services d&apos;infrastructure sont hébergés sur des serveurs cloud sécurisés hautement disponibles :
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400">
            <li>Déploiement Frontend & Edge : Infrastructure Vercel Inc.</li>
            <li>Base de données & Stockage persistant : Neon Cloud (PostgreSQL haute disponibilité).</li>
          </ul>

          <h2 className="text-lg font-bold text-white pt-4">3. Sécurité et Paiements</h2>
          <p>
            Toutes les transactions financières et souscriptions d&apos;abonnements sont chiffrées selon les protocoles internationaux de sécurité bancaire SSL/TLS 256 bits via des fournisseurs de services financiers agréés.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Contact et Support</h2>
          <p>
            Pour toute question, réclamation ou assistance technique relative au service KabanEx :
            <br />
            Email : <span className="text-orange-400 font-semibold">contact@kabanex.io</span>
          </p>
        </section>
      </main>
    </div>
  );
}
