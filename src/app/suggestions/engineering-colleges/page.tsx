
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const engineeringColleges = [
    { name: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)', location: 'ঢাকা' },
    { name: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (কুয়েট)', location: 'khulna' },
    { name: 'রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (রুয়েট)', location: 'রাজশাহী' },
    { name: 'চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট)', location: 'চট্টগ্রাম' },
    { name: 'ইসলামিক ইউনিভার্সিটি অব টেকনোলজি (IUT)', location: 'গাজীপুর' },
    { name: 'মিলিটারি ইনস্টিটিউট অফ সায়েন্স অ্যান্ড টেকনোলজি (MIST)', location: 'ঢাকা' },
    { name: 'ময়মনসিংহ ইঞ্জিনিয়ারিং কলেজ', location: 'ময়মনসিংহ' },
    { name: 'সিলেট ইঞ্জিনিয়ারিং কলেজ', location: 'সিলেট' },
    { name: 'ফরিদপুর ইঞ্জিনিয়ারিং কলেজ', location: 'ফরিদপুর' },
    { name: 'বরিশাল ইঞ্জিনিয়ারিং কলেজ', location: 'বরিশাল' },
    { name: 'আহছানউল্লা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', location: 'ঢাকা (বেসরকারি)' },
];

export default function EngineeringCollegesPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">ইঞ্জিনিয়ারিং কলেজ তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    বাংলাদেশের সেরা প্রকৌশল বিশ্ববিদ্যালয় ও কলেজগুলোর তালিকা।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ইঞ্জিনিয়ারিং প্রতিষ্ঠান</CardTitle>
                    <CardDescription>প্রকৌশলী হওয়ার স্বপ্ন পূরণে সেরা প্রতিষ্ঠানগুলো দেখুন।</CardDescription>
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
                            {engineeringColleges.map((college, index) => (
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
