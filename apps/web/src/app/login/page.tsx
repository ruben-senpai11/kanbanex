'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AppLogo } from '@/components/ui/AppLogo';
import { getLandingUrl } from '@/lib/urls';
import { LoginBenefitsShowcase } from '@/components/auth/LoginBenefitsShowcase';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0B0D11] text-slate-900 dark:text-slate-100 select-none">
      {/* ========================================================================= */}
      {/* VOLET GAUCHE : FORMULAIRE DE CONNEXION & AUTHENTIFICATION (~45% Desktop) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[480px] xl:w-[540px] 2xl:w-[580px] shrink-0 flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-white dark:bg-[#0E121A] border-r border-slate-200/80 dark:border-white/10 z-20 shadow-xl lg:shadow-none min-h-screen">
        {/* 1. Header with Logo & Back to Site Link */}
        <div className="flex items-center justify-between pb-8">
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

        {/* 2. Main Login Form Container */}
        <div className="my-auto py-6 max-w-md w-full mx-auto space-y-6">
          {/* Headline & Subtitle with high-contrast text */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Espace sécurisé</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Connexion à votre espace
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Vos tableaux, sprints et collaborateurs réunis en un seul endroit.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className={`p-4 rounded-2xl text-xs font-medium space-y-2 border ${
                error.toLowerCase().includes('valider votre adresse email')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300'
              }`}
            >
              <p>{error}</p>
              {error.toLowerCase().includes('valider votre adresse email') && (
                <div className="pt-1">
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(email)}`}
                    className="inline-flex items-center gap-1.5 text-orange-600 dark:text-orange-400 hover:underline font-bold"
                  >
                    <span>Vérifier mon email / Renvoyer le lien</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Adresse email
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.com"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Mot de passe
                </label>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-slate-100/80 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-2.5 transition-colors"
                  title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 bg-slate-100 dark:bg-[#12151C]"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Se souvenir de moi
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full py-3.5 text-sm font-black bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-105 text-white rounded-xl shadow-lg shadow-orange-500/25 brand-glow transition-all interactive-scale"
              isLoading={isLoading}
            >
              <span>Se connecter à KanbanEx</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Sign Up Redirect */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Pas encore de compte ?{' '}
              <Link
                href="/signup"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-black underline underline-offset-4 ml-1"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* 3. Footer Security Trust Seal */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Chiffrement Argon2id • TLS 256 bits</span>
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
