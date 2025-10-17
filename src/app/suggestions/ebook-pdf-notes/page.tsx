
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';

export default function EbookPdfNotesPage() {
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
                     <Download className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">eBook / PDF নোটস</CardTitle>
                    <CardDescription className="text-lg">প্রয়োজনীয় বই ও নোটস ডাউনলোড করুন।</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">এই পাতাটি এখন নির্মাণাধীন</h3>
                    <p className="text-muted-foreground">
                        আমরা এই বিভাগে বিভিন্ন বিষয়ের উপর গুরুত্বপূর্ণ বই এবং লেকচার নোটের PDF সংগ্রহ করছি। খুব শীঘ্রই এখান থেকে প্রয়োজনীয় ফাইল ডাউনলোড করার সুযোগ পাবেন। আমাদের সাথে থাকার জন্য ধন্যবাদ!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
