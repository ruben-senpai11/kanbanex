'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp, Heart } from 'lucide-react';

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-2xl text-slate-400 text-xs py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-500/40 shadow-sm bg-black shrink-0">
              <Image
                src="/images/kabanex-logo.jpg"
                alt="KabanEx"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-black text-base text-white tracking-tight flex items-center justify-center sm:justify-start">
                Kaban<span className="text-orange-500">Ex</span>
              </span>
              <p className="text-[11px] text-slate-500">Vos projets. Une seule vision.</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <Link href="/legal/terms" className="hover:text-white transition-colors">
              Conditions Générales (CGU)
            </Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
            <Link href="/legal/mentions" className="hover:text-white transition-colors">
              Mentions Légales
            </Link>
          </div>

          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all text-xs"
            title="Revenir en haut"
          >
            <span>Haut de page</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-[11px] text-slate-500">
          <p>© 2026 KabanEx • Écosystème Expansion. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu pour la haute productivité et l&apos;orchestration agile
          </p>
        </div>
      </div>
    </footer>
  );
}
