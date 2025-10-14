
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExamForm } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import type { ExamResult } from '@/types';
import { z } from 'zod';
import { searchResultLegacy } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formSchema } from '@/lib/schema';
import ResultAlertForm from '@/components/result-alert-form';
import { Separator } from '@/components/ui/separator';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();
  const [showNotice, setShowNotice] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [captchaCookie, setCaptchaCookie] = useState('');
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const db = getFirestore(app);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exam: '',
      year: '',
      board: '',
      roll: '',
      reg: '',
      captcha: '',
    },
  });

  const refreshCaptcha = useCallback(async () => {
    form.setValue('captcha', '');
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
  }, [form, toast]);


  useEffect(() => {
    const noticeSeen = sessionStorage.getItem('noticeSeen');
    if (!noticeSeen) {
      setShowNotice(true);
      sessionStorage.setItem('noticeSeen', 'true');
    }
    refreshCaptcha();
    
    const fetchSettings = async () => {
        try {
            const settingsRef = doc(db, 'settings', 'config');
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
                setShowSubscriptionForm(settingsSnap.data().showSubscriptionForm);
            } else {
                setShowSubscriptionForm(true); // Default to true if not set
            }
        } catch (error) {
            console.error("Error fetching site settings: ", error);
            setShowSubscriptionForm(true); // Default to true on error
        } finally {
            setLoadingSettings(false);
        }
    };

    fetchSettings();
  }, [refreshCaptcha, db]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setResult(null);

    const valuesWithCookie = { ...values, cookie: captchaCookie };

    try {
      const searchResult = await searchResultLegacy(valuesWithCookie);
      
      if ('error' in searchResult) {
          throw new Error(searchResult.error);
      }

      setResult(searchResult);
      addHistoryItem({
          roll: values.roll,
          reg: values.reg,
          board: values.board,
          year: values.year,
          exam: values.exam,
          result: searchResult,
      });
    } catch (e: any) {
       toast({
        title: "ত্রুটি",
        description: e.message,
        variant: "destructive"
       });
       refreshCaptcha();
    } finally {
        setIsSubmitting(false);
    }
  };

  const resetSearch = () => {
    setResult(null);
    form.reset();
    refreshCaptcha();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12" id="main-content">
      <Dialog open={showNotice} onOpenChange={setShowNotice}>
          <DialogContent>
              <DialogHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                      <Megaphone className="h-8 w-8 text-primary" />
                  </div>
                  <DialogTitle className="text-center">এইচএসসি ফলাফল ২০২৫ সংক্রান্ত বিজ্ঞপ্তি</DialogTitle>
                  <DialogDescription className="text-center">
                      ফলাফল প্রকাশের গুরুত্বপূর্ণ তথ্য।
                  </DialogDescription>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert max-w-full">
                  <p>
                      এইচএসসি ও সমমান পরীক্ষা ২০২৫-এর ফলাফল আগামী <strong className="text-primary">১৬ অক্টোবর ২০২৫</strong> সকাল ১০:০০ টায় একযোগে প্রকাশ করা হবে।
                  </p>
                  <ul className="list-decimal pl-5 space-y-1">
                      <li>
                          ফলাফল দেখতে <a href="#main-content" onClick={() => setShowNotice(false)} className="font-semibold text-primary">এই ওয়েবসাইটে (bdedu.me)</a> আপনার রোল ও রেজিস্ট্রেশন নম্বর ব্যবহার করুন।
                      </li>
                      <li>
                          SMS-এর মাধ্যমে ফল পেতে <strong className="text-primary">HSC &lt;Board&gt; &lt;Roll&gt; &lt;Year&gt;</strong> লিখে <strong className="text-primary">16222</strong> নম্বরে পাঠান।
                      </li>
                  </ul>
              </div>
              <DialogFooter>
                  <Button onClick={() => setShowNotice(false)}>বুঝেছি</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

       <div className="flex flex-col items-center text-center mb-12 no-print">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent animate-fade-in-up">
          আপনার ফলাফল দেখুন
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground animate-fade-in-up animation-delay-200">
           যেকোনো শিক্ষাবোর্ডের ফলাফল দেখুন খুব সহজে।
        </p>
      </div>

      {!result ? (
        <div className="space-y-12">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-4 md:p-8">
              <ExamForm 
                form={form} 
                onSubmit={onSubmit} 
                isSubmitting={isSubmitting}
                captchaUrl={captchaUrl}
                onCaptchaRefresh={refreshCaptcha}
              />
          </div>
           <Separator />
           {loadingSettings ? (
              <Card className="border-dashed">
                  <CardHeader className="text-center">
                       <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                       <Skeleton className="h-7 w-64 mx-auto mt-4" />
                       <Skeleton className="h-5 w-80 mx-auto mt-2" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-40 w-full" />
                  </CardContent>
              </Card>
            ) : showSubscriptionForm && <ResultAlertForm />}
        </div>
      ) : (
        <>
          <ResultsDisplay 
            result={result} 
            onReset={resetSearch}
          />
        </>
      )}
    </div>
  );
}
