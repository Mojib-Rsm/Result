
'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, MailCheck, DatabaseZap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

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
        title: 'সাবস্ক্রিপশন',
        description: 'ফলাফলের বিজ্ঞপ্তির জন্য সাবস্ক্রাইব করা ব্যবহারকারীদের দেখুন।',
        icon: MailCheck,
    },
    {
        title: 'ডাটাবেস সিডিং',
        description: 'প্রাথমিক ডেটা দিয়ে ডাটাবেস প্রস্তুত করুন। /seeding রুটে যান।',
        icon: DatabaseZap,
    }
];

export default function AdminPage() {
    const [recentSearches, setRecentSearches] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch Recent Searches
                const searchesRef = collection(db, 'search-history');
                const searchesQuery = query(searchesRef, orderBy('timestamp', 'desc'), limit(10));
                const searchesSnapshot = await getDocs(searchesQuery);
                const searches = searchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecentSearches(searches);

                // Fetch Users
                const usersRef = collection(db, 'users');
                const usersQuery = query(usersRef, limit(10)); // Example: limit to 10 users
                const usersSnapshot = await getDocs(usersQuery);
                const fetchedUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(fetchedUsers);

                // Fetch Subscriptions
                const subscriptionsRef = collection(db, 'subscriptions');
                const subsQuery = query(subscriptionsRef, orderBy('createdAt', 'desc'), limit(10));
                const subsSnapshot = await getDocs(subsQuery);
                const fetchedSubs = subsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubscriptions(fetchedSubs);

            } catch (error) {
                console.error("Error fetching admin data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [db]);

    const TableSkeleton = () => (
        [...Array(5)].map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            </TableRow>
        ))
    );


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
                            <CardDescription>
                                {feature.description}
                                {feature.title === 'ডাটাবেস সিডিং' && <Link href="/seeding" className="text-primary font-semibold hover:underline block mt-2">এখান থেকে করুন</Link>}
                            </CardDescription>
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
                                {loading ? (
                                    [...Array(2)].map((_, i) => (
                                         <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : users.length > 0 ? (
                                    users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                    </TableRow>
                                ))) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">কোনো ব্যবহারকারী নেই।</TableCell>
                                    </TableRow>
                                )}
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
                                {loading ? (
                                    <TableSkeleton />
                                ) : recentSearches.length > 0 ? (
                                    recentSearches.map(result => (
                                        <TableRow key={result.id}>
                                            <TableCell>{result.roll}</TableCell>
                                            <TableCell className="uppercase">{result.exam}</TableCell>
                                            <TableCell>{result.year}</TableCell>
                                            <TableCell>{result.result?.gpa?.toFixed(2) || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">কোনো সাম্প্রতিক অনুসন্ধান নেই।</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
             <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>সাম্প্রতিক সাবস্ক্রিপশন</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ফোন নম্বর</TableHead>
                                    <TableHead>রোল</TableHead>
                                    <TableHead>পরীক্ষা</TableHead>
                                    <TableHead>বছর</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton />
                                ) : subscriptions.length > 0 ? (
                                    subscriptions.map(sub => (
                                    <TableRow key={sub.id}>
                                        <TableCell>{sub.phone}</TableCell>
                                        <TableCell>{sub.roll}</TableCell>
                                        <TableCell className="uppercase">{sub.exam}</TableCell>
                                        <TableCell>{sub.year}</TableCell>
                                    </TableRow>
                                ))) : (
                                     <TableRow>
                                        <TableCell colSpan={4} className="text-center">কোনো সাম্প্রতিক সাবস্ক্রিপশন নেই।</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
