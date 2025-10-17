
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const publicUniversities = [
    { name: 'University of Dhaka', location: 'ঢাকা', website: 'http://www.du.ac.bd' },
    { name: 'University of Rajshahi', location: 'রাজশাহী', website: 'http://www.ru.ac.bd' },
    { name: 'Bangladesh Agricultural University', location: 'ময়মনসিংহ', website: 'http://www.bau.edu.bd' },
    { name: 'Bangladesh University of Engineering & Technology', location: 'ঢাকা', website: 'http://www.buet.ac.bd' },
    { name: 'University of Chittagong', location: 'চট্টগ্রাম', website: 'http://www.cu.ac.bd' },
    { name: 'Jahangirnagar University', location: 'সাভার, ঢাকা', website: 'http://www.juniv.edu' },
    { name: 'Islamic University, Bangladesh', location: 'কুষ্টিয়া', website: 'http://www.iu.ac.bd' },
    { name: 'Shahjalal University of Science & Technology', location: 'সিলেট', website: 'http://www.sust.edu' },
    { name: 'Khulna University', location: 'খুলনা', website: 'http://www.ku.ac.bd' },
    { name: 'National University', location: 'গাজীপুর', website: 'http://www.nu.edu.bd' },
    { name: 'Bangladesh Open University', location: 'গাজীপুর', website: 'http://www.bou.ac.bd' },
    { name: 'Bangabandhu Sheikh Mujib Medical University', location: 'ঢাকা', website: 'http://www.bsmmu.edu.bd' },
    { name: 'Bangabandhu Sheikh Mujibur Rahman Agricultural University', location: 'গাজীপুর', website: 'https://bsmrau.edu.bd/' },
    { name: 'Hajee Mohammad Danesh Science & Technology University', location: 'দিনাজপুর', website: 'http://www.hstu.ac.bd' },
    { name: 'Mawlana Bhashani Science & Technology University', location: 'টাঙ্গাইল', website: 'http://www.mbstu.ac.bd' },
    { name: 'Patuakhali Science And Technology University', location: 'পটুয়াখালী', website: 'http://www.pstu.ac.bd' },
    { name: 'Sher-e-Bangla Agricultural University', location: 'ঢাকা', website: 'http://www.sau.edu.bd' },
    { name: 'Chittagong University of Engineering & Technology (CUET)', location: 'চট্টগ্রাম', website: 'http://www.cuet.ac.bd' },
    { name: 'Rajshahi University of Engineering & Technology (RUET)', location: 'রাজশাহী', website: 'http://www.ruet.ac.bd' },
    { name: 'Khulna University of Engineering & Technology (KUET)', location: 'খুলনা', website: 'http://www.kuet.ac.bd' },
    { name: 'Dhaka University of Engineering & Technology (DUET)', location: 'গাজীপুর', website: 'http://www.duet.ac.bd' },
    { name: 'Noakhali Science & Technology University', location: 'নোয়াখালী', website: 'http://www.nstu.edu.bd' },
    { name: 'Jagannath University', location: 'ঢাকা', website: 'http://www.jnu.ac.bd' },
    { name: 'Comilla University', location: 'কুমিল্লা', website: 'http://www.cou.ac.bd' },
    { name: 'Jatiya Kabi Kazi Nazrul Islam University', location: 'ত্রিশাল, ময়মনসিংহ', website: 'http://www.jkkniu.edu.bd' },
    { name: 'Chittagong Veterinary and Animal Sciences University', location: 'চট্টগ্রাম', website: 'http://www.cvasu.ac.bd' },
    { name: 'Sylhet Agricultural University', location: 'সিলেট', website: 'http://www.sau.ac.bd' },
    { name: 'Jessore University of Science & Technology', location: 'যশোর', website: 'http://www.just.edu.bd' },
    { name: 'Pabna University of Science and Technology', location: 'পাবনা', website: 'http://www.pust.ac.bd' },
    { name: 'Begum Rokeya University, Rangpur', location: 'রংপুর', website: 'http://www.brur.ac.bd' },
    { name: 'Bangladesh University of Professionals', location: 'ঢাকা', website: 'http://www.bup.edu.bd' },
    { name: 'Bangabandhu Sheikh Mujibur Rahman Science & Technology University', location: 'গোপালগঞ্জ', website: 'http://www.bsmrstu.edu.bd' },
    { name: 'Bangladesh University of Textiles', location: 'ঢাকা', website: 'http://www.butex.edu.bd' },
    { name: 'University of Barishal', location: 'বরিশাল', website: 'http://www.bu.ac.bd' },
    { name: 'Rangamati Science and Technology University', location: 'রাঙ্গামাটি', website: 'http://www.rmstu.edu.bd' },
    { name: 'Bangladesh Maritime University', location: 'ঢাকা', website: 'https://bmu.edu.bd/' },
    { name: 'Islamic Arabic University', location: 'ঢাকা', website: 'http://www.iau.edu.bd' },
    { name: 'Chittagong Medical University', location: 'চট্টগ্রাম', website: 'http://www.cmu.edu.bd' },
    { name: 'Rajshahi Medical University', location: 'রাজশাহী', website: 'http://www.rmu.edu.bd' },
    { name: 'Rabindra University, Bangladesh', location: 'সিরাজগঞ্জ', website: 'http://www.rub.ac.bd' },
    { name: 'Bangabandhu Sheikh Mujibur Rahman Digital University', location: 'গাজীপুর', website: 'http://www.bdu.ac.bd' },
    { name: 'Sheikh Hasina University', location: 'নেত্রকোনা', website: 'https://www.shu.edu.bd/' },
    { name: 'Khulna Agricultural University', location: 'খুলনা', website: 'http://www.kau.edu.bd' },
    { name: 'Bangamata Sheikh Fojilatunnesa Mujib Science and Technology University', location: 'জামালপুর', website: 'https://bsfmstu.ac.bd/' },
    { name: 'Pabna Science and Technology University', location: 'পাবনা', website: 'http://www.pust.ac.bd'},
    { name: 'Bangabandhu Sheikh Mujibur Rahman University, Kishoreganj', location: 'কিশোরগঞ্জ', website: 'http://bsmru.ac.bd' },
    { name: 'Chandpur Science and Technology University', location: 'চাঁদপুর', website: 'http://www.cstu.ac.bd' },
    { name: 'Sunamganj Science and Technology University', location: 'সুনামগঞ্জ', website: 'http://www.sstu.ac.bd' },
    { name: 'Hobiganj Agricultural University', location: 'হবিগঞ্জ', website: 'http://www.hau.ac.bd' },
    { name: 'Kurigram Agricultural University', location: 'কুড়িগ্রাম', website: 'http://www.kuriau.edu.bd' },
    { name: 'Sheikh Hasina Medical University, Khulna', location: 'খুলনা', website: 'http://www.shmu.ac.bd' },
];


export default function PublicUniversitiesPage() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
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
                                <TableHead className="w-[100px]">ক্রমিক</TableHead>
                                <TableHead>বিশ্ববিদ্যালয়ের নাম</TableHead>
                                <TableHead>অবস্থান</TableHead>
                                <TableHead className="text-right">ওয়েবসাইট</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {publicUniversities.map((uni, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{uni.name}</TableCell>
                                    <TableCell>{uni.location}</TableCell>
                                    <TableCell className="text-right">
                                        {uni.website ? (
                                            <Button asChild variant="ghost" size="sm">
                                                <a href={uni.website} target="_blank" rel="noopener noreferrer">
                                                    ভিজিট করুন
                                                    <ExternalLink className="ml-2 h-3 w-3" />
                                                </a>
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <p className="text-muted-foreground text-sm mt-4 text-center">
                (দ্রষ্টব্য: এটি UGC ওয়েবসাইট থেকে সংগৃহীত তালিকা। ভর্তির জন্য সংশ্লিষ্ট প্রতিষ্ঠানের অফিসিয়াল ওয়েবসাইট দেখুন।)
            </p>
        </div>
    );
}
