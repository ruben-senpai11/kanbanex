'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

import Image from 'next/image';

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
    <div className="min-h-screen bg-[#0B0D11] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl shadow-orange-950/60 bg-black animate-pulse">
          <Image
            src="/images/kabanex-logo.jpg"
            alt="KabanEx"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <p className="text-xs text-amber-200/90 font-bold tracking-wider uppercase">
          Kaban<span className="text-orange-500">Ex</span>
        </p>
      </div>
    </div>
  );
}
