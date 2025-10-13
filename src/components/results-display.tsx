
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Download, BarChart, ArrowUp, ArrowDown, Star, Sparkles, Share2 } from 'lucide-react';
import type { ExamResult, GradeInfo } from '@/types';
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

const FooterContent = () => (
    <div className="text-center">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
                <p className="text-md font-medium text-foreground">A Project by BD Edu Result</p>
                <p className="text-sm text-muted-foreground">All rights reserved.</p>
            </div>
            <div className="flex flex-col items-center gap-2 mt-2">
                <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer">
                    <Image 
                        src="/logo.png"
                        alt="BD Edu Result Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                    />
                </Link>
                <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    bdedu.me
                </Link>
            </div>
        </div>
    </div>
);

const MarksheetAnalyzer = ({ grades }: { grades: GradeInfo[] }) => {
    if (grades.length === 0) return null;

    const gradeOrder = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];
    
    const sortedGrades = [...grades].sort((a, b) => {
        const indexA = gradeOrder.indexOf(a.grade);
        const indexB = gradeOrder.indexOf(b.grade);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const highestGrade = sortedGrades[0];
    const lowestGrade = sortedGrades[sortedGrades.length - 1];

    const gradeCounts = grades.reduce((acc, g) => {
        acc[g.grade] = (acc[g.grade] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-6 w-6" />
                    ফলাফল বিশ্লেষণ
                </CardTitle>
                <CardDescription>আপনার ফলাফলের একটি সংক্ষিপ্ত বিবরণ।</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-start p-4 bg-muted/50 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-4">
                           <Star className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">সেরা পারফরম্যান্স</p>
                            <p className="font-bold text-lg">{highestGrade.subject}</p>
                            <p className="font-semibold text-green-600 dark:text-green-300">গ্রেড: {highestGrade.grade}</p>
                        </div>
                    </div>
                    <div className="flex items-start p-4 bg-muted/50 rounded-lg">
                         <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full mr-4">
                           <ArrowDown className="h-6 w-6 text-red-600 dark:text-red-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">উন্নতির সুযোগ</p>
                            <p className="font-bold text-lg">{lowestGrade.subject}</p>
                             <p className="font-semibold text-red-600 dark:text-red-300">গ্রেড: {lowestGrade.grade}</p>
                        </div>
                    </div>
                     <div className="flex items-start p-4 bg-muted/50 rounded-lg md:col-span-1">
                         <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
                           <ArrowUp className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">সর্বোচ্চ গ্রেড (A+)</p>
                            <p className="font-bold text-lg">
                                {gradeCounts['A+'] || 0} টি বিষয়ে
                            </p>
                             <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">অসাধারণ ফলাফল!</p>
                        </div>
                    </div>
                </div>

                <h4 className="font-semibold mb-2 text-center">গ্রেড বিতরণ</h4>
                 <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {gradeOrder.map(g => <TableHead key={g} className="text-center">{g}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                {gradeOrder.map(g => (
                                    <TableCell key={g} className="text-center font-bold text-lg">
                                        {gradeCounts[g] || 0}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

const GradesTable = ({ grades, showMarks }: { grades: GradeInfo[], showMarks: boolean }) => {
    return (
        <div className="relative w-full overflow-auto">
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
                    {grades.map((g, index) => (
                        <TableRow key={g.code + index} className={cn(index % 2 !== 0 && 'bg-muted/50')}>
                            <TableCell>{g.code}</TableCell>
                            <TableCell className="font-medium">{g.subject}</TableCell>
                            {showMarks && <TableCell className="text-right font-bold">{g.marks}</TableCell>}
                            <TableCell className="text-right font-bold">{g.grade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};


export default function ResultsDisplay({ result, onReset, isDialog = false }: ResultsDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  
  const handleDownload = async () => {
    setIsDownloading(true);
    const element = document.getElementById('printable-area');
    if (!element) {
        setIsDownloading(false);
        return;
    }

    try {
        const canvas = await html2canvas(element, { 
            scale: 2, // Higher scale for better quality
            useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        
        const ratio = imgWidth / imgHeight;
        let newImgWidth = pdfWidth;
        let newImgHeight = newImgWidth / ratio;

        if (newImgHeight > pdfHeight) {
            newImgHeight = pdfHeight;
            newImgWidth = newImgHeight * ratio;
        }
        
        const x = (pdfWidth - newImgWidth) / 2;
        const y = (pdfHeight - newImgHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
        pdf.save(`BD-Edu-Result-${result.roll}-${result.year}.pdf`);

    } catch (error) {
        console.error("Could not generate PDF", error);
    } finally {
        setIsDownloading(false);
    }
  }

  const handleShare = async () => {
      setIsSharing(true);
      const element = document.getElementById('share-card');
      if (!element) {
          setIsSharing(false);
          return;
      }

      try {
          const canvas = await html2canvas(element, { 
              scale: 2, 
              useCORS: true,
              backgroundColor: null,
          });

          const link = document.createElement('a');
          link.download = `BD_Edu_Result_${result.roll}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();

      } catch (error) {
          console.error("Could not generate share image", error);
      } finally {
          setIsSharing(false);
      }
  };


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
  
  const half = Math.ceil(result.grades.length / 2);
  const firstHalfGrades = result.grades.slice(0, half);
  const secondHalfGrades = result.grades.slice(half);

  return (
    <div className={containerClasses}>
       {/* Hidden card for sharing */}
        <div id="share-card" className="fixed top-0 left-[200vw] w-[600px] h-[315px] bg-gradient-to-br from-primary via-green-500 to-accent p-8 text-white font-sans flex flex-col justify-between">
             <div>
                 <div className="flex items-center gap-3">
                     <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 w-12 rounded-full border-2 border-white/50" />
                    <p className="text-2xl font-bold tracking-wider">BD Edu Result</p>
                </div>
                 <p className="mt-4 text-lg opacity-90">Congratulations, {result.studentInfo.name}!</p>
            </div>

            <div className="text-center">
                <p className="text-3xl font-bold leading-tight">
                    Passed the <span className="uppercase">{result.exam}</span> - {result.year} exam
                </p>
                {isPass && gpa && <p className="text-5xl font-extrabold mt-2 text-white/90 drop-shadow-lg">GPA: {gpa} 🎉</p>}
            </div>

             <p className="text-sm text-right opacity-80 font-medium">Check your result at bdedu.me</p>
        </div>

       <div className={cn("flex flex-wrap justify-end gap-2", !isDialog && "no-print")}>
          {!isDialog && onReset && (
              <Button variant="outline" onClick={onReset} disabled={isDownloading || isSharing}>
                  <Search className="mr-2 h-4 w-4" />
                  অন্য ফলাফল খুঁজুন
              </Button>
          )}

           <Button onClick={handleShare} disabled={isSharing || isDownloading}>
                {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                শেয়ার কার্ড
           </Button>

          <Button onClick={handleDownload} disabled={isDownloading || isSharing}>
              {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              ডাউনলোড করুন
          </Button>
      </div>

      <div id="pdf-container">
        <Card className={cardClasses} id="printable-area">
              <CardHeader>
                   <div className="relative text-center">
                      <div className="flex justify-center">
                          <Image 
                              src="/logo.png" 
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
              <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <InfoItem label="Roll No" value={result.roll} />
                  <InfoItem label="Registration No" value={result.reg} />
                  <InfoItem label="Board" value={result.board} />
                  <InfoItem label="Name" value={result.studentInfo.name} />
                  <InfoItem label="Father's Name" value={result.studentInfo.fatherName} />
                  <InfoItem label="Mother's Name" value={result.studentInfo.motherName} />
                  <InfoItem label="Group" value={result.studentInfo.group} />
                  <InfoItem label="Date of Birth" value={result.studentInfo.dob} />
                  <InfoItem label="Session" value={result.studentInfo.session} />
                  <div className="col-span-full md:col-span-3">
                    <InfoItem label="Institute" value={result.studentInfo.institute} />
                  </div>
              </div>

              <Separator className="my-6" />

              <h3 className="font-semibold text-lg mb-2 text-center">বিষয়ভিত্তিক গ্রেড</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <GradesTable grades={firstHalfGrades} showMarks={showMarks} />
                  <GradesTable grades={secondHalfGrades} showMarks={showMarks} />
                </div>
              </CardContent>
            
            <Separator className="my-6" />
            
            <div className="px-6 pb-6">
                 <FooterContent />
            </div>
        </Card>

        {!isDialog && isPass && (
            <>
                <Card className="mt-8 no-print">
                    <CardHeader>
                        <CardTitle>পরবর্তী ধাপ</CardTitle>
                        <CardDescription>আপনার ফলাফলের উপর ভিত্তি করে ভর্তির জন্য সেরা প্রতিষ্ঠানগুলো সম্পর্কে জানুন।</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/suggestions?gpa=${gpa}`}>
                            <Button className="w-full" size="lg">
                                <Sparkles className="mr-2 h-4 w-4" />
                                ভর্তি পরামর্শ দেখুন
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
                <MarksheetAnalyzer grades={result.grades} />
            </>
        )}
      </div>
      
      {!isDialog && (
         <CardFooter className="flex justify-end gap-2 no-print">
            {onReset && (
                <Button variant="outline" onClick={onReset} disabled={isDownloading || isSharing}>
                    <Search className="mr-2 h-4 w-4" />
                    অন্য ফলাফল খুঁজুন
                </Button>
            )}
             <Button onClick={handleShare} disabled={isSharing || isDownloading}>
                {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                শেয়ার কার্ড
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading || isSharing}>
               {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                ডাউনলোড করুন
            </Button>
        </CardFooter>
      )}

    </div>
  );
}
