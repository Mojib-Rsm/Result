
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileSearch, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl items-center justify-center py-12">
            <Card className="w-full text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto w-fit rounded-full bg-primary/10 p-4">
                        <FileSearch className="h-12 w-12 text-primary" />
                    </div>
                    <p className="mt-4 text-6xl font-bold text-primary">404</p>
                    <CardTitle className="text-3xl">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</CardTitle>
                    <CardDescription className="text-lg">
                        দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই অথবা সরানো হয়েছে।
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            হোমে ফিরে যান
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
