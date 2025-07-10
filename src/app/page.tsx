'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { searchResultAction, getRecommendationsAction } from '@/lib/actions';
import { ExamForm, formSchema } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExamResult } from '@/types';
import type { GenerateRecommendationsOutput } from '@/ai/flows/generate-recommendations';
import { useHistory } from '@/hooks/use-history';

export default function Home() {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: string | null;
    result: ExamResult | null;
    recommendations: GenerateRecommendationsOutput | null;
  }>({
    isLoading: false,
    error: null,
    result: null,
    recommendations: null,
  });

  const { addHistoryItem } = useHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roll: '',
      reg: '',
      board: 'dhaka',
      year: new Date().getFullYear().toString(),
      exam: 'hsc',
    },
  });

  const handleSearch = async (values: z.infer<typeof formSchema>) => {
    setState({ isLoading: true, error: null, result: null, recommendations: null });
    try {
      const examResult = await searchResultAction(values);
      setState(prevState => ({ ...prevState, result: examResult }));

      const grades = examResult.grades.reduce((acc, g) => {
        acc[g.subject] = g.grade;
        return acc;
      }, {} as Record<string, string>);

      const recommendations = await getRecommendationsAction({
        examName: values.exam.toUpperCase(),
        grades,
        examYear: values.year,
        boardName: values.board,
      });

      setState(prevState => ({ ...prevState, isLoading: false, recommendations }));
      addHistoryItem({ ...values, result: examResult, recommendations });
    } catch (error) {
      console.error(error);
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred.',
        result: null,
        recommendations: null,
      });
    }
  };

  const resetSearch = () => {
    form.reset();
    setState({
      isLoading: false,
      error: null,
      result: null,
      recommendations: null,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          Check Your Results
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Enter your exam details to instantly view your results and receive AI-powered recommendations for your future.
        </p>
      </div>

      {!state.result && !state.isLoading && !state.error && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enter Exam Information</CardTitle>
            <CardDescription>Fill in your details as they appear on your admit card.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExamForm form={form} onSubmit={handleSearch} isSubmitting={state.isLoading} />
          </CardContent>
        </Card>
      )}

      {state.isLoading && (
         <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
             <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
             </div>
          </CardContent>
        </Card>
      )}

      {state.error && (
        <Card className="shadow-lg border-destructive">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-destructive">{state.error}</p>
            <Button onClick={() => handleSearch(form.getValues())} variant="destructive">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {state.result && (
        <>
          <ResultsDisplay 
            result={state.result} 
            recommendations={state.recommendations} 
            isLoadingRecommendations={state.isLoading}
            onReset={resetSearch}
          />
        </>
      )}
    </div>
  );
}
