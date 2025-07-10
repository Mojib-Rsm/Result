
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
      
      if (pathname === '/admin' && !isAuth) {
        const key = prompt('অ্যাডমিন প্যানেলে প্রবেশ করতে সিক্রেট কী লিখুন:');
        if (key === SECRET_KEY) {
          sessionStorage.setItem(AUTH_KEY, key);
          setIsAuthenticated(true);
        } else if (key !== null) {
          alert('সিক্রেট কী সঠিক নয়!');
          router.push('/');
          setIsAuthenticated(false);
        } else {
          router.push('/');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(isAuth);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsAuthLoading(false);
    }
  }, [router, pathname]);
  
  useEffect(() => {
    // We only want to run this verification logic on the client
    if (typeof window !== 'undefined') {
      verifyAuth();
    }
  }, [verifyAuth]);


  return { isAuthenticated, isAuthLoading, SECRET_KEY };
}
