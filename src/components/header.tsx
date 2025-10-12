'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, History, Calculator, MoreVertical, Sparkles, LogOut, User, Bookmark } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/hooks/use-auth';

export default function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isAdminPage = pathname.startsWith('/admin');

  const navLinks = [
    { href: '/', label: 'হোম', icon: GraduationCap },
    { href: '/education-news', label: 'শিক্ষা সংবাদ', icon: Bookmark },
    { href: '/suggestions', label: 'ভর্তি পরামর্শ', icon: Sparkles },
    { href: '/history', label: 'ইতিহাস', icon: History },
    { href: '/gpa-calculator', label: 'GPA ক্যালকুলেটর', icon: Calculator },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
           <Image
            src="/logo.png"
            alt="BD Edu Result Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-bold sm:inline-block">BD Edu Result</span>
        </Link>
        
        {!isAdminPage && (
          <nav className="hidden flex-1 items-center gap-2 text-sm md:flex">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                <Link href={link.href} className="flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>
        )}
        
        {isAdminPage && <div className="flex-1" />}

        <div className="flex items-center justify-end">
            {isAdminPage && user ? (
                 <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    লগআউট
                </Button>
            ) : !isAdminPage && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="md:hidden">
                            <MoreVertical className="h-5 w-5" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {navLinks.map(link => (
                             <DropdownMenuItem key={link.href} asChild>
                                 <Link href={link.href} className="flex items-center gap-2">
                                    <link.icon className="h-4 w-4" />
                                    <span>{link.label}</span>
                                </Link>
                             </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
      </div>
    </header>
  );
}
