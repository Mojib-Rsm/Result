'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CareerManagementPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobsRef = collection(db, 'jobs');
                const q = query(jobsRef, orderBy('postedAt', 'desc'));
                const querySnapshot = await getDocs(q);
                setJobs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching jobs: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [db]);

    const TableSkeleton = () => (
        [...Array(5)].map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                <TableCell><Skeleton className="h-4 w-1/4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-1/4" /></TableCell>
                <TableCell><Skeleton className="h-8 w-24" /></TableCell>
            </TableRow>
        ))
    );

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">ক্যারিয়ার ম্যানেজমেন্ট</h1>
                    <p className="mt-2 text-md text-muted-foreground">
                        সাইটের সকল চাকরির পোস্ট পরিচালনা করুন।
                    </p>
                </div>
                <Button asChild>
                    <Link href="/career/post-job">
                        <Plus className="mr-2 h-4 w-4" />
                        নতুন জব পোস্ট করুন
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>চাকরির তালিকা</CardTitle>
                    <CardDescription>এখানে সাইটের সকল চাকরির পোস্ট তালিকাভুক্ত রয়েছে।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>পদের নাম</TableHead>
                                <TableHead>কোম্পানির নাম</TableHead>
                                <TableHead>অবস্থান</TableHead>
                                <TableHead>পোস্টের তারিখ</TableHead>
                                <TableHead className="text-right">কার্যকলাপ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeleton />
                            ) : jobs.length > 0 ? (
                                jobs.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium max-w-xs truncate">
                                            {item.title}
                                        </TableCell>
                                        <TableCell>{item.companyName}</TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell>{item.postedAt ? new Date(item.postedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" disabled>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" disabled>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        কোনো জব পোস্ট পাওয়া যায়নি।
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
