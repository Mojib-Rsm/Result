'use client';

import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { cn } from '@/lib/utils';

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
      </div>
      <Toaster />
    </div>
  );
}
