
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExamForm, formSchema } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import type { ExamResult } from '@/types';
import { z } from 'zod';
import { searchResultLegacy } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';

export default function Home() {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exam: '',
      year: '',
      board: '',
      result_type: '1',
      roll: '',
      reg: '',
      eiin: '',
      dcode: '',
      ccode: '',
      captcha: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await searchResultLegacy(values);
      setResult(searchResult);
       if (values.result_type === '1') {
         addHistoryItem({
            roll: values.roll!,
            reg: values.reg,
            board: values.board,
            year: values.year,
            exam: values.exam,
            result_type: values.result_type,
            result: searchResult,
            eiin: values.eiin
        });
       }
    } catch (e: any) {
       setError(e.message);
       toast({
        title: "Error",
        description: e.message,
        variant: "destructive"
       });
        // Auto-refresh captcha if it's a captcha error
       if (e.message && (e.message.toLowerCase().includes("captcha") || e.message.toLowerCase().includes("security key"))) {
            const formComponent = document.getElementById('exam-form-component');
            if (formComponent) {
                const event = new CustomEvent('refreshcaptcha');
                formComponent.dispatchEvent(event);
            }
       }
    } finally {
        setIsSubmitting(false);
    }
  };

  const resetSearch = () => {
    setResult(null);
    setError(null);
    form.reset();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12" id="main-content">
       <div className="flex flex-col items-center text-center mb-12 no-print">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          আপনার ফলাফল দেখুন
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
           যেকোনো শিক্ষাবোর্ডের ফলাফল দেখুন খুব সহজে।
        </p>
      </div>

      {!result ? (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4 md:p-8">
            <ExamForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
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
