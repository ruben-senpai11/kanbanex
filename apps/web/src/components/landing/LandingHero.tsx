'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Shield, Zap, CheckCircle2, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getAppUrl } from '@/lib/urls';

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
      );

      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      );

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.45, ease: 'power3.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToDemo = () => {
    const el = document.getElementById('showcase');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden text-center px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-600/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Floating Hero Badge: Direct benefit of the app without Expansion */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-black/60 border border-orange-500/30 backdrop-blur-xl shadow-lg shadow-orange-950/5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
            Conçu spécialement pour les entrepreneurs • The One Thing & GTD
          </span>
        </div>

        {/* Impactful Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] drop-shadow-xs"
        >
          La plateforme #1 pour organiser ses projets{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
            et sa vision à long terme.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Tamisez objectivement vos idées, éliminez le superflu avec Essentialism et concentrez toute votre énergie sur votre Domino #1. La puissance de Getting Things Done alliée à une expérience panoramique cinématographique.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={getAppUrl('/signup')}>
            <Button
              size="lg"
              className="brand-glow bg-gradient-warm text-white font-black text-sm px-7 py-3.5 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="lg"
            onClick={scrollToDemo}
            className="border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-sm px-6 py-3.5 rounded-xl backdrop-blur-md w-full sm:w-auto transition-all shadow-xs"
          >
            <Play className="w-4 h-4 mr-2 fill-slate-800 dark:fill-white" />
            <span>Tester la démo interactive</span>
          </Button>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Commencer avec 0F à planifier vos projets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            <span>Déploiement instantané</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Formule Entreprise offerte au Super Admin</span>
          </div>
        </div>
      </div>
    </section>
  );
}
