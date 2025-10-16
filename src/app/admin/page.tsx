
'use client'

import { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, where, getCountFromServer, doc, setDoc, getDoc } from 'firebase/firestore';
import { startOfDay, subDays } from 'date-fns';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, MailCheck, DatabaseZap, Search, BellRing, MessageSquare, Bookmark, Trash2, RefreshCw, Settings, BadgeDollarSign, FileCog, History, Briefcase, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';


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
        icon: History,
        href: '/admin/search-history'
    },
    {
        title: 'সাবস্ক্রিপশন',
        description: 'ফলাফল বিজ্ঞপ্তির সাবস্ক্রাইবারদের পরিচালনা করুন।',
        icon: MailCheck,
        href: '/admin/subscriptions'
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
        title: 'ক্যারিয়ার ম্যানেজমেন্ট',
        description: 'সাইটের সকল চাকরির পোস্ট পরিচালনা করুন।',
        icon: Briefcase,
        href: '/admin/career'
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
    const [users, setUsers] = useState<any[]>([]);
    const [subscriptionsCount, setSubscriptionsCount] = useState(0);
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
    
    // Site settings state
    const [siteSettings, setSiteSettings] = useState({
        showSubscriptionForm: true,
        showNoticeBoard: true,
        showAdmissionUpdate: true,
        showEducationalResources: true,
        showCareerHub: true,
        showNewsSection: true,
        showTools: true,
        showCommunityForum: true,
        activeSmsApi: 'anbu',
    });
    const [loadingSettings, setLoadingSettings] = useState(true);


    const db = getFirestore(app);
    const { toast } = useToast();
    
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setLoadingSettings(true);
        try {
            const searchesRef = collection(db, 'search-history');
            const usersRef = collection(db, 'users');
            const subscriptionsRef = collection(db, 'subscriptions');
            const settingsRef = doc(db, 'settings', 'config');
            
            // Temporarily simplified query to avoid composite index requirement
            const [
                totalUsersSnap,
                totalSearchesSnap,
                totalSubscriptionsSnap,
                allUsersSnap,
                settingsSnap
            ] = await Promise.all([
                getCountFromServer(query(usersRef)),
                getCountFromServer(query(searchesRef)),
                getCountFromServer(query(subscriptionsRef)),
                getDocs(query(usersRef, orderBy('name'))),
                getDoc(settingsRef)
            ]);
            
            const subsCount = totalSubscriptionsSnap.data().count;
            setSubscriptionsCount(subsCount);
            
            setStats({
                totalUsers: totalUsersSnap.data().count,
                totalSearches: totalSearchesSnap.data().count,
                todaysSearches: 0,
                searchesLast7Days: 0,
                searchesLast30Days: 0,
                totalSubscriptions: subsCount,
            });

            setUsers(allUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            if (settingsSnap.exists()) {
                const settingsData = settingsSnap.data();
                setSiteSettings(prev => ({ ...prev, ...settingsData }));
            }
        } catch (error) {
            console.error("Error fetching admin data: ", error);
            // toast({
            //     title: "ত্রুটি",
            //     description: "অ্যাডমিন ডেটা আনতে সমস্যা হয়েছে।",
            //     variant: "destructive",
            // });
        } finally {
            setLoading(false);
            setLoadingSettings(false);
        }
    }, [db]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);
    
    const handleSettingsChange = async (key: string, value: any) => {
        setSiteSettings(prev => ({ ...prev, [key]: value }));
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
             // Revert UI change on error
             setSiteSettings(prev => ({ ...prev, [key]: !value }));
        }
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
            const subscriptionsRef = collection(db, 'subscriptions');
            const subsSnapshot = await getDocs(query(subscriptionsRef));
            const phoneNumbers = subsSnapshot.docs.map(doc => doc.data().phone);

            if(phoneNumbers.length === 0) {
                toast({
                    title: 'কোনো সাবস্ক্রাইবার নেই',
                    description: 'SMS পাঠানোর জন্য কোনো সাবস্ক্রাইবার পাওয়া যায়নি।',
                    variant: 'destructive',
                });
                setIsSendingSms(false);
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
                            এখান থেকে সকল সাবস্ক্রাইবারদের একসাথে SMS পাঠান। ({loading ? '...' : subscriptionsCount.toLocaleString()} জন সাবস্ক্রাইবার)
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
                             <Button onClick={handleBulkSendSms} disabled={isSendingSms || subscriptionsCount === 0}>
                                {isSendingSms ? 'পাঠানো হচ্ছে...' : `সকল ${subscriptionsCount} সাবস্ক্রাইবারকে SMS পাঠান`}
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
                               {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                           </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <h4 className="font-medium">হোমপেজ সেকশন ম্যানেজমেন্ট</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch id="notice-board-toggle" checked={siteSettings.showNoticeBoard} onCheckedChange={(c) => handleSettingsChange('showNoticeBoard', c)} />
                                            <Label htmlFor="notice-board-toggle">নোটিশ বোর্ড</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="admission-update-toggle" checked={siteSettings.showAdmissionUpdate} onCheckedChange={(c) => handleSettingsChange('showAdmissionUpdate', c)} />
                                            <Label htmlFor="admission-update-toggle">ভর্তি আপডেট</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="educational-resources-toggle" checked={siteSettings.showEducationalResources} onCheckedChange={(c) => handleSettingsChange('showEducationalResources', c)} />
                                            <Label htmlFor="educational-resources-toggle">শিক্ষামূলক রিসোর্স</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="career-hub-toggle" checked={siteSettings.showCareerHub} onCheckedChange={(c) => handleSettingsChange('showCareerHub', c)} />
                                            <Label htmlFor="career-hub-toggle">ক্যারিয়ার হাব</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="news-section-toggle" checked={siteSettings.showNewsSection} onCheckedChange={(c) => handleSettingsChange('showNewsSection', c)} />
                                            <Label htmlFor="news-section-toggle">শিক্ষা সংবাদ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="tools-toggle" checked={siteSettings.showTools} onCheckedChange={(c) => handleSettingsChange('showTools', c)} />
                                            <Label htmlFor="tools-toggle">টুলস ও ফিচার</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="community-forum-toggle" checked={siteSettings.showCommunityForum} onCheckedChange={(c) => handleSettingsChange('showCommunityForum', c)} />
                                            <Label htmlFor="community-forum-toggle">কমিউনিটি ফোরাম</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="subscription-form-toggle" checked={siteSettings.showSubscriptionForm} onCheckedChange={(c) => handleSettingsChange('showSubscriptionForm', c)} />
                                            <Label htmlFor="subscription-form-toggle">ফলাফল অ্যালার্ট ফর্ম</Label>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="mb-2 block font-medium">সক্রিয় SMS গেটওয়ে</Label>
                                    <RadioGroup
                                        value={siteSettings.activeSmsApi}
                                        onValueChange={(v) => handleSettingsChange('activeSmsApi', v)}
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

            <div className="mt-12" id="users-table">
                <Card>
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
                                    [...Array(2)].map((_, i) => (
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
            </div>
        </div>
    );
}

    