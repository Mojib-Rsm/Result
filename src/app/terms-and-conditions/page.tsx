
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsAndConditionsPage() {
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
                    <CardTitle className="text-4xl mt-4">শর্তাবলী</CardTitle>
                    <CardDescription className="text-lg">আমাদের পরিষেবা ব্যবহারের নিয়মাবলী</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 prose dark:prose-invert max-w-none">
                    <p>
                        BD Edu Hub-এ আপনাকে স্বাগতম। এই ওয়েবসাইটটি ব্যবহার করার আগে, অনুগ্রহ করে নিম্নলিখিত শর্তাবলী মনোযোগ সহকারে পড়ুন। এই সাইটটি ব্যবহার করার মাধ্যমে, আপনি এই শর্তাবলীতে আবদ্ধ হতে সম্মত হচ্ছেন।
                    </p>

                    <h2>১. পরিষেবার ব্যবহার</h2>
                    <ul>
                        <li>এই ওয়েবসাইটের সমস্ত তথ্য শুধুমাত্র শিক্ষামূলক এবং তথ্যগত উদ্দেশ্যে প্রদান করা হয়েছে।</li>
                        <li>আপনি এই সাইটটি কোনো বেআইনি বা নিষিদ্ধ উদ্দেশ্যে ব্যবহার করতে পারবেন না।</li>
                        <li>আমরা কোনো পূর্ব বিজ্ঞপ্তি ছাড়াই যেকোনো সময় পরিষেবা পরিবর্তন বা বন্ধ করার অধিকার রাখি।</li>
                    </ul>

                    <h2>২. ফলাফলের নির্ভুলতা</h2>
                    <p>
                       আমরা শিক্ষা বোর্ডের অফিসিয়াল উৎস থেকে ফলাফল সংগ্রহ করি, তবে তথ্যের নির্ভুলতার নিশ্চয়তা দিই না। চূড়ান্ত ফলাফলের জন্য সর্বদা আপনার শিক্ষা বোর্ডের অফিসিয়াল ডকুমেন্ট দেখুন। ফলাফলের কোনো ভুলের জন্য আমরা দায়ী নই।
                    </p>

                    <h2>৩. SMS পরিষেবা</h2>
                    <p>
                        আমাদের SMS অ্যালার্ট পরিষেবাটি একটি স্বয়ংক্রিয় সিস্টেমের মাধ্যমে পরিচালিত হয়। আমরা ফলাফল প্রকাশের সাথে সাথে SMS পাঠানোর চেষ্টা করি, তবে প্রযুক্তিগত কারণে SMS পৌঁছাতে বিলম্ব বা ব্যর্থতার জন্য আমরা দায়ী থাকব না।
                    </p>

                    <h2>৪. কপিরাইট</h2>
                     <p>
                        এই ওয়েবসাইটের সমস্ত কনটেন্ট, ডিজাইন এবং লোগো BD Edu Hub এবং এর পরিচালক Oftern দ্বারা সংরক্ষিত। আমাদের লিখিত অনুমতি ছাড়া কোনো কনটেন্ট বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা যাবে না।
                    </p>
                    
                    <h2>৫. শর্তাবলী পরিবর্তন</h2>
                    <p>
                        আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি। পরিবর্তনগুলো এই পৃষ্ঠায় প্রকাশ করা হবে এবং অবিলম্বে কার্যকর হবে।
                    </p>

                     <h2>যোগাযোগ</h2>
                    <p>
                        এই শর্তাবলী সম্পর্কে আপনার কোনো প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে <Link href="/contact-us">যোগাযোগ</Link> করুন।
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
