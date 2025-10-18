
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Briefcase, ShieldAlert } from 'lucide-react';

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
                    <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-4">এই ফিচারটি শুধুমাত্র অ্যাডমিনদের জন্য।</h3>
                    <p className="text-muted-foreground">
                        আমাদের প্ল্যাটফর্মে চাকরির বিজ্ঞপ্তির মান বজায় রাখার জন্য, বর্তমানে শুধুমাত্র অ্যাডমিনরা চাকরির বিজ্ঞপ্তি পোস্ট করতে পারেন। আপনি যদি আপনার প্রতিষ্ঠানের জন্য কোনো বিজ্ঞপ্তি পোস্ট করতে চান, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।
                    </p>
                    <div className="flex gap-4 justify-center mt-6">
                        <Button asChild>
                            <Link href="/contact-us">
                                যোগাযোগ করুন
                            </Link>
                        </Button>
                         <Button asChild variant="outline">
                            <Link href="/admin/career/add">
                                অ্যাডমিন প্যানেলে যান
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
