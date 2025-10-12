
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const polytechnicInstitutes = [
    { name: 'B.Baria Polytechnic Institute', departments: [ { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Computer Technolgy', seats: 100 }, { name: 'Architecture and Interior Design Technology', seats: 50 }, { name: 'Electro-Medical Technology', seats: 50 } ] },
    { name: 'Barguna Polytechnic Institute', departments: [ { name: 'Computer Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Environmental Technology', seats: 50 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Civil Technology', seats: 50 } ] },
    { name: 'Barisal Polytechnic Institute', departments: [ { name: 'Electro-Medical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Computer Technolgy', seats: 100 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Power Technology', seats: 100 }, { name: 'Civil Technology', seats: 150 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Tourism and Hospitality', seats: 50 } ] },
    { name: 'BD institute of Glass and Ciramics', departments: [ { name: 'Ceramic Technology', seats: 150 }, { name: 'Glass Technology', seats: 50 } ] },
    { name: 'BD Survey Institute', departments: [ { name: 'Surveying Technology', seats: 100 } ] },
    { name: 'BD Sweeden Polytechnic Institute', departments: [ { name: 'Civil (Wood) Technology', seats: 50 }, { name: 'Electrical Technology', seats: 50 }, { name: 'Mechanical Technology', seats: 50 }, { name: 'Computer Technology', seats: 50 }, { name: 'Automobile Technology', seats: 50 }, { name: 'Construction Technology', seats: 50 } ] },
    { name: 'Bhola Polytechnic Institute', departments: [ { name: 'Computer Technolgy', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 } ] },
    { name: 'Bogra Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 50 }, { name: 'Mining and Mine Survey Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Computer Technolgy', seats: 50 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Tourism and Hospitality', seats: 50 } ] },
    { name: 'Chandpur Polytechnic Institute', departments: [ { name: 'Computer Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Construction Technology', seats: 100 }, { name: 'Civil Technology', seats: 50 } ] },
    { name: 'Chapainababgong Polytechnic Institute', departments: [ { name: 'Food Technology', seats: 100 }, { name: 'Mecatronics', seats: 100 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 100 }, { name: 'Computer Technolgy', seats: 100 } ] },
    { name: 'Chittagong Mohila Polytechnic Institute', departments: [ { name: 'Electronics Technology', seats: 50 }, { name: 'Computer Technolgy', seats: 50 }, { name: 'Garment Design and Pattern Making', seats: 50 }, { name: 'Architecture and Interior Design Technology', seats: 50 } ] },
    { name: 'Chittagong Polytechnic Institute', departments: [ { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 100 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 }, { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Environmental Technology', seats: 50 } ] },
    { name: 'Comilla Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'ComputerTechnology', seats: 100 } ] },
    { name: "Cox's Bazar Polytechnic Institute", departments: [ { name: 'Computer Technology', seats: 50 }, { name: 'Civil Technology', seats: 50 }, { name: 'Food Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Tourism and Hospitality', seats: 50 } ] },
    { name: 'Dhaka Mahila Polytechnic Institute', departments: [ { name: 'Computer Technology', seats: 50 }, { name: 'Electro-Medical Technology', seats: 50 }, { name: 'Instrumentation and process Technology', seats: 50 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Architecture Technology', seats: 100 }, { name: 'Tourism and Hospitality', seats: 50 } ] },
    { name: 'Dhaka Polytechnic Institute', departments: [ { name: 'Electronics Technology', seats: 100 }, { name: 'Architecture Technology', seats: 100 }, { name: 'Chemical Technology', seats: 100 }, { name: 'Environmental Technology', seats: 50 }, { name: 'Food Technology', seats: 100 }, { name: 'Civil Technology', seats: 200 }, { name: 'Electrical Technology', seats: 150 }, { name: 'Mechanical Technology', seats: 150 }, { name: 'Automobile Technology', seats: 100 }, { name: 'Refrigeration and Air-conditioning Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 } ] },
    { name: 'Dinajpur Polytechnic Institute', departments: [ { name: 'ComputerTechnology', seats: 100 }, { name: 'Architecture and Interior Design Technology', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 100 } ] },
    { name: 'Faridpur Polytechnic Institute', departments: [ { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 }, { name: 'Refrigeration and Air-conditioning Technology', seats: 100 }, { name: 'Civil Technology', seats: 100 } ] },
    { name: 'Feni Computer Institute', departments: [ { name: 'Data Communication and Networking', seats: 50 }, { name: 'Computer Science and Technolgy', seats: 50 }, { name: 'Telecommunication Technology', seats: 50 } ] },
    { name: 'Feni Polytechnic Institute', departments: [ { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 50 }, { name: 'Computer Technology', seats: 100 }, { name: 'Architecture and Interior Design Technology', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 } ] },
    { name: 'Gopalgonj Polytechnic Institute', departments: [ { name: 'Electrical Technology', seats: 100 }, { name: 'Computer Technolgy', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Food Technology', seats: 50 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 } ] },
    { name: 'Graphic Arts Institute', departments: [ { name: 'GraphicDesign Technology', seats: 100 }, { name: 'Printing Technology', seats: 50 }, { name: 'Computer Technology', seats: 50 } ] },
    { name: 'Habigonj Polytechnic Institute', departments: [ { name: 'Computer Technology', seats: 100 }, { name: 'Civil Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Architecture and Interior Design Technology', seats: 50 } ] },
    { name: 'Jessore Polytechnic Institute', departments: [ { name: 'Telecommunication Technology', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 100 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Computer Technology', seats: 100 } ] },
    { name: 'Jhenidah Polytechnic Institute', departments: [ { name: 'Computer Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Civil Technology', seats: 50 }, { name: 'Environmental Technology', seats: 50 }, { name: 'Electrical Technology', seats: 50 } ] },
    { name: 'Khulna Mohila Polytechnic Institute', departments: [ { name: 'Computer Technolgy', seats: 100 }, { name: 'Architecture and Interior Design Technology', seats: 100 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Environmental Technology', seats: 50 }, { name: 'Civil Technology', seats: 50 } ] },
    { name: 'Khulna Polytechnic Institute', departments: [ { name: 'Electrical Technology', seats: 100 }, { name: 'Computer Technology', seats: 50 }, { name: 'Power Technology', seats: 50 }, { name: 'Environmental Technology', seats: 50 }, { name: 'Instrumentation and process Technology', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Electronics Technology', seats: 50 } ] },
    { name: 'Kishoregong Polytechnic Institute', departments: [ { name: 'Electronics Technology', seats: 100 }, { name: 'Food Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 } ] },
    { name: 'Kurigram Polytechnic Institute', departments: [ { name: 'Electronics Technology', seats: 50 }, { name: 'Construction Technology', seats: 50 }, { name: 'Architecture and Interior Design Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 }, { name: 'Electrical Technology', seats: 50 }, { name: 'Civil Technology', seats: 50 }, { name: 'Mechanical Technology', seats: 50 } ] },
    { name: 'Kushtia Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Mechanical Technology', seats: 50 }, { name: 'Power Technology', seats: 50 }, { name: 'Computer Technology', seats: 50 } ] },
    { name: 'Laxmipur Polytechnic Institute', departments: [ { name: 'Architecture and Interior Design Technology', seats: 50 }, { name: 'Computer Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 50 } ] },
    { name: 'Magura Polytechnic Institute', departments: [ { name: 'Food Technology', seats: 100 }, { name: 'Mecatronics', seats: 100 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 100 } ] },
    { name: 'Moulvibazar Polytechnic Institute', departments: [ { name: 'Computer Technology', seats: 100 }, { name: 'Refrigeration and Air-Conditioning Technology', seats: 100 }, { name: 'Food Technology', seats: 100 }, { name: 'Electronics Technology', seats: 100 } ] },
    { name: 'Munshigonj Polytechnic Institute', departments: [ { name: 'Electro-medical Technology', seats: 50 }, { name: 'Instrumentation and process Technology', seats: 50 }, { name: 'Computer Technology', seats: 100 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Civil Technology', seats: 50 }, { name: 'Electrical Technology', seats: 50 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Mechanical Technology', seats: 50 } ] },
    { name: 'Mymensingh Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 150 }, { name: 'Electrical Technology', seats: 150 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 100 }, { name: 'Electro-Medical Technology', seats: 100 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 } ] },
    { name: 'Naogaon Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 50 }, { name: 'Computer Technology', seats: 50 }, { name: 'Food Technology', seats: 50 }, { name: 'Architecture and Interior Design Technology', seats: 50 }, { name: 'Environmental Technology', seats: 50 } ] },
    { name: 'Narshingdi Polytechnic Institute', departments: [ { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Computer Technolgy', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Food Technology', seats: 50 }, { name: 'Electrical Technology', seats: 50 } ] },
    { name: 'Pabna Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 150 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 }, { name: 'Construction Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 100 }, { name: 'Environmental Technology', seats: 100 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 } ] },
    { name: 'Patuakhali Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Computer Technolgy', seats: 50 } ] },
    { name: 'Rajshahi Mohila Polytechnic Institute', departments: [ { name: 'Computer Technolgy', seats: 50 }, { name: 'Electro-Medical Technology', seats: 50 }, { name: 'Architecture and Interior Design Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Food Technology', seats: 50 } ] },
    { name: 'Rajshahi Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Electro-Medical Technology', seats: 50 }, { name: 'Computer Technolgy', seats: 50 }, { name: 'Mechatronics', seats: 50 } ] },
    { name: 'Rangpur Polytechnic Institute', departments: [ { name: 'Power Technology', seats: 100 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Electro-Medical Technology', seats: 50 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 }, { name: 'Civil Technology', seats: 100 } ] },
    { name: 'Sariatpur Polytechnic Institute', departments: [ { name: 'Computer Technolgy', seats: 100 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Telecommunication Technology', seats: 50 }, { name: 'Instrumentation and process Technology', seats: 50 } ] },
    { name: 'Satkhira Polytechnic Institute', departments: [ { name: 'Computer Technolgy', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Environmental Technology', seats: 50 }, { name: 'Tourism and Hospitality Management', seats: 50 }, { name: 'Civil Technology', seats: 50 } ] },
    { name: 'Sherpur Polytechnic Institute', departments: [ { name: 'Computer Technolgy', seats: 50 }, { name: 'Civil Technology', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Environmental Technology', seats: 50 }, { name: 'Electrical Technology', seats: 50 } ] },
    { name: 'Sirajgonj Polytechnic Institute', departments: [ { name: 'Computer Technolgy', seats: 50 }, { name: 'Electronics Technology', seats: 50 }, { name: 'Civil Technology', seats: 100 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Electrical Technology', seats: 50 } ] },
    { name: 'Sylhet Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 150 }, { name: 'Electrical Technology', seats: 100 }, { name: 'Mechanical Technology', seats: 100 }, { name: 'Power Technology', seats: 50 }, { name: 'Computer Technology', seats: 100 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Electro-Medical Technology', seats: 50 } ] },
    { name: 'Tangail Polytechnic Institute', departments: [ { name: 'Electrical Technology', seats: 100 }, { name: 'Construction Technology', seats: 50 }, { name: 'Electronics Technology', seats: 100 }, { name: 'Computer Technology', seats: 100 }, { name: 'Telecommunication Technology', seats: 100 } ] },
    { name: 'Thakurgaon Polytechnic Institute', departments: [ { name: 'Architecture and Interior Design Technology', seats: 50 }, { name: 'Refrigeration and Air Conditioning Technology', seats: 50 }, { name: 'Computer Technology', seats: 100 }, { name: 'Food Technology', seats: 100 }, { name: 'Mechatronics', seats: 50 } ] },
];


export default function PolytechnicInstitutesPage() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/suggestions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">পলিটেকনিক ইনস্টিটিউট তালিকা</h1>
                <p className="mt-2 text-md text-muted-foreground">
                    কারিগরি ও বৃত্তিমূলক শিক্ষার জন্য সেরা পলিটেকনিক ইনস্টিটিউট, বিভাগ এবং আসন সংখ্যা।
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>পলিটেকনিক ইনস্টিটিউট</CardTitle>
                    <CardDescription>ডিপ্লোমা-ইন-ইঞ্জিনিয়ারিং ডিগ্রির জন্য প্রতিষ্ঠান, বিভাগ ও আসন সংখ্যা দেখুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>প্রতিষ্ঠানের নাম</TableHead>
                                <TableHead>বিভাগ</TableHead>
                                <TableHead className="text-right">আসন সংখ্যা</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {polytechnicInstitutes.flatMap((inst, instIndex) =>
                                inst.departments.map((dept, deptIndex) => (
                                    <TableRow key={`${instIndex}-${deptIndex}`}>
                                        {deptIndex === 0 && (
                                            <TableCell className="font-medium" rowSpan={inst.departments.length}>
                                                {inst.name}
                                            </TableCell>
                                        )}
                                        <TableCell>{dept.name}</TableCell>
                                        <TableCell className="text-right">{dept.seats}</TableCell>
                                    </TableRow>
                                ))
                            )}
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
