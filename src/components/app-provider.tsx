
'use client';

import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContext, AuthUser } from '@/hooks/use-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('auth-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: AuthUser) => {
    localStorage.setItem('auth-user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth-user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className={cn('font-poppins antialiased bg-background text-foreground')}>
        <div className="relative flex min-h-screen flex-col">
          <Header className="no-print" />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

    