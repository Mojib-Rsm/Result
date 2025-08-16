
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCaptchaAction } from '@/lib/actions';
import Image from 'next/image';

export const formSchema = z.object({
  exam: z.string().min(1, 'পরীক্ষা নির্বাচন আবশ্যক।'),
  year: z.string().min(1, 'বছর নির্বাচন আবশ্যক।'),
  board: z.string().min(1, 'বোর্ড নির্বাচন আবশ্যক।'),
  roll: z.string().optional(),
  reg: z.string().optional(),
  result_type: z.string().min(1, 'ফলাফলের ধরন আবশ্যক।'),
  eiin: z.string().optional(),
  dcode: z.string().optional(),
  ccode: z.string().optional(),
  captcha: z.string().min(1, 'ক্যাপচা আবশ্যক।'),
}).refine((data) => {
    if ((data.result_type === '1' || data.result_type === '7') && (!data.roll || !data.reg)) {
        return false;
    }
    return true;
}, {
    message: 'রোল এবং রেজিস্ট্রেশন নম্বর আবশ্যক।',
    path: ['roll'],
}).refine((data) => {
    if ((data.result_type === '1' || data.result_type === '7') && (!data.roll || !data.reg)) {
        return false;
    }
    return true;
}, {
    message: 'রোল এবং রেজিস্ট্রেশন নম্বর আবশ্যক।',
    path: ['reg'],
}).refine((data) => {
    if ((data.result_type === '2' || data.result_type === '6') && !data.eiin) {
        return false;
    }
    return true;
}, {
    message: 'EIIN নম্বর আবশ্যক।',
    path: ['eiin'],
})
.refine(data => {
    if (data.result_type === '4' && !data.dcode) {
        return false;
    }
    return true;
}, {
    message: 'জেলার নাম আবশ্যক।',
    path: ['dcode']
})
.refine(data => {
    if (data.result_type === '4' && !data.ccode) {
        return false;
    }
    return true;
}, {
    message: 'কেন্দ্রের নাম আবশ্যক।',
    path: ['ccode']
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1996 + 1 }, (_, i) => currentYear - i).map(String);


const exams = [
    { value: 'ssc', label: 'এসএসসি/দাখিল/সমমান' },
    { value: 'hsc', label: 'এইচএসসি/আলিম/সমমান' },
    { value: 'jsc', label: 'জেএসসি/জেডিসি' },
    { value: 'ssc_voc', label: 'এসএসসি (ভোকেশনাল)'},
    { value: 'hsc_voc', label: 'এইচএসসি (ভোকেশনাল)'},
    { value: 'hsc_hbm', label: 'এইচএসসি (বিএম)'},
    { value: 'hsc_dic', label: 'ডিপ্লোমা ইন কমার্স'},
    { value: 'hsc_dba', label: 'ডিপ্লোমা ইন বিজনেস স্টাডিজ'},
];

const resultTypes = [
    { value: '1', label: 'ব্যক্তিগত / বিস্তারিত ফলাফল' },
    { value: '2', label: 'প্রতিষ্ঠানের ফলাফল' },
    { value: '3', label: 'কেন্দ্রের ফলাফল' },
    { value: '4', label: 'জেলা ভিত্তিক ফলাফল' },
    { value: '5', label: 'প্রতিষ্ঠান বিশ্লেষণ' },
    { value: '6', label: 'বোর্ড বিশ্লেষণ' },
    { value: '7', label: 'ব্যক্তিগত / বিস্তারিত পুনঃনিরীক্ষণ ফলাফল' },
];


interface ExamFormProps {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
}

export function ExamForm({ form, onSubmit, isSubmitting }: ExamFormProps) {
  const resultType = form.watch('result_type');
  const isRollRegRequired = resultType === '1' || resultType === '7';
  const isEiinRequired = resultType === '2' || resultType === '6';
  const isDistrictRequired = resultType === '4' || resultType === '5';
  const isCenterRequired = resultType === '4';

  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  const refreshCaptcha = async () => {
      setIsCaptchaLoading(true);
      try {
          const image = await getCaptchaAction();
          setCaptchaImage(image);
      } catch (error) {
          console.error(error);
          setCaptchaImage(null);
      } finally {
          setIsCaptchaLoading(false);
      }
  };

  useEffect(() => {
      refreshCaptcha();
  }, []);

  useEffect(() => {
    const handleRefreshCaptcha = () => refreshCaptcha();
    const formComponent = document.getElementById('exam-form-component');
    
    if (formComponent) {
      formComponent.addEventListener('refreshcaptcha', handleRefreshCaptcha);
    }
    
    return () => {
      if (formComponent) {
        formComponent.removeEventListener('refreshcaptcha', handleRefreshCaptcha);
      }
    };
  }, []);


  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="exam-form-component">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
              control={form.control}
              name="result_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ফলাফলের ধরন</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="ফলাফলের ধরন নির্বাচন করুন" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resultTypes.map(rt => <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          {isRollRegRequired && (
            <>
              <FormField
                control={form.control}
                name="roll"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>রোল নম্বর</FormLabel>
                    <FormControl><Input placeholder="যেমন: 123456" {...field} value={field.value || ''} /></FormControl>
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
                    <FormControl><Input placeholder="যেমন: 1234567890" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {isEiinRequired && (
             <FormField
                control={form.control}
                name="eiin"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>প্রতিষ্ঠানের EIIN নম্বর</FormLabel>
                    <FormControl><Input placeholder="আপনার প্রতিষ্ঠানের EIIN নম্বর লিখুন" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}

          {isDistrictRequired && (
               <FormField
                control={form.control}
                name="dcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>জেলার নাম</FormLabel>
                     <FormControl><Input placeholder="জেলার কোড লিখুন" {...field} value={field.value || ''} /></FormControl>
                     <FormDescription>This is a demo. This field is not functional.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
           
           {isCenterRequired && (
              <FormField
                control={form.control}
                name="ccode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>কেন্দ্রের নাম</FormLabel>
                    <FormControl><Input placeholder="কেন্দ্রের কোড লিখুন" {...field} value={field.value || ''} /></FormControl>
                    <FormDescription>This is a demo. This field is not functional.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
           )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নিরাপত্তা কোড</FormLabel>
                    <FormControl><Input placeholder="ছবিতে দেখানো সংখ্যাটি লিখুন" {...field} value={field.value || ''} autoComplete="off" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 mt-2 md:mt-7">
                  {isCaptchaLoading ? (
                      <div className="h-12 w-32 flex items-center justify-center bg-muted rounded-md">
                          <Loader2 className="h-6 w-6 animate-spin"/>
                      </div>
                  ) : captchaImage ? (
                      <Image src={captchaImage} alt="Captcha Image" width={128} height={48} className="rounded-md border" />
                  ) : (
                      <div className="h-12 w-32 flex items-center justify-center bg-muted rounded-md text-xs text-muted-foreground">ক্যাপচা লোড করা যায়নি</div>
                  )}
                  <Button type="button" variant="outline" size="icon" onClick={refreshCaptcha} disabled={isCaptchaLoading}>
                      <RefreshCw className={cn("h-4 w-4", isCaptchaLoading && "animate-spin")} />
                  </Button>
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
