
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { searchResultAction, getCaptchaAction } from '@/lib/actions';
import type { CaptchaChallenge } from '@/lib/actions';
import { ExamForm, formSchema, formSchemaWithoutReg, formSchema2025 } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExamResult, HistoryItem } from '@/types';
import { useHistory } from '@/hooks/use-history';

export default function Home() {
  const [state, setState] = useState<{
    isLoading: boolean;
    isFetchingCaptcha: boolean;
    error: string | null;
    result: ExamResult | null;
    captchaChallenge: CaptchaChallenge | null;
  }>({
    isLoading: false,
    isFetchingCaptcha: true,
    error: null,
    result: null,
    captchaChallenge: null,
  });
  
  const { addHistoryItem } = useHistory();
  const [isRegRequired, setIsRegRequired] = useState(true);
  const [isCaptchaRequired, setIsCaptchaRequired] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: (data, context, options) => {
        let schema;
        const is2025Ctg = data.year === '2025' && data.board === 'chittagong';

        if (is2025Ctg) {
          schema = formSchema2025;
        } else if (isRegRequired) {
          schema = formSchema;
        } else {
          schema = formSchemaWithoutReg;
        }
        return zodResolver(schema)(data, context, options);
    },
    defaultValues: {
      roll: '',
      reg: '',
      board: 'chittagong',
      year: new Date().getFullYear().toString(),
      exam: 'ssc',
      captcha: '',
    },
  });

  const selectedYear = form.watch('year');
  const selectedBoard = form.watch('board');

  useEffect(() => {
    const yearNumber = parseInt(selectedYear, 10);
    const is2025Ctg = yearNumber === 2025 && selectedBoard === 'chittagong';

    setIsRegRequired(!is2025Ctg);
    setIsCaptchaRequired(!is2025Ctg);

    if (is2025Ctg) {
      form.setValue('reg', '');
      form.setValue('captcha', '');
    }

  }, [selectedYear, selectedBoard, form]);

  const fetchCaptcha = async () => {
    setState(prevState => ({ ...prevState, isFetchingCaptcha: true, error: null }));
    try {
      const challenge = await getCaptchaAction();
      setState(prevState => ({ ...prevState, captchaChallenge: challenge, isFetchingCaptcha: false }));
    } catch (error) {
      console.error(error);
      setState(prevState => ({ 
        ...prevState, 
        isFetchingCaptcha: false, 
        error: error instanceof Error ? error.message : 'Could not load security key.' 
      }));
    }
  };

  useEffect(() => {
    if (isCaptchaRequired) {
        fetchCaptcha();
    } else {
        setState(prevState => ({ ...prevState, captchaChallenge: null, isFetchingCaptcha: false }));
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCaptchaRequired]);

  const handleSearch = async (values: z.infer<typeof formSchema>) => {
    if (isCaptchaRequired && !state.captchaChallenge) {
      setState(prevState => ({ ...prevState, error: 'ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে রিফ্রেশ করুন।' }));
      return;
    }

    setState({ ...state, isLoading: true, error: null, result: null });
    
    try {
      const examResult = await searchResultAction({ 
        ...values, 
        cookies: state.captchaChallenge?.cookies ?? ''
      });
      
      const historyEntry: Omit<HistoryItem, 'timestamp'> = { ...values, result: examResult };
      addHistoryItem(historyEntry); 

      setState(prevState => ({ ...prevState, result: examResult, isLoading: false }));

    } catch (error) {
      console.error(error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।',
        result: null,
      }));
      // Re-fetch captcha only on captcha error
      if (isCaptchaRequired && error instanceof Error && error.message.toLowerCase().includes('captcha')) {
        fetchCaptcha();
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
      captcha: '',
    });
    setState({
      isLoading: false,
      isFetchingCaptcha: false,
      error: null,
      result: null,
      captchaChallenge: null,
    });
    if (isCaptchaRequired) {
        fetchCaptcha();
    }
  };
  
  const isSubmitting = state.isLoading || (isCaptchaRequired && state.isFetchingCaptcha);

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
              isSubmitting={isSubmitting}
              captchaImage={state.captchaChallenge?.captchaImage}
              isFetchingCaptcha={state.isFetchingCaptcha}
              onReloadCaptcha={fetchCaptcha}
              isRegRequired={isRegRequired}
              isCaptchaRequired={isCaptchaRequired}
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
