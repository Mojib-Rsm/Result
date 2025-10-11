
'use client';

import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="no-print py-8 md:px-8 bg-background/95 border-t">
      <div className="container flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
            <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer">
                 <Image 
                    src="https://www.bdedu.me/logo.png"
                    alt="BD Edu Result Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                />
            </Link>
             <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
                BD Edu Result
            </Link>
        </div>
        <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Developed & Maintained by <Link href="https://www.mojib.me" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:underline">Mojib Rsm</Link>
            </p>
            <p className="text-xs text-muted-foreground mt-1">All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn('font-sans antialiased bg-background text-foreground')}>
      <div className="relative flex min-h-screen flex-col">
        <Header className="no-print" />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}
