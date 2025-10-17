
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, LayoutDashboard, Newspaper, Briefcase, Users, MailCheck, History, Settings, FileCog, MessageSquare, MessagesSquare } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';

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
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="ড্যাশবোর্ড"><Link href="/admin"><LayoutDashboard /><span>ড্যাশবোর্ড</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="শিক্ষা সংবাদ"><Link href="/admin/news"><Newspaper /><span>শিক্ষা সংবাদ</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="ক্যারিয়ার"><Link href="/admin/career"><Briefcase /><span>ক্যারিয়ার</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        {user.role === 'admin' && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="ব্যবহারকারীগণ"><Link href="/admin/users"><Users /><span>ব্যবহারকারীগণ</span></Link></SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="প্রশ্নোত্তর"><Link href="/admin/community/qna"><MessageSquare /><span>প্রশ্নোত্তর</span></Link></SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="ফোরাম"><Link href="/admin/community/forum"><MessagesSquare /><span>ফোরাম</span></Link></SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="সাবস্ক্রিপশন"><Link href="/admin/subscriptions"><MailCheck /><span>সাবস্ক্রিপশন</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="অনুসন্ধানের ইতিহাস"><Link href="/admin/search-history"><History /><span>অনুসন্ধানের ইতিহাস</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="API লগ"><Link href="/admin/api-logs"><History /><span>API লগ</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="পেজ ম্যানেজমেন্ট"><Link href="/admin/pages"><FileCog /><span>পেজ ম্যানেজমেন্ট</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="সেটিংস"><Link href="/admin/settings"><Settings /><span>সেটিংস</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-14 items-center justify-between border-b bg-background px-4">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">অ্যাডমিন প্যানেল</h1>
                    <div />
                </header>
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
