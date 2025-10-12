
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const nationalColleges = [
    { name: 'ঢাকা কলেজ', location: 'ঢাকা', website: 'https://www.dhakacollege.edu.bd' },
    { name: 'ইডেন মহিলা কলেজ', location: 'ঢাকা', website: 'https://www.emc.edu.bd' },
    { name: 'সরকারি তিতুমীর কলেজ', location: 'ঢাকা', website: 'https://www.titumircollege.gov.bd' },
    { name: 'সরকারি বাঙলা কলেজ', location: 'ঢাকা', website: 'https://www.banglacollege.gov.bd' },
    { name: 'কবি নজরুল সরকারি কলেজ', location: 'ঢাকা', website: 'https://www.kncollege.gov.bd' },
    { name: 'বেগম বদরুন্নেসা সরকারি মহিলা কলেজ', location: 'ঢাকা', website: 'https://www.bbgmc.gov.bd' },
    { name: 'সরকারি শহীদ সোহরাওয়ার্দী কলেজ', location: 'ঢাকা', website: 'https://www.gssc.gov.bd' },
    { name: 'ভাওয়াল বদরে আলম সরকারি কলেজ', location: 'গাজীপুর', website: 'https://www.bbagc.edu.bd' },
    { name: 'নরসিংদী সরকারি কলেজ', location: 'নরসিংদী', website: 'https://www.ngc.gov.bd' },
    { name: 'সরকারি তোলারাম কলেজ', location: 'নারায়ণগঞ্জ', website: 'https://www.tolaramcollege.gov.bd' },

    // Chittagong Division
    { name: 'চট্টগ্রাম কলেজ', location: 'চট্টগ্রাম', website: 'https://www.ctgcollege.gov.bd' },
    { name: 'সরকারি হাজী মুহাম্মদ মহসিন কলেজ', location: 'চট্টগ্রাম', website: 'https://www.mohsincollege.gov.bd' },
    { name: 'স্যার আশুতোষ সরকারি কলেজ', location: 'চট্টগ্রাম', website: 'https://sagc.edu.bd' },
    { name: 'কুমিল্লা ভিক্টোরিয়া সরকারি কলেজ', location: 'কুমিল্লা', website: 'https://www.cvgc.edu.bd' },
    { name: 'ফেনী সরকারি কলেজ', location: 'ফেনী', website: 'https://www.fgc.gov.bd' },
    { name: 'ব্রাহ্মণবাড়িয়া সরকারি কলেজ', location: 'ব্রাহ্মণবাড়িয়া', website: 'https://www.brahmanbaria-govt-college.com' },

    // Rajshahi Division
    { name: 'রাজশাহী কলেজ', location: 'রাজশাহী', website: 'https://www.rc.edu.bd' },
    { name: 'রাজশাহী নিউ গভঃ ডিগ্রী কলেজ', location: 'রাজশাহী', website: 'https://www.newgovtdegreecollege.edu.bd' },
    { name: 'সরকারি আজিজুল হক কলেজ', location: 'বগুড়া', website: 'https://www.ahcollege.gov.bd' },
    { name: 'সিরাজগঞ্জ সরকারি কলেজ', location: 'সিরাজগঞ্জ', website: 'https://sgc.gov.bd' },
    { name: 'পাবনা এডওয়ার্ড কলেজ', location: 'পাবনা', website: 'https://www.edwardcollege.edu.bd' },

    // Khulna Division
    { name: 'সরকারি ব্রজলাল কলেজ', location: 'খুলনা', website: 'https://www.blcollege.edu.bd' },
    { name: 'সরকারি এম. এম. কলেজ', location: 'যশোর', website: 'https://www.mmcollege.edu.bd' },
    { name: 'সাতক্ষীরা সরকারি কলেজ', location: 'সাতক্ষীরা', website: 'https://www.satkhiragovtcollege.edu.bd' },
    { name: 'কুষ্টিয়া সরকারি কলেজ', location: 'কুষ্টিয়া', website: 'https://www.kushtiagovtcollege.edu.bd' },

    // Barishal Division
    { name: 'বরিশাল সরকারি ব্রজমোহন কলেজ', location: 'বরিশাল', website: 'https://www.bmcollege.gov.bd' },
    { name: 'সরকারি সৈয়দ হাতেম আলী কলেজ', location: 'বরিশাল', website: 'https://www.shacollege.gov.bd' },

    // Sylhet Division
    { name: 'মদন মোহন কলেজ', location: 'সিলেট', website: 'https://www.mmc.edu.bd' },
    { name: 'মুরারিচাঁদ কলেজ', location: 'সিলেট', website: 'https://www.mccollege.edu.bd' },
    { name: 'বৃন্দাবন সরকারি কলেজ', location: 'হবিগঞ্জ', website: 'https://www.brindabancollege.gov.bd' },

    // Rangpur Division
    { name: 'কারমাইকেল কলেজ', location: 'রংপুর', website: 'https://www.carichael.gov.bd' },
    { name: 'দিনাজপুর সরকারি কলেজ', location: 'দিনাজপুর', website: 'https://www.dgc.gov.bd' },

    // Mymensingh Division
    { name: 'আনন্দ মোহন কলেজ', location: 'ময়মনসিংহ', website: 'https://www.amcollege.gov.bd' },
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
                                <TableHead className="text-right">ওয়েবসাইট</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nationalColleges.map((college, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{college.name}</TableCell>
                                    <TableCell>{college.location}</TableCell>
                                    <TableCell className="text-right">
                                        {college.website ? (
                                            <Button asChild variant="ghost" size="sm">
                                                <a href={college.website.startsWith('http') ? college.website : `https://${college.website}`} target="_blank" rel="noopener noreferrer">
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
                (দ্রষ্টব্য: এটি একটি সংক্ষিপ্ত তালিকা। ভর্তির জন্য সংশ্লিষ্ট প্রতিষ্ঠানের অফিসিয়াল ওয়েবসাইট দেখুন।)
            </p>
        </div>
    );
}
