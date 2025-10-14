
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Building, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchInstituteResult } from '@/lib/actions';
import type { InstituteResult } from '@/types';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const instituteFormSchema = z.object({
  eiin: z.string().length(6, 'EIIN অবশ্যই ৬ সংখ্যার হতে হবে।'),
  exam: z.string().min(1, 'পরীক্ষা নির্বাচন আবশ্যক।'),
  year: z.string().min(1, 'বছর নির্বাচন আবশ্যক।'),
  board: z.string().min(1, 'বোর্ড নির্বাচন আবশ্যক।'),
  captcha: z.string().min(1, 'ক্যাপচা আবশ্যক।'),
});

const exams = [
    { value: 'jsc', label: 'JSC/JDC' },
    { value: 'ssc', label: 'SSC/Dakhil' },
    { value: 'hsc', label: 'HSC/Alim' },
];

const boards = [
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'barisal', label: 'Barisal' },
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'comilla', label: 'Comilla' },
    { value: 'dinajpur', label: 'Dinajpur' },
    { value: 'jessore', label: 'Jessore' },
    { value: 'mymensingh', label: 'Mymensingh' },
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'sylhet', label: 'Sylhet' },
    { value: 'madrasah', label: 'Madrasah' },
    { value: 'tec', label: 'Technical' },
    { value: 'dibs', label: 'DIBS(Dhaka)' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1995 }, (_, i) => currentYear - i).map(String);

export default function InstituteResultPage() {
  const [result, setResult] = useState<InstituteResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [captchaCookie, setCaptchaCookie] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof instituteFormSchema>>({
    resolver: zodResolver(instituteFormSchema),
    defaultValues: {
      eiin: '',
      exam: 'hsc',
      year: '2025',
      board: '',
      captcha: '',
    },
  });

  const refreshCaptcha = useCallback(async () => {
    form.setValue('captcha', '');
    try {
        const res = await fetch('/api/captcha');
        const data = await res.json();
        setCaptchaUrl(data.img);
        setCaptchaCookie(data.cookie);
    } catch(e) {
        console.error("Failed to refresh captcha", e);
        toast({
            title: "ত্রুটি",
            description: "ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।",
            variant: "destructive"
        });
    }
  }, [form, toast]);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);


  const onSubmit = async (values: z.infer<typeof instituteFormSchema>) => {
    setIsSubmitting(true);
    setResult(null);

    const valuesWithCookie = { ...values, cookie: captchaCookie };

    try {
      const searchResult = await searchInstituteResult(valuesWithCookie);
      
      if ('error' in searchResult) {
          throw new Error(searchResult.error);
      }

      setResult(searchResult);
    } catch (e: any) {
       toast({
        title: "ত্রুটি",
        description: e.message,
        variant: "destructive"
       });
       refreshCaptcha();
    } finally {
        setIsSubmitting(false);
    }
  };
  
   const resetSearch = () => {
    setResult(null);
    form.reset();
    refreshCaptcha();
  };


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center mb-12">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Building className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                প্রতিষ্ঠানের ফলাফল
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                আপনার শিক্ষা প্রতিষ্ঠানের EIIN ব্যবহার করে সম্পূর্ণ ফলাফল দেখুন।
            </p>
        </div>

        {!result ? (
            <Card className="p-4 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="exam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>পরীক্ষা</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="পরীক্ষা নির্বাচন করুন" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {exams.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>বছর</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="বছর নির্বাচন করুন" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="board"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>বোর্ড</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="বোর্ড নির্বাচন করুন" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {boards.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                     <FormField
                        control={form.control}
                        name="eiin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EIIN নম্বর</FormLabel>
                            <FormControl>
                                <Input placeholder="আপনার প্রতিষ্ঠানের ৬ সংখ্যার EIIN দিন" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    <div className="space-y-2 rounded-md border p-4 bg-muted/50">
                        <FormLabel>রোবট নন তা প্রমাণ করুন</FormLabel>
                        <div className="flex flex-wrap items-end gap-2">
                            <div className="flex items-center gap-2">
                                <div className="relative w-24 h-9 flex-shrink-0">
                                    {captchaUrl && <Image src={captchaUrl} alt="ক্যাপচা" layout="fill" objectFit="contain" unoptimized />}
                                </div>
                                <Button type="button" variant="outline" size="icon" onClick={refreshCaptcha} className="h-9 w-9 flex-shrink-0">
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="sr-only">অন্য ছবি</span>
                                </Button>
                            </div>
                            <FormField
                                control={form.control}
                                name="captcha"
                                render={({ field }) => (
                                    <FormItem className="flex-grow min-w-[200px]">
                                        <FormControl>
                                            <Input 
                                                placeholder="ছবিতে দেখানো সংখ্যাগুলো লিখুন" 
                                                {...field}
                                                autoComplete="off"
                                                className="h-9 py-1"
                                                value={field.value || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        field.onChange(value);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        ফলাফল খুঁজুন
                      </Button>
                    </div>
                  </form>
                </Form>
            </Card>
        ) : (
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{result.instituteName}</CardTitle>
                            <CardDescription>EIIN: {result.eiin} | {result.exam.toUpperCase()} - {result.year}</CardDescription>
                        </div>
                         <Button variant="outline" onClick={resetSearch}>
                             <Search className="mr-2 h-4 w-4" />
                            আবার খুঁজুন
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Separator className="mb-4" />
                     <p className="text-center text-muted-foreground mb-4">মোট {result.results.length} জন শিক্ষার্থীর ফলাফল পাওয়া গেছে।</p>
                    <div className="max-h-[60vh] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background">
                                <TableRow>
                                    <TableHead>রোল</TableHead>
                                    <TableHead>রেজি.</TableHead>
                                    <TableHead className="text-right">GPA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.results.map((student, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{student.roll}</TableCell>
                                        <TableCell>{student.reg}</TableCell>
                                        <TableCell className="text-right font-bold">{student.gpa}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
