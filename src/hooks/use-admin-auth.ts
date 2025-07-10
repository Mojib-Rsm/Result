
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'admin-auth-token';
const SECRET_KEY = 'bartanow@2024';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = sessionStorage.getItem(AUTH_KEY);
      setIsAuthenticated(token === SECRET_KEY);
    } catch (error) {
      setIsAuthenticated(false);
    }
  }, []);

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

  const promptLogin = useCallback(() => {
    const key = prompt('অ্যাডমিন প্যানেলে প্রবেশ করতে সিক্রেট কী লিখুন:');
    if (key) {
      if (!login(key)) {
        alert('সিক্রেট কী সঠিক নয়!');
      }
    }
  }, [login]);

  return { isAuthenticated, login, logout, promptLogin, SECRET_KEY };
}
