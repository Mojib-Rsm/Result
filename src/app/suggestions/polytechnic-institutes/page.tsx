
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const polytechnicInstitutes = [
    { name: 'ঢাকা পলিটেকনিক ইনস্টিটিউট', location: 'ঢাকা' },
    { name: 'ঢাকা মহিলা পলিটেকনিক ইনস্টিটিউট', location: 'ঢাকা' },
    { name: 'বাংলাদেশ সুইডেন পলিটেকনিক ইনস্টিটিউট', location: 'কাপ্তাই, রাঙ্গামাটি' },
    { name: 'চট্টগ্রাম পলিটেকনিক ইনস্টিটিউট', location: 'চট্টগ্রাম' },
    { name: 'কুমিল্লা পলিটেকনিক ইনস্টিটিউট', location: 'কুমিল্লা' },
    { name: 'ফেনী পলিটেকনিক ইনস্টিটিউট', location: 'ফেনী' },
    { name: 'বাংলাদেশ সার্ভে ইনস্টিটিউট', location: 'কুমিল্লা' },
    { name: 'রাজশাহী পলিটেকনিক ইনস্টিটিউট', location: 'রাজশাহী' },
    { name: 'বগুড়া পলিটেকনিক ইনস্টিটিউট', location: 'বগুড়া' },
    { name: 'পাবনা পলিটেকনিক ইনস্টিটিউট', location: 'পাবনা' },
    { name: 'সিরাজগঞ্জ পলিটেকনিক ইনস্টিটিউট', location: 'সিরাজগঞ্জ' },
    { name: 'খুলনা পলিটেকনিক ইনস্টিটিউট', location: 'খুলনা' },
    { name: 'যশোর পলিটেকনিক ইনস্টিটিউট', location: 'যশোর' },
    { name: 'কুষ্টিয়া পলিটেকনিক ইনস্টিটিউট', location: 'কুষ্টিয়া' },
    { name: 'বরিশাল পলিটেকনিক ইনস্টিটিউট', location: 'বরিশাল' },
    { name: 'পটুয়াখালী পলিটেকনিক ইনস্টিটিউট', location: 'পটুয়াখালী' },
    { name: 'সিলেট পলিটেকনিক ইনস্টিটিউট', location: 'সিলেট' },
    { name: 'ময়মনসিংহ পলিটেকনিক ইনস্টিটিউট', location: 'ময়মনসিংহ' },
    { name: 'টাঙ্গাইল পলিটেকনিক ইনস্টিটিউট', location: 'টাঙ্গাইল' },
    { name: 'ফরিদপুর পলিটেকনিক ইনস্টিটিউট', location: 'ফরিদপুর' },
    { name: 'রংপুর পলিটেকনিক ইনস্টিটিউট', location: 'রংপুর' },
    { name: 'দিনাজপুর পলিটেকনিক ইনস্টিটিউট', location: 'দিনাজপুর' },
    { name: 'গ্রাফিক আর্টস ইনস্টিটিউট', location: 'ঢাকা' },
    { name: 'বাংলাদেশ গ্লাস এন্ড সিরামিক ইনস্টিটিউট', location: 'ঢাকা' },
    { name: 'ফেনী কম্পিউটার ইনস্টিটিউট', location: 'ফেনী' },
    { name: 'বরগুনা পলিটেকনিক ইনস্টিটিউট', location: 'বরগুনা' },
    { name: 'ব্রাহ্মণবাড়িয়া পলিটেকনিক ইনস্টিটিউট', location: 'ব্রাহ্মণবাড়িয়া' },
    { name: 'চাঁপাইনবাবগঞ্জ পলিটেকনিক ইনস্টিটিউট', location: 'চাঁপাইনবাবগঞ্জ' },
    { name: 'চাঁদপুর পলিটেকনিক ইনস্টিটিউট', location: 'চাঁদপুর' },
    { name: 'কক্সবাজার পলিটেকনিক ইনস্টিটিউট', location: 'কক্সবাজার' },
    { name: 'গোপালগঞ্জ পলিটেকনিক ইনস্টিটিউট', location: 'গোপালগঞ্জ' },
    { name: 'হবিগঞ্জ পলিটেকনিক ইনস্টিটিউট', location: 'হবিগঞ্জ' },
    { name: 'ঝিনাইদহ পলিটেকনিক ইনস্টিটিউট', location: 'ঝিনাইদহ' },
    { name: 'জয়পুরহাট পলিটেকনিক ইনস্টিটিউট', location: 'জয়পুরহাট' },
    { name: 'খাগড়াছড়ি পলিটেকনিক ইনস্টিটিউট', location: 'খাগড়াছড়ি' },
    { name: 'কিশোরগঞ্জ পলিটেকনিক ইনস্টিটিউট', location: 'কিশোরগঞ্জ' },
    { name: 'কুড়িগ্রাম পলিটেকনিক ইনস্টিটিউট', location: 'কুড়িগ্রাম' },
    { name: 'লক্ষ্মীপুর পলিটেকনিক ইনস্টিটিউট', location: 'লক্ষ্মীপুর' },
    { name: 'মাগুরা পলিটেকনিক ইনস্টিটিউট', location: 'মাগুরা' },
    { name: 'মৌলভীবাজার পলিটেকনিক ইনস্টিটিউট', location: 'মৌলভীবাজার' },
    { name: 'মুন্সিগঞ্জ পলিটেকনিক ইনস্টিটিউট', location: 'মুন্সিগঞ্জ' },
    { name: 'নরসিংদী পলিটেকনিক ইনস্টিটিউট', location: 'নরসিংদী' },
    { name: 'নওগাঁ পলিটেকনিক ইনস্টিটিউট', location: 'নওগাঁ' },
    { name: 'নেত্রকোনা পলিটেকনিক ইনস্টিটিউট', location: 'নেত্রকোনা' },
    { name: 'শেরপুর পলিটেকনিক ইনস্টিটিউট', location: 'শেরপুর' },
    { name: 'সাতক্ষীরা পলিটেকনিক ইনস্টিটিউট', location: 'সাতক্ষীরা' },
    { name: 'শরীয়তপুর পলিটেকনিক ইনস্টিটিউট', location: 'শরীয়তপুর' },
    { name: 'ঠাকুরগাঁও পলিটেকনিক ইনস্টিটিউট', location: 'ঠাকুরগাঁও' },
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
