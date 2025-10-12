
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, History, Calculator } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Header({ className }: { className?: string }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'হোম', icon: GraduationCap },
    { href: '/history', label: 'ইতিহাস', icon: History },
    { href: '/gpa-calculator', label: 'GPA ক্যালকুলেটর', icon: Calculator },
  ];

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
        <nav className="flex flex-1 items-center gap-2 text-sm">
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
      </div>
    </header>
  );
}
