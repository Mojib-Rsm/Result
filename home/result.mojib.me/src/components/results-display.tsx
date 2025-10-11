
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Printer } from 'lucide-react';
import type { ExamResult } from '@/types';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ResultsDisplayProps {
  result: ExamResult;
  onReset?: () => void;
  isDialog?: boolean;
}

const getGpaGrade = (gpa: number): string => {
    if (gpa >= 5) return 'A+';
    if (gpa >= 4) return 'A';
    if (gpa >= 3.5) return 'A-';
    if (gpa >= 3) return 'B';
    if (gpa >= 2) return 'C';
    if (gpa >= 1) return 'D';
    return 'F';
};

const FooterContent = () => (
    <div className="text-center">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
                <p className="text-md font-medium text-foreground">A Project by BDEdu</p>
                <p className="text-sm text-muted-foreground">All rights reserved.</p>
            </div>
            <div className="flex flex-col items-center gap-2 mt-2">
                <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer">
                    <Image 
                        src="https://www.bdedu.me/favicon.png"
                        alt="BD Edu Result Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10"
                    />
                </Link>
                <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    bdedu.me
                </Link>
            </div>
        </div>
    </div>
);


export default function ResultsDisplay({ result, onReset, isDialog = false }: ResultsDisplayProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
        window.print();
        setIsPrinting(false);
    }, 100);
  }

  const gpa = result.gpa?.toFixed(2);
  const isPass = result.status === 'Pass';
  const showMarks = result.grades.some(g => g.marks);
  
  const InfoItem = ({ label, value }: { label: string, value: string | undefined}) => (
    <div className="flex flex-col p-2 bg-muted/30 rounded-md">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-semibold text-sm capitalize">{value || 'N/A'}</span>
    </div>
  );

  const containerClasses = cn(
    "space-y-4",
    !isDialog && "space-y-8"
  );
  
  const cardClasses = cn(
      "shadow-lg",
      isDialog && "shadow-none border-none"
  );

  return (
    <div className={containerClasses}>
       <div className={cn("flex justify-end gap-2", !isDialog && "no-print")}>
          {!isDialog && onReset && (
              <Button variant="outline" onClick={onReset} disabled={isPrinting}>
                  <Search className="mr-2 h-4 w-4" />
                  অন্য ফলাফল খুঁজুন
              </Button>
          )}

          <Button onClick={handlePrint} disabled={isPrinting}>
              {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
              প্রিন্ট করুন
          </Button>
      </div>

      <div id="pdf-container">
        <Card className={cardClasses} id="printable-area">
              <CardHeader>
                   <div className="relative text-center">
                      <div className="flex justify-center">
                          <Image 
                              src="https://www.bdedu.me/favicon.png"
                              alt="BD Edu Result Logo"
                              width={60}
                              height={60}
                              className="h-16 w-16 mb-2"
                          />
                      </div>
                       <CardTitle className="text-2xl text-primary">Result Marksheet</CardTitle>

                      <div className="absolute top-0 right-0 text-right font-bold text-xl min-w-[120px]">
                          <p className={isPass ? 'text-green-600' : 'text-destructive'}>Status: {result.status}</p>
                          {isPass && gpa && <p>GPA: {gpa}</p>}
                      </div>
                  </div>
                   <CardDescription className="text-center">{result.exam.toUpperCase()} Examination - {result.year}</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  <InfoItem label="Roll No" value={result.roll} />
                  <InfoItem label="Board" value={result.board} />
                  <InfoItem label="Name" value={result.studentInfo.name} />
                  <InfoItem label="Father's Name" value={result.studentInfo.fatherName} />
                  <InfoItem label="Mother's Name" value={result.studentInfo.motherName} />
                  <InfoItem label="Group" value={result.studentInfo.group} />
                  <InfoItem label="Date of Birth" value={result.studentInfo.dob} />
                  <div className="col-span-full">
                    <InfoItem label="Institute" value={result.studentInfo.institute} />
                  </div>
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold text-lg mb-2 text-center">Subject-wise Grade</h3>
              <Table>
                  <TableHeader>
                  <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Subject Name</TableHead>
                      {showMarks && <TableHead className="text-right">Marks</TableHead>}
                      <TableHead className="text-right">Letter Grade</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {result.grades.map((g, index) => (
                      <TableRow key={g.code + index} className={cn(index % 2 !== 0 && 'bg-muted/50')}>
                      <TableCell>{g.code}</TableCell>
                      <TableCell className="font-medium">{g.subject}</TableCell>
                      {showMarks && <TableCell className="text-right font-bold">{g.marks}</TableCell>}
                      <TableCell className="text-right font-bold">{g.grade}</TableCell>
                      </TableRow>
                  ))}
                  </TableBody>
              </Table>
              </CardContent>
            
            <Separator className="my-6" />
            
            <div className="px-6 pb-6">
                 <FooterContent />
            </div>
        </Card>
      </div>
      
      {!isDialog && (
         <CardFooter className="flex justify-end gap-2 no-print">
            {onReset && (
                <Button variant="outline" onClick={onReset} disabled={isPrinting}>
                    <Search className="mr-2 h-4 w-4" />
                    অন্য ফলাফল খুঁজুন
                </Button>
            )}
            <Button onClick={handlePrint} disabled={isPrinting}>
               {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                প্রিন্ট করুন
            </Button>
        </CardFooter>
      )}

    </div>
  );
}
