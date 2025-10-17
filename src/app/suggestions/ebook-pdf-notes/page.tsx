
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download, Book, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const bookList = [
  { subject: 'পদার্থবিজ্ঞান', title: 'HSC Physics 1st Paper Notes', author: 'Dr. Shahjahan Tapan', link: '#' },
  { subject: 'রসায়ন', title: 'HSC Chemistry 2nd Paper Guide', author: 'Sanjit Kumar Guha', link: '#' },
  { subject: 'গণিত', title: 'Calculus Made Easy', author: 'S. L. Loney (Adapted)', link: '#' },
  { subject: 'জীববিজ্ঞান', title: 'Biology Notes for HSC', author: 'Dr. Md. Abul Hasan', link: '#' },
  { subject: 'ইংরেজি', title: 'Advanced English Grammar', author: 'Chowdhury & Hossain', link: '#' },
  { subject: 'সাধারণ জ্ঞান', title: 'Current Affairs Digest - 2024', author: 'Professor\'s Publications', link: '#' },
  { subject: 'বিশ্ববিদ্যালয় ভর্তি', title: 'Admission Test Question Bank (Science)', author: 'Udvash', link: '#' },
];


export default function EbookPdfNotesPage() {
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
                     <Download className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">eBook / PDF নোটস</CardTitle>
                    <CardDescription className="text-lg">প্রয়োজনীয় বই ও নোটস ডাউনলোড করুন।</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>বিষয়</TableHead>
                                <TableHead>শিরোনাম</TableHead>
                                <TableHead>লেখক/প্রকাশক</TableHead>
                                <TableHead className="text-right">ডাউনলোড</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookList.map((book, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{book.subject}</TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <a href={book.link} download>
                                                <Download className="mr-2 h-4 w-4" />
                                                ডাউনলোড
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <p className="text-muted-foreground text-sm mt-4 text-center">
                (দ্রষ্টব্য: এটি একটি ডেমো তালিকা। ডাউনলোড লিঙ্কগুলো বর্তমানে নিষ্ক্রিয় রয়েছে।)
            </p>
        </div>
    );
}
