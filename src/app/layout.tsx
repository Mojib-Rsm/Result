import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BD Education Results',
  description: 'Check your Bangladesh education board exam results.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
