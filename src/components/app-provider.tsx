
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
        <div className="text-center">
            <p className="text-md font-medium text-foreground">Developed & Maintained by: Mojib Rsm</p>
            <p className="text-sm text-muted-foreground">For any query: mojibrsm@gmail.com</p>
        </div>
        <div className="flex flex-col items-center gap-2 mt-2">
            <Link href="https://www.oftern.com" target="_blank" rel="noopener noreferrer">
                 <Image 
                    src="https://www.oftern.com/uploads/logo/favicon_67c1bdb47ee422-18965133.png"
                    alt="Oftern Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                />
            </Link>
             <Link href="https://www.oftern.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                www.oftern.com
            </Link>
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
