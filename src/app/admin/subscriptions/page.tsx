
'use client'

import { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, RefreshCw, Loader2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { searchResultLegacy } from '@/lib/actions';
import type { ExamResult } from '@/types';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

type SubscriptionItem = {
    id: string;
    phone: string;
    roll: string;
    reg: string;
    exam: string;
    year: string;
    board: string;
    createdAt: { seconds: number };
};

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);
    const { toast } = useToast();

    // State for individual subscriber result check
    const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(null);
    const [isCheckingResult, setIsCheckingResult] = useState(false);
    const [checkedResult, setCheckedResult] = useState<ExamResult | null>(null);
    const [checkError, setCheckError] = useState<string | null>(null);
    const [isSendingSingleSms, setIsSendingSingleSms] = useState(false);
    const [singleSmsMessage, setSingleSmsMessage] = useState('');

    const [captchaUrl, setCaptchaUrl] = useState('');
    const [captchaCookie, setCaptchaCookie] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const subsRef = collection(db, 'subscriptions');
                const q = query(subsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                setSubscriptions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubscriptionItem)));
            } catch (error) {
                console.error("Error fetching subscriptions: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, [db]);

    const refreshCaptcha = useCallback(async () => {
        setCaptchaInput('');
        setCaptchaUrl('');
        try {
            const res = await fetch('/api/captcha');
            const data = await res.json();
            setCaptchaUrl(data.img);
            setCaptchaCookie(data.cookie);
        } catch(e) {
            console.error("Failed to refresh captcha", e);
            toast({
                title: "ত্রুটি",
                description: "ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।",
                variant: "destructive"
            });
        }
      }, [toast]);

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
        if (subscriptions.length === 0) return;

        const headers = ['Phone', 'Roll', 'Registration', 'Exam', 'Board', 'Year', 'SubscribedAt'];
        const csvRows = [
            headers.join(','),
            ...subscriptions.map(sub => {
                const row = [
                    sub.phone,
                    sub.roll,
                    sub.reg,
                    sub.exam.toUpperCase(),
                    sub.board.charAt(0).toUpperCase() + sub.board.slice(1),
                    sub.year,
                    format(new Date(sub.createdAt.seconds * 1000), 'yyyy-MM-dd HH:mm:ss')
                ];
                return row.join(',');
            })
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openCheckResultDialog = (sub: SubscriptionItem) => {
        setSelectedSub(sub);
        setCheckedResult(null);
        setCheckError(null);
        setSingleSmsMessage('');
        refreshCaptcha();
    };
    
    const handleCheckResult = async () => {
        if (!selectedSub || !captchaInput) {
            setCheckError("অনুগ্রহ করে ক্যাপচা পূরণ করুন।");
            return;
        }

        setIsCheckingResult(true);
        setCheckedResult(null);
        setCheckError(null);
        
        try {
            const result = await searchResultLegacy({
                exam: selectedSub.exam,
                year: selectedSub.year,
                board: selectedSub.board,
                roll: selectedSub.roll,
                reg: selectedSub.reg,
                captcha: captchaInput,
                cookie: captchaCookie,
            });

            if ('error' in result) {
                throw new Error(result.error);
            }
            setCheckedResult(result);
            
            let message = '';
            if (result.status === 'Pass') {
                message = `অভিনন্দন! আপনার ${result.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। আপনার GPA: ${result.gpa.toFixed(2)}. বিস্তারিত দেখুন: bdedu.me`;
            } else {
                message = `আপনার ${selectedSub.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। স্ট্যাটাস: Fail. বিস্তারিত দেখুন: bdedu.me`;
            }
            setSingleSmsMessage(message);

        } catch (error: any) {
            setCheckError(error.message);
            const message = `দুঃখিত, আপনার ${selectedSub.exam.toUpperCase()} পরীক্ষার জন্য দেওয়া রোল (${selectedSub.roll}) ও বোর্ডের তথ্যে কোনো ফলাফল পাওয়া যায়নি। তথ্য সঠিক কিনা যাচাই করুন। - bdedu.me`;
            setSingleSmsMessage(message);
            refreshCaptcha();
        } finally {
            setIsCheckingResult(false);
        }
    };
    
    const handleSendSingleSms = async () => {
        if (!singleSmsMessage || !selectedSub?.phone) return;

        setIsSendingSingleSms(true);
        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: singleSmsMessage, type: 'sms', recipient: selectedSub.phone }),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                toast({
                    title: 'SMS পাঠানো হয়েছে',
                    description: `${selectedSub.phone} নম্বরে SMS সফলভাবে পাঠানো হয়েছে।`,
                });
            } else {
                throw new Error(result.error || 'SMS পাঠাতে একটি অজানা সমস্যা হয়েছে।');
            }
        } catch (error: any) {
            toast({
                title: 'SMS পাঠাতে ব্যর্থ',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSendingSingleSms(false);
        }
    };

    const handleDeleteSubscriber = async (subId: string) => {
        try {
            await deleteDoc(doc(db, "subscriptions", subId));
            setSubscriptions(prev => prev.filter(sub => sub.id !== subId));
            toast({
                title: 'সাফল্য',
                description: 'সাবস্ক্রাইবার সফলভাবে মুছে ফেলা হয়েছে।',
            });
        } catch (error: any) {
            toast({
                title: 'ত্রুটি',
                description: 'সাবস্ক্রাইবার মুছতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">সাবস্ক্রিপশন ব্যবস্থাপনা</h1>
                    <p className="mt-2 text-md text-muted-foreground">
                        ফলাফল প্রকাশের বিজ্ঞপ্তির জন্য সাবস্ক্রাইব করা সমস্ত ব্যবহারকারী।
                    </p>
                </div>
                 <Button onClick={handleExport} disabled={subscriptions.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV এক্সপোর্ট
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>সাবস্ক্রিপশন তালিকা</CardTitle>
                    <CardDescription>এখানে সর্বশেষ থেকে শুরু করে সকল সাবস্ক্রিপশনের তালিকা রয়েছে।</CardDescription>
                </CardHeader>
                <CardContent>
                     <Dialog>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ফোন নম্বর</TableHead>
                                    <TableHead>রোল</TableHead>
                                    <TableHead>রেজি. নম্বর</TableHead>
                                    <TableHead>পরীক্ষা</TableHead>
                                    <TableHead>বোর্ড</TableHead>
                                    <TableHead>বছর</TableHead>
                                    <TableHead className="text-right">কার্যকলাপ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton columns={7} />
                                ) : subscriptions.length > 0 ? (
                                    subscriptions.map(sub => (
                                    <TableRow key={sub.id}>
                                        <TableCell>{sub.phone}</TableCell>
                                        <TableCell>{sub.roll}</TableCell>
                                        <TableCell>{sub.reg}</TableCell>
                                        <TableCell className="uppercase">{sub.exam}</TableCell>
                                        <TableCell className="capitalize">{sub.board}</TableCell>
                                        <TableCell>{sub.year}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => openCheckResultDialog(sub)}>
                                                        ফলাফল দেখুন ও পাঠান
                                                    </Button>
                                                </DialogTrigger>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                এই কাজটি ফিরিয়ে আনা যাবে না। এটি এই সাবস্ক্রাইবারকে স্থায়ীভাবে মুছে ফেলবে।
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteSubscriber(sub.id)}>
                                                                মুছে ফেলুন
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24">কোনো সাবস্ক্রিপশন নেই।</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                         {selectedSub && (
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>ফলাফল এবং SMS</DialogTitle>
                                        <DialogDescription>
                                            রোল: {selectedSub.roll}, রেজি: {selectedSub.reg}, বোর্ড: <span className="capitalize">{selectedSub.board}</span>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                        {checkedResult ? (
                                            <div className="space-y-1">
                                                <p><strong>নাম:</strong> {checkedResult.studentInfo.name}</p>
                                                <p><strong>স্ট্যাটাস:</strong> <span className={checkedResult.status === 'Pass' ? 'text-green-600' : 'text-destructive'}>{checkedResult.status}</span></p>
                                                {checkedResult.status === 'Pass' && <p><strong>GPA:</strong> {checkedResult.gpa.toFixed(2)}</p>}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                 <div className="flex items-center gap-2">
                                                    <div className="relative w-24 h-9 flex-shrink-0">
                                                        {captchaUrl ? <Image src={captchaUrl} alt="ক্যাপচা" layout="fill" objectFit="contain" unoptimized /> : <Skeleton className="w-full h-full" />}
                                                    </div>
                                                    <Button type="button" variant="outline" size="icon" onClick={refreshCaptcha} className="h-9 w-9 flex-shrink-0">
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Input 
                                                    placeholder="ক্যাপচা লিখুন"
                                                    value={captchaInput}
                                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                                    disabled={isCheckingResult}
                                                />
                                                 <Button onClick={handleCheckResult} disabled={isCheckingResult || !captchaInput} className="w-full">
                                                    {isCheckingResult && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    ফলাফল চেক করুন
                                                </Button>
                                            </div>
                                        )}
                                        
                                        {checkError && <p className="text-destructive text-sm font-medium">{checkError}</p>}
                                        
                                        <Separator />

                                        <textarea
                                            placeholder="SMS বার্তা..."
                                            value={singleSmsMessage}
                                            onChange={(e) => setSingleSmsMessage(e.target.value)}
                                            rows={4}
                                            disabled={!checkedResult && !checkError}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={handleSendSingleSms}
                                            disabled={isCheckingResult || isSendingSingleSms || !singleSmsMessage}
                                        >
                                            {isSendingSingleSms && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            SMS পাঠান
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                         )}
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
