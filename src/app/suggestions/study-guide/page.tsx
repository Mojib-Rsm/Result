
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const studyTips = {
    ssc: {
        title: "SSC পরীক্ষার প্রস্তুতি",
        tips: [
            {
                title: "রুটিন তৈরি ও অনুসরণ",
                content: "প্রতিদিন নির্দিষ্ট সময়ে পড়ার অভ্যাস করুন। কঠিন বিষয়গুলোর জন্য বেশি সময় দিন এবং সহজ বিষয়গুলো রিভিশনের জন্য রাখুন। একটি ভারসাম্যপূর্ণ রুটিন আপনাকে গোছানোভাবে প্রস্তুতি নিতে সাহায্য করবে।"
            },
            {
                title: "টেস্ট পেপার সমাধান",
                content: "বিগত বছরের প্রশ্ন ও বিভিন্ন স্কুলের টেস্ট পরীক্ষার প্রশ্ন সমাধান করুন। এটি আপনাকে প্রশ্নের ধরন বুঝতে এবং সময় ব্যবস্থাপনায় দক্ষ হতে সাহায্য করবে।"
            },
            {
                title: "নোট তৈরি",
                content: "গুরুত্বপূর্ণ বিষয়গুলো পড়ার সময় সংক্ষিপ্ত নোট তৈরি করুন। পরীক্ষার আগে এই নোটগুলো দ্রুত রিভিশন দিতে খুব কার্যকর হবে।"
            }
        ]
    },
    hsc: {
        title: "HSC পরীক্ষার প্রস্তুতি",
        tips: [
            {
                title: "বিষয়ভিত্তিক গভীর জ্ঞান",
                content: "এইচএসসি পর্যায়ে প্রতিটি বিষয়ের গভীরে গিয়ে বোঝা জরুরি। মুখস্থ করার পরিবর্তে মূল ধারণা বোঝার চেষ্টা করুন। বিশেষ করে বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য এটি খুব গুরুত্বপূর্ণ।"
            },
            {
                title: 'সৃজনশীল প্রশ্নের অনুশীলন',
                content: 'গাইড বইয়ের পাশাপাশি মূল বই ভালোভাবে পড়ুন। প্রতিটি অধ্যায়ের শেষে দেওয়া সৃজনশীল প্রশ্নগুলো নিজে নিজে সমাধান করার চেষ্টা করুন।'
            },
            {
                title: "সময় ব্যবস্থাপনা",
                content: "পরীক্ষার হলে প্রতিটি প্রশ্নের জন্য সময় ভাগ করে নিন। কোনো একটি প্রশ্নের পেছনে অতিরিক্ত সময় নষ্ট না করে অন্য প্রশ্নে চলে যান। শেষে সময় পেলে কঠিন প্রশ্নগুলো আবার চেষ্টা করুন।"
            }
        ]
    },
    admission: {
        title: "বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি",
        tips: [
            {
                title: "লক্ষ্য নির্ধারণ",
                content: "আপনি কোন বিশ্ববিদ্যালয়ে বা কোন বিষয়ে পড়তে আগ্রহী, তা আগে থেকেই নির্ধারণ করুন। সে অনুযায়ী আপনার প্রস্তুতির কৌশল সাজান।"
            },
            {
                title: "প্রশ্নব্যাংক সমাধান",
                content: "আপনার টার্গেট করা বিশ্ববিদ্যালয়ের বিগত বছরগুলোর ভর্তি পরীক্ষার প্রশ্ন সংগ্রহ করে সমাধান করুন। এতে প্রশ্নের ধরন ও মান সম্পর্কে পরিষ্কার ধারণা পাওয়া যাবে।"
            },
            {
                title: "সাধারণ জ্ঞান ও ইংরেজি",
                content: "বেশিরভাগ ভর্তি পরীক্ষায় সাধারণ জ্ঞান এবং ইংরেজিতে দক্ষতা যাচাই করা হয়। প্রতিদিন পত্রিকা পড়ুন এবং ভালো মানের ইংরেজি বই পড়ার অভ্যাস করুন।"
            }
        ]
    }
}


export default function StudyGuidePage() {
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
                     <BookOpen className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">স্টাডি গাইড</CardTitle>
                    <CardDescription className="text-lg">SSC, HSC ও বিশ্ববিদ্যালয় ভর্তি গাইড।</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="ssc">
                            <AccordionTrigger className="text-xl">{studyTips.ssc.title}</AccordionTrigger>
                            <AccordionContent className="space-y-4 prose dark:prose-invert max-w-none">
                                {studyTips.ssc.tips.map(tip => (
                                    <div key={tip.title}>
                                        <h4>{tip.title}</h4>
                                        <p>{tip.content}</p>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="hsc">
                            <AccordionTrigger className="text-xl">{studyTips.hsc.title}</AccordionTrigger>
                            <AccordionContent className="space-y-4 prose dark:prose-invert max-w-none">
                                 {studyTips.hsc.tips.map(tip => (
                                    <div key={tip.title}>
                                        <h4>{tip.title}</h4>
                                        <p>{tip.content}</p>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="admission">
                            <AccordionTrigger className="text-xl">{studyTips.admission.title}</AccordionTrigger>
                            <AccordionContent className="space-y-4 prose dark:prose-invert max-w-none">
                                {studyTips.admission.tips.map(tip => (
                                    <div key={tip.title}>
                                        <h4>{tip.title}</h4>
                                        <p>{tip.content}</p>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
