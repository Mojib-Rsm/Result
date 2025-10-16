
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Code, Facebook, Mail, Phone } from 'lucide-react';

const footerLinks = [
    { href: '/about-us', label: 'আমাদের সম্পর্কে' },
    { href: '/contact-us', label: 'যোগাযোগ' },
    { href: '/privacy-policy', label: 'গোপনীয়তা নীতি' },
    { href: '/disclaimer', label: 'দাবিত্যাগ' },
    { href: '/terms-and-conditions', label: 'শর্তাবলী' },
    { href: '/suggestions', label: 'ভর্তি পরামর্শ' },
    { href: '/education-news', label: 'শিক্ষা সংবাদ' },
];

export default function Footer() {
  return (
    <footer className="no-print py-12 md:px-8 bg-muted/50 border-t">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
                 <Image 
                    src="/logo.png"
                    alt="BD Edu Hub Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                />
                 <span className="text-xl font-bold">BD Edu Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
                বাংলাদেশের শিক্ষার্থীদের জন্য একটি ওয়ান-স্টপ শিক্ষা ও ক্যারিয়ার প্ল্যাটফর্ম।
            </p>
             <div className="mt-2 text-center md:text-left">
                <p className="text-sm">
                  A Project by <strong className="text-primary">Oftern</strong>
                </p>
             </div>
        </div>

        <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-4 text-center md:text-left">গুরুত্বপূর্ণ লিঙ্ক</h3>
             <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                {footerLinks.map(link => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="space-y-4 text-center md:text-left">
             <h3 className="font-semibold text-lg">ডেভেলপার</h3>
             <div className='flex flex-col items-center md:items-start'>
                <p className="text-sm text-muted-foreground">
                  Developed & Maintained by <Link href="/developer" className="font-medium text-foreground hover:underline">Mojib Rsm</Link>
                </p>
                 <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link href="/developer">
                      <Code className="mr-2 h-4 w-4" />
                      About Developer
                    </Link>
                  </Button>
             </div>
        </div>

      </div>
       <div className="container mt-8 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} BD Edu Hub. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="mailto:info@bdedu.me" aria-label="Email"><Mail className="h-5 w-5 text-muted-foreground hover:text-primary"/></a>
                    <a href="https://www.facebook.com/Oftern/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="h-5 w-5 text-muted-foreground hover:text-primary"/></a>
                    <a href="tel:+8801601519007" aria-label="Phone"><Phone className="h-5 w-5 text-muted-foreground hover:text-primary"/></a>
                </div>
            </div>
        </div>
    </footer>
  )
}
