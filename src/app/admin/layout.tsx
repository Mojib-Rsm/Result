
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../loading';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
      // This state should ideally not be reached due to the useEffect redirect,
      // but it's a good failsafe.
      return <Loading />;
    }

    if (user.role !== 'admin' && user.role !== 'editor') {
        return (
             <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
                <Card className="border-destructive">
                    <CardHeader className="items-center text-center">
                        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                        <CardTitle className="text-destructive">অ্যাক্সেস ডিনাইড</CardTitle>
                        <CardDescription>এই পৃষ্ঠাটি দেখার জন্য আপনার অনুমতি নেই।</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">আপনাকে অবশ্যই একজন অ্যাডমিন বা এডিটর হতে হবে।</p>
                    </CardContent>
                </Card>
            </div>
        )
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
