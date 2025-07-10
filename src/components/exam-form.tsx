'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export const formSchema = z.object({
  roll: z.string().min(6, 'Roll number must be at least 6 digits.').regex(/^\d+$/, 'Roll must be a number.'),
  reg: z.string().min(1, 'Registration number is required.').regex(/^\d+$/, 'Registration must be a number.'),
  board: z.string(),
  year: z.string(),
  exam: z.string(),
  captcha: z.string().min(1, 'Please enter the security key.'),
});

export const formSchemaWithoutReg = formSchema.omit({ reg: true });

const boards = [
    { value: 'barisal', label: 'Barisal' },
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'comilla', label: 'Comilla' },
    { value: 'dhaka', label: 'Dhaka' },
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
const years = Array.from({ length: 30 }, (_, i) => currentYear + 5 - i).map(String);
const exams = [
    { value: 'ssc', label: 'SSC/Dakhil' },
    { value: 'hsc', label: 'HSC/Alim/Equivalent' },
    { value: 'jsc', label: 'JSC/JDC' },
    { value: 'ssc_voc', label: 'SSC(Vocational)'},
    { value: 'hsc_voc', label: 'HSC(Vocational)'},
    { value: 'hsc_hbm', label: 'HSC(BM)'},
    { value: 'hsc_dic', label: 'Diploma in Commerce'},
    { value: 'hsc_dba', label: 'Diploma in Business Studies'},
];

interface ExamFormProps {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
  captchaImage?: string;
  isFetchingCaptcha: boolean;
  onReloadCaptcha: () => void;
  isRegRequired: boolean;
}

export function ExamForm({ form, onSubmit, isSubmitting, captchaImage, isFetchingCaptcha, onReloadCaptcha, isRegRequired }: ExamFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examination</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select Exam" /></SelectTrigger>
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
                <FormLabel>Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
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
                <FormLabel>Board</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {boards.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="roll"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl><Input placeholder="e.g., 123456" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isRegRequired && (
            <FormField
              control={form.control}
              name="reg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration No.</FormLabel>
                  <FormControl><Input placeholder="e.g., 1234567890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        
            <div className="flex flex-col gap-2">
                 <FormLabel>Security Key</FormLabel>
                <div className="flex items-center gap-4">
                    <div className='relative h-12 w-48 bg-gray-200 rounded-md'>
                    {isFetchingCaptcha ? (
                        <Skeleton className="h-full w-full" />
                    ) : (
                        captchaImage && <Image src={captchaImage} alt="Captcha" layout="fill" objectFit="contain" />
                    )}
                    </div>
                     <Button type="button" variant="secondary" size="icon" onClick={onReloadCaptcha} disabled={isFetchingCaptcha}>
                        <RefreshCw className={`h-4 w-4 ${isFetchingCaptcha ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>
             <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="sr-only">Type the digits visible on the image</FormLabel>
                    <FormControl><Input placeholder="Type the security key here" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Result
          </Button>
        </div>
      </form>
    </Form>
  );
}
