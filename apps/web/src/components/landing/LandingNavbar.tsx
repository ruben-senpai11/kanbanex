'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AppLogo } from '@/components/ui/AppLogo';
import { getAppUrl, getLandingUrl } from '@/lib/urls';

export function LandingNavbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-black/75 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg py-3'
          : 'bg-transparent py-[18px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={getLandingUrl('/')} className="flex items-center gap-2.5 group">
          <AppLogo size="md" withText textClassName="font-black text-lg text-slate-900 dark:text-white group-hover:opacity-90 transition-opacity" priority />
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Fonctionnalités
          </button>
          <button
            onClick={() => scrollToSection('showcase')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Vues interactives
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Tarifs
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Link href={getAppUrl('/overview')}>
              <Button size="sm" className="brand-glow bg-gradient-warm text-white font-bold">
                <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                <span>Mon Espace de travail</span>
              </Button>
            </Link>
          ) : (
            <>
              <Link href={getAppUrl('/login')}>
                <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white">
                  Se connecter
                </Button>
              </Link>
              <Link href={getAppUrl('/signup')}>
                <Button size="sm" className="brand-glow bg-gradient-warm text-white font-bold shadow-md">
                  <span>Démarrer gratuitement</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <Link href={getAppUrl('/overview')}>
              <Button size="sm" className="bg-gradient-warm text-white text-xs px-2.5 py-1">
                Espace
              </Button>
            </Link>
          ) : null}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#0E1117]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 px-6 py-6 space-y-4 animate-fade-in text-slate-800 dark:text-slate-200">
          <nav className="flex flex-col gap-3.5 text-sm font-semibold">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-1 hover:text-orange-500"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-left py-1 hover:text-orange-500"
            >
              Vues interactives
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-left py-1 hover:text-orange-500"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left py-1 hover:text-orange-500"
            >
              FAQ
            </button>
          </nav>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2.5">
            {user ? (
              <Link href={getAppUrl('/overview')} className="w-full">
                <Button className="w-full bg-gradient-warm text-white font-bold">
                  Accéder à mon espace
                </Button>
              </Link>
            ) : (
              <>
                <Link href={getAppUrl('/login')} className="w-full">
                  <Button variant="ghost" className="w-full text-slate-700 dark:text-slate-300">
                    Se connecter
                  </Button>
                </Link>
                <Link href={getAppUrl('/signup')} className="w-full">
                  <Button className="w-full bg-gradient-warm text-white font-bold">
                    Démarrer gratuitement
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
