'use client';

import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { cn } from '@/lib/utils';

function Footer() {
  return (
    <footer className="no-print py-6 md:px-8 md:py-0 bg-background/95 border-t">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          Contact: <span className="font-medium text-foreground">mojibrsm@gmail.com</span>.
        </p>
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
