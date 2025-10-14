
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchInstituteResult } from '@/lib/actions';
import type { InstituteResult } from '@/types';
import { Separator } from '@/components/ui/separator';

const instituteFormSchema = z.object({
  eiin: z.string().length(6, 'EIIN অবশ্যই ৬ সংখ্যার হতে হবে।'),
  exam: z.string().min(1, 'পরীক্ষা নির্বাচন আবশ্যক।'),
  year: z.string().min(1, 'বছর নির্বাচন আবশ্যক।'),
  board: z.string().min(1, 'বোর্ড নির্বাচন আবশ্যক।'),
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
  const { toast } = useToast();

  const form = useForm<z.infer<typeof instituteFormSchema>>({
    resolver: zodResolver(instituteFormSchema),
    defaultValues: {
      eiin: '',
      exam: '',
      year: '',
      board: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof instituteFormSchema>) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const searchResult = await searchInstituteResult(values);
      
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
    } finally {
        setIsSubmitting(false);
    }
  };
  
   const resetSearch = () => {
    setResult(null);
    form.reset();
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
