
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const privateUniversities = [
    { name: 'নর্থ সাউথ বিশ্ববিদ্যালয়', location: 'ঢাকা' },
    { name: 'ব্র্যাক বিশ্ববিদ্যালয়', location: 'ঢাকা' },
    { name: 'আমেরিকান ইন্টারন্যাশনাল ইউনিভার্সিটি-বাংলাদেশ (AIUB)', location: 'ঢাকা' },
    { name: 'ইনডিপেনডেন্ট ইউনিভার্সিটি, বাংলাদেশ (IUB)', location: 'ঢাকা' },
    { name: 'ইস্ট ওয়েস্ট বিশ্ববিদ্যালয়', location: 'ঢাকা' },
    { name: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি', location: 'ঢাকা' },
    { name: 'ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)', location: 'ঢাকা' },
    { name: 'ইউনিভার্সিটি অফ লিবারেল আর্টস বাংলাদেশ (ULAB)', location: 'ঢাকা' },
    { name: 'আহছানউল্লা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', location: 'ঢাকা' },
    { name: 'ইন্টারন্যাশনাল ইউনিভার্সিটি অব বিজনেস অ্যাগ্রিকালচার অ্যান্ড টেকনোলজি (IUBAT)', location: 'ঢাকা' },
    { name: 'গ্রিন ইউনিভার্সিটি অফ বাংলাদেশ', location: 'ঢাকা' },
    { name: 'সাউথইস্ট ইউনিভার্সিটি', location: 'ঢাকা' },
    { name: 'স্ট্যামফোর্ড ইউনিভার্সিটি বাংলাদেশ', location: 'ঢাকা' },
];

export default function PrivateUniversitiesPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">প্রাইভেট বিশ্ববিদ্যালয় তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    বাংলাদেশের জনপ্রিয় প্রাইভেট বিশ্ববিদ্যালয়গুলোর তালিকা।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>প্রাইভেট বিশ্ববিদ্যালয়</CardTitle>
                    <CardDescription>আপনার পছন্দের বিষয় এবং বাজেট অনুযায়ী বিশ্ববিদ্যালয় নির্বাচন করুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>বিশ্ববিদ্যালয়ের নাম</TableHead>
                                <TableHead>অবস্থান</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {privateUniversities.map((uni, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{uni.name}</TableCell>
                                    <TableCell>{uni.location}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <p className="text-muted-foreground text-sm mt-4 text-center">
                (দ্রষ্টব্য: এটি একটি সংক্ষিপ্ত তালিকা। ভর্তির জন্য সংশ্লিষ্ট প্রতিষ্ঠানের অফিসিয়াল ওয়েবসাইট দেখুন।)
            </p>
        </div>
    );
}
