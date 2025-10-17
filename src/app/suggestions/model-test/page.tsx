
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

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
                <CardContent className="p-6 md:p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">এই পাতাটি এখন নির্মাণাধীন</h3>
                    <p className="text-muted-foreground">
                        আমরা এই বিভাগে পরীক্ষার প্রস্তুতির জন্য বিভিন্ন বিষয়ের উপর মডেল টেস্ট এবং গুরুত্বপূর্ণ সাজেশন যুক্ত করার জন্য কাজ করছি। খুব শীঘ্রই এখানে নতুন কনটেন্ট যুক্ত করা হবে। আমাদের সাথে থাকার জন্য ধন্যবাদ!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
