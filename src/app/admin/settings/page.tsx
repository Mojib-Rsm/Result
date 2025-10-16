
'use client'

import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, BadgeDollarSign, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
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
    const [adsTxtContent, setAdsTxtContent] = useState('');
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [isSavingAds, setIsSavingAds] = useState(false);

    const db = getFirestore(app);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setLoadingSettings(true);
            try {
                const settingsRef = doc(db, 'settings', 'config');
                const settingsSnap = await getDoc(settingsRef);
                if (settingsSnap.exists()) {
                    const settingsData = settingsSnap.data();
                    setSiteSettings(prev => ({ ...prev, ...settingsData }));
                }

                // Fetch ads.txt content from our new API
                const adsRes = await fetch('/api/settings?file=ads.txt');
                if (adsRes.ok) {
                    const data = await adsRes.json();
                    setAdsTxtContent(data.content);
                }

            } catch (error) {
                console.error("Error fetching site settings: ", error);
                toast({
                    title: 'ত্রুটি',
                    description: 'সেটিংস আনতে সমস্যা হয়েছে।',
                    variant: 'destructive',
                });
            } finally {
                setLoadingSettings(false);
            }
        };

        fetchSettings();
    }, [db, toast]);

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
    
    const handleSaveAdsTxt = async () => {
        setIsSavingAds(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: 'ads.txt', content: adsTxtContent }),
            });
            
            const result = await response.json();

            if (response.ok) {
                toast({
                    title: 'সফল',
                    description: 'ads.txt ফাইল সফলভাবে সংরক্ষিত হয়েছে।',
                });
            } else {
                throw new Error(result.error || 'ফাইল সংরক্ষণ করা যায়নি।');
            }
        } catch (error: any) {
             toast({
                title: 'ত্রুটি',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSavingAds(false);
        }
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">সাইট সেটিংস</h1>
                    <p className="mt-2 text-md text-muted-foreground">
                        সাইটের বিভিন্ন ফিচার ও কনফিগারেশন পরিচালনা করুন।
                    </p>
                </div>
            </div>

            <Card id="site-settings">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-6 w-6" />
                        সাধারণ সেটিংস
                    </CardTitle>
                    <CardDescription>
                        এখান থেকে আপনার সাইটের সার্বিক কার্যক্রম নিয়ন্ত্রণ করুন।
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

            <Card id="ads-management">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BadgeDollarSign className="h-6 w-6" />
                        বিজ্ঞাপন ম্যানেজমেন্ট
                    </CardTitle>
                    <CardDescription>
                        Google AdSense বা অন্যান্য বিজ্ঞাপন নেটওয়ার্কের জন্য ads.txt ফাইল পরিচালনা করুন।
                    </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                     {loadingSettings ? (
                        <Skeleton className="h-48 w-full" />
                     ) : (
                        <>
                            <Label htmlFor="ads-txt">ads.txt ফাইলের কনটেন্ট</Label>
                            <Textarea 
                                id="ads-txt"
                                placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
                                value={adsTxtContent}
                                onChange={(e) => setAdsTxtContent(e.target.value)}
                                rows={8}
                            />
                            <p className="text-xs text-muted-foreground">
                                ads.txt ফাইলটি বিজ্ঞাপনের স্বচ্ছতা এবং জালিয়াতি রোধ করতে ব্যবহৃত হয়। প্রতিটি লাইন একটি অনুমোদিত বিজ্ঞাপন বিক্রেতাকে প্রতিনিধিত্ব করে।
                            </p>
                        </>
                     )}
                 </CardContent>
                 <CardContent>
                     <Button onClick={handleSaveAdsTxt} disabled={isSavingAds || loadingSettings}>
                        {isSavingAds ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        সংরক্ষণ করুন
                     </Button>
                </CardContent>
            </Card>
        </div>
    );
}
