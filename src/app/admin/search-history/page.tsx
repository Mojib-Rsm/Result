
'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

type SearchHistoryItem = {
    id: string;
    timestamp?: { seconds: number };
    roll: string;
    reg: string;
    board: string;
    exam: string;
    year: string;
    result?: {
        studentInfo?: {
            name?: string;
        };
        gpa?: number;
    };
};

export default function SearchHistoryPage() {
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyRef = collection(db, 'search-history');
                const q = query(historyRef, orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                setHistory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SearchHistoryItem)));
            } catch (error) {
                console.error("Error fetching search history: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [db]);

    const TableSkeleton = ({ columns }: { columns: number }) => (
        [...Array(10)].map((_, i) => (
            <TableRow key={i}>
                {[...Array(columns)].map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
            </TableRow>
        ))
    );
    
    const handleExport = () => {
        if (history.length === 0) return;

        const headers = ['Timestamp', 'Name', 'Roll', 'Registration', 'Board', 'Exam', 'Year', 'GPA'];
        const csvRows = [
            headers.join(','),
            ...history.map(item => {
                const row = [
                    item.timestamp && typeof item.timestamp.seconds === 'number' ? format(new Date(item.timestamp.seconds * 1000), 'yyyy-MM-dd HH:mm:ss') : 'N/A',
                    `"${item.result?.studentInfo?.name || 'N/A'}"`,
                    item.roll,
                    item.reg,
                    item.board,
                    item.exam.toUpperCase(),
                    item.year,
                    item.result?.gpa?.toFixed(2) || 'N/A'
                ];
                return row.join(',');
            })
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `search-history-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">অনুসন্ধানের ইতিহাস</h1>
                    <p className="mt-2 text-md text-muted-foreground">
                        ব্যবহারকারীদের দ্বারা করা সমস্ত ফলাফল অনুসন্ধানের লগ।
                    </p>
                </div>
                <Button onClick={handleExport} disabled={history.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV এক্সপোর্ট
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>অনুসন্ধানের তালিকা</CardTitle>
                    <CardDescription>এখানে সর্বশেষ থেকে শুরু করে সকল অনুসন্ধানের তালিকা রয়েছে।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>সময়</TableHead>
                                <TableHead>নাম</TableHead>
                                <TableHead>রোল</TableHead>
                                <TableHead>রেজি. নম্বর</TableHead>
                                <TableHead>বোর্ড</TableHead>
                                <TableHead>পরীক্ষা</TableHead>
                                <TableHead>বছর</TableHead>
                                <TableHead>GPA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeleton columns={8} />
                            ) : history.length > 0 ? (
                                history.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-xs">
                                          {item.timestamp && typeof item.timestamp.seconds === 'number'
                                              ? format(new Date(item.timestamp.seconds * 1000), 'dd/MM/yy hh:mm a')
                                              : 'N/A'}
                                        </TableCell>
                                        <TableCell>{item.result?.studentInfo?.name || 'N/A'}</TableCell>
                                        <TableCell>{item.roll}</TableCell>
                                        <TableCell>{item.reg}</TableCell>
                                        <TableCell className="capitalize">{item.board}</TableCell>
                                        <TableCell className="uppercase">{item.exam}</TableCell>
                                        <TableCell>{item.year}</TableCell>
                                        <TableCell>{item.result?.gpa?.toFixed(2) || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24">
                                        কোনো অনুসন্ধানের ইতিহাস পাওয়া যায়নি।
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
