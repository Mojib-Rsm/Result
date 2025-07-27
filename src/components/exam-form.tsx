
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export const formSchema = z.object({
  roll: z.string().min(6, 'রোল নম্বর কমপক্ষে ৬ সংখ্যার হতে হবে।').regex(/^\d+$/, 'রোল নম্বর অবশ্যই একটি সংখ্যা হতে হবে।'),
  reg: z.string().min(1, 'রেজিস্ট্রেশন নম্বর আবশ্যক।').regex(/^\d+$/, 'রেজিস্ট্রেশন নম্বর অবশ্যই একটি সংখ্যা হতে হবে।'),
  board: z.string(),
  year: z.string(),
  exam: z.string(),
  captcha: z.string().min(1, 'সিক্রেট কোড আবশ্যক।'),
});

const boards = [
    { value: 'barisal', label: 'বরিশাল' },
    { value: 'chittagong', label: 'চট্টগ্রাম' },
    { value: 'comilla', label: 'কুমিল্লা' },
    { value: 'dhaka', label: 'ঢাকা' },
    { value: 'dinajpur', label: 'দিনাজপুর' },
    { value: 'jessore', label: 'যশোর' },
    { value: 'mymensingh', label: 'ময়মনসিংহ' },
    { value: 'rajshahi', label: 'রাজশাহী' },
    { value: 'sylhet', label: 'সিলেট' },
    { value: 'madrasah', label: 'মাদ্রাসা' },
    { value: 'tec', label: 'কারিগরি' },
    { value: 'dibs', label: 'ডিপ্লোমা ইন বিজনেস স্টাডিজ (DIBS)' },
];

const maxYear = 2025;
const years = Array.from({ length: maxYear - 1996 + 1 }, (_, i) => maxYear - i).map(String);


const exams = [
    { value: 'ssc', label: 'এসএসসি/দাখিল' },
    { value: 'hsc', label: 'এইচএসসি/আলিম/সমমান' },
    { value: 'jsc', label: 'জেএসসি/জেডিসি' },
    { value: 'ssc_voc', label: 'এসএসসি (ভোকেশনাল)'},
    { value: 'hsc_voc', label: 'এইচএসসি (ভোকেশনাল)'},
    { value: 'hsc_hbm', label: 'এইচএসসি (বিএম)'},
    { value: 'hsc_dic', label: 'ডিপ্লোমা ইন কমার্স'},
    { value: 'hsc_dba', label: 'ডিপ্লোমা ইন বিজনেস স্টাডিজ'},
];

interface ExamFormProps {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
  isRegRequired: boolean;
  isCaptchaRequired: boolean;
  captchaImage?: string;
  isFetchingCaptcha: boolean;
  onRefreshCaptcha: () => void;
}

export function ExamForm({ form, onSubmit, isSubmitting, isRegRequired, isCaptchaRequired, captchaImage, isFetchingCaptcha, onRefreshCaptcha }: ExamFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>পরীক্ষা</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
           <FormField
            control={form.control}
            name="roll"
            render={({ field }) => (
              <FormItem>
                <FormLabel>রোল নম্বর</FormLabel>
                <FormControl><Input placeholder="যেমন: 123456" {...field} /></FormControl>
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
                  <FormLabel>রেজিস্ট্রেশন নম্বর</FormLabel>
                  <FormControl><Input placeholder="যেমন: 1234567890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isCaptchaRequired && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  {isFetchingCaptcha ? (
                     <Skeleton className="h-[50px] w-[180px] rounded-md" />
                  ) : captchaImage ? (
                    <Image
                      src={captchaImage}
                      alt="সিক্রেট কোড"
                      width={180}
                      height={50}
                      className="rounded-md border p-1 bg-white"
                      unoptimized
                    />
                  ) : <div className="h-[50px] w-[180px] border rounded-md flex items-center justify-center bg-muted text-muted-foreground text-xs">কোড লোড হচ্ছে...</div>}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRefreshCaptcha}
                    disabled={isFetchingCaptcha || isSubmitting}
                    aria-label="রিফ্রেশ সিক্রেট কোড"
                  >
                    <RefreshCw className={`h-5 w-5 ${isFetchingCaptcha ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                 <FormDescription>
                    ছবিতে দেখানো সংখ্যাগুলো লিখুন
                </FormDescription>
              </div>

               <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                     <FormLabel>সিক্রেট কোড</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="সিক্রেট কোড লিখুন"
                        {...field}
                        disabled={isFetchingCaptcha || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting || isFetchingCaptcha} className="w-full md:w-auto">
            {(isSubmitting || isFetchingCaptcha) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ফলাফল দেখুন
          </Button>
        </div>
      </form>
    </Form>
  );
}
