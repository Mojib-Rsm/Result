
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const publicUniversities = [
    { name: 'ঢাকা বিশ্ববিদ্যালয়', location: 'ঢাকা' },
    { name: 'রাজশাহী বিশ্ববিদ্যালয়', location: 'রাজশাহী' },
    { name: 'চট্টগ্রাম বিশ্ববিদ্যালয়', location: 'চট্টগ্রাম' },
    { name: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', location: 'সাভার, ঢাকা' },
    { name: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)', location: 'ঢাকা' },
    { name: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (কুয়েট)', location: 'খুলনা' },
    { name: 'রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (রুয়েট)', location: 'রাজশাহী' },
    { name: 'চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট)', location: 'চট্টগ্রাম' },
    { name: 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', location: 'সিলেট' },
    { name: 'ইসলামী বিশ্ববিদ্যালয়, বাংলাদেশ', location: 'কুষ্টিয়া' },
    { name: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয়', location: 'ময়মনসিংহ' },
    { name: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান কৃষি বিশ্ববিদ্যালয়', location: 'গাজীপুর' },
    { name: 'হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', location: 'দিনাজপুর' },
    { name: 'পটুয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', location: 'পটুয়াখালী' },
    { name: 'জগন্নাথ বিশ্ববিদ্যালয়', location: 'ঢাকা' },
    { name: 'কুমিল্লা বিশ্ববিদ্যালয়', location: 'কুমিল্লা' },
    { name: 'জাতীয় কবি কাজী নজরুল ইসলাম বিশ্ববিদ্যালয়', location: 'ত্রিশাল, ময়মনসিংহ' },
    { name: 'বরিশাল বিশ্ববিদ্যালয়', location: 'বরিশাল' },
    { name: 'বেগম রোকেয়া বিশ্ববিদ্যালয়, রংপুর', location: 'রংপুর' },
];

export default function PublicUniversitiesPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">পাবলিক বিশ্ববিদ্যালয় তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    বাংলাদেশের শীর্ষস্থানীয় পাবলিক বিশ্ববিদ্যালয়গুলোর তালিকা।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>পাবলিক বিশ্ববিদ্যালয়</CardTitle>
                    <CardDescription>আপনার পছন্দের বিশ্ববিদ্যালয় নির্বাচন করুন।</CardDescription>
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
                            {publicUniversities.map((uni, index) => (
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
