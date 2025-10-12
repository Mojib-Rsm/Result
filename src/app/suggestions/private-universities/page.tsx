
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const privateUniversities = [
    { name: 'North South University', location: 'ঢাকা', website: 'http://www.northsouth.edu' },
    { name: 'University of Science & Technology Chittagong', location: 'চট্টগ্রাম', website: 'http://www.ustc.edu.bd' },
    { name: 'Independent University, Bangladesh', location: 'ঢাকা', website: 'http://www.iub.edu.bd' },
    { name: 'Central Women\'s University', location: 'ঢাকা', website: 'http://www.cwu.edu.bd' },
    { name: 'International University of Business Agriculture & Technology', location: 'ঢাকা', website: 'http://www.iubat.edu' },
    { name: 'International Islamic University Chittagong', location: 'চট্টগ্রাম', website: 'http://www.iiuc.ac.bd' },
    { name: 'Ahsanullah University of Science and Technology', location: 'ঢাকা', website: 'http://www.aust.edu' },
    { name: 'American International University-Bangladesh', location: 'ঢাকা', website: 'http://www.aiub.ac.bd' },
    { name: 'East West University', location: 'ঢাকা', website: 'http://www.ewubd.edu' },
    { name: 'University of Asia Pacific', location: 'ঢাকা', website: 'http://www.uap-bd.edu' },
    { name: 'Gono Bishwabidyalay', location: 'সাভার, ঢাকা', website: 'http://www.gonouniversity.edu.bd' },
    { name: 'The People\'s University of Bangladesh', location: 'ঢাকা', website: 'http://www.pub.ac.bd' },
    { name: 'Asian University of Bangladesh', location: 'ঢাকা', website: 'http://www.aub.ac.bd' },
    { name: 'Dhaka International University', location: 'ঢাকা', website: 'http://www.diu.ac' },
    { name: 'Manarat International University', location: 'ঢাকা', website: 'http://www.manarat.ac.bd' },
    { name: 'BRAC University', location: 'ঢাকা', website: 'http://www.bracu.ac.bd' },
    { name: 'Bangladesh University', location: 'ঢাকা', website: 'http://www.bu.edu.bd' },
    { name: 'Leading University', location: 'সিলেট', website: 'http://www.lus.ac.bd' },
    { name: 'BGC Trust University Bangladesh', location: 'চট্টগ্রাম', website: 'http://www.bgctub.ac.bd' },
    { name: 'Sylhet International University', location: 'সিলেট', website: 'http://www.siu.edu.bd' },
    { name: 'University of Development Alternative', location: 'ঢাকা', website: 'http://www.uoda.edu.bd' },
    { name: 'Premier University', location: 'চট্টগ্রাম', website: 'http://www.puc.ac.bd' },
    { name: 'Southeast University', location: 'ঢাকা', website: 'http://www.seu.edu.bd' },
    { name: 'Daffodil International University', location: 'ঢাকা', website: 'http://www.daffodilvarsity.edu.bd' },
    { name: 'Stamford University Bangladesh', location: 'ঢাকা', website: 'http://www.stamforduniversity.edu.bd' },
    { name: 'State University of Bangladesh (SUB)', location: 'ঢাকা', website: 'https://www.sub.ac.bd' },
    { name: 'City University', location: 'ঢাকা', website: 'http://www.cityuniversity.ac.bd' },
    { name: 'Prime University', location: 'ঢাকা', website: 'http://www.primeuniversity.edu.bd' },
    { name: 'Northern University Bangladesh', location: 'ঢাকা', website: 'http://www.nub.ac.bd' },
    { name: 'Southern University Bangladesh', location: 'চট্টগ্রাম', website: 'http://www.southern.edu.bd' },
    { name: 'Green University of Bangladesh', location: 'ঢাকা', website: 'http://www.green.edu.bd' },
    { name: 'Pundra University of Science & Technology', location: 'বগুড়া', website: 'http://www.pundrauniversity.ac.bd' },
    { name: 'World University of Bangladesh', location: 'ঢাকা', website: 'http://www.wub.edu.bd' },
    { name: 'Shanto-Mariam University of Creative Technology', location: 'ঢাকা', website: 'http://www.smuct.edu.bd' },
    { name: 'The Millennium University', location: 'ঢাকা', website: 'http://www.themillenniumuniversity.edu.bd' },
    { name: 'Eastern University', location: 'ঢাকা', website: 'http://www.easternuni.edu.bd' },
    { name: 'Metropolitan University', location: 'সিলেট', website: 'http://www.metrouni.edu.bd' },
    { name: 'Uttara University', location: 'ঢাকা', website: 'http://www.uttarauniversity.edu.bd' },
    { name: 'United International University', location: 'ঢাকা', website: 'http://www.uiu.ac.bd' },
    { name: 'University of South Asia', location: 'ঢাকা', website: 'http://www.southasiauni.ac.bd' },
    { name: 'Victoria University of Bangladesh', location: 'ঢাকা', website: 'http://www.vub.edu.bd' },
    { name: 'Bangladesh University of Business & Technology', location: 'ঢাকা', website: 'http://www.bubt.ac.bd' },
    { name: 'Presidency University', location: 'ঢাকা', website: 'http://www.presidency.edu.bd' },
    { name: 'University of Information Technology & Sciences', location: 'ঢাকা', website: 'http://www.uits.edu.bd' },
    { name: 'Primeasia University', location: 'ঢাকা', website: 'http://www.primeasia.edu.bd' },
    { name: 'Royal University of Dhaka', location: 'ঢাকা', website: 'http://www.royal.edu.bd' },
    { name: 'University of Liberal Arts Bangladesh', location: 'ঢাকা', website: 'http://www.ulab.edu.bd' },
    { name: 'Atish Dipankar University of Science & Technology', location: 'ঢাকা', website: 'http://www.adust.edu.bd' },
    { name: 'Bangladesh Islami University', location: 'ঢাকা', website: 'http://www.biu.ac.bd' },
    { name: 'ASA University Bangladesh', location: 'ঢাকা', website: 'http://www.asaub.edu.bd' },
    { name: 'East Delta University', location: 'চট্টগ্রাম', website: 'http://www.eastdelta.edu.bd' },
    { name: 'European University of Bangladesh', location: 'ঢাকা', website: 'http://www.eub.edu.bd' },
    { name: 'Varendra University', location: 'রাজশাহী', website: 'http://www.vu.edu.bd' },
    { name: 'Hamdard University Bangladesh', location: 'মুন্সিগঞ্জ', website: 'http://www.hamdarduniversity.edu.bd' },
    { name: 'BGMEA University of Fashion & Technology(BUFT)', location: 'ঢাকা', website: 'http://www.buft.edu.bd' },
    { name: 'North East University Bangladesh', location: 'সিলেট', website: 'http://www.neub.edu.bd' },
    { name: 'First Capital University of Bangladesh', location: 'চুয়াডাঙ্গা', website: 'http://www.fcub.edu.bd' },
    { name: 'Ishakha International University, Bangladesh', location: 'কিশোরগঞ্জ', website: 'http://www.ishakha.edu.bd' },
    { name: 'Z.H Sikder University of Science & Technology', location: 'শরীয়তপুর', website: 'http://www.zhsust.edu.bd' },
    { name: 'Exim Bank Agricultural University, Bangladesh', location: 'চাঁপাইনবাবগঞ্জ', website: 'http://www.ebaub.edu.bd' },
    { name: 'North Western University', location: 'খুলনা', website: 'http://www.nwu.ac.bd' },
    { name: 'Khwaja Yunus Ali University', location: 'সিরাজগঞ্জ', website: 'http://www.kyau.edu.bd' },
    { name: 'Sonargaon University', location: 'ঢাকা', website: 'http://www.su.edu.bd' },
    { name: 'Feni University', location: 'ফেনী', website: 'http://www.feniuniversity.ac.bd' },
    { name: 'Britannia University', location: 'কুমিল্লা', website: 'http://www.britannia.edu.bd' },
    { name: 'Port City International University', location: 'চট্টগ্রাম', website: 'http://www.portcity.edu.bd' },
    { name: 'Bangladesh University of Health Sciences', location: 'ঢাকা', website: 'http://www.buhs.ac.bd' },
    { name: 'Chittagong Independent University', location: 'চট্টগ্রাম', website: 'http://www.ciu.edu.bd' },
    { name: 'Notre Dame University Bangladesh', location: 'ঢাকা', website: 'http://www.ndub.edu.bd' },
    { name: 'Times University, Bangladesh', location: 'ফরিদপুর', website: 'http://www.timesuniversitybd.com' },
    { name: 'North Bengal International University', location: 'রাজশাহী', website: 'http://www.nbiu.edu.bd' },
    { name: 'Fareast International University', location: 'ঢাকা', website: 'http://www.fiu.edu.bd' },
    { name: 'Rajshahi Science & Technology University (RSTU), Natore', location: 'নাটোর', website: 'http://www.rstu.edu.bd' },
    { name: 'Brahmaputra International University', location: 'ঢাকা', website: 'http://www.sfmu.ac.bd' },
    { name: 'Cox\'s Bazar International University', location: 'কক্সবাজার', website: 'http://www.cbiu.ac.bd' },
    { name: 'R. P. Shaha University', location: 'টাঙ্গাইল', website: 'http://www.rpsu.ac.bd' },
    { name: 'German University Bangladesh', location: 'গাজীপুর', website: 'http://www.gub.edu.bd' },
    { name: 'Global University Bangladesh', location: 'বরিশাল', website: 'http://www.globaluniversity.edu.bd' },
    { name: 'CCN University of Science & Technology', location: 'কুমিল্লা', website: 'http://www.ccnust.edu.bd' },
    { name: 'Bangladesh Army University of Science and Technology(BAUST), Saidpur', location: 'সৈয়দপুর', website: 'http://www.baust.edu.bd' },
    { name: 'Bangladesh Army University of Engineering and Technology (BAUET), Qadirabad', location: 'নাটোর', website: 'http://www.bauet.ac.bd' },
    { name: 'Bangladesh Army International University of Science & Technology(BAIUST) ,Comilla', location: 'কুমিল্লা', website: 'http://www.baiust.ac.bd' },
    { name: 'University of Scholars', location: 'ঢাকা', website: 'http://www.ius.edu.bd' },
    { name: 'Canadian University of Bangladesh', location: 'ঢাকা', website: 'http://www.cub.edu.bd' },
    { name: 'N.P.I University of Bangladesh', location: 'মানিকগঞ্জ', website: 'http://www.npiub.edu.bd' },
    { name: 'Northern University of Business & Technology, Khulna', location: 'খুলনা', website: 'http://www.nubtkhulna.ac.bd' },
    { name: 'Rabindra Maitree University, Kushtia', location: 'কুষ্টিয়া', website: '' },
    { name: 'University of Creative Technology, Chittagong', location: 'চট্টগ্রাম', website: 'http://www.uctc.edu.bd' },
    { name: 'Central University of Science and Technology', location: 'ঢাকা', website: 'http://www.cust.edu.bd' },
    { name: 'Tagore University of Creative Arts, Uttara, Dhaka, Bangladesh', location: 'ঢাকা', website: 'http://www.tuca.edu.bd' },
    { name: 'University of Global Village', location: 'বরিশাল', website: 'http://www.ugv.edu.bd' },
    { name: 'Anwer Khan Modern University', location: 'ঢাকা', website: 'http://www.akmu.edu.bd' },
    { name: 'ZNRF University of Management Sciences', location: 'ঢাকা', website: 'http://www.zums.edu.bd' },
    { name: 'Ahsania Mission University of Science and Technology', location: 'রাজশাহী', website: 'http://www.amust.ac.bd' },
    { name: 'Khulna Khan Bahadur Ahsanullah University', location: 'খুলনা', website: 'http://www.kkbau.ac.bd' },
    { name: 'Bandarban University', location: 'বান্দরবান', website: 'http://www.bubban.edu.bd' },
    { name: 'Trust University, Barishal', location: 'বরিশাল', website: 'http://www.trustuniversity.ac.bd' },
    { name: 'International Standard University', location: 'ঢাকা', website: 'http://www.isu.ac.bd' },
    { name: 'University of Brahmanbaria', location: 'ব্রাহ্মণবাড়িয়া', website: 'http://www.uob.edu.bd' },
    { name: 'University of Skill Enrichment and Technology', location: 'ঢাকা', website: 'http://www.uset.ac.bd' },
    { name: 'R.T.M Al-Kabir Technical University', location: 'সিলেট', website: 'http://www.rtm-aktu.edu.bd' },
    { name: 'Dr. Momtaz Begum University of Science and Technology (MUST)', location: 'মানিকগঞ্জ', website: 'http://www.must.ac.bd' },
    { name: 'Chattogram BGMEA University of Fashion and Technology', location: 'চট্টগ্রাম', website: 'http://www.cbuft.edu.bd' },
    { name: 'Bangladesh Army University of Science and Technology, Khulna', location: 'খুলনা', website: 'http://www.baustkhulna.ac.bd' },
    { name: 'Teesta University, Rangpur', location: 'রংপুর', website: 'http://www.teestauniversity.ac.bd' },
    { name: 'International Islami University of Science and Technology', location: 'ঢাকা', website: 'http://www.iiustb.ac.bd' },
    { name: 'Lalon University of Science and Arts', location: 'কুষ্টিয়া', website: 'https://lusa.ac.bd' },
];

export default function PrivateUniversitiesPage() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">প্রাইভেট বিশ্ববিদ্যালয় তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    বাংলাদেশের ইউজিসি অনুমোদিত প্রাইভেট বিশ্ববিদ্যালয়গুলোর তালিকা।
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
                                <TableHead className="w-[100px]">ক্রমিক</TableHead>
                                <TableHead>বিশ্ববিদ্যালয়ের নাম</TableHead>
                                <TableHead>অবস্থান</TableHead>
                                <TableHead className="text-right">ওয়েবসাইট</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {privateUniversities.map((uni, index) => (
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

    