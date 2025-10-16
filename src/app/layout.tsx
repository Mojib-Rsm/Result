
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = 'https://www.bdedu.me';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BD Edu - Education & Career Hub',
  description: 'Your all-in-one education portal for exam results (SSC, HSC), admission info, career guidance, study resources, and education news in Bangladesh.',
  keywords: [
    // Primary Keywords
    'Bangladesh Education', 'BD Edu', 'BD Edu Hub', 'Education Portal BD', 'Career Hub BD', 'Admission Information', 'University Admission BD', 'College Suggestions', 'GPA Calculator', 'SSC Result', 'HSC Result', 'BD Exam Result', 'Education Board Result BD',
    // Feature Keywords
    'Study Resources BD', 'Model Test', 'Question Bank', 'Job Circular BD', 'Govt Job', 'Private Job', 'Career Tips', 'CV Builder', 'Scholarship BD', 'Institute Directory BD',
    // Bangla Keywords
    'শিক্ষা কেন্দ্র', 'বিডি এডু', 'বিডি এডু হাব', 'শিক্ষা ও ক্যারিয়ার', 'ভর্তি তথ্য', 'বিশ্ববিদ্যালয় ভর্তি', 'কলেজ সাজেশন', 'এসএসসি রেজাল্ট', 'এইচএসসি রেজাল্ট', 'চাকরির খবর', 'সরকারি চাকরি', 'বেসরকারি চাকরি', 'ক্যারিয়ার গাইডলাইন', 'স্টাডি রিসোর্স', 'বৃত্তি',
    // Legacy Keywords
    'BD Edu Result', 'Mojib Rsm', 'BD Result', 'Education Board Result', 'Marksheet', 'Online Result',
  ],
  authors: [{ name: 'Mojib Rsm', url: 'https://www.mojib.me' }],
  creator: 'Mojib Rsm',
  publisher: 'Oftern',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BD Edu - Your Education & Career Hub in Bangladesh',
    description: 'The most comprehensive platform for exam results, admission guidance, career news, study resources, and tools for students in Bangladesh.',
    url: siteUrl,
    siteName: 'BD Edu',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'BD Edu - Education & Career Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BD Edu - Results, News, Admission & Career Info',
    description: 'Your complete guide for educational resources in Bangladesh, including results, news, career guidance, and admission help. Maintained by Mojib Rsm.',
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
