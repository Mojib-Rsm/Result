
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { formSchema } from '@/lib/schema';

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


const exams = [
    { value: 'jsc', label: 'JSC/JDC' },
    { value: 'ssc', label: 'SSC/Dakhil' },
    { value: 'hsc', label: 'HSC/Alim' },
    { value: 'ssc_voc', label: 'SSC(Vocational)' },
    { value: 'hsc_voc', label: 'HSC(Vocational)' },
    { value: 'hsc_bm', label: 'HSC(BM)' },
    { value: 'dibs', label: 'Diploma in Business Studies' },
];


interface ExamFormProps {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
  captchaUrl: string;
  onCaptchaRefresh: () => void;
  selectedExam: string;
}

export function ExamForm({ form, onSubmit, isSubmitting, captchaUrl, onCaptchaRefresh, selectedExam }: ExamFormProps) {
  const showBoardField = selectedExam !== 'hsc_bm' && selectedExam !== 'hsc_voc';
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="exam-form-component">
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
           {showBoardField && (
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
           )}
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roll"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>রোল নম্বর</FormLabel>
                  <FormControl>
                      <Input 
                          placeholder="যেমন: 123456" 
                          {...field} 
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
            <FormField
              control={form.control}
              name="reg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>রেজিস্ট্রেশন নম্বর</FormLabel>
                  <FormControl>
                      <Input 
                          placeholder="যেমন: 1234567890" 
                          {...field} 
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

        <div className="space-y-2 rounded-md border p-4 bg-muted/50">
            <FormLabel>রোবট নন তা প্রমাণ করুন</FormLabel>
            <div className="flex flex-wrap items-end gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative w-24 h-9 flex-shrink-0">
                        {captchaUrl && <Image src={captchaUrl} alt="ক্যাপচা" layout="fill" objectFit="contain" unoptimized />}
                    </div>
                    <Button type="button" variant="outline" size="icon" onClick={onCaptchaRefresh} className="h-9 w-9 flex-shrink-0">
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
            ফলাফল দেখুন
          </Button>
        </div>
      </form>
    </Form>
  );
}
