
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Building, HeartPulse, HardHat, School, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

const institutionCategories = [
  {
    title: 'পাবলিক বিশ্ববিদ্যালয়',
    description: 'দেশের শীর্ষস্থানীয় পাবলিক বিশ্ববিদ্যালয়গুলোর সম্পর্কে জানুন।',
    icon: GraduationCap,
    href: '#', 
  },
  {
    title: 'প্রাইভেট বিশ্ববিদ্যালয়',
    description: 'আপনার পছন্দের বিষয়ে পড়ার জন্য সেরা প্রাইভেট বিশ্ববিদ্যালয়গুলো দেখুন।',
    icon: Building,
    href: '#',
  },
  {
    title: 'মেডিকেল কলেজ',
    description: 'ডাক্তারি পড়ার জন্য সরকারি ও বেসরকারি মেডিকেল কলেজের তালিকা।',
    icon: HeartPulse,
    href: '#',
  },
  {
    title: 'ইঞ্জিনিয়ারিং কলেজ',
    description: 'প্রকৌশলী হওয়ার স্বপ্ন পূরণে সেরা ইঞ্জিনিয়ারিং কলেজগুলো সম্পর্কে জানুন।',
    icon: HardHat,
    href: '#',
  },
    {
    title: 'জাতীয় বিশ্ববিদ্যালয়',
    description: 'স্নাতক ও স্নাতকোত্তর ডিগ্রির জন্য অধিভুক্ত কলেজগুলোর তালিকা দেখুন।',
    icon: School,
    href: '#',
  },
  {
    title: 'পলিটেকনিক ইনস্টিটিউট',
    description: 'কারিগরি ও বৃত্তিমূলক শিক্ষার জন্য সেরা পলিটেকনিক ইনস্টিটিউটগুলো জানুন।',
    icon: Wrench,
    href: '#',
  },
];


export default function SuggestionsPage() {
    const searchParams = useSearchParams();
    const gpa = searchParams.get('gpa');

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">ভর্তি পরামর্শ</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    আপনার GPA অনুযায়ী সেরা কলেজ ও বিশ্ববিদ্যালয় খুঁজে নিন।
                </p>
                {gpa && (
                    <p className="mt-4 text-xl font-semibold text-primary">
                        আপনার প্রাপ্ত GPA: {gpa}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {institutionCategories.map((category, index) => (
                    <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <category.icon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl">{category.title}</CardTitle>
                                <CardDescription className="mt-1">
                                    {category.description}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           {/* Content can be added here if needed in the future */}
                        </CardContent>
                        <CardFooter>
                            <Link href={category.href} className="w-full">
                                <Button variant="outline" className="w-full">
                                    তালিকা দেখুন
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center">
                 <p className="text-muted-foreground text-sm">
                    (দ্রষ্টব্য: এটি একটি পরীক্ষামূলক ফিচার। প্রদত্ত তথ্য রেফারেন্স হিসেবে ব্যবহার করুন। ভর্তির জন্য সংশ্লিষ্ট প্রতিষ্ঠানের অফিসিয়াল ওয়েবসাইট দেখুন।)
                </p>
            </div>
        </div>
    );
}

