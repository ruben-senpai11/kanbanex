'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { CreditCard, Shield, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { formatFCFA } from '@/lib/utils';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanModal({ isOpen, onClose }: PlanModalProps) {
  const router = useRouter();
  const { currentWorkspace } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !currentWorkspace) return;

    const loadSub = async () => {
      setIsLoading(true);
      try {
        const data = await api.getWorkspaceSubscription(currentWorkspace.id);
        setSubscription(data);
      } catch (err) {
        console.error('Failed to load subscription in modal', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSub();
  }, [isOpen, currentWorkspace]);

  const activePlanName = subscription?.subscription?.plan?.name || currentWorkspace?.subscription?.plan?.name || 'Formule Starter';
  const activePlanPrice = subscription?.subscription?.plan?.priceMonthly ?? 0;
  const status = subscription?.subscription?.status || 'Actif';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mon Plan & Abonnement"
      description={`Espace de travail : ${currentWorkspace?.name || 'Mon Espace'}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Active plan card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Abonnement Actuel
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {activePlanName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statut : <span className="font-semibold text-emerald-500">{status}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activePlanPrice === 0 ? 'Gratuit' : formatFCFA(activePlanPrice)}
              </span>
              {activePlanPrice > 0 && (
                <span className="text-[10px] text-slate-400 block">/mois</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-500/20 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Tableaux Kanban illimités et vues calendrier</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Personnalisation cinématique des arrières-plans</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Collaboration et assignations en temps réel</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>

          <Button
            onClick={() => {
              onClose();
              router.push('/billing');
            }}
            className="brand-glow"
          >
            <span>Gérer les formules</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
