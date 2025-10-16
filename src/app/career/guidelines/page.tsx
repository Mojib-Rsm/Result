'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

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
                <CardContent className="p-6 md:p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">এই পাতাটি এখন নির্মাণাধীন</h3>
                    <p className="text-muted-foreground">
                        আমরা এই বিভাগে ক্যারিয়ার গাইডলাইন, সিভি লেখার নিয়ম, ভাইভা টিপস এবং আরও অনেক কিছু যুক্ত করার জন্য কাজ করছি। খুব শীঘ্রই এখানে নতুন কনটেন্ট যুক্ত করা হবে। আমাদের সাথে থাকার জন্য ধন্যবাদ!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
