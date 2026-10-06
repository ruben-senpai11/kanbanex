'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/overview');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#0B0D11] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-warm flex items-center justify-center font-black text-white text-xl tracking-wider shadow-lg shadow-orange-950/60 animate-pulse">
          EX
        </div>
        <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
          Kanban<span className="text-orange-500">EX</span>
        </p>
      </div>
    </div>
  );
}
