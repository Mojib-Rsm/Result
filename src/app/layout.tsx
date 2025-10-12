
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = 'https://www.bdedu.me';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BD Edu Result - Check All Board Exam Results in Bangladesh',
  description: 'JSC, JDC, SSC, Dakhil, HSC, Alim এবং ভোকেশনাল পরীক্ষার ফলাফল দেখুন। বিস্তারিত মার্কশিট সহ। দ্রুত ও নির্ভরযোগ্য।',
  keywords: [
    'BD Edu Result', 'Mojib Rsm', 'BD Result', 'Education Board Result', 'SSC Result', 'HSC Result', 'JSC Result', 'Dakhil Result', 'Alim Result', 'JDC Result', 'Bangladesh Education Board', 'Public Exam Result', 'Marksheet', 'Online Result', 
    'ফলাফল', 'রেজাল্ট', 'এসএসসি রেজাল্ট', 'এইচএসসি রেজাল্ট', 'জেএসসি রেজাল্ট', 'দাখিল রেজাল্ট', 'আলিম রেজাল্ট', 'জেডিসি রেজাল্ট', 'শিক্ষা বোর্ড', 'মার্কশিট', 'অনলাইন রেজাল্ট'
  ],
  authors: [{ name: 'Mojib Rsm', url: 'https://www.mojib.me' }],
  creator: 'Mojib Rsm',
  publisher: 'Mojib Rsm',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BD Edu Result - All Education Board Results',
    description: 'The fastest and most reliable way to check all public examination results in Bangladesh with detailed marksheets.',
    url: siteUrl,
    siteName: 'BD Edu Result',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'BD Edu Result',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BD Edu Result - Check Your Exam Results Instantly',
    description: 'Easily check all Bangladesh Education Board results including SSC, HSC, JSC, and more. Maintained by Mojib Rsm.',
    creator: '@MrTools_BD',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  verification: {
    google: 'FOlKCdIBPLnKIty-uFCQb1dJh7EfLFCcshPgHzaaUCI',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  colorScheme: 'light dark',
}


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
