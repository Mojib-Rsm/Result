
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, BarChart, Shield } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const adminFeatures = [
    {
        title: 'ব্যবহারকারী ব্যবস্থাপনা',
        description: 'অ্যাপ্লিকেশনের সমস্ত ব্যবহারকারীদের দেখুন এবং পরিচালনা করুন।',
        icon: Users,
    },
    {
        title: 'ফলাফল ডেটা',
        description: 'সংরক্ষিত ফলাফল ডেটা দেখুন এবং বিশ্লেষণ করুন।',
        icon: FileText,
    },
    {
        title: 'সাইট পরিসংখ্যান',
        description: 'ভিজিটর, অনুসন্ধান এবং অন্যান্য পরিসংখ্যান ট্র্যাক করুন।',
        icon: BarChart,
    },
    {
        title: 'সেটিংস',
        description: 'অ্যাপ্লিকেশনের বিভিন্ন সেটিংস কনফিগার করুন।',
        icon: Shield,
    }
];

// Demo data - replace with Firestore data
const demoUsers = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'Mojib Rsm', email: 'mojibrsm@gmail.com', role: 'editor' },
];

const demoResults = [
    { roll: '123456', exam: 'HSC', year: '2023', gpa: '5.00' },
    { roll: '654321', exam: 'SSC', year: '2023', gpa: '4.89' },
    { roll: '101010', exam: 'JSC', year: '2023', gpa: 'Pass' },
];


export default function AdminPage() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">অ্যাডমিন ড্যাশবোর্ড</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    অ্যাপ্লিকেশন পরিচালনা ও নিরীক্ষণের জন্য আপনার কন্ট্রোল প্যানেল।
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminFeatures.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <feature.icon className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle>সাম্প্রতিক ব্যবহারকারীগণ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>নাম</TableHead>
                                    <TableHead>ইমেইল</TableHead>
                                    <TableHead>ভূমিকা</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {demoUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>সাম্প্রতিক ফলাফল অনুসন্ধান</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>রোল</TableHead>
                                    <TableHead>পরীক্ষা</TableHead>
                                    <TableHead>বছর</TableHead>
                                    <TableHead>GPA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {demoResults.map(result => (
                                    <TableRow key={result.roll}>
                                        <TableCell>{result.roll}</TableCell>
                                        <TableCell>{result.exam}</TableCell>
                                        <TableCell>{result.year}</TableCell>
                                        <TableCell>{result.gpa}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
             <div className="mt-12 text-center">
                 <p className="text-muted-foreground">
                    (দ্রষ্টব্য: এটি অ্যাডমিন প্যানেলের একটি ডেমো। ফায়ারস্টোর থেকে ডেটা লোড করা হবে।)
                </p>
            </div>
        </div>
    );
}
