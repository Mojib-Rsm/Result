
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Briefcase } from 'lucide-react';

export default function PostJobPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/career">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ক্যারিয়ার পেজে ফিরে যান
                    </Link>
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="text-center p-6 bg-muted/30">
                     <Briefcase className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">জব পোস্ট করুন</CardTitle>
                    <CardDescription className="text-lg">আপনার প্রতিষ্ঠানের জন্য চাকরির বিজ্ঞপ্তি দিন।</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">এই পাতাটি এখন নির্মাণাধীন</h3>
                    <p className="text-muted-foreground">
                        বর্তমানে শুধুমাত্র অ্যাডমিনরা চাকরির বিজ্ঞপ্তি পোস্ট করতে পারেন। এই ফিচারটি শীঘ্রই সকলের জন্য উন্মুক্ত করা হবে। আমাদের সাথে থাকার জন্য ধন্যবাদ!
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/admin/career/add">
                            অ্যাডমিন প্যানেলে যান
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
