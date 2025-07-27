
'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { searchResultAction, getCaptchaAction } from '@/lib/actions';
import { ExamForm, formSchema } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExamResult, HistoryItem } from '@/types';
import { useHistory } from '@/hooks/use-history';

export default function Home() {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: string | null;
    result: ExamResult | null;
  }>({
    isLoading: false,
    error: null,
    result: null,
  });

  const [captchaChallenge, setCaptchaChallenge] = useState<{
    image: string;
    cookies: string;
    text: string;
  } | null>(null);
  const [isFetchingCaptcha, setIsFetchingCaptcha] = useState(true);
  
  const { addHistoryItem } = useHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roll: '',
      reg: '',
      board: 'chittagong',
      year: new Date().getFullYear().toString(),
      exam: 'ssc',
      captcha: '',
    },
  });

  const fetchNewCaptcha = useCallback(async () => {
    setIsFetchingCaptcha(true);
    setState(prevState => ({ ...prevState, error: null }));
    try {
      const challenge = await getCaptchaAction();
      setCaptchaChallenge(challenge);
      if(challenge.text) {
        form.setValue('captcha', challenge.text, { shouldValidate: true });
      } else {
        form.setValue('captcha', '');
      }
    } catch (error) {
       setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to load security code. Please refresh.',
      }));
    } finally {
      setIsFetchingCaptcha(false);
    }
  }, [form]);

  useEffect(() => {
    fetchNewCaptcha();
  }, [fetchNewCaptcha]);


  const handleSearch = async (values: z.infer<typeof formSchema>) => {
    if (isFetchingCaptcha) return;

    setState({ isLoading: true, error: null, result: null });
    
    try {
      if (!captchaChallenge) {
        throw new Error("Security code not loaded. Please wait or refresh.");
      }
      
      const examResult = await searchResultAction({ 
        ...values,
        cookies: captchaChallenge?.cookies || '',
      });
      
      const historyEntry: Omit<HistoryItem, 'timestamp'> = { ...values, result: examResult };
      addHistoryItem(historyEntry); 

      setState({ result: examResult, isLoading: false, error: null });

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।';
       setState({
        isLoading: false,
        error: errorMessage,
        result: null,
      });
      
      if (errorMessage.toLowerCase().includes('security key') || errorMessage.toLowerCase().includes('captcha')) {
         fetchNewCaptcha();
      }
    }
  };

  const resetSearch = () => {
    form.reset({
      roll: '',
      reg: '',
      board: 'chittagong',
      year: new Date().getFullYear().toString(),
      exam: 'ssc',
      captcha: ''
    });
    setState({
      isLoading: false,
      error: null,
      result: null,
    });
    fetchNewCaptcha();
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12" id="main-content">
      <div className="flex flex-col items-center text-center mb-12 no-print">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          আপনার ফলাফল দেখুন
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          আপনার পরীক্ষার বিবরণ লিখুন এবং মুহূর্তেই ফলাফল দেখুন।
        </p>
      </div>

      {!state.result && !state.isLoading && (
        <Card className="shadow-lg no-print">
          <CardHeader>
            <CardTitle>পরীক্ষার তথ্য লিখুন</CardTitle>
            <CardDescription>আপনার প্রবেশপত্র অনুযায়ী তথ্য পূরণ করুন।</CardDescription>
          </CardHeader>
          <CardContent>
             {state.error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6 text-center">
                    <p>{state.error}</p>
                </div>
              )}
            <ExamForm 
              form={form} 
              onSubmit={handleSearch} 
              isSubmitting={state.isLoading}
              isRegRequired={true}
              isCaptchaRequired={true}
              captchaImage={captchaChallenge?.image}
              isFetchingCaptcha={isFetchingCaptcha}
              onRefreshCaptcha={fetchNewCaptcha}
            />
          </CardContent>
        </Card>
      )}

      {state.isLoading && (
         <Card className="shadow-lg no-print">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2 text-center">
              <p className="text-lg font-semibold animate-pulse">আপনার ফলাফল আনা হচ্ছে...</p>
              <p className="text-muted-foreground">কিছুক্ষণ অপেক্ষা করুন।</p>
            </div>
          </CardContent>
        </Card>
      )}

      {state.result && (
        <>
          <ResultsDisplay 
            result={state.result} 
            onReset={resetSearch}
          />
        </>
      )}
    </div>
  );
}
