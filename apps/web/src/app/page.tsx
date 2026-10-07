'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function RootPage() {
  const router = useRouter();
  const { user, currentWorkspace, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const redirectToActiveBoard = async () => {
      if (currentWorkspace) {
        try {
          const projects = await api.getProjectsOverview(currentWorkspace.id);
          if (projects && projects.length > 0) {
            router.replace(`/projects/${projects[0].id}`);
            return;
          }
        } catch {
          // fallback
        }
      }
      router.replace('/overview');
    };

    redirectToActiveBoard();
  }, [user, currentWorkspace, isLoading, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-warm flex items-center justify-center font-black text-white text-xl tracking-wider shadow-md shadow-orange-500/20 animate-pulse">
          EX
        </div>
        <p className="text-xs text-slate-600 font-bold tracking-wider uppercase">
          Kanban<span className="text-orange-500">EX</span>
        </p>
      </div>
    </div>
  );
}
