
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.oftern.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thedailystar.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tbsnews.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bdnews24.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dhakatribune.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.savethechildren.org',
        port: '',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'media.wired.com' },
      { protocol: 'https', hostname: 'img-cdn.tnwcdn.com' },
      { protocol: 'https', hostname: 'images.wsj.net' },
      { protocol: 'https', hostname: 'i.kinja-img.com' },
      { protocol: 'https', hostname: 'mypeoplesreview.com' },
      { protocol: 'https', hostname: 'journals.plos.org' },
      { protocol: 'https', hostname: 'images.prothomalo.com' },
      { protocol: 'https', hostname: 'banglatribune.com' },
      { protocol: 'https', hostname: 'www.jugantor.com' },
      { protocol: 'https', hostname: 'www.kalerkantho.com' },
      { protocol: 'https', hostname: 'images.somoynews.tv' },
      { protocol: 'https', hostname: 'www.ittefaq.com.bd' },
    ],
  },
  env: {}
};

export default nextConfig;





