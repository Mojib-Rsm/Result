'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { searchResultAction, getCaptchaAction } from '@/lib/actions';
import type { CaptchaChallenge } from '@/lib/actions';
import { ExamForm, formSchema, formSchemaWithoutReg } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExamResult } from '@/types';
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: (data, context, options) => {
        const schema = isRegRequired ? formSchema : formSchemaWithoutReg;
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

  useEffect(() => {
    // For years 2025 and beyond, registration is not required.
    const yearNumber = parseInt(selectedYear, 10);
    setIsRegRequired(yearNumber < 2025);
  }, [selectedYear]);

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
    fetchCaptcha();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (values: z.infer<typeof formSchema>) => {
    if (!state.captchaChallenge) {
      setState(prevState => ({ ...prevState, error: 'Captcha not loaded. Please refresh.' }));
      return;
    }

    setState({ ...state, isLoading: true, error: null, result: null });
    
    try {
      const examResult = await searchResultAction({ 
        ...values, 
        cookies: state.captchaChallenge.cookies 
      });
      addHistoryItem({ ...values, result: examResult });
      setState(prevState => ({ ...prevState, result: examResult, isLoading: false }));

    } catch (error) {
      console.error(error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred.',
        result: null,
      }));
      // Re-fetch captcha only on captcha error
      if (error instanceof Error && error.message.toLowerCase().includes('captcha')) {
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
    fetchCaptcha();
  };
  
  const isSubmitting = state.isLoading || state.isFetchingCaptcha;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12" id="main-content">
      <div className="flex flex-col items-center text-center mb-12 no-print">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          Check Your Results
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Enter your exam details to instantly view your results.
        </p>
      </div>

      {!state.result && !state.isLoading && (
        <Card className="shadow-lg no-print">
          <CardHeader>
            <CardTitle>Enter Exam Information</CardTitle>
            <CardDescription>Fill in your details as they appear on your admit card.</CardDescription>
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
              <p className="text-lg font-semibold animate-pulse">Fetching your result...</p>
              <p className="text-muted-foreground">This may take a moment.</p>
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
