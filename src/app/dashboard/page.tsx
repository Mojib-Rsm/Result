
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12 space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <User className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-3xl mt-4">ব্যবহারকারী ড্যাশবোর্ড</CardTitle>
                    <CardDescription>
                        স্বাগতম, {user.name}!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <p><strong>নাম:</strong> {user.name}</p>
                        <p><strong>ইমেইল:</strong> {user.email}</p>
                        <p><strong>ভূমিকা:</strong> <span className="capitalize">{user.role}</span></p>
                    </div>

                    {user.role === 'admin' || user.role === 'editor' ? (
                         <Button asChild className="w-full">
                            <Link href="/admin">
                                অ্যাডমিন প্যানেলে যান
                            </Link>
                        </Button>
                    ) : null}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-6 w-6" />
                        আপনার কার্যক্রম
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">আপনার সংরক্ষিত অনুসন্ধানের ইতিহাস দেখতে নিচের বাটনে ক্লিক করুন।</p>
                    <Button asChild>
                        <Link href="/dashboard/history">
                            অনুসন্ধানের ইতিহাস দেখুন
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
