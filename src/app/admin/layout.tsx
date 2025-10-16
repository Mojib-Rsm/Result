'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../loading';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { GraduationCap, MailCheck, History, Bookmark, Briefcase, BarChart, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const adminNavLinks = [
    { href: '/admin', label: 'ড্যাশবোর্ড', icon: GraduationCap },
    { href: '/admin/subscriptions', label: 'সাবস্ক্রিপশন', icon: MailCheck },
    { href: '/admin/search-history', label: 'অনুসন্ধানের ইতিহাস', icon: History },
    { href: '/admin/news', label: 'শিক্ষা সংবাদ', icon: Bookmark },
    { href: '/admin/career', label: 'ক্যারিয়ার', icon: Briefcase },
    { href: '/admin/api-logs', label: 'API লগ', icon: BarChart },
];


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);
    
    const handleLogout = () => {
        logout();
        router.push('/login');
    }

    if (loading) {
        return <Loading />;
    }

    if (!user && pathname !== '/login') {
      return <Loading />;
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                     <SidebarHeader>
                        <div className="flex items-center gap-2">
                             <Image
                                src="/logo.png"
                                alt="BD Edu Logo"
                                width={32}
                                height={32}
                            />
                            <span className="font-bold text-lg">অ্যাডমিন প্যানেল</span>
                        </div>
                    </SidebarHeader>
                    <SidebarMenu>
                        {adminNavLinks.map(link => (
                            <SidebarMenuItem key={link.href}>
                                 <Link href={link.href}>
                                    <SidebarMenuButton isActive={pathname === link.href}>
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                     <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={handleLogout}>
                                    <LogOut className="h-4 w-4" />
                                    লগআউট
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </SidebarContent>
                <main className="flex-1 bg-muted/30">
                    <header className="p-4 flex items-center gap-4 md:hidden border-b bg-background">
                        <SidebarTrigger />
                        <h1 className="text-lg font-semibold">অ্যাডমিন প্যানেল</h1>
                    </header>
                    {children}
                </main>
            </Sidebar>
        </SidebarProvider>
    );
}
