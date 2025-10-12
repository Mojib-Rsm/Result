
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const nationalColleges = [
    { name: 'ঢাকা কলেজ', location: 'ঢাকা' },
    { name: 'ইডেন মহিলা কলেজ', location: 'ঢাকা' },
    { name: 'সরকারি তিতুমীর কলেজ', location: 'ঢাকা' },
    { name: 'Carmichael College', location: 'রংপুর' },
    { name: 'Brindaban Government College', location: 'হবিগঞ্জ' },
    { name: 'রাজশাহী কলেজ', location: 'রাজশাহী' },
    { name: 'বরিশাল সরকারি ব্রজমোহন কলেজ', location: 'বরিশাল' },
    { name: 'আনন্দ মোহন কলেজ', location: 'ময়মনসিংহ' },
    { name: 'সরকারি এম. এম. কলেজ, যশোর', location: 'যশোর' },
    { name: 'চট্টগ্রাম কলেজ', location: 'চট্টগ্রাম' },
];

export default function NationalUniversityPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">জাতীয় বিশ্ববিদ্যালয়ের অধিভুক্ত কলেজ</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    স্নাতক ও স্নাতকোত্তর ডিগ্রির জন্য সেরা অধিভুক্ত কলেজগুলোর তালিকা।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>সেরা কলেজসমূহ</CardTitle>
                    <CardDescription>জাতীয় বিশ্ববিদ্যালয়ের অধীনে থাকা শীর্ষস্থানীয় কলেজগুলো দেখুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>কলেজের নাম</TableHead>
                                <TableHead>অবস্থান</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nationalColleges.map((college, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{college.name}</TableCell>
                                    <TableCell>{college.location}</TableCell>
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
