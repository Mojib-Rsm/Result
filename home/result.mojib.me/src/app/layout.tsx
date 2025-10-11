
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/app-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdedu.me';

export const metadata: Metadata = {
  title: {
    template: '%s | BD Edu Result by Mojib Rsm',
    default: 'BD Edu Result - Check JSC, SSC, HSC, and All Board Results by Mojib Rsm',
  },
  description: 'Check all Bangladesh Education Board exam results (JSC, JDC, SSC, Dakhil, HSC, Alim) with marksheet. A fast and reliable result checking website by Mojib Rsm.',
  keywords: [
    'BD Edu Result',
    'Education Board Result',
    'SSC Result',
    'HSC Result',
    'JSC Result',
    'JDC Result',
    'Dakhil Result',
    'Alim Result',
    'Bangladesh Result',
    'Board Result',
    'Marksheet',
    'BD result',
    'Mojib Rsm',
    'MrTools BD',
    'Oftern',
    'bdedu.me',
    'educationboardresults.gov.bd',
    'ফলাফল',
    'রেজাল্ট',
    'এসএসসি রেজাল্ট',
    'এইচএসসি রেজাল্ট',
    'জেএসসি রেজাল্ট',
    'দাখিল রেজাল্ট',
    'আলিম রেজাল্ট',
    'মার্কশিট',
    'মজিব RSM',
    'মজিবুর রহমান',
  ],
  authors: [{ name: 'Mojib Rsm', url: 'https://www.mojib.me' }],
  creator: 'Mojib Rsm',
  publisher: 'Mojib Rsm',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'BD Edu Result - Check Your Board Exam Results by Mojib Rsm',
    description: 'The fastest and most reliable way to check all Bangladesh Education Board results (SSC, HSC, JSC, Dakhil, Alim) with marksheet.',
    siteName: 'BD Edu Result',
    images: [
      {
        url: 'https://www.bdedu.me/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BD Edu Result - Official Banner by Mojib Rsm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BD Edu Result - Check All Board Exam Results by Mojib Rsm',
    description: 'The fastest and most reliable way to check all Bangladesh Education Board results (SSC, HSC, JSC, Dakhil, Alim) with marksheet.',
    images: ['https://www.bdedu.me/twitter-image.png'],
    creator: '@MrTools_BD', 
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
  icons: {
    icon: 'https://www.bdedu.me/logo.png',
    shortcut: 'https://www.bdedu.me/logo.png',
    apple: 'https://www.bdedu.me/logo.png',
  },
  verification: {
    google: 'FOlKCdIBPLnKIty-uFCQb1dJh7EfLFCcshPgHzaaUCI',
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
