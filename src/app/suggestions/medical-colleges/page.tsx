
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const medicalColleges = [
    { name: 'ঢাকা মেডিকেল কলেজ', location: 'ঢাকা' },
    { name: 'স্যার সলিমুল্লাহ মেডিকেল কলেজ', location: 'ঢাকা' },
    { name: 'শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ', location: 'ঢাকা' },
    { name: 'ময়মনসিংহ মেডিকেল কলেজ', location: 'ময়মনসিংহ' },
    { name: 'চট্টগ্রাম মেডিকেল কলেজ', location: 'চট্টগ্রাম' },
    { name: 'রাজশাহী মেডিকেল কলেজ', location: 'রাজশাহী' },
    { name: 'সিলেট এম.এ.জি. ওসমানী মেডিকেল কলেজ', location: 'সিলেট' },
    { name: 'শের-ই-বাংলা মেডিকেল কলেজ', location: 'বরিশাল' },
    { name: 'রংপুর মেডিকেল কলেজ', location: 'রংপুর' },
    { name: 'কুমিল্লা মেডিকেল কলেজ', location: 'কুমিল্লা' },
    { name: 'খুলনা মেডিকেল কলেজ', location: 'খুলনা' },
    { name: 'বাংলাদেশ মেডিকেল কলেজ', location: 'ঢাকা (বেসরকারি)' },
    { name: 'হলি ফ্যামিলি রেড ক্রিসেন্ট মেডিকেল কলেজ', location: 'ঢাকা (বেসরকারি)' },
    { name: 'ইব্রাহিম মেডিকেল কলেজ', location: 'ঢাকা (বেসরকারি)' },
];

export default function MedicalCollegesPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">মেডিকেল কলেজ তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    বাংলাদেশের সরকারি ও বেসরকারি মেডিকেল কলেজগুলোর তালিকা।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>মেডিকেল কলেজ</CardTitle>
                    <CardDescription>ডাক্তারি পড়ার জন্য সেরা প্রতিষ্ঠানগুলো সম্পর্কে জানুন।</CardDescription>
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
                            {medicalColleges.map((college, index) => (
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
