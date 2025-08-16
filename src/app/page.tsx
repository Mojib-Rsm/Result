
'use client';

import { useState } from 'react';
import ResultsDisplay from '@/components/results-display';
import type { ExamResult } from '@/types';

// Static demo result data
const demoResult: ExamResult = {
  roll: '123456',
  reg: '1234567890',
  board: 'dhaka',
  year: '2023',
  exam: 'hsc',
  gpa: 5.0,
  status: 'Pass',
  studentInfo: {
    name: 'Firstname Lastname',
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    group: 'Science',
    dob: '01-01-2005',
    institute: 'Some College Name',
    session: '2021-2022',
  },
  grades: [
    { code: '101', subject: 'BANGLA', grade: 'A+' },
    { code: '107', subject: 'ENGLISH', grade: 'A+' },
    { code: '265', subject: 'INFORMATION AND COMMUNICATION TECHNOLOGY', grade: 'A+' },
    { code: '174', subject: 'PHYSICS', grade: 'A+' },
    { code: '176', subject: 'CHEMISTRY', grade: 'A+' },
    { code: '269', subject: 'HIGHER MATHEMATICS', grade: 'A+' },
    { code: '178', subject: 'BIOLOGY', grade: 'A+' },
  ],
};

export default function Home() {
  const [result, setResult] = useState<ExamResult | null>(demoResult);

  const resetSearch = () => {
    setResult(demoResult);
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12" id="main-content">
      <div className="flex flex-col items-center text-center mb-12 no-print">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          আপনার ফলাফল দেখুন
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          এটি ফলাফল প্রদর্শনের একটি ডেমো।
        </p>
      </div>

      {result && (
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
