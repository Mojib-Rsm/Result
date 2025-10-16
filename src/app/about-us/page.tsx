
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Users, Target, Building } from 'lucide-react';

export default function AboutUsPage() {
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

            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="text-center p-6 bg-muted/30">
                     <Image
                        src="/logo.png"
                        alt="BD Edu Hub Logo"
                        width={80}
                        height={80}
                        className="rounded-full mx-auto border-4 border-background shadow-md"
                    />
                    <CardTitle className="text-4xl mt-4">আমাদের সম্পর্কে</CardTitle>
                    <CardDescription className="text-lg text-primary font-semibold">BD Edu - Your Education & Career Hub</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-10">
                    <div className="text-center">
                        <Target className="h-12 w-12 mx-auto text-primary mb-4" />
                        <h2 className="text-2xl font-bold">আমাদের লক্ষ্য</h2>
                        <p className="text-muted-foreground mt-2">
                           BD Edu Hub হলো বাংলাদেশের শিক্ষার্থীদের জন্য একটি ওয়ান-স্টপ সমাধান। আমাদের লক্ষ্য হলো পরীক্ষার ফলাফল, ভর্তি তথ্য, ক্যারিয়ার গাইডলাইন, এবং শিক্ষামূলক রিসোর্সগুলোকে সবার জন্য সহজলভ্য করে তোলা। আমরা বিশ্বাস করি, সঠিক তথ্য এবং দিকনির্দেশনা শিক্ষার্থীদের তাদের স্বপ্নের পথে এগিয়ে যেতে সাহায্য করে।
                        </p>
                    </div>

                     <div className="text-center">
                        <Building className="h-12 w-12 mx-auto text-primary mb-4" />
                        <h2 className="text-2xl font-bold">আমাদের প্রতিষ্ঠান</h2>
                        <p className="text-muted-foreground mt-2">
                           এই প্ল্যাটফর্মটি <strong className="text-foreground">Oftern</strong> দ্বারা পরিচালিত। Oftern একটি প্রযুক্তি-ভিত্তিক প্রতিষ্ঠান যা ডিজিটাল সমাধান তৈরির মাধ্যমে মানুষের জীবনকে সহজ করতে প্রতিশ্রুতিবদ্ধ। আমাদের ডেভেলপার এবং ডিজাইনারদের টিম শিক্ষার্থীদের জন্য একটি সুন্দর এবং কার্যকরী অভিজ্ঞতা নিশ্চিত করতে অক্লান্ত পরিশ্রম করে যাচ্ছে।
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                        <h2 className="text-2xl font-bold">আমাদের প্রতিষ্ঠাতা</h2>
                         <div className="flex flex-col items-center mt-4">
                             <Image
                                src="https://avatars.githubusercontent.com/u/85434839?v=4"
                                alt="Mojib Rsm"
                                width={100}
                                height={100}
                                className="rounded-full border-4 border-muted shadow-md"
                            />
                            <p className="font-bold text-xl mt-3">Mojibur Rahman (Mojib Rsm)</p>
                            <p className="text-muted-foreground">Founder, Oftern</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/developer">
                                    আরও জানুন
                                </Link>
                            </Button>
                         </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
