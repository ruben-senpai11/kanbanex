'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#0B0D11] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
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
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header with Official KabanEx Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl shadow-orange-950/60 mb-2 bg-black">
            <Image
              src="/images/kabanex-logo.jpg"
              alt="KabanEx"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Connexion à Kaban<span className="text-orange-500">Ex</span>
          </h1>
          <p className="text-xs text-amber-200/80 font-medium">
            Vos projets. Une seule vision.
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl bg-[#12151C]/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alban@expansion.io"
              required
              autoFocus
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <Button
              type="submit"
              size="lg"
              className="w-full brand-glow mt-2"
              isLoading={isLoading}
            >
              <span>Se connecter</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Pas encore de compte ?{' '}
              <Link
                href="/signup"
                className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
