'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatFCFA, formatDate } from '@/lib/utils';
import {
  Shield,
  Users,
  CreditCard,
  Settings,
  DollarSign,
  TrendingUp,
  Layers,
  FolderKanban,
  Check,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'plans' | 'users' | 'transactions' | 'settings'>('plans');

  const [isLoading, setIsLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editMaxProjects, setEditMaxProjects] = useState<number>(0);
  const [editMaxMembers, setEditMaxMembers] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== 'SUPER_ADMIN') {
        router.push('/overview');
        return;
      }
      loadAdminData();
    }
  }, [user, isAuthLoading]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, plansData, usersData, txData, settingsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminPlans(),
        api.getAdminUsers(),
        api.getAdminTransactions(),
        api.getAdminSettings(),
      ]);
      setStats(statsData);
      setPlans(plansData);
      setUsers(usersData.users || []);
      setTransactions(txData.transactions || []);
      setSettings(settingsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditPlan = (plan: any) => {
    setEditingPlanId(plan.id);
    setEditPrice(plan.price);
    setEditMaxProjects(plan.maxProjects);
    setEditMaxMembers(plan.maxMembersPerProject);
  };

  const handleSavePlan = async (planId: string) => {
    try {
      await api.updateAdminPlan(planId, {
        price: Number(editPrice),
        maxProjects: Number(editMaxProjects),
        maxMembersPerProject: Number(editMaxMembers),
      });
      setEditingPlanId(null);
      setSaveSuccessMsg('Prix et quotas du plan mis à jour avec succès.');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erreur mise à jour plan');
    }
  };

  const handleToggleUserRole = async (targetUserId: string, currentRole: string) => {
    const newRole = currentRole === 'SUPER_ADMIN' ? 'USER' : 'SUPER_ADMIN';
    if (confirm(`Changer le rôle de cet utilisateur vers ${newRole} ?`)) {
      await api.updateUserRole(targetUserId, newRole);
      await loadAdminData();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col overflow-hidden">
        <AppHeader />
        <div className="flex-1 flex overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#0B0D11]">
            <div className="max-w-6xl mx-auto space-y-3">
              <Skeleton className="h-6 w-48 rounded-full" />
              <Skeleton className="h-9 w-80 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-md" />
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#12151C] border border-slate-800 space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              ))}
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#12151C] border border-slate-800 space-y-4">
                  <Skeleton className="h-6 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-8 w-32 rounded-xl my-4" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col overflow-hidden">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <AppSidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#0B0D11]">
          {/* Super Admin Banner */}
          <div className="max-w-6xl mx-auto space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Console d'Administration Globale
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Espace Super Admin KanbanEX
            </h1>
            <p className="text-sm text-slate-400">
              Pilotez la tarification des abonnements, gérez les rôles utilisateurs et suivez la télémétrie commerciale.
            </p>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="max-w-6xl mx-auto p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Platform KPIs Grid */}
          {stats && (
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#12151C] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-orange-400" />
                  Utilisateurs inscrits
                </span>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#12151C] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Espaces de travail
                </span>
                <p className="text-2xl font-bold text-white">{stats.totalWorkspaces}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#12151C] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <FolderKanban className="w-3.5 h-3.5 text-emerald-400" />
                  Projets actifs
                </span>
                <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#12151C] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  Revenu FedaPay collecté
                </span>
                <p className="text-2xl font-bold text-amber-300">
                  {formatFCFA(stats.totalRevenueCFA)}
                </p>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="max-w-6xl mx-auto flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'plans'
                  ? 'bg-gradient-warm text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Plans & Tarification
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-warm text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Utilisateurs ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-gradient-warm text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transactions FedaPay ({transactions.length})
            </button>
          </div>

          {/* Tab 1: Plans & Pricing Editor (Source of truth in DB) */}
          {activeTab === 'plans' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Gestion dynamique des prix et quotas</h3>
                  <p className="text-xs text-slate-400">
                    Modifiez instantanément les prix des plans en FCFA sans redéploiement de code.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const isEditing = editingPlanId === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className="p-6 rounded-3xl bg-[#12151C] border border-slate-800 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {plan.slug}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400">{plan.description}</p>

                        {isEditing ? (
                          <div className="space-y-3 pt-3 border-t border-slate-800">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                Prix en FCFA
                              </label>
                              <Input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                Limite projets (-1 pour illimité)
                              </label>
                              <Input
                                type="number"
                                value={editMaxProjects}
                                onChange={(e) => setEditMaxProjects(Number(e.target.value))}
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                Limite membres par projet
                              </label>
                              <Input
                                type="number"
                                value={editMaxMembers}
                                onChange={(e) => setEditMaxMembers(Number(e.target.value))}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-white">
                                {formatFCFA(plan.price)}
                              </span>
                              <span className="text-slate-400">/ mois</span>
                            </div>

                            <div className="space-y-1 text-slate-400 pt-2">
                              <p>• Max projets : <strong className="text-white">{plan.maxProjects === -1 ? 'Illimité' : plan.maxProjects}</strong></p>
                              <p>• Max membres : <strong className="text-white">{plan.maxMembersPerProject === -1 ? 'Illimité' : plan.maxMembersPerProject}</strong></p>
                              <p>• Thèmes cinématographiques : <strong className="text-white">{plan.features?.customThemes ? 'Oui' : 'Non'}</strong></p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-800">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setEditingPlanId(null)}>
                              <X className="w-4 h-4 mr-1" />
                              Annuler
                            </Button>
                            <Button size="sm" onClick={() => handleSavePlan(plan.id)}>
                              <Save className="w-4 h-4 mr-1" />
                              Enregistrer
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="secondary" className="w-full" onClick={() => startEditPlan(plan)}>
                            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                            Modifier le prix et les quotas
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Users Management */}
          {activeTab === 'users' && (
            <div className="max-w-6xl mx-auto rounded-3xl bg-[#12151C] border border-slate-800 divide-y divide-slate-800 overflow-hidden">
              <div className="p-4 bg-[#15181F] flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Utilisateur</span>
                <span>Rôle</span>
              </div>
              {users.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">{u.fullName}</p>
                    <p className="text-slate-400">{u.email}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Inscrit le {formatDate(u.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleUserRole(u.id, u.role)}
                    >
                      Basculer rôle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Transactions Audit */}
          {activeTab === 'transactions' && (
            <div className="max-w-6xl mx-auto rounded-3xl bg-[#12151C] border border-slate-800 divide-y divide-slate-800 overflow-hidden">
              <div className="p-4 bg-[#15181F] flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Transaction & Espace</span>
                <span>Montant & Statut</span>
              </div>
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Aucune transaction enregistrée pour le moment.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{tx.plan?.name} • {tx.workspace?.name}</p>
                      <p className="text-slate-500 text-[11px]">
                        Réf : {tx.providerTxId || tx.id} • {formatDate(tx.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-white">{formatFCFA(tx.amount)}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          tx.status === 'APPROVED'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                            : 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
