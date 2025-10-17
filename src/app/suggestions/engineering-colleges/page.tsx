
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const engineeringColleges = [
    // Public Engineering Universities
    { name: 'Bangladesh University of Engineering and Technology (BUET)', location: 'ঢাকা', website: 'https://www.buet.ac.bd' },
    { name: 'Khulna University of Engineering & Technology (KUET)', location: 'খুলনা', website: 'https://www.kuet.ac.bd' },
    { name: 'Rajshahi University of Engineering & Technology (RUET)', location: 'রাজশাহী', website: 'https://www.ruet.ac.bd' },
    { name: 'Chittagong University of Engineering & Technology (CUET)', location: 'চট্টগ্রাম', website: 'https://www.cuet.ac.bd' },
    { name: 'Dhaka University of Engineering & Technology (DUET)', location: 'গাজীপুর', website: 'http://www.duet.ac.bd' },

    // Science and Technology Universities with Strong Engineering
    { name: 'Shahjalal University of Science & Technology (SUST)', location: 'সিলেট', website: 'http://www.sust.edu' },
    { name: 'Hajee Mohammad Danesh Science & Technology University (HSTU)', location: 'দিনাজপুর', website: 'http://www.hstu.ac.bd' },
    { name: 'Mawlana Bhashani Science & Technology University (MBSTU)', location: 'টাঙ্গাইল', website: 'http://www.mbstu.ac.bd' },
    { name: 'Patuakhali Science And Technology University (PSTU)', location: 'পটুয়াখালী', website: 'http://www.pstu.ac.bd' },
    { name: 'Noakhali Science & Technology University (NSTU)', location: 'নোয়াখালী', website: 'http://www.nstu.edu.bd' },
    { name: 'Jessore University of Science & Technology (JUST)', location: 'যশোর', website: 'http://www.just.edu.bd' },
    { name: 'Pabna University of Science and Technology (PUST)', location: 'পাবনা', website: 'http://www.pust.ac.bd' },
    { name: 'Bangabandhu Sheikh Mujibur Rahman Science & Technology University (BSMRSTU)', location: 'গোপালগঞ্জ', website: 'http://www.bsmrstu.edu.bd' },
    
    // Specialized Public Universities
    { name: 'Islamic University of Technology (IUT)', location: 'গাজীপুর', website: 'https://www.iutoic-dhaka.edu' },
    { name: 'Military Institute of Science and Technology (MIST)', location: 'ঢাকা', website: 'https://mist.ac.bd' },
    { name: 'Bangladesh University of Textiles (BUTEX)', location: 'ঢাকা', website: 'http://www.butex.edu.bd' },

    // Government Engineering Colleges
    { name: 'Mymensingh Engineering College', location: 'ময়মনসিংহ', website: 'https://www.mec.ac.bd' },
    { name: 'Sylhet Engineering College', location: 'সিলেট', website: 'https://www.sec.ac.bd' },
    { name: 'Faridpur Engineering College', location: 'ফরিদপুর', website: 'https://www.fec.ac.bd' },
    { name: 'Barisal Engineering College', location: 'বরিশাল', website: 'https://www.bec.ac.bd' },
    
    // Top Private Universities for Engineering
    { name: 'Ahsanullah University of Science and Technology (AUST)', location: 'ঢাকা (বেসরকারি)', website: 'http://www.aust.edu' },
    { name: 'American International University-Bangladesh (AIUB)', location: 'ঢাকা (বেসরকারি)', website: 'http://www.aiub.ac.bd' },
    { name: 'BRAC University', location: 'ঢাকা (বেসরকারি)', website: 'http://www.bracu.ac.bd' },
    { name: 'North South University (NSU)', location: 'ঢাকা (বেসরকারি)', website: 'http://www.northsouth.edu' },
    { name: 'East West University (EWU)', location: 'ঢাকা (বেসরকারি)', website: 'http://www.ewubd.edu' },
    { name: 'United International University (UIU)', location: 'ঢাকা (বেসরকারি)', website: 'http://www.uiu.ac.bd' },
    { name: 'Daffodil International University (DIU)', location: 'ঢাকা (বেসরকারি)', website: 'http://www.daffodilvarsity.edu.bd' },
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
                <h1 className="text-3xl font-bold tracking-tight">ইঞ্জিনিয়ারিং কলেজ ও বিশ্ববিদ্যালয় তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    বাংলাদেশের সেরা প্রকৌশল বিশ্ববিদ্যালয় ও কলেজগুলোর তালিকা।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>প্রকৌশল প্রতিষ্ঠান</CardTitle>
                    <CardDescription>প্রকৌশলী হওয়ার স্বপ্ন পূরণে সেরা প্রতিষ্ঠানগুলো দেখুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>প্রতিষ্ঠানের নাম</TableHead>
                                <TableHead>অবস্থান</TableHead>
                                <TableHead className="text-right">ওয়েবসাইট</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {engineeringColleges.map((college, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{college.name}</TableCell>
                                    <TableCell>{college.location}</TableCell>
                                     <TableCell className="text-right">
                                        {college.website ? (
                                            <Button asChild variant="ghost" size="sm">
                                                <a href={college.website} target="_blank" rel="noopener noreferrer">
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
        </div>
    );
}
