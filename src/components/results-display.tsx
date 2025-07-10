'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, RotateCcw } from 'lucide-react';
import type { ExamResult } from '@/types';
import type { GenerateRecommendationsOutput } from '@/ai/flows/generate-recommendations';
import AiRecommendations from './ai-recommendations';
import { Separator } from './ui/separator';

interface ResultsDisplayProps {
  result: ExamResult;
  recommendations: GenerateRecommendationsOutput | null;
  isLoadingRecommendations: boolean;
  onReset: () => void;
}

export default function ResultsDisplay({ result, recommendations, isLoadingRecommendations, onReset }: ResultsDisplayProps) {
  
  useEffect(() => {
    const originalBodyClassName = document.body.className;
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');

    window.onbeforeprint = () => {
      document.body.className = 'printing';
      if (mainContent) mainContent.classList.remove('no-print');
      if (header) header.classList.add('no-print');
    };
    
    window.onafterprint = () => {
      document.body.className = originalBodyClassName;
       if (header) header.classList.remove('no-print');
    };

    return () => {
      window.onbeforeprint = null;
      window.onafterprint = null;
    }
  }, []);
  
  const handlePrint = () => {
    window.print();
  };

  const gpa = result.gpa.toFixed(2);
  const isPass = result.status === 'Pass';

  return (
    <div className="space-y-8">
      <Card className="shadow-lg" id="printable-area">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-primary">Result Marksheet</CardTitle>
              <CardDescription>{result.exam.toUpperCase()} Examination - {result.year}</CardDescription>
            </div>
            <div className={`text-right ${isPass ? 'text-green-600' : 'text-destructive'} font-bold text-xl`}>
                <p>Status: {result.status}</p>
                {isPass && <p>GPA: {gpa}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div><strong>Roll No:</strong> {result.roll}</div>
            <div><strong>Board:</strong> <span className="capitalize">{result.board}</span></div>
            <div><strong>Group:</strong> {result.studentInfo.group}</div>
            <div><strong>Name:</strong> {result.studentInfo.name}</div>
            <div><strong>Father's Name:</strong> {result.studentInfo.fatherName}</div>
            <div><strong>Mother's Name:</strong> {result.studentInfo.motherName}</div>
            <div><strong>Date of Birth:</strong> {result.studentInfo.dob}</div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.grades.map((g) => (
                <TableRow key={g.code}>
                  <TableCell>{g.code}</TableCell>
                  <TableCell className="font-medium">{g.subject}</TableCell>
                  <TableCell className="text-right font-bold">{g.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 no-print">
            <Button variant="outline" onClick={onReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Check Another
            </Button>
            <Button onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </CardFooter>
      </Card>
      
      {isPass && (
        <div className="no-print">
            <Separator />
            <AiRecommendations recommendations={recommendations} isLoading={isLoadingRecommendations} />
        </div>
      )}

    </div>
  );
}
