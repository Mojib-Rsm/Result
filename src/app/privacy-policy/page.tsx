
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                     <ShieldCheck className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">গোপনীয়তা নীতি</CardTitle>
                    <CardDescription className="text-lg">সর্বশেষ আপডেট: ১৬ অক্টোবর, ২০২৪</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 prose dark:prose-invert max-w-none">
                    <p>
                        BD Edu Hub ("আমরা", "আমাদের") আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই নীতিটি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।
                    </p>

                    <h2>যে তথ্য আমরা সংগ্রহ করি</h2>
                    <ul>
                        <li><strong>ফলাফল অনুসন্ধানের তথ্য:</strong> আপনি যখন ফলাফল অনুসন্ধান করেন, আমরা আপনার রোল, রেজিস্ট্রেশন নম্বর, বোর্ড, পরীক্ষার বছর ইত্যাদি তথ্য সংগ্রহ করি। এই তথ্য শুধুমাত্র ফলাফল প্রদর্শনের জন্য ব্যবহৃত হয়।</li>
                        <li><strong>সাবস্ক্রিপশন তথ্য:</strong> আপনি যদি ফলাফল প্রকাশের জন্য SMS অ্যালার্ট সাবস্ক্রাইব করেন, আমরা আপনার ফোন নম্বর এবং পরীক্ষার তথ্য সংগ্রহ করি।</li>
                         <li><strong>যোগাযোগের তথ্য:</strong> আপনি আমাদের সাথে যোগাযোগ করলে আপনার নাম, ইমেইল বা ফোন নম্বর সংগ্রহ করা হতে পারে।</li>
                    </ul>

                    <h2>তথ্যের ব্যবহার</h2>
                    <p>আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহৃত হয়:</p>
                    <ul>
                        <li> আপনাকে পরীক্ষার ফলাফল প্রদর্শন করতে।</li>
                        <li> ফলাফল প্রকাশিত হলে SMS বা অন্যান্য মাধ্যমে আপনাকে অবহিত করতে।</li>
                        <li> আমাদের পরিষেবা উন্নত করতে এবং ব্যবহারকারীর অভিজ্ঞতা অপ্টিমাইজ করতে।</li>
                        <li> আপনার প্রশ্নের উত্তর দিতে এবং সহায়তা প্রদান করতে।</li>
                    </ul>

                    <h2>তথ্য সুরক্ষা</h2>
                    <p>
                        আমরা আপনার তথ্যের সুরক্ষা নিশ্চিত করতে বিভিন্ন প্রযুক্তিগত এবং সাংগঠনিক পদক্ষেপ গ্রহণ করি। তবে, ইন্টারনেটের মাধ্যমে কোনো তথ্য ১০০% নিরাপদ নয়, তাই আমরা সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে পারি না।
                    </p>

                    <h2>তৃতীয় পক্ষের লিঙ্ক</h2>
                    <p>
                        আমাদের ওয়েবসাইটে তৃতীয় পক্ষের ওয়েবসাইটের লিঙ্ক থাকতে পারে। সেইসব সাইটের গোপনীয়তা নীতির জন্য আমরা দায়ী নই।
                    </p>

                    <h2>নীতি পরিবর্তন</h2>
                    <p>
                        আমরা সময়ে সময়ে এই গোপনীয়তা নীতি পরিবর্তন করার অধিকার রাখি। যেকোনো পরিবর্তন এই পৃষ্ঠায় প্রকাশ করা হবে।
                    </p>

                    <h2>যোগাযোগ</h2>
                    <p>
                        এই নীতি সম্পর্কে আপনার কোনো প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে <Link href="/contact-us">যোগাযোগ</Link> করুন।
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
