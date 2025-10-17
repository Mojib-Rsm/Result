
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileText, Book, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

const modelTests = {
    ssc: [
        { subject: 'বাংলা ১ম পত্র', topic: 'গদ্য ও পদ্য', totalQuestions: 30, duration: '৩০ মিনিট' },
        { subject: 'গণিত', topic: 'বীজগণিত ও জ্যামিতি', totalQuestions: 25, duration: '৪০ মিনিট' },
        { subject: 'পদার্থবিজ্ঞান', topic: 'গতি ও বল', totalQuestions: 20, duration: '২৫ মিনিট' },
    ],
    hsc: [
        { subject: 'রসায়ন ২য় পত্র', topic: 'জৈব রসায়ন', totalQuestions: 40, duration: '৪৫ মিনিট' },
        { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি', topic: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', totalQuestions: 35, duration: '৩৫ মিনিট' },
        { subject: 'ইংরেজি', topic: 'Grammar & Vocabulary', totalQuestions: 50, duration: '৫০ মিনিট' },
    ],
    admission: [
        { subject: 'ঢাকা বিশ্ববিদ্যালয় (ক ইউনিট)', topic: 'পদার্থ, রসায়ন, গণিত, জীববিজ্ঞান', totalQuestions: 60, duration: '৪৫ মিনিট' },
        { subject: 'মেডিকেল ভর্তি পরীক্ষা', topic: 'জীববিজ্ঞান, রসায়ন, পদার্থ, ইংরেজি, সাধারণ জ্ঞান', totalQuestions: 100, duration: '৬০ মিনিট' },
        { subject: 'গুচ্ছ ভর্তি পরীক্ষা (A ইউনিট)', topic: 'পদার্থ, রসায়ন, গণিত/জীববিজ্ঞান', totalQuestions: 80, duration: '৬০ মিনিট' },
    ]
};


const ModelTestCard = ({ test }: { test: any }) => (
    <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
            <CardTitle>{test.subject}</CardTitle>
            <CardDescription>{test.topic}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
            <span>প্রশ্ন: {test.totalQuestions}টি</span>
            <span>সময়: {test.duration}</span>
        </CardContent>
        <CardFooter>
            <Button className="w-full">টেস্ট শুরু করুন</Button>
        </CardFooter>
    </Card>
);

export default function ModelTestPage() {
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
                     <FileText className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">মডেল টেস্ট ও সাজেশন</CardTitle>
                    <CardDescription className="text-lg">পরীক্ষার প্রস্তুতির জন্য মডেল টেস্ট ও সাজেশন।</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <Tabs defaultValue="hsc" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="ssc"><Book className="mr-2 h-4 w-4" /> SSC</TabsTrigger>
                            <TabsTrigger value="hsc"><Book className="mr-2 h-4 w-4" /> HSC</TabsTrigger>
                            <TabsTrigger value="admission"><GraduationCap className="mr-2 h-4 w-4" /> Admission</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ssc" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {modelTests.ssc.map((test, i) => <ModelTestCard key={i} test={test} />)}
                            </div>
                        </TabsContent>
                        <TabsContent value="hsc" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {modelTests.hsc.map((test, i) => <ModelTestCard key={i} test={test} />)}
                            </div>
                        </TabsContent>
                        <TabsContent value="admission" className="mt-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {modelTests.admission.map((test, i) => <ModelTestCard key={i} test={test} />)}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <p className="text-muted-foreground text-sm mt-4 text-center">
                (দ্রষ্টব্য: এটি একটি ডেমো ফিচার। মডেল টেস্টগুলো বর্তমানে নিষ্ক্রিয় রয়েছে।)
            </p>
        </div>
    );
}
