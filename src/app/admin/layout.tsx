
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../loading';
import Header from '@/components/header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    // Use usePathname hook at the top level
    const pathname = useRouter();

    useEffect(() => {
        // This check should ideally be inside the component's body or another useEffect
        // For simplicity, we assume we want to redirect if not loading and no user, and not on login page
        if (!loading && !user && pathname.pathname !== '/login') {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);
    

    if (loading) {
        return <Loading />;
    }

    if (!user && pathname.pathname !== '/login') {
      return <Loading />;
    }

    return (
        <>
            <Header />
            <main>
                {children}
            </main>
        </>
    );
}
