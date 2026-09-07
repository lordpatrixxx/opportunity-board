'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SafeUser } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  savedCount: number;
  setSavedCount: React.Dispatch<React.SetStateAction<number>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (data: { email?: string; fullName?: string; name?: string; avatarUrl?: string | null; credential?: string; accessToken?: string; role?: string }) => Promise<{ isNewUser?: boolean }>;
  register: (data: { email: string; password: string; fullName: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSavedCount(data.savedCount || 0);
      } else {
        setUser(null);
        setSavedCount(0);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    setSavedCount(data.savedCount || 0);
    router.refresh();
  };

  const loginWithGoogle = async (googleData: { email?: string; fullName?: string; name?: string; avatarUrl?: string | null; credential?: string; accessToken?: string; role?: string }) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Google sign in failed');
    }

    setUser(data.user);
    setSavedCount(data.savedCount || 0);
    router.refresh();
    return data;
  };

  const register = async (formData: { email: string; password: string; fullName: string; role?: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setUser(data.user);
    setSavedCount(0);
    router.refresh();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setSavedCount(0);
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        savedCount,
        setSavedCount,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
