
'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface LogItem {
    id: string;
    timestamp: { seconds: number, nanoseconds: number };
    apiProvider: string;
    phoneNumber: string;
    status: 'success' | 'error';
    response: string;
}

export default function ApiLogsPage() {
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logsRef = collection(db, 'sms-logs');
                const q = query(logsRef, orderBy('timestamp', 'desc'), limit(100)); // Fetch last 100 logs
                const querySnapshot = await getDocs(q);
                setLogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogItem)));
            } catch (error) {
                console.error("Error fetching API logs: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [db]);

    const TableSkeleton = () => (
        [...Array(10)].map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                <TableCell><Skeleton className="h-4 w-1/4" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            </TableRow>
        ))
    );

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API লগ</h1>
                    <p className="mt-2 text-md text-muted-foreground">
                        সিস্টেম থেকে পাঠানো সকল SMS-এর API রেসপন্স লগ।
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>SMS API লগ</CardTitle>
                    <CardDescription>এখানে সর্বশেষ ১০০টি SMS পাঠানোর লগ তালিকাভুক্ত রয়েছে।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>সময়</TableHead>
                                <TableHead>ফোন নম্বর</TableHead>
                                <TableHead>API প্রোভাইডার</TableHead>
                                <TableHead>স্ট্যাটাস</TableHead>
                                <TableHead>রেসপন্স</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeleton />
                            ) : logs.length > 0 ? (
                                logs.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-xs">
                                            {format(new Date(item.timestamp.seconds * 1000), 'dd/MM/yy hh:mm a')}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.phoneNumber}</TableCell>
                                        <TableCell className="capitalize">{item.apiProvider}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'success' ? 'default' : 'destructive'} className={item.status === 'success' ? 'bg-green-600' : ''}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs whitespace-pre-wrap">{item.response}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        কোনো লগ পাওয়া যায়নি।
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
