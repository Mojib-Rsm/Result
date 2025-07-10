
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, RotateCcw } from 'lucide-react';
import type { ExamResult } from '@/types';
import { Separator } from './ui/separator';

interface ResultsDisplayProps {
  result: ExamResult;
  onReset: () => void;
}

const gradeToPoint: Record<string, number> = {
  'A+': 5.0,
  'A': 4.0,
  'A-': 3.5,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
};

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  
  useEffect(() => {
    const handleBeforePrint = () => {
      document.body.classList.add('printing');
    };
    const handleAfterPrint = () => {
      document.body.classList.remove('printing');
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
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
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className='mb-4 md:mb-0'>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-4 text-sm">
            <div><strong>Roll No:</strong> {result.roll}</div>
            <div><strong>Name:</strong> {result.studentInfo.name}</div>
            <div><strong>Father's Name:</strong> {result.studentInfo.fatherName}</div>
            <div><strong>Board:</strong> <span className="capitalize">{result.board}</span></div>
            <div><strong>Group:</strong> {result.studentInfo.group}</div>
            <div><strong>Mother's Name:</strong> {result.studentInfo.motherName}</div>
            <div><strong>Date of Birth:</strong> {result.studentInfo.dob}</div>
            <div className="md:col-span-2"><strong>Institute:</strong> {result.studentInfo.institute}</div>
            <div><strong>Type:</strong> {result.studentInfo.type}</div>
            <div className="md:col-span-3"><strong>Session:</strong> {result.studentInfo.session}</div>
          </div>

          <Separator className="my-6" />

          <h3 className="font-semibold text-lg mb-2">Subject-wise Grade</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Letter Grade</TableHead>
                <TableHead className="text-right">Grade Point</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.grades.map((g) => (
                <TableRow key={g.code}>
                  <TableCell>{g.code}</TableCell>
                  <TableCell className="font-medium">{g.subject}</TableCell>
                  <TableCell>{g.grade}</TableCell>
                  <TableCell className="text-right font-bold">{gradeToPoint[g.grade]?.toFixed(2) ?? 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 no-print mt-6">
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
    </div>
  );
}
