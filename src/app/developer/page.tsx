
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Phone, Globe, Send, Facebook, Code, ShoppingBag, Newspaper } from 'lucide-react';

const developerInfo = {
    name: 'Mojibur Rahman (Mojib Rsm)',
    role: 'Junior Web Developer, Creative Designer, CEO',
    bio: 'একজন সৃজনশীল ডিজাইনার এবং ওয়েব ডেভেলপার হিসেবে, আমি প্রযুক্তি এবং ডিজাইনের সমন্বয়ে ব্যবহারকারী-বান্ধব এবং আকর্ষণীয় ডিজিটাল অভিজ্ঞতা তৈরি করতে আগ্রহী। আমি Oftern IT এবং Oftern Shop-এর প্রতিষ্ঠাতা, যেখানে আমরা উদ্ভাবনী সমাধান সরবরাহ করি।',
    imageUrl: 'https://avatars.githubusercontent.com/u/85434839?s=400&u=7eac013dc3bd8535a13bdca8754198976d95dd44&v=4',
    links: [
        { label: 'ইমেইল', value: 'mojibrsm@gmail.com', icon: Mail, href: 'mailto:mojibrsm@gmail.com' },
        { label: 'ফোন', value: '+8801601519007', icon: Phone, href: 'tel:+8801601519007' },
        { label: 'পোর্টফোলিও', value: 'www.mojib.me', icon: Globe, href: 'https://www.mojib.me' },
        { label: 'টেলিগ্রাম', value: '@MrTools_BD', icon: Send, href: 'https://t.me/MrTools_BD' },
        { label: 'ফেসবুক', value: 'Mojib Rsm', icon: Facebook, href: 'https://www.facebook.com/MojibRsm' },
        { label: 'Oftern IT', value: 'IT Solutions', icon: Code, href: 'https://www.oftern.com' },
        { label: 'Oftern Shop', value: 'E-commerce', icon: ShoppingBag, href: 'https://www.oftern.shop' },
        { label: 'BartaNow', value: 'News Portal', icon: Newspaper, href: 'https://www.bartanow.com' }
    ]
};

export default function DeveloperPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        হোমে ফিরে যান
                    </Link>
                </Button>
            </div>

            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="text-center p-6 bg-muted/30">
                    <Image
                        src={developerInfo.imageUrl}
                        alt={developerInfo.name}
                        width={120}
                        height={120}
                        className="rounded-full mx-auto border-4 border-background shadow-md"
                    />
                    <CardTitle className="text-3xl mt-4">{developerInfo.name}</CardTitle>
                    <CardDescription className="text-md text-primary font-semibold">{developerInfo.role}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground mb-8">{developerInfo.bio}</p>
                    
                    <div className="space-y-4">
                        {developerInfo.links.map((link, index) => (
                            <a 
                                key={index} 
                                href={link.href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                            >
                                <link.icon className="h-5 w-5 mr-4 text-primary" />
                                <div className="flex-1">
                                    <p className="font-semibold">{link.label}</p>
                                    <p className="text-sm text-muted-foreground">{link.value}</p>
                                </div>
                                <ArrowLeft className="h-4 w-4 text-muted-foreground transform rotate-180" />
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
