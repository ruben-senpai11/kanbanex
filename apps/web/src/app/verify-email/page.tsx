'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CheckCircle2,
  XCircle,
  Mail,
  Loader2,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { getLandingUrl } from '@/lib/urls';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { completeVerification } = useAuth();

  const token = searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>(
    token ? 'loading' : 'pending',
  );
  const [message, setMessage] = useState<string>('');
  const [resendEmail, setResendEmail] = useState<string>(initialEmail);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendFeedback, setResendFeedback] = useState<{ success: boolean; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (!token) {
      setStatus('pending');
      return;
    }

    let isMounted = true;

    async function executeVerification() {
      setStatus('loading');
      try {
        const res = await api.verifyEmail(token as string);
        if (!isMounted) return;
        setStatus('success');
        setMessage(res.message || 'Votre compte a été vérifié avec succès !');

        // Store tokens and sync user
        if (res.accessToken) {
          await completeVerification(res);
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push('/overview');
          }, 2000);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setMessage(err.message || 'Le lien de validation est invalide ou a expiré.');
      }
    }

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token, completeVerification, router]);

  const handleResend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resendEmail || !resendEmail.includes('@')) {
      setResendFeedback({ success: false, text: 'Veuillez saisir une adresse email valide.' });
      return;
    }

    setIsResending(true);
    setResendFeedback(null);
    try {
      const res = await api.resendVerification(resendEmail);
      setResendFeedback({
        success: true,
        text: res.message || 'Email de validation renvoyé ! Vérifiez votre boîte de réception.',
      });
    } catch (err: any) {
      setResendFeedback({
        success: false,
        text: err.message || 'Échec de l\'envoi de l\'email.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <AppLogo size="xl" priority className="mb-2" />
        <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Kanban<span className="text-orange-500">Ex</span>
        </h1>
        <p className="text-xs text-amber-100 font-medium drop-shadow-sm">
          Vos projets. Une seule vision.
        </p>
      </div>

      {/* Main Card */}
      <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#12151C]/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        {/* STATE 1: LOADING */}
        {status === 'loading' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Validation en cours...
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nous vérifions votre jeton de sécurité. Veuillez patienter un instant.
              </p>
            </div>
          </div>
        )}

        {/* STATE 2: SUCCESS */}
        {status === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Compte Activé
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Email Validé avec Succès !
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {message || 'Votre adresse a été confirmée. Redirection vers votre espace de travail...'}
              </p>
            </div>

            <div className="pt-2">
              <Link href="/overview" className="w-full">
                <Button className="w-full brand-glow bg-gradient-warm text-white font-bold">
                  <span>Accéder à mon espace</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* STATE 3: ERROR */}
        {status === 'error' && (
          <div className="space-y-5">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <XCircle className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Échec de Validation
                </h2>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {message}
                </p>
              </div>
            </div>

            {/* Resend Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Saisissez votre email pour recevoir un nouveau lien de validation :
              </p>

              <form onSubmit={handleResend} className="space-y-2.5">
                <Input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="w-full font-bold bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-white"
                  isLoading={isResending}
                >
                  <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Renvoyer l&apos;email de validation</span>
                </Button>
              </form>

              {resendFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium ${
                    resendFeedback.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-300'
                  }`}
                >
                  {resendFeedback.text}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 font-semibold"
              >
                Retour à la connexion
              </Link>
              <Link
                href={getLandingUrl('/')}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                Retour au site
              </Link>
            </div>
          </div>
        )}

        {/* STATE 4: PENDING (Instructions to check inbox) */}
        {status === 'pending' && (
          <div className="space-y-5">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-xl shadow-orange-950/20">
                <Mail className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Vérifiez votre boîte de réception
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Un email avec un lien de validation a été envoyé{' '}
                  {initialEmail ? (
                    <strong className="text-white">à {initialEmail}</strong>
                  ) : (
                    'à votre adresse'
                  )}
                  .
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                📬 Que devez-vous faire ?
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <li>Ouvrez l&apos;email reçu de <strong>KanbanEx</strong></li>
                <li>Cliquez sur le bouton <strong>Valider mon adresse email</strong></li>
                <li>Pensez à vérifier votre dossier <strong>Spams / Courriers indésirables</strong></li>
              </ul>
            </div>

            {/* Resend Form */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Vous n&apos;avez rien reçu après quelques minutes ?
              </p>

              <form onSubmit={handleResend} className="space-y-2">
                <Input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Confirmer votre email..."
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="w-full font-bold"
                  isLoading={isResending}
                >
                  <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Renvoyer l&apos;email de validation</span>
                </Button>
              </form>

              {resendFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium text-center ${
                    resendFeedback.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-300'
                  }`}
                >
                  {resendFeedback.text}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 font-semibold"
              >
                Retour à la connexion
              </Link>
              <Link
                href={getLandingUrl('/')}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                Retour au site
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D11] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Responsive Wallpaper Backdrop */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <div
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/kanbanex-mobile.jpg')` }}
        />
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/kanbanex-desktop.jpg')` }}
        />
        <div className="absolute inset-0 bg-black/75 dark:bg-black/85 backdrop-blur-md" />
      </div>

      <Suspense
        fallback={
          <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#12151C]/90 text-center text-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
            <p className="mt-2 text-xs text-slate-400">Chargement...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
