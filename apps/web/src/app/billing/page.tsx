'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/Button';
import { formatFCFA, formatDate } from '@/lib/utils';
import { Check, Shield, Zap, CreditCard, ExternalLink, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BillingPage() {
  const { currentWorkspace, refreshUserData } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadBillingData = async () => {
    if (!currentWorkspace) return;
    setIsLoading(true);
    try {
      const [plansData, subData] = await Promise.all([
        api.getPlans(),
        api.getWorkspaceSubscription(currentWorkspace.id),
      ]);
      setPlans(plansData);
      setSubscriptionData(subData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();

    // Vérifier si l'utilisateur revient du guichet de paiement avec un paramètre ?tx=...
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const txId = params.get('tx');
      if (txId) {
        const verifyPaymentReturn = async () => {
          try {
            await api.verifyPayment(txId);
            setNotification({
              type: 'success',
              message: 'Paiement confirmé avec succès ! Votre nouvel abonnement est maintenant actif.',
            });
            await loadBillingData();
            await refreshUserData();
          } catch (err: any) {
            setNotification({
              type: 'error',
              message: err.message || 'Le paiement n\'a pas pu être validé par la passerelle.',
            });
          } finally {
            window.history.replaceState({}, '', window.location.pathname);
          }
        };
        verifyPaymentReturn();
      }
    }
  }, [currentWorkspace]);

  const handleSubscribe = async (planSlug: string) => {
    if (!currentWorkspace) return;
    setCheckoutLoading(planSlug);
    setNotification(null);

    try {
      const callbackUrl = `${window.location.origin}/billing`;
      const res = await api.createCheckout(currentWorkspace.id, {
        planSlug,
        callbackUrl,
      });

      if (res.isFree) {
        setNotification({ type: 'success', message: res.message });
        await loadBillingData();
        await refreshUserData();
      } else if (res.checkoutUrl && res.checkoutUrl.startsWith('http')) {
        // Redirection sécurisée vers la page de paiement FedaPay
        window.location.href = res.checkoutUrl;
      } else if (res.transactionId) {
        // Mode simulation dev (hors-ligne ou sans clé FedaPay)
        await api.verifyPayment(res.transactionId);
        setNotification({
          type: 'success',
          message: `[Mode Simulation Dev] Abonnement validé avec succès !`,
        });
        await loadBillingData();
        await refreshUserData();
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Erreur lors de l\'initiation du paiement sécurisé',
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const activePlanSlug = subscriptionData?.subscription?.plan?.slug || 'basic';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0D11] dark:text-slate-100 flex flex-col overflow-hidden">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50 dark:bg-[#0B0D11]">
          {/* Header */}
          <div className="max-w-5xl mx-auto space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Paiements Sécurisés (Carte & Mobile Money)
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Abonnements & Plans KanbanEX
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Choisissez le niveau de puissance adapté à vos projets et débloquez la personnalisation cinématographique.
            </p>
          </div>

          {notification && (
            <div className="max-w-5xl mx-auto">
              <div
                className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-3 ${
                  notification.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                }`}
              >
                {notification.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
            </div>
          )}

          {/* Current Subscription Info */}
          {subscriptionData && (
            <div className="max-w-5xl mx-auto p-6 rounded-3xl bg-white dark:bg-[#12151C] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Abonnement actuel</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                  Plan {subscriptionData.subscription?.plan?.name || 'Basic'}
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    Actif
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Projets actifs : {subscriptionData.usage.projectsCount} / {subscriptionData.usage.maxProjects === -1 ? 'Illimité' : subscriptionData.usage.maxProjects} •
                  Membres : {subscriptionData.usage.membersCount} / {subscriptionData.usage.maxMembers === -1 ? 'Illimité' : subscriptionData.usage.maxMembers}
                </p>
              </div>

              {subscriptionData.subscription?.currentPeriodEnd && (
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Renouvellement le</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(subscriptionData.subscription.currentPeriodEnd)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Subscription Plans Grid (Prices dynamically loaded from DB) */}
          {isLoading ? (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#12151C] border border-slate-200 dark:border-slate-800 space-y-4">
                  <Skeleton className="h-6 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-8 w-36 rounded-xl my-4" />
                  <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-4/5 rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-xl mt-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrent = activePlanSlug === plan.slug || (activePlanSlug === 'basic' && plan.slug === 'starter');
                const isPro = plan.slug === 'pro';
                const isEntreprise = plan.slug === 'entreprise' || plan.slug === 'enterprise';

                // Exact features from Image 1 / Login benefits
                const featuresList = plan.slug === 'starter' || plan.slug === 'basic'
                  ? [
                      'Tableaux Kanban illimités',
                      'Vue calendrier et échéancier',
                      'Arrière-plans signature KanbanEx',
                      'Jusqu\'à 3 membres par espace',
                    ]
                  : isPro
                  ? [
                      'Toutes les fonctionnalités Starter',
                      'Diagramme de Gantt interactif',
                      'Membres et collaborateurs illimités',
                      'Personnalisation cinématique complète',
                      'Paiement sécurisé et instantané',
                    ]
                  : [
                      'Toutes les fonctionnalités Pro',
                      'Console Super Admin centralisée',
                      'Multi-espaces de travail illimités',
                      'Gestion avancée de la tarification',
                      'Support dédié et prioritaire 24/7',
                    ];

                return (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-xl border flex flex-col justify-between relative transition-all shadow-sm ${
                      isPro
                        ? 'bg-gradient-to-b from-orange-50/60 to-white dark:from-[#181D26] dark:to-[#12151C] border-orange-500 ring-2 ring-orange-500/20 shadow-xl'
                        : 'bg-white dark:bg-[#12151C] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {isPro && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-warm text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        Le plus populaire
                      </div>
                    )}

                    {isEntreprise && (
                      <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-bold">
                        Inclus pour le Super Admin
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                          {plan.description}
                        </p>
                      </div>

                      {/* Price in FCFA directly from DB */}
                      <div className="pt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                            {plan.price === 0 ? '0 FCFA' : formatFCFA(plan.price)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {plan.price === 0 ? '/toujours gratuit' : '/mois'}
                          </span>
                        </div>
                      </div>

                      {/* Features list */}
                      <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                        {featuresList.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subscribe / Change Action */}
                    <div className="pt-8">
                      {isCurrent ? (
                        <Button variant="secondary" className="w-full rounded-lg" disabled>
                          Plan actuel
                        </Button>
                      ) : (
                        <Button
                          variant={isPro ? 'primary' : 'secondary'}
                          className="w-full rounded-lg"
                          isLoading={checkoutLoading === plan.slug}
                          onClick={() => handleSubscribe(plan.slug)}
                        >
                          {plan.price === 0
                            ? 'Démarrer gratuitement'
                            : isPro
                            ? 'Passer à la formule Pro →'
                            : 'Rejoindre l\'Écosystème'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Transactions History */}
          {subscriptionData?.transactions?.length > 0 && (
            <div className="max-w-5xl mx-auto space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Historique des transactions
              </h3>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12151C] divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
                {subscriptionData.transactions.map((tx: any) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{tx.plan?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Réf : {tx.providerTxId || tx.id} • {formatDate(tx.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-900 dark:text-white">{formatFCFA(tx.amount)}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          tx.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60'
                            : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/60'
                        }`}
                      >
                        {tx.status === 'APPROVED' ? 'Payé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
