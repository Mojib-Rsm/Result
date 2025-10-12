
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const polytechnicInstitutes = [
    { name: 'ঢাকা পলিটেকনিক ইনস্টিটিউট', location: 'ঢাকা' },
    { name: 'বাংলাদেশ সুইডেন পলিটেকনিক ইনস্টিটিউট', location: 'কাপ্তাই, রাঙ্গামাটি' },
    { name: 'চট্টগ্রাম পলিটেকনিক ইনস্টিটিউট', location: 'চট্টগ্রাম' },
    { name: 'রাজশাহী পলিটেকনিক ইনস্টিটিউট', location: 'রাজশাহী' },
    { name: 'খুলনা পলিটেকনিক ইনস্টিটিউট', location: 'খুলনা' },
    { name: 'বগুড়া পলিটেকনিক ইনস্টিটিউট', location: 'বগুড়া' },
    { name: 'বরিশাল পলিটেকনিক ইনস্টিটিউট', location: 'বরিশাল' },
    { name: 'সিলেট পলিটেকনিক ইনস্টিটিউট', location: 'সিলেট' },
    { name: 'ময়মনসিংহ পলিটেকনিক ইনস্টিটিউট', location: 'ময়মনসিংহ' },
    { name: 'কুমিল্লা পলিটেকনিক ইনস্টিটিউট', location: 'কুমিল্লা' },
    { name: 'ফেনী পলিটেকনিক ইনস্টিটিউট', location: 'ফেনী' },
];

export default function PolytechnicInstitutesPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">পলিটেকনিক ইনস্টিটিউট তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    কারিগরি ও বৃত্তিমূলক শিক্ষার জন্য সেরা পলিটেকনিক ইনস্টিটিউটগুলো।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>পলিটেকনিক ইনস্টিটিউট</CardTitle>
                    <CardDescription>ডিপ্লোমা-ইন-ইঞ্জিনিয়ারিং ডিগ্রির জন্য প্রতিষ্ঠানগুলো দেখুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>প্রতিষ্ঠানের নাম</TableHead>
                                <TableHead>অবস্থান</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {polytechnicInstitutes.map((inst, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{inst.name}</TableCell>
                                    <TableCell>{inst.location}</TableCell>
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
