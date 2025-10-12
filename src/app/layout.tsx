
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = 'https://www.bdedu.me';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BD Edu Result 2025 - Check All Board Result with Marksheet',
  description: 'Check your SSC, HSC, Dakhil, JSC, JDC, Alim and all board results for 2025 instantly with marksheet. The best eboardresults.com alternative. Register early to get your result by SMS/Email at BD Edu Result.',
  keywords: [
    // Primary Keywords
    'SSC Result 2025', 'HSC Result 2025', 'Bangladesh Education Board Result', 'All Board Result 2025', 'eboardresults.com alternative', 'BD Result Check', 'Education Board Result BD', 'Result Check by Roll and Reg No', 'SSC Marksheet Download', 'HSC Marksheet Download', 'BD Exam Result Online',
    'BD Edu Result', 'Mojib Rsm', 'BD Result', 'Education Board Result', 'SSC Result', 'HSC Result', 'JSC Result', 'Dakhil Result', 'Alim Result', 'JDC Result', 'Bangladesh Education Board', 'Public Exam Result', 'Marksheet', 'Online Result',
    // Bangla Keywords
    'এসএসসি রেজাল্ট ২০২৫', 'এইচএসসি রেজাল্ট ২০২৫', 'রেজাল্ট চেক করার ওয়েবসাইট', 'অনলাইনে রেজাল্ট দেখার নিয়ম', 'মার্কশিটসহ রেজাল্ট দেখুন', 'সব বোর্ডের রেজাল্ট', 'বোর্ড রেজাল্ট চেক', 'শিক্ষা বোর্ডের রেজাল্ট', 'কিভাবে রেজাল্ট দেখবো', 'দ্রুত রেজাল্ট দেখার ওয়েবসাইট',
    'ফলাফল', 'রেজাল্ট', 'এসএসসি রেজাল্ট', 'এইচএসসি রেজাল্ট', 'জেএসসি রেজাল্ট', 'দাখিল রেজাল্ট', 'আলিম রেজাল্ট', 'জেডিসি রেজাল্ট', 'মার্কশিট', 'অনলাইন রেজাল্ট',
    // Feature/Service Keywords
    'GPA Calculator BD', 'SSC GPA Calculator', 'HSC GPA Calculator', 'Result Notification System', 'SMS Result Alert BD', 'Online Marksheet Generator', 'Result Card Generator', 'Institute Wise Result BD', 'Education News Update BD', 'Board Notice Bangladesh',
    // Long-Tail Keywords
    'How to check SSC result online in Bangladesh', 'How to get SSC result by SMS', 'When will HSC result 2025 be published', 'Best website to check board result in Bangladesh', 'How to download SSC marksheet 2025', 'SSC result 2025 published date', 'How to get result fast when eboard site is down', 'SSC/HSC result without registration number',
  ],
  authors: [{ name: 'Mojib Rsm', url: 'https://www.mojib.me' }],
  creator: 'Mojib Rsm',
  publisher: 'Oftern',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BD Edu Result 2025 - All Education Board Results',
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
