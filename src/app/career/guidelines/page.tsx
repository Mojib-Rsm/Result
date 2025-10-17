
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FileText, UserCheck, MessageSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const careerTips = [
    {
        title: "একটি আকর্ষণীয় সিভি (CV) তৈরি করুন",
        icon: FileText,
        content: "আপনার সিভিতে শিক্ষাগত যোগ্যতা, অভিজ্ঞতা এবং দক্ষতার একটি সুস্পষ্ট তালিকা তৈরি করুন। বানান এবং ব্যাকরণগত ভুল এড়িয়ে চলুন। একটি পরিষ্কার এবং পেশাদার টেমপ্লেট ব্যবহার করুন। প্রয়োজনে আমাদের সিভি বিল্ডার টুল ব্যবহার করতে পারেন।"
    },
    {
        title: "ভাইভা বা ইন্টারভিউয়ের জন্য প্রস্তুতি নিন",
        icon: UserCheck,
        content: "সাক্ষাৎকারের আগে প্রতিষ্ঠান এবং পদের দায়িত্ব সম্পর্কে গবেষণা করুন। সাধারণ প্রশ্নগুলোর উত্তর প্রস্তুত রাখুন এবং নিজের সম্পর্কে ইতিবাচকভাবে কথা বলুন। আপনার পোশাক পরিচ্ছন্ন ও পেশাদার হওয়া উচিত।"
    },
    {
        title: "যোগাযোগ দক্ষতা বাড়ান",
        icon: MessageSquare,
        content: "কাজের জায়গায় সফল হওয়ার জন্য ভালো যোগাযোগ দক্ষতা অপরিহার্য। স্পষ্টভাবে কথা বলুন, অন্যের কথা মনোযোগ দিয়ে শুনুন এবং ইমেইল বা অন্যান্য লিখিত মাধ্যমে পেশাদার ভাষা ব্যবহার করুন।"
    }
];

export default function CareerGuidelinesPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        হোমে ফিরে যান
                    </Link>
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="text-center p-6 bg-muted/30">
                     <Sparkles className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">ক্যারিয়ার গাইডলাইন</CardTitle>
                    <CardDescription className="text-lg">সফল ক্যারিয়ার গড়ার জন্য সিভি তৈরি, ভাইভা প্রস্তুতি ও অন্যান্য টিপস।</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                     <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {careerTips.map((tip, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-xl">
                                    <div className="flex items-center gap-3">
                                        <tip.icon className="h-6 w-6 text-primary" />
                                        {tip.title}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="prose dark:prose-invert max-w-none text-base pl-12">
                                   {tip.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
