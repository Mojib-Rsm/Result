
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Calculator, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools = [
  {
    title: 'GPA ক্যালকুলেটর',
    description: 'বিষয়ভিত্তিক গ্রেড ব্যবহার করে সহজেই আপনার গ্রেড পয়েন্ট এভারেজ (GPA) গণনা করুন।',
    icon: Calculator,
    href: '/tools/gpa-calculator',
  },
  {
    title: 'CGPA ক্যালকুলেটর',
    description: 'প্রতি সেমিস্টারের ক্রেডিট ও GPA ব্যবহার করে আপনার מצטבר গ্রেড পয়েন্ট এভারেজ (CGPA) গণনা করুন।',
    icon: Calculator,
    href: '/tools/cgpa-calculator',
  },
  {
    title: 'বয়স ক্যালকুলেটর',
    description: 'চাকরি বা ভর্তির আবেদনের জন্য আপনার সঠিক বয়স (বছর, মাস, দিন) নির্ভুলভাবে গণনা করুন।',
    icon: Calendar,
    href: '/tools/age-calculator',
  },
];

export default function ToolsPage() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">শিক্ষা সহায়ক টুলস</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    আপনার শিক্ষা জীবনকে আরও সহজ করতে আমাদের精心ভাবে তৈরি করা টুলসগুলো ব্যবহার করুন।
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool, index) => (
                    <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <tool.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{tool.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <CardDescription>{tool.description}</CardDescription>
                        </CardContent>
                        <CardContent>
                            <Link href={tool.href} className="w-full">
                                <Button variant="outline" className="w-full">
                                    টুলটি ব্যবহার করুন
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

    