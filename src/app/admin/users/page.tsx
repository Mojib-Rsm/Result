
'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const db = getFirestore(app);
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            if (currentUser?.role !== 'admin') {
                 setLoading(false);
                 return;
            }
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, orderBy('name', 'asc'));
                const querySnapshot = await getDocs(q);
                setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching users: ", error);
                 toast({ title: 'ত্রুটি', description: 'ব্যবহারকারীদের তালিকা আনতে সমস্যা হয়েছে।', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [db, toast, currentUser]);

    const handleDelete = async (userId: string) => {
        setDeletingId(userId);
        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            toast({
                title: 'সাফল্য',
                description: 'ব্যবহারকারীকে সফলভাবে মুছে ফেলা হয়েছে।',
            });
        } catch (error) {
            toast({
                title: 'ত্রুটি',
                description: 'ব্যবহারকারীকে মোছা যায়নি।',
                variant: 'destructive',
            });
            console.error("Error deleting user: ", error);
        } finally {
            setDeletingId(null);
        }
    };

    const TableSkeleton = () => (
        [...Array(5)].map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
            </TableRow>
        ))
    );

    if (currentUser?.role !== 'admin') {
        return (
             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">অ্যাক্সেস ডিনাইড</CardTitle>
                    <CardDescription>এই পৃষ্ঠাটি শুধুমাত্র অ্যাডমিনরা দেখতে পারবেন।</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">ব্যবহারকারী ব্যবস্থাপনা</h1>
                    <p className="mt-2 text-md text-muted-foreground">
                        সাইটের সকল ব্যবহারকারী পরিচালনা করুন।
                    </p>
                </div>
                 <Button asChild>
                    <Link href="/register">
                        <UserPlus className="mr-2 h-4 w-4" />
                        নতুন ব্যবহারকারী যোগ করুন
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ব্যবহারকারীর তালিকা</CardTitle>
                    <CardDescription>এখানে সাইটের সকল নিবন্ধিত ব্যবহারকারী তালিকাভুক্ত রয়েছে।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>নাম</TableHead>
                                <TableHead>ইমেইল</TableHead>
                                <TableHead>ভূমিকা</TableHead>
                                <TableHead className="text-right">কার্যকলাপ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeleton />
                            ) : users.length > 0 ? (
                                users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-primary/80' : ''}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/users/edit/${user.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                         <Button variant="ghost" size="icon" className="text-destructive" disabled={deletingId === user.id}>
                                                            {deletingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                এই কাজটি ফিরিয়ে আনা যাবে না। এই ব্যবহারকারী স্থায়ীভাবে মুছে যাবে।
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(user.id)}>
                                                                মুছে ফেলুন
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        কোনো ব্যবহারকারী পাওয়া যায়নি।
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

