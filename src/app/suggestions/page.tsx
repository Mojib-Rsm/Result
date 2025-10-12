
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, GraduationCap, HeartPulse, TestTube, School } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const institutionTypes = [
    {
        id: 'public-universities',
        title: 'পাবলিক বিশ্ববিদ্যালয়',
        description: 'দেশের শীর্ষস্থানীয় পাবলিক বিশ্ববিদ্যালয়গুলোর সম্পর্কে জানুন।',
        icon: GraduationCap,
    },
    {
        id: 'private-universities',
        title: 'প্রাইভেট বিশ্ববিদ্যালয়',
        description: 'আপনার পছন্দের বিষয়ে পড়ার জন্য সেরা প্রাইভেট বিশ্ববিদ্যালয়গুলো দেখুন।',
        icon: Building,
    },
    {
        id: 'medical-colleges',
        title: 'মেডিকেল কলেজ',
        description: 'ডাক্তারি পড়ার জন্য সরকারি ও বেসরকারি মেডিকেল কলেজের তালিকা।',
        icon: HeartPulse,
    },
    {
        id: 'engineering-colleges',
        title: 'ইঞ্জিনিয়ারিং কলেজ',
        description: 'প্রকৌশলী হওয়ার স্বপ্ন পূরণে সেরা ইঞ্জিনিয়ারিং কলেজগুলো সম্পর্কে জানুন।',
        icon: TestTube,
    }
];

const publicUniversities = [
  { name: 'ঢাকা বিশ্ববিদ্যালয়', location: 'ঢাকা' },
  { name: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)', location: 'ঢাকা' },
  { name: 'রাজশাহী বিশ্ববিদ্যালয়', location: 'রাজশাহী' },
  { name: 'চট্টগ্রাম বিশ্ববিদ্যালয়', location: 'চট্টগ্রাম' },
  { name: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', location: 'সাভার, ঢাকা' },
  { name: 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', location: 'সিলেট' },
  { name: 'খুলনা বিশ্ববিদ্যালয়', location: 'খুলনা' },
  { name: 'ইসলামী বিশ্ববিদ্যালয়, বাংলাদেশ', location: 'কুষ্টিয়া' },
  { name: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয়', location: 'ময়মনসিংহ' },
];

const privateUniversities = [
  { name: 'নর্থ সাউথ বিশ্ববিদ্যালয়', location: 'ঢাকা' },
  { name: 'ব্র্যাক বিশ্ববিদ্যালয়', location: 'ঢাকা' },
  { name: 'আমেরিকান ইন্টারন্যাশনাল ইউনিভার্সিটি-বাংলাদেশ (এআইইউবি)', location: 'ঢাকা' },
  { name: 'ইস্ট ওয়েস্ট বিশ্ববিদ্যালয়', location: 'ঢাকা' },
  { name: 'ইনডিপেনডেন্ট ইউনিভার্সিটি, বাংলাদেশ (আইইউবি)', location: 'ঢাকা' },
  { name: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি', location: 'ঢাকা' },
];

const medicalColleges = [
  { name: 'ঢাকা মেডিকেল কলেজ', location: 'ঢাকা' },
  { name: 'স্যার সলিমুল্লাহ মেডিকেল কলেজ', location: 'ঢাকা' },
  { name: 'শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ', location: 'ঢাকা' },
  { name: 'চট্টগ্রাম মেডিকেল কলেজ', location: 'চট্টগ্রাম' },
  { name: 'রাজশাহী মেডিকেল কলেজ', location: 'রাজশাহী' },
  { name: 'বাংলাদেশ মেডিকেল কলেজ', location: 'ঢাকা (বেসরকারি)' },
];

const engineeringColleges = [
  { name: 'চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট)', location: 'চট্টগ্রাম' },
  { name: 'রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (রুয়েট)', location: 'রাজশাহী' },
  { name: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (কুয়েট)', location: 'খুলনা' },
  { name: 'ঢাকা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (ডুয়েট)', location: 'গাজীপুর' },
  { name: ' মিলিটারি ইনস্টিটিউট অফ সায়েন্স অ্যান্ড টেকনোলজি (এমআইএসটি)', location: 'ঢাকা' },
];

const InstitutionTable = ({ title, institutions }: { title: string, institutions: { name: string, location: string }[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
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
                    {institutions.map((inst, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{inst.name}</TableCell>
                            <TableCell>{inst.location}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             <p className="text-xs text-muted-foreground mt-4">
                (দ্রষ্টব্য: এটি একটি সংক্ষিপ্ত তালিকা। আরও তথ্যের জন্য সংশ্লিষ্ট প্রতিষ্ঠানের ওয়েবসাইট ভিজিট করুন।)
            </p>
        </CardContent>
    </Card>
);

export default function SuggestionsPage() {
    const searchParams = useSearchParams();
    const gpa = searchParams.get('gpa');

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">ভর্তি পরামর্শ</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    আপনার GPA অনুযায়ী সেরা কলেজ ও বিশ্ববিদ্যালয় খুঁজে নিন।
                </p>
                {gpa && (
                    <p className="mt-4 text-xl font-semibold text-primary">
                        আপনার প্রাপ্ত GPA: {gpa}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {institutionTypes.map((institution) => (
                    <Card key={institution.id} className="flex flex-col hover:border-primary transition-all">
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <institution.icon className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{institution.title}</CardTitle>
                                <CardDescription>{institution.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                            <Link href={`#${institution.id}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                    তালিকা দেখুন
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-12">
                <div id="public-universities">
                    <InstitutionTable title="সেরা পাবলিক বিশ্ববিদ্যালয়" institutions={publicUniversities} />
                </div>
                <div id="private-universities">
                     <InstitutionTable title="সেরা প্রাইভেট বিশ্ববিদ্যালয়" institutions={privateUniversities} />
                </div>
                 <div id="medical-colleges">
                     <InstitutionTable title="সেরা মেডিকেল কলেজ" institutions={medicalColleges} />
                </div>
                <div id="engineering-colleges">
                     <InstitutionTable title="সেরা ইঞ্জিনিয়ারিং কলেজ ও বিশ্ববিদ্যালয়" institutions={engineeringColleges} />
                </div>
            </div>

            <div className="mt-12 text-center">
                 <p className="text-muted-foreground">
                    (দ্রষ্টব্য: এটি একটি পরীক্ষামূলক ফিচার। প্রদত্ত তথ্য রেফারেন্স হিসেবে ব্যবহার করুন। ভর্তির জন্য সংশ্লিষ্ট প্রতিষ্ঠানের অফিসিয়াল ওয়েবসাইট দেখুন।)
                </p>
            </div>
        </div>
    );
}
