
'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ResultsDisplay from '@/components/results-display';
import type { ExamResult } from '@/types';


type SearchHistoryItem = {
    id: string;
    timestamp?: { seconds: number };
    roll: string;
    reg: string;
    board: string;
    exam: string;
    year: string;
    result?: ExamResult;
};

export default function SearchHistoryPage() {
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
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

    const filteredHistory = history.filter(item =>
        item.roll.includes(searchQuery) || (item.reg && item.reg.includes(searchQuery))
    );

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
        if (filteredHistory.length === 0) return;

        const headers = ['Timestamp', 'Name', 'Roll', 'Registration', 'Board', 'Exam', 'Year', 'GPA'];
        const csvRows = [
            headers.join(','),
            ...filteredHistory.map(item => {
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
                <Button onClick={handleExport} disabled={filteredHistory.length === 0}>
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
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="রোল বা রেজি. নম্বর দিয়ে ফিল্টার করুন..."
                                className="pl-10 w-full"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <Dialog>
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
                                    <TableHead className="text-right">কার্যকলাপ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton columns={9} />
                                ) : filteredHistory.length > 0 ? (
                                    filteredHistory.map(item => (
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
                                            <TableCell className="text-right">
                                                {item.result && (
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setSelectedResult(item.result!)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center h-24">
                                            {history.length > 0 ? 'এই অনুসন্ধানের জন্য কোনো ফলাফল পাওয়া যায়নি।' : 'কোনো অনুসন্ধানের ইতিহাস পাওয়া যায়নি।'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                         {selectedResult && (
                            <DialogContent className="max-w-4xl h-[95vh] flex flex-col">
                                <DialogHeader className="no-print">
                                    <DialogTitle>ফলাফলের বিবরণ</DialogTitle>
                                </DialogHeader>
                                <div className="flex-grow overflow-y-auto">
                                    <ResultsDisplay result={selectedResult} isDialog={true} />
                                </div>
                            </DialogContent>
                        )}
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
