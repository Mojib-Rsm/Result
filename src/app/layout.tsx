import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BD Result Hub',
  description: 'Check all your Bangladesh education board exam results in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
