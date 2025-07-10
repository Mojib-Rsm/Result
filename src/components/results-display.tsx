
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Loader2, RotateCcw } from 'lucide-react';
import type { ExamResult } from '@/types';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;
    setIsDownloading(true);

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.width = '800px'; 
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    try {
        const canvas = await html2canvas(clonedElement, {
            scale: 2,
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let newImgWidth = pdfWidth - 20; // with margin
        let newImgHeight = newImgWidth / ratio;
        
        if (newImgHeight > pdfHeight - 20) {
            newImgHeight = pdfHeight - 20;
            newImgWidth = newImgHeight * ratio;
        }

        const x = (pdfWidth - newImgWidth) / 2;
        const y = 10; // top margin
        
        pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
        
        const fileName = `${result.studentInfo.name.replace(/\s+/g, '_')}-${result.roll}-Mojib_Rsm.pdf`;
        pdf.save(fileName);
    } catch(error) {
        console.error("Error generating PDF:", error);
    } finally {
        document.body.removeChild(tempContainer);
        setIsDownloading(false);
    }
  };

  const gpa = result.gpa.toFixed(2);
  const isPass = result.status === 'Pass';
  const gpaGrade = getGpaGrade(result.gpa);
  
  const InfoItem = ({ label, value }: { label: string, value: string | undefined}) => (
    <div className="flex flex-col p-2 bg-muted/30 rounded-md">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-semibold text-sm capitalize">{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div id="pdf-container">
        <Card className="shadow-lg" id="printable-area">
            <CardHeader>
                <div className="relative">
                    <div className="text-center">
                        <div className="inline-block">
                            <Image 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png" 
                                alt="Government Seal of Bangladesh"
                                width={60}
                                height={60}
                                className="h-16 w-16 mb-2 mx-auto"
                            />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 text-right font-bold text-xl min-w-[120px]">
                        <p className={isPass ? 'text-green-600' : 'text-destructive'}>Status: {result.status}</p>
                        {isPass && <p>GPA: {gpa}</p>}
                        {isPass && <p>Grade: {gpaGrade}</p>}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <CardTitle className="text-2xl text-primary">Result Marksheet</CardTitle>
                    <CardDescription>{result.exam.toUpperCase()} Examination - {result.year}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <InfoItem label="Roll No" value={result.roll} />
                <InfoItem label="Reg No" value={result.reg} />
                <InfoItem label="Board" value={result.board} />
                <InfoItem label="Name" value={result.studentInfo.name} />
                <InfoItem label="Father's Name" value={result.studentInfo.fatherName} />
                <InfoItem label="Mother's Name" value={result.studentInfo.motherName} />
                <InfoItem label="Group" value={result.studentInfo.group} />
                <InfoItem label="Date of Birth" value={result.studentInfo.dob} />
                <InfoItem label="Session" value={result.studentInfo.session} />
                <div className="col-span-2 md:col-span-3">
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
                <p>Thanks to Mojib Rsm</p>
                <Link href="https://www.bartanow.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    www.bartanow.com
                </Link>
            </div>
        </Card>
      </div>

      <CardFooter className="flex justify-end gap-2 no-print">
          {!isDialog && onReset && (
              <Button variant="outline" onClick={onReset} disabled={isDownloading}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Check Another
              </Button>
          )}
          <Button onClick={handleDownloadPdf} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download PDF
          </Button>
      </CardFooter>
    </div>
  );
}
