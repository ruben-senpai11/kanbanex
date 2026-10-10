'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Briefcase,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AppLogo } from '@/components/ui/AppLogo';
import { getLandingUrl } from '@/lib/urls';
import { LoginBenefitsShowcase } from '@/components/auth/LoginBenefitsShowcase';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await signup({
        fullName,
        email,
        password,
        workspaceName: workspaceName.trim() || undefined,
      });
      if (res?.requiresEmailVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0B0D11] text-slate-900 dark:text-slate-100 select-none">
      {/* ========================================================================= */}
      {/* VOLET GAUCHE : FORMULAIRE D'INSCRIPTION (~45% Desktop)                    */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[480px] xl:w-[540px] 2xl:w-[580px] shrink-0 flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-white dark:bg-[#0E121A] border-r border-slate-200/80 dark:border-white/10 z-20 shadow-xl lg:shadow-none min-h-screen">
        {/* 1. Header with Logo & Back to Site Link */}
        <div className="flex items-center justify-between pb-6">
          <Link href={getLandingUrl('/')} className="group">
            <AppLogo
              size="lg"
              withText
              priority
              textClassName="text-xl font-black text-slate-900 dark:text-white group-hover:opacity-90 transition-opacity"
            />
          </Link>

          <Link
            href={getLandingUrl('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Accueil</span>
          </Link>
        </div>

        {/* 2. Main Signup Form Container */}
        <div className="my-auto py-4 max-w-md w-full mx-auto space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <Zap className="w-3 h-3" />
              <span>Création de compte gratuite</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Rejoindre KanbanEx
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Démarrez en quelques secondes et organisez vos projets avec fluidité.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nom complet */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nom complet *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alban Expansion"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Adresse email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alban@expansion.io"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Mot de passe * (min. 8 caractères)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-100/80 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-2 transition-colors"
                  title={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Espace de travail */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nom de votre premier espace (optionnel)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="ex. Expansion Studio"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full py-3.5 text-sm font-black bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-105 text-white rounded-xl shadow-lg shadow-orange-500/25 brand-glow transition-all interactive-scale mt-2"
              isLoading={isLoading}
            >
              <span>Créer mon compte KanbanEx</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Déjà inscrit */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Déjà un compte ?{' '}
              <Link
                href="/login"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-black underline underline-offset-4 ml-1"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* 3. Footer Security */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Sécurisé • 0 engagement</span>
          </div>
          <span>© 2026 KanbanEx</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VOLET DROIT : BÉNÉFICES DE L'APPLICATION INTERACTIFS (~55% Desktop)       */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <LoginBenefitsShowcase />
      </div>
    </div>
  );
}
