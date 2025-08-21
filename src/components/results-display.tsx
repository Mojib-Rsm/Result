
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Loader2, Search, FileDown } from 'lucide-react';
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

const FooterContent = () => (
    <div className="text-center">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
                <p className="text-md font-medium text-foreground">Developed & Maintained by: Mojib Rsm</p>
                <p className="text-sm text-muted-foreground">For any query: mojibrsm@gmail.com</p>
            </div>
            <div className="flex flex-col items-center gap-2 mt-2">
                <Link href="https://www.bartanow.com" target="_blank" rel="noopener noreferrer">
                    <Image 
                        src="https://www.oftern.com/uploads/logo/favicon_67c1bdb47ee422-18965133.png"
                        alt="Bartanow Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                    />
                </Link>
                <Link href="https://www.bartanow.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    www.bartanow.com
                </Link>
            </div>
        </div>
    </div>
);


export default function ResultsDisplay({ result, onReset, isDialog = false }: ResultsDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(element, {
            scale: 3, // Increased scale for better resolution
            useCORS: true,
            logging: false,
            onclone: (document) => {
              // Remove shadows from the cloned document to improve PDF clarity
              const clonedElement = document.getElementById('printable-area');
              if(clonedElement) {
                clonedElement.style.boxShadow = 'none';
                clonedElement.style.border = 'none';
              }
            }
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
        
        const fileName = `${result.studentInfo?.name?.replace(/\s+/g, '_') || 'result'}-${result.roll || ''}-oftern.com.pdf`;
        pdf.save(fileName);
    } catch(error) {
        console.error("Error generating PDF:", error);
    } finally {
        setIsDownloading(false);
    }
  };

  const gpa = result.gpa?.toFixed(2);
  const isPass = result.status === 'Pass';
  const gpaGrade = getGpaGrade(result.gpa);
  const showMarks = result.year === '2025' && result.grades.some(g => g.marks);
  
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

  const isIndividualResult = !result.rawHtml;

  const downloadUrl = result.pdfName ? `https://www.eboardresults.com/v2/pdl` : '#';

  return (
    <div className={containerClasses}>
       <div className={cn("flex justify-end gap-2", !isDialog && "no-print")}>
          {!isDialog && onReset && (
              <Button variant="outline" onClick={onReset} disabled={isDownloading} size={isIndividualResult ? "icon" : "default"}>
                  <Search className={cn(isIndividualResult ? "h-4 w-4" : "mr-2 h-4 w-4")} />
                  {isIndividualResult ? <span className="sr-only">আবার খুঁজুন</span> : 'অন্য ফলাফল খুঁজুন'}
              </Button>
          )}

          {isIndividualResult ? (
            <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                ডাউনলোড পিডিএফ
            </Button>
          ) : (
            <Button asChild>
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download>
                    <FileDown className="mr-2 h-4 w-4" />
                    সম্পূর্ণ ফলাফল ডাউনলোড করুন
                </a>
            </Button>
          )}

      </div>

      <div id="pdf-container">
        <Card className={cardClasses} id="printable-area">
          {isIndividualResult ? (
            <>
              <CardHeader>
                   <div className="relative text-center">
                      <div className="flex justify-center">
                          <Image 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png" 
                              alt="Government Seal of Bangladesh"
                              width={60}
                              height={60}
                              className="h-16 w-16 mb-2"
                          />
                      </div>
                       <CardTitle className="text-2xl text-primary">Result Marksheet</CardTitle>

                      <div className="absolute top-0 right-0 text-right font-bold text-xl min-w-[120px]">
                          <p className={isPass ? 'text-green-600' : 'text-destructive'}>Status: {result.status}</p>
                          {isPass && <p>GPA: {gpa}</p>}
                          {isPass && <p>Grade: {gpaGrade}</p>}
                      </div>
                  </div>
                   <CardDescription className="text-center">{result.exam.toUpperCase()} Examination - {result.year}</CardDescription>
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
                      {showMarks && <TableHead className="text-right">Marks</TableHead>}
                      <TableHead className="text-right">Letter Grade</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {result.grades.map((g, index) => (
                      <TableRow key={g.code} className={cn(index % 2 !== 0 && 'bg-muted/50')}>
                      <TableCell>{g.code}</TableCell>
                      <TableCell className="font-medium">{g.subject}</TableCell>
                      {showMarks && <TableCell className="text-right font-bold">{g.marks}</TableCell>}
                      <TableCell className="text-right font-bold">{g.grade}</TableCell>
                      </TableRow>
                  ))}
                  </TableBody>
              </Table>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-6">
               <div dangerouslySetInnerHTML={{ __html: result.rawHtml || '' }} />
            </CardContent>
          )}

            <Separator className="my-6" />
            
            <div className="px-6 pb-6">
                 <FooterContent />
            </div>
        </Card>
      </div>
      
      {!isDialog && isIndividualResult && (
         <CardFooter className="flex justify-end gap-2 no-print">
            {onReset && (
                <Button variant="outline" onClick={onReset} disabled={isDownloading}>
                    <Search className="mr-2 h-4 w-4" />
                    অন্য ফলাফল খুঁজুন
                </Button>
            )}
            <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                ডাউনলোড পিডিএফ
            </Button>
        </CardFooter>
      )}

    </div>
  );
}
