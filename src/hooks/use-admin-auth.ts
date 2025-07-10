
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AUTH_KEY = 'admin-auth-token';
const SECRET_KEY = 'bartanow@2024';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const verifyAuth = useCallback(() => {
    try {
      const token = sessionStorage.getItem(AUTH_KEY);
      const isAuth = token === SECRET_KEY;
      setIsAuthenticated(isAuth);
      if (pathname === '/admin' && !isAuth) {
        const key = prompt('অ্যাডমিন প্যানেলে প্রবেশ করতে সিক্রেট কী লিখুন:');
        if (key === SECRET_KEY) {
          sessionStorage.setItem(AUTH_KEY, key);
          setIsAuthenticated(true);
        } else if (key !== null) {
          alert('সিক্রেট কী সঠিক নয়!');
          router.push('/');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      router.push('/');
    } finally {
      setIsAuthLoading(false);
    }
  }, [router, pathname]);
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const login = useCallback((key: string) => {
    if (key === SECRET_KEY) {
      sessionStorage.setItem(AUTH_KEY, key);
      setIsAuthenticated(true);
      router.push('/admin');
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    router.push('/');
  }, [router]);

  return { isAuthenticated, isAuthLoading, login, logout, SECRET_KEY };
}
