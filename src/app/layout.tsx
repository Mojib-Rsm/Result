
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = 'https://www.bdedu.me';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BD Edu Center - Your Companion for Educational Journey in Bangladesh',
  description: 'BD Edu Center is your one-stop platform for all educational needs in Bangladesh, from exam results (SSC, HSC, etc.) and marksheets to admission information, GPA calculation, and the latest education news.',
  keywords: [
    // Primary Keywords
    'Bangladesh Education', 'BD Edu Center', 'Educational Platform BD', 'Admission Information', 'University Admission BD', 'College Suggestions', 'GPA Calculator', 'SSC Result', 'HSC Result', 'BD Exam Result', 'Education Board Result BD',
    'BD Edu Result', 'Mojib Rsm', 'BD Result', 'Education Board Result', 'SSC Result', 'HSC Result', 'JSC Result', 'Dakhil Result', 'Alim Result', 'JDC Result', 'Bangladesh Education Board', 'Public Exam Result', 'Marksheet', 'Online Result',
    // Bangla Keywords
    'শিক্ষা কেন্দ্র', 'বিডি এডু সেন্টার', 'ভর্তি তথ্য', 'বিশ্ববিদ্যালয় ভর্তি', 'কলেজ সাজেশন', 'এসএসসি রেজাল্ট', 'এইচএসসি রেজাল্ট', 'রেজাল্ট চেক', 'শিক্ষা সংবাদ', 'ক্যারিয়ার গাইডলাইন',
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
    title: 'BD Edu Center - Your Guide to Education in Bangladesh',
    description: 'The most comprehensive platform for exam results, admission guidance, educational news, and tools for students in Bangladesh.',
    url: siteUrl,
    siteName: 'BD Edu Center',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'BD Edu Center',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BD Edu Center - Results, News, and Admission Info',
    description: 'Your complete guide for educational resources in Bangladesh, including results, news, GPA tools, and admission help. Maintained by Mojib Rsm.',
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
