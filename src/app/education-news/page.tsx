'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const newsItems = [
    {
        title: '২০২৫ সালের এসএসসি পরীক্ষা ফেব্রুয়ারিতে, এইচএসসি এপ্রিলে',
        description: 'আগামী বছরের (২০২৫) এসএসসি ও সমমান পরীক্ষা ফেব্রুয়ারিতে এবং এইচএসসি ও সমমান পরীক্ষা এপ্রিলে অনুষ্ঠিত হবে।',
        imageUrl: 'https://picsum.photos/seed/news1/600/400',
        source: 'প্রথম আলো',
        date: 'জুলাই ২১, ২০২৪',
        link: '#',
        tags: ['এসএসসি', 'এইচএসসি', '২০২৫'],
    },
    {
        title: 'পাবলিক বিশ্ববিদ্যালয়ে থাকছে না দ্বিতীয়বার ভর্তির সুযোগ',
        description: 'দেশের পাবলিক বিশ্ববিদ্যালয়গুলোতে স্নাতক প্রথম বর্ষে দ্বিতীয়বার ভর্তির সুযোগ আর থাকছে না। अगले শিক্ষাবর্ষ থেকে এটি কার্যকর হবে।',
        imageUrl: 'https://picsum.photos/seed/news2/600/400',
        source: 'The Daily Star',
        date: 'জুলাই ২০, ২০২৪',
        link: '#',
        tags: ['ভর্তি', 'পাবলিক বিশ্ববিদ্যালয়'],
    },
    {
        title: 'গুচ্ছ ভর্তি পরীক্ষা: প্রাথমিক আবেদন শুরু',
        description: 'দেশের ২২টি সাধারণ এবং বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের গুচ্ছ ভর্তি পরীক্ষার প্রাথমিক আবেদন শুরু হয়েছে।',
        imageUrl: 'https://picsum.photos/seed/news3/600/400',
        source: 'দৈনিক শিক্ষা',
        date: 'জুলাই ১৯, ২০২৪',
        link: '#',
        tags: ['গুচ্ছ', 'ভর্তি পরীক্ষা'],
    },
     {
        title: 'জুলাইয়ে খুলছে না শিক্ষা প্রতিষ্ঠান, ছুটি আরও বাড়তে পারে',
        description: 'সারা দেশে বন্যা পরিস্থিতির অবনতি হওয়ায় জুলাই মাসে শিক্ষা প্রতিষ্ঠান খোলার সম্ভাবনা নেই। ছুটি আরও বাড়তে পারে বলে জানিয়েছে শিক্ষা মন্ত্রণালয়।',
        imageUrl: 'https://picsum.photos/seed/news4/600/400',
        source: 'Jago News 24',
        date: 'জুলাই ১৮, ২০২৪',
        link: '#,
        tags: ['ছুটি', 'বন্যা'],
    }
];

export default function EducationNewsPage() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">শিক্ষা সংবাদ</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    শিক্ষা জগতের সর্বশেষ খবর ও আপডেট জানুন।
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {newsItems.map((item, index) => (
                    <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                         <CardHeader>
                             <div className="aspect-video relative">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-lg"
                                />
                            </div>
                         </CardHeader>

                        <CardContent className="flex-grow">
                             <CardTitle className="text-lg leading-snug hover:text-primary transition-colors">
                                <Link href={item.link} target="_blank">
                                    {item.title}
                                </Link>
                            </CardTitle>
                            <CardDescription className="mt-3">
                                {item.description}
                            </CardDescription>
                        </CardContent>

                        <CardFooter className="flex flex-col items-start gap-4">
                             <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                <span>{item.source}</span>
                                <span>{item.date}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                            <Link href={item.link} target="_blank" className="text-sm font-semibold text-primary hover:underline flex items-center">
                                বিস্তারিত পড়ুন <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <div className="mt-12 text-center">
                 <p className="text-muted-foreground text-sm">
                    (দ্রষ্টব্য: এটি একটি ডেমো সংবাদ বিভাগ। লিঙ্কগুলো বর্তমানে নিষ্ক্রিয় রয়েছে।)
                </p>
            </div>
        </div>
    );
}