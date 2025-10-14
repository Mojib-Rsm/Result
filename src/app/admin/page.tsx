
'use client'

import { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, where, getCountFromServer, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { startOfDay, subDays } from 'date-fns';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, MailCheck, DatabaseZap, Search, BellRing, MessageSquare, Bookmark, Trash2, RefreshCw, Settings, BadgeDollarSign, FileCog, History } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { searchResultLegacy } from '@/lib/actions';
import type { ExamResult } from '@/types';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


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
        description: 'ফলাফল বিজ্ঞপ্তির সাবস্ক্রাইবারদের পরিচালনা করুন।',
        icon: MailCheck,
        href: '#subscriptions-table'
    },
     {
        title: 'বাল্ক নোটিফিকেশন',
        description: 'ব্যবহারকারীদের SMS বা ইমেইল নোটিফিকেশন পাঠান।',
        icon: BellRing,
        href: '#notification-system'
    },
    {
        title: 'শিক্ষা সংবাদ',
        description: 'সাইটের সংবাদ এবং নোটিশ পরিচালনা করুন।',
        icon: Bookmark,
        href: '/admin/news'
    },
    {
        title: 'API লগ',
        description: 'SMS API থেকে আসা রেসপন্স লগ দেখুন।',
        icon: History,
        href: '/admin/api-logs'
    },
    {
        title: 'সেটিংস ও SEO',
        description: 'সাইটের SEO, অ্যানালিটিক্স এবং অন্যান্য সেটিংস পরিচালনা করুন।',
        icon: Settings,
        href: '#site-settings'
    },
    {
        title: 'বিজ্ঞাপন ম্যানেজমেন্ট',
        description: 'Google AdSense বা অন্যান্য বিজ্ঞাপন নেটওয়ার্ক পরিচালনা করুন।',
        icon: BadgeDollarSign,
        href: '#'
    },
    {
        title: 'পেইজ ম্যানেজমেন্ট',
        description: 'About, Privacy Policy ইত্যাদি স্ট্যাটিক পেইজ এডিট করুন।',
        icon: FileCog,
        href: '#'
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
        totalSubscriptions: 0,
        searchesLast7Days: 0,
        searchesLast30Days: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isSendingSms, setIsSendingSms] = useState(false);
    const [smsMessage, setSmsMessage] = useState('');

    // State for individual subscriber result check
    const [selectedSub, setSelectedSub] = useState<any | null>(null);
    const [isCheckingResult, setIsCheckingResult] = useState(false);
    const [checkedResult, setCheckedResult] = useState<ExamResult | null>(null);
    const [checkError, setCheckError] = useState<string | null>(null);
    const [isSendingSingleSms, setIsSendingSingleSms] = useState(false);
    const [singleSmsMessage, setSingleSmsMessage] = useState('');

    const [captchaUrl, setCaptchaUrl] = useState('');
    const [captchaCookie, setCaptchaCookie] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    
    // Site settings state
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(true);
    const [activeSmsApi, setActiveSmsApi] = useState('anbu');
    const [loadingSettings, setLoadingSettings] = useState(true);


    const db = getFirestore(app);
    const { toast } = useToast();

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

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setLoadingSettings(true);
            try {
                const today = new Date();
                const startOfToday = startOfDay(today);
                const startOf7DaysAgo = startOfDay(subDays(today, 7));
                const startOf30DaysAgo = startOfDay(subDays(today, 30));

                const searchesRef = collection(db, 'search-history');
                const usersRef = collection(db, 'users');
                const subscriptionsRef = collection(db, 'subscriptions');
                const settingsRef = doc(db, 'settings', 'config');
                
                const [
                    totalUsersSnap,
                    totalSearchesSnap,
                    todaysSearchesSnap,
                    last7DaysSearchesSnap,
                    last30DaysSearchesSnap,
                    totalSubscriptionsSnap,
                    recentSearchesSnap,
                    allUsersSnap,
                    allSubsSnap,
                    settingsSnap
                ] = await Promise.all([
                    getCountFromServer(query(usersRef)),
                    getCountFromServer(query(searchesRef)),
                    getCountFromServer(query(searchesRef, where('timestamp', '>=', startOfToday))),
                    getCountFromServer(query(searchesRef, where('timestamp', '>=', startOf7DaysAgo))),
                    getCountFromServer(query(searchesRef, where('timestamp', '>=', startOf30DaysAgo))),
                    getCountFromServer(query(subscriptionsRef)),
                    getDocs(query(searchesRef, orderBy('timestamp', 'desc'))),
                    getDocs(query(usersRef, orderBy('name'))),
                    getDocs(query(subscriptionsRef, orderBy('createdAt', 'desc'))),
                    getDoc(settingsRef)
                ]);
                
                setStats({
                    totalUsers: totalUsersSnap.data().count,
                    totalSearches: totalSearchesSnap.data().count,
                    todaysSearches: todaysSearchesSnap.data().count,
                    searchesLast7Days: last7DaysSearchesSnap.data().count,
                    searchesLast30Days: last30DaysSearchesSnap.data().count,
                    totalSubscriptions: totalSubscriptionsSnap.data().count,
                });

                setRecentSearches(recentSearchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setUsers(allUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setSubscriptions(allSubsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                if (settingsSnap.exists()) {
                    const settingsData = settingsSnap.data();
                    setShowSubscriptionForm(settingsData.showSubscriptionForm);
                    setActiveSmsApi(settingsData.activeSmsApi || 'anbu');
                }


            } catch (error) {
                console.error("Error fetching admin data: ", error);
                toast({
                    title: "ত্রুটি",
                    description: "অ্যাডমিন ডেটা আনতে সমস্যা হয়েছে।",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
                setLoadingSettings(false);
            }
        };

        fetchAllData();
    }, [db, toast]);
    
    const handleSettingsChange = async (key: string, value: any) => {
        try {
            const settingsRef = doc(db, 'settings', 'config');
            await setDoc(settingsRef, { [key]: value }, { merge: true });
            toast({
                title: 'সেটিং সংরক্ষিত হয়েছে',
            });
        } catch (error: any) {
            toast({
                title: 'ত্রুটি',
                description: 'সেটিং সংরক্ষণ করা যায়নি।',
                variant: 'destructive',
            });
        }
    };
    
    const handleSubscriptionFormToggle = (checked: boolean) => {
        setShowSubscriptionForm(checked);
        handleSettingsChange('showSubscriptionForm', checked);
    };

    const handleSmsApiChange = (value: string) => {
        setActiveSmsApi(value);
        handleSettingsChange('activeSmsApi', value);
    };

    const handleBulkSendSms = async () => {
        if (!smsMessage.trim()) {
            toast({
                title: 'ত্রুটি',
                description: 'SMS বার্তা খালি হতে পারে না।',
                variant: 'destructive',
            });
            return;
        }

        setIsSendingSms(true);
        try {
            const phoneNumbers = subscriptions.map(sub => sub.phone);
            if(phoneNumbers.length === 0) {
                toast({
                    title: 'কোনো সাবস্ক্রাইবার নেই',
                    description: 'SMS পাঠানোর জন্য কোনো সাবস্ক্রাইবার পাওয়া যায়নি।',
                    variant: 'destructive',
                });
                return;
            }
            
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: smsMessage, type: 'sms-bulk', recipients: phoneNumbers }),
            });
            const result = await response.json();


            if (response.ok && result.success) {
                toast({
                    title: 'সাফল্য',
                    description: `${phoneNumbers.length} জন সাবস্ক্রাইবারকে SMS পাঠানোর জন্য প্রক্রিয়া করা হয়েছে।`,
                });
                setSmsMessage('');
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
            setIsSendingSms(false);
        }
    }

    const openCheckResultDialog = (sub: any) => {
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
                const resultUrl = result.pdfId ? `www.bdedu.me/results/${result.pdfId}` : 'www.bdedu.me';
                message = `অভিনন্দন! আপনার ${result.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। আপনার GPA: ${result.gpa.toFixed(2)}. বিস্তারিত দেখুন: ${resultUrl}`;
            } else {
                message = `আপনার ${selectedSub.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। স্ট্যাটাস: Fail. বিস্তারিত দেখুন: www.bdedu.me`;
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
            setStats(prev => ({...prev, totalSubscriptions: prev.totalSubscriptions - 1}));
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


    const TableSkeleton = () => (
        [...Array(5)].map((_, i) => (
            <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
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
                <StatCard title="গত ৭ দিনে অনুসন্ধান" value={stats.searchesLast7Days} icon={Search} description="সর্বশেষ ৭ দিনের মোট অনুসন্ধান" />
                <StatCard title="গত ৩০ দিনে অনুসন্ধান" value={stats.searchesLast30Days} icon={Search} description="সর্বশেষ ৩০ দিনের মোট অনুসন্ধান" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <Separator className="my-12" />

             <div className="grid grid-cols-1 gap-8">
                 <Card id="notification-system">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <MessageSquare className="h-6 w-6" />
                            বাল্ক নোটিফিকেশন সিস্টেম
                        </CardTitle>
                        <CardDescription>
                            এখান থেকে সকল সাবস্ক্রাইবারদের একসাথে SMS পাঠান। ({loading ? '...' : stats.totalSubscriptions.toLocaleString()} জন সাবস্ক্রাইবার)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                             <Textarea
                                placeholder="এখানে আপনার SMS বার্তা লিখুন..."
                                value={smsMessage}
                                onChange={(e) => setSmsMessage(e.target.value)}
                                rows={4}
                            />
                             <Button onClick={handleBulkSendSms} disabled={isSendingSms || subscriptions.length === 0}>
                                {isSendingSms ? 'পাঠানো হচ্ছে...' : `সকল ${subscriptions.length} সাবস্ক্রাইবারকে SMS পাঠান`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
                 <Card id="site-settings">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-6 w-6" />
                            সাইট সেটিংস
                        </CardTitle>
                        <CardDescription>
                            সাইটের বিভিন্ন ফিচার ও কনফিগারেশন পরিচালনা করুন।
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {loadingSettings ? (
                           <div className="space-y-4">
                               <Skeleton className="h-8 w-48" />
                               <Skeleton className="h-10 w-full" />
                           </div>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="subscription-form-toggle"
                                        checked={showSubscriptionForm}
                                        onCheckedChange={handleSubscriptionFormToggle}
                                    />
                                    <Label htmlFor="subscription-form-toggle">ফলাফল অ্যালার্ট ফর্ম দেখান</Label>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="mb-2 block">সক্রিয় SMS গেটওয়ে</Label>
                                    <RadioGroup
                                        value={activeSmsApi}
                                        onValueChange={handleSmsApiChange}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="anbu" id="anbu" />
                                            <Label htmlFor="anbu">ANBU SMS</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="bulksmsbd" id="bulksmsbd" />
                                            <Label htmlFor="bulksmsbd">BulkSMSBD</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <Card id="users-table">
                    <CardHeader>
                        <CardTitle>ব্যবহারকারীগণ</CardTitle>
                        <CardDescription>
                            আপনার অ্যাপ্লিকেশনের সকল নিবন্ধিত ব্যবহারকারীদের তালিকা।
                        </CardDescription>
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
                                    [...Array(5)].map((_, i) => (
                                         <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-2/4" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-1/4" /></TableCell>
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
                        <CardTitle>ফলাফল অনুসন্ধানের লগ</CardTitle>
                         <CardDescription>
                            ব্যবহারকারীদের দ্বারা করা সমস্ত ফলাফল অনুসন্ধানের ইতিহাস।
                        </CardDescription>
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
                        <CardTitle>সাবস্ক্রিপশন তালিকা</CardTitle>
                         <CardDescription>
                            ফলাফল প্রকাশের বিজ্ঞপ্তির জন্য সাবস্ক্রাইব করা সমস্ত ব্যবহারকারী।
                        </CardDescription>
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
                                        <TableSkeleton />
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
                                            <TableCell colSpan={7} className="text-center">কোনো সাবস্ক্রিপশন নেই।</TableCell>
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

                                            <Textarea
                                                placeholder="SMS বার্তা..."
                                                value={singleSmsMessage}
                                                onChange={(e) => setSingleSmsMessage(e.target.value)}
                                                rows={4}
                                                disabled={!checkedResult && !checkError}
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
        </div>
    );
}

    

    
