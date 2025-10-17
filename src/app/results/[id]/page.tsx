
'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ExamResult } from '@/types';
import ResultsDisplay from '@/components/results-display';
import Loading from '@/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function ResultPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    if (id) {
      const fetchResult = async () => {
        try {
          const resultDocRef = doc(db, 'results', id);
          const resultDocSnap = await getDoc(resultDocRef);

          if (resultDocSnap.exists()) {
            setResult(resultDocSnap.data() as ExamResult);
            // Trigger print dialog after a short delay
            setTimeout(() => window.print(), 1000);
          } else {
            setError('দুঃখিত, এই ফলাফলের জন্য কোনো তথ্য খুঁজে পাওয়া যায়নি।');
          }
        } catch (err) {
          console.error("Error fetching result from Firestore:", err);
          setError('ফলাফল আনতে একটি সমস্যা হয়েছে।');
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
            <Card className="border-destructive">
                <CardHeader className="items-center text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <CardTitle className="text-destructive">ত্রুটি</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                     <p className="text-sm text-muted-foreground">অনুগ্রহ করে লিঙ্কটি সঠিক কিনা তা পরীক্ষা করুন অথবা আবার চেষ্টা করুন।</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (result) {
    return (
        <div>
            <ResultsDisplay result={result} isDialog={true} />
        </div>
    );
  }

  return null;
}

    