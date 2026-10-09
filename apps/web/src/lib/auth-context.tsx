'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setTokens, getAccessToken } from './api';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'SUPER_ADMIN';
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  role?: string;
  subscription?: {
    status: string;
    plan: {
      slug: string;
      name: string;
      price: number;
    };
  };
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  login: (dto: any) => Promise<void>;
  signup: (dto: any) => Promise<any>;
  completeVerification: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  const loadUserData = async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const me = await api.getMe();
      setUser({
        id: me.id,
        email: me.email,
        fullName: me.fullName,
        role: me.role,
        avatarUrl: me.avatarUrl,
      });

      const userWorkspaces = me.workspaceMembers.map((m: any) => ({
        id: m.workspace.id,
        name: m.workspace.name,
        slug: m.workspace.slug,
        description: m.workspace.description,
        role: m.role,
        subscription: m.workspace.subscription,
      }));

      setWorkspaces(userWorkspaces);

      const savedWsId = typeof window !== 'undefined' ? localStorage.getItem('kanbanex_active_ws') : null;
      const matched = userWorkspaces.find((w: any) => w.id === savedWsId);
      const active = matched || userWorkspaces[0] || null;

      setCurrentWorkspaceState(active);
      if (active) {
        localStorage.setItem('kanbanex_active_ws', active.id);
      }
    } catch {
      setTokens(null, null);
      setUser(null);
      setCurrentWorkspaceState(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const login = async (dto: any) => {
    setIsLoading(true);
    try {
      const res = await api.login(dto);
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      if (res.currentWorkspace) {
        setCurrentWorkspaceState(res.currentWorkspace);
        localStorage.setItem('kanbanex_active_ws', res.currentWorkspace.id);
      }
      await loadUserData();
      router.push('/overview');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (dto: any) => {
    setIsLoading(true);
    try {
      const res = await api.signup(dto);
      if (res.requiresEmailVerification) {
        return res;
      }
      if (res.accessToken) {
        setTokens(res.accessToken, res.refreshToken);
        setUser(res.user);
        if (res.currentWorkspace) {
          setCurrentWorkspaceState(res.currentWorkspace);
          localStorage.setItem('kanbanex_active_ws', res.currentWorkspace.id);
        }
        await loadUserData();
        router.push('/overview');
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const completeVerification = async (res: any) => {
    if (res.accessToken) {
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      if (res.currentWorkspace) {
        setCurrentWorkspaceState(res.currentWorkspace);
        localStorage.setItem('kanbanex_active_ws', res.currentWorkspace.id);
      }
      await loadUserData();
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    setTokens(null, null);
    setUser(null);
    setCurrentWorkspaceState(null);
    setWorkspaces([]);
    router.push('/login');
  };

  const setCurrentWorkspace = (workspace: Workspace) => {
    setCurrentWorkspaceState(workspace);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanbanex_active_ws', workspace.id);
    }
  };

  const refreshUserData = async () => {
    await loadUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        currentWorkspace,
        isLoading,
        login,
        signup,
        completeVerification,
        logout,
        setCurrentWorkspace,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  return context;
}
