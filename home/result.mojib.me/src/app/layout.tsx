import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdedu.me';

export const metadata: Metadata = {
  title: {
    template: '%s | BD Edu Result',
    default: 'BD Edu Result - Check JSC, SSC, HSC, and All Board Results',
  },
  description: 'Easily check all Bangladesh Education Board exam results including JSC, JDC, SSC, Dakhil, HSC, Alim, and equivalent examinations. Fast, reliable, and detailed results with marksheet.',
  keywords: [
    'BD Edu Result',
    'Education Board Result',
    'SSC Result',
    'HSC Result',
    'JSC Result',
    'Dakhil Result',
    'Alim Result',
    'Bangladesh Result',
    'Board Result',
    'Marksheet',
    'bdedu.me',
    'BD result',
    'ফলাফল',
    'এসএসসি রেজাল্ট',
    'এইচএসসি রেজাল্ট',
  ],
  authors: [{ name: 'BD Edu', url: siteUrl }],
  creator: 'BD Edu',
  publisher: 'BD Edu',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'BD Edu Result - Check All Board Exam Results',
    description: 'The fastest and most reliable way to check all Bangladesh Education Board results. SSC, HSC, JSC, Dakhil, Alim and more.',
    siteName: 'BD Edu Result',
    images: [
      {
        url: 'https://www.bdedu.me/og-image.png', // It's a good practice to have an OG image
        width: 1200,
        height: 630,
        alt: 'BD Edu Result Official Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BD Edu Result - Check All Board Exam Results',
    description: 'The fastest and most reliable way to check all Bangladesh Education Board results. SSC, HSC, JSC, Dakhil, Alim and more.',
    images: ['https://www.bdedu.me/twitter-image.png'], // It's a good practice to have a twitter image
    creator: '@BDEduResult', // Replace with your actual twitter handle
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
