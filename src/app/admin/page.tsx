
'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, limit, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { startOfDay, endOfDay } from 'date-fns';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, MailCheck, DatabaseZap, Search, BellRing } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const adminFeatures = [
    {
        title: 'ব্যবহারকারী ব্যবস্থাপনা',
        description: 'অ্যাপ্লিকেশনের সমস্ত ব্যবহারকারীদের দেখুন এবং পরিচালনা করুন।',
        icon: Users,
        href: '#users-table'
    },
    {
        title: 'ফলাফল ডেটা',
        description: 'সংরক্ষিত ফলাফল ডেটা দেখুন এবং বিশ্লেষণ করুন।',
        icon: FileText,
        href: '#searches-table'
    },
    {
        title: 'সাবস্ক্রিপশন',
        description: 'ফলাফলের বিজ্ঞপ্তির জন্য সাবস্ক্রাইব করা ব্যবহারকারীদের দেখুন।',
        icon: MailCheck,
        href: '#subscriptions-table'
    },
    {
        title: 'ডাটাবেস সিডিং',
        description: 'প্রাথমিক ডেটা দিয়ে ডাটাবেস প্রস্তুত করুন।',
        icon: DatabaseZap,
        href: '/seeding'
    }
];

export default function AdminPage() {
    const [recentSearches, setRecentSearches] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSearches: 0,
        todaysSearches: 0,
        totalSubscriptions: 0
    });
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const today = new Date();
                const startOfToday = startOfDay(today);
                const endOfToday = endOfDay(today);

                // Collections
                const searchesRef = collection(db, 'search-history');
                const usersRef = collection(db, 'users');
                const subscriptionsRef = collection(db, 'subscriptions');

                // Stat Queries
                const totalUsersQuery = query(usersRef);
                const totalSearchesQuery = query(searchesRef);
                const todaysSearchesQuery = query(searchesRef, where('timestamp', '>=', startOfToday.getTime()), where('timestamp', '<=', endOfToday.getTime()));
                const totalSubscriptionsQuery = query(subscriptionsRef);

                // Recent Data Queries
                const recentSearchesQuery = query(searchesRef, orderBy('timestamp', 'desc'), limit(5));
                const recentUsersQuery = query(usersRef, orderBy('name'), limit(5));
                const recentSubsQuery = query(subscriptionsRef, orderBy('createdAt', 'desc'), limit(5));

                // Execute all queries in parallel
                const [
                    totalUsersSnap,
                    totalSearchesSnap,
                    todaysSearchesSnap,
                    totalSubscriptionsSnap,
                    recentSearchesSnap,
                    recentUsersSnap,
                    recentSubsSnap
                ] = await Promise.all([
                    getCountFromServer(totalUsersQuery),
                    getCountFromServer(totalSearchesQuery),
                    getCountFromServer(todaysSearchesQuery),
                    getCountFromServer(totalSubscriptionsQuery),
                    getDocs(recentSearchesQuery),
                    getDocs(recentUsersQuery),
                    getDocs(recentSubsQuery)
                ]);

                // Set stats
                setStats({
                    totalUsers: totalUsersSnap.data().count,
                    totalSearches: totalSearchesSnap.data().count,
                    todaysSearches: todaysSearchesSnap.data().count,
                    totalSubscriptions: totalSubscriptionsSnap.data().count,
                });

                // Set recent data
                setRecentSearches(recentSearchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setUsers(recentUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setSubscriptions(recentSubsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

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
                {[...Array(4)].map((_, j) => (
                     <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
            </TableRow>
        ))
    );

    const StatCard = ({ title, value, icon: Icon, description }: {title: string, value: number, icon: React.ElementType, description: string}) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-2/4" /> : <div className="text-2xl font-bold">{value.toLocaleString()}</div> }
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );


    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">অ্যাডমিন ড্যাশবোর্ড</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    অ্যাপ্লিকেশন পরিচালনা ও নিরীক্ষণের জন্য আপনার কন্ট্রোল প্যানেল।
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="মোট ব্যবহারকারী" value={stats.totalUsers} icon={Users} description="নিবন্ধিত ব্যবহারকারীর সংখ্যা" />
                <StatCard title="মোট অনুসন্ধান" value={stats.totalSearches} icon={Search} description="এখন পর্যন্ত মোট ফলাফল অনুসন্ধান" />
                <StatCard title="আজকের অনুসন্ধান" value={stats.todaysSearches} icon={FileText} description="গত ২৪ ঘন্টায় অনুসন্ধান" />
                <StatCard title="মোট সাবস্ক্রিপশন" value={stats.totalSubscriptions} icon={BellRing} description="ফলাফল অ্যালার্টের জন্য সাবস্ক্রাইবার" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminFeatures.map((feature, index) => (
                     <Link href={feature.href} key={index}>
                        <Card className="hover:shadow-lg transition-shadow h-full">
                            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <Card id="users-table">
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
                 <Card id="searches-table">
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
            
             <div className="mt-8" id="subscriptions-table">
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

    