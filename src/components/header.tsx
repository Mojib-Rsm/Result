'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, History } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: GraduationCap },
    { href: '/history', label: 'History', icon: History },
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
            src="https://placehold.co/32x32.png"
            data-ai-hint="logo monogram"
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
      </div>
    </header>
  );
}
