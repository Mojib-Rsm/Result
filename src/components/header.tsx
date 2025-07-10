
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, History, Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/use-admin-auth';


export default function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const { promptLogin } = useAdminAuth();

  const navLinks = [
    { href: '/', label: 'হোম', icon: GraduationCap },
    { href: '/history', label: 'ইতিহাস', icon: History },
  ];

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="https://www.bartanow.com" target="_blank" rel="noopener noreferrer" className="mr-6 flex items-center space-x-2">
           <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png"
            alt="Government Seal of Bangladesh"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <Image 
            src="https://www.oftern.com/uploads/logo/favicon_67c1bdb47ee422-18965133.png"
            alt="Bartanow Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <span className="font-bold sm:inline-block">BD Education Results</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
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
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="ml-auto">
           <Button
              variant="ghost"
              onClick={promptLogin}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === '/admin' ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              <Lock className="mr-2 h-4 w-4" />
              অ্যাডমিন
            </Button>
        </div>
      </div>
    </header>
  );
}
