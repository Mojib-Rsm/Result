
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Award, Globe, Building } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const scholarshipList = [
    { name: 'Fulbright Scholarship', country: 'USA', level: 'স্নাতকোত্তর', deadline: 'October 15, 2025' },
    { name: 'Chevening Scholarship', country: 'UK', level: 'স্নাতকোত্তর', deadline: 'November 5, 2025' },
    { name: 'DAAD Scholarship', country: 'Germany', level: 'স্নাতকোত্তর/PhD', deadline: 'Varies' },
    { name: 'Prime Minister Fellowship', country: 'Bangladesh', level: 'স্নাতকোত্তর/PhD', deadline: 'March 31, 2026' },
];

export default function ScholarshipsPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        হোমে ফিরে যান
                    </Link>
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="text-center p-6 bg-muted/30">
                     <Award className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">স্কলারশিপ ও ইন্টার্নশিপ</CardTitle>
                    <CardDescription className="text-lg">দেশ-বিদেশের বিভিন্ন স্কলারশিপ ও ইন্টার্নশিপের সুযোগ।</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>স্কলারশিপের নাম</TableHead>
                                <TableHead>দেশ</TableHead>
                                <TableHead>স্তর</TableHead>
                                <TableHead>আবেদনের শেষ তারিখ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scholarshipList.map((scholarship, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{scholarship.name}</TableCell>
                                    <TableCell>{scholarship.country}</TableCell>
                                    <TableCell>{scholarship.level}</TableCell>
                                    <TableCell>{scholarship.deadline}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
