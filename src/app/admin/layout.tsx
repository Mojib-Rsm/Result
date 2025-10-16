'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../loading';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = useRouter();

    useEffect(() => {
        if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);
    

    if (loading) {
        return <Loading />;
    }

    if (!user && pathname !== '/login') {
      return <Loading />;
    }

    return (
        <div className="flex-1">
            {children}
        </div>
    );
}
