'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { AppLogo } from '@/components/ui/AppLogo';

export default function SignupPage() {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signup({
        fullName,
        email,
        password,
        workspaceName: workspaceName.trim() || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D11] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Responsive Wallpaper Backdrop (Mobile Img 2 vs Desktop Img 3) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <div
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/kabanex-mobile.jpg')` }}
        />
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/kabanex-desktop.jpg')` }}
        />
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-md" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header with Official KabanEx Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <AppLogo size="xl" priority className="mb-2" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Créer un compte Kaban<span className="text-orange-500">Ex</span>
          </h1>
          <p className="text-xs text-amber-100 font-medium drop-shadow-sm">
            Vos projets. Une seule vision.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#12151C]/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom complet *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alban Expansion"
              required
              autoFocus
            />

            <Input
              label="Adresse email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alban@expansion.io"
              required
            />

            <Input
              label="Mot de passe * (min 8 caractères)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <Input
              label="Nom de l'espace de travail (optionnel)"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="ex. Expansion Studio"
            />

            <Button
              type="submit"
              size="lg"
              className="w-full brand-glow mt-2"
              isLoading={isLoading}
            >
              <span>Commencer immédiatement</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Déjà inscrit ?{' '}
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold underline underline-offset-4"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
