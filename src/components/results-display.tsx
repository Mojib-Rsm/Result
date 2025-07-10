
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, RotateCcw } from 'lucide-react';
import type { ExamResult } from '@/types';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  result: ExamResult;
  onReset?: () => void;
  isDialog?: boolean;
}

const getGpaGrade = (gpa: number): string => {
    if (gpa === 5) return 'A+';
    if (gpa >= 4) return 'A';
    if (gpa >= 3.5) return 'A-';
    if (gpa >= 3) return 'B';
    if (gpa >= 2) return 'C';
    if (gpa >= 1) return 'D';
    return 'F';
};


export default function ResultsDisplay({ result, onReset, isDialog = false }: ResultsDisplayProps) {
  
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
  const gpaGrade = getGpaGrade(result.gpa);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg" id="printable-area">
        <CardHeader>
          <div className="flex flex-col items-center text-center mb-4">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png" 
                alt="Government Seal of Bangladesh"
                width={60}
                height={60}
                className="h-16 w-16 mb-2"
              />
              <CardTitle className="text-2xl text-primary">Result Marksheet</CardTitle>
              <CardDescription>{result.exam.toUpperCase()} Examination - {result.year}</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className='mb-4 md:mb-0'>
               
            </div>
            <div className={`text-right font-bold text-xl`}>
                <p className={isPass ? 'text-green-600' : 'text-destructive'}>Status: {result.status}</p>
                {isPass && <p>GPA: {gpa}</p>}
                {isPass && <p>Grade: {gpaGrade}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-4 text-sm">
            <div><strong>Roll No:</strong> {result.roll}</div>
            <div><strong>Reg No:</strong> {result.reg}</div>
            <div><strong>Name:</strong> {result.studentInfo.name}</div>
            <div><strong>Father's Name:</strong> {result.studentInfo.fatherName}</div>
            <div><strong>Board:</strong> <span className="capitalize">{result.board}</span></div>
            <div><strong>Group:</strong> {result.studentInfo.group}</div>
            <div><strong>Mother's Name:</strong> {result.studentInfo.motherName}</div>
            <div><strong>Date of Birth:</strong> {result.studentInfo.dob}</div>
            <div className="md:col-span-2"><strong>Institute:</strong> {result.studentInfo.institute}</div>
            <div><strong>Session:</strong> {result.studentInfo.session}</div>
          </div>

          <Separator className="my-6" />

          <h3 className="font-semibold text-lg mb-2">Subject-wise Grade</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead className="text-right">Letter Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.grades.map((g, index) => (
                <TableRow key={g.code} className={cn(index % 2 !== 0 && 'bg-muted/50')}>
                  <TableCell>{g.code}</TableCell>
                  <TableCell className="font-medium">{g.subject}</TableCell>
                  <TableCell className="text-right font-bold">{g.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

         <Separator className="my-6" />
        
        <div className="px-6 pb-6 text-center text-xs text-muted-foreground">
             <p>For any queries, contact: mojibrsm@gmail.com</p>
             <p>Developed by: <span className="font-semibold text-foreground">Mojib Rsm</span> | www.oftern.com</p>
        </div>


        <CardFooter className="flex justify-end gap-2 no-print mt-6">
            {!isDialog && onReset && (
                <Button variant="outline" onClick={onReset}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Check Another
                </Button>
            )}
            <Button onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
