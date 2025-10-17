
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../loading';
import { Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
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

    if (loading || !user) {
        return <Loading />;
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="ড্যাশবোর্ড"><Link href="/dashboard"><LayoutDashboard /><span>ড্যাশবোর্ড</span></Link></SidebarMenuButton>
                        </SidebarMenuItem>
                        {user.role === 'admin' &&
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="অ্যাডমিন প্যানেল"><Link href="/admin"><User /><span>অ্যাডমিন প্যানেল</span></Link></SidebarMenuButton>
                            </SidebarMenuItem>
                        }
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
             <SidebarInset>
                <header className="flex h-14 items-center justify-between border-b bg-background px-4">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">ব্যবহারকারী ড্যাশবোর্ড</h1>
                    <div />
                </header>
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
