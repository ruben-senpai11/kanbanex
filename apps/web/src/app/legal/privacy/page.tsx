'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AppLogo } from '@/components/ui/AppLogo';
import { getLandingUrl } from '@/lib/urls';

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            <Lock className="w-3.5 h-3.5" />
            Protection & Confidentialité
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-slate-400">
            Dernière mise à jour : 9 octobre 2026 • KabanEx Data Privacy
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-bold text-white">1. Collecte des Données Personnelles</h2>
          <p>
            KabanEx ne collecte que les informations strictement nécessaires au bon fonctionnement du service : nom complet, adresse email professionnelle, préférences d&apos;affichage, ainsi que les données relatives aux projets et tâches créés par l&apos;utilisateur.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Utilisation des Données</h2>
          <p>
            Vos données sont utilisées exclusivement pour :
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-400">
            <li>L&apos;authentification sécurisée (tokens JWT, sessions chiffrées argon2).</li>
            <li>La synchronisation et la sauvegarde de vos projets, tableaux et collaborateurs.</li>
            <li>La gestion des abonnements et des facturations sécurisées.</li>
            <li>L&apos;amélioration continue des performances et de la fiabilité de l&apos;application.</li>
          </ul>

          <h2 className="text-lg font-bold text-white pt-4">3. Sécurité et Chiffrement</h2>
          <p>
            Toutes les communications entre votre navigateur et nos serveurs sont protégées par chiffrement SSL/TLS haute sécurité. Les mots de passe sont hachés de manière irréversible via Argon2id et les bases de données PostgreSQL sont hébergées sur des infrastructures cloud isolées et conformes aux plus hauts standards de résilience.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Non-Partage et Zéro Vente de Données</h2>
          <p>
            KabanEx ne vend, ne loue et ne cède aucune de vos données personnelles à des tiers ou courtiers en données à des fins publicitaires. Vos projets et informations restent votre propriété exclusive.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">5. Droits de l&apos;Utilisateur</h2>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles sur simple demande via votre tableau de bord ou par email à support@kabanex.io.
          </p>
        </section>
      </main>
    </div>
  );
}
