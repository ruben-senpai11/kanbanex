'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Shield, Zap, CheckCircle2, Play } from 'lucide-react';
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
        {/* Floating Hero Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-orange-500/30 backdrop-blur-xl shadow-xl shadow-orange-950/20">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-bold text-orange-400">
            Écosystème Expansion • Plateforme de gestion de projets unifiée
          </span>
        </div>

        {/* Impactful Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md"
        >
          Une seule plateforme pour vos projets.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
            Une vision absolue.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Fini la dispersion des tâches. Rassemblez vos tableaux Kanban agiles, vos diagrammes de Gantt, vos calendriers et vos univers cinématiques dans une interface fluide et instantanée.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={getAppUrl('/signup')}>
            <Button
              size="lg"
              className="brand-glow bg-gradient-warm text-white font-black text-sm px-7 py-3.5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="lg"
            onClick={scrollToDemo}
            className="border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-sm px-6 py-3.5 rounded-2xl backdrop-blur-md w-full sm:w-auto transition-all"
          >
            <Play className="w-4 h-4 mr-2 fill-white" />
            <span>Tester la démo interactive</span>
          </Button>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>0 carte bancaire requise</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Déploiement instantané</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Formule Entreprise offerte au Super Admin</span>
          </div>
        </div>
      </div>
    </section>
  );
}
