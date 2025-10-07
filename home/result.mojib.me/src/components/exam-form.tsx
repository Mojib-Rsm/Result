
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
import { cn } from '@/lib/utils';

export const formSchema = z.object({
  exam: z.string().min(1, 'পরীক্ষা নির্বাচন আবশ্যক।'),
  year: z.string().min(1, 'বছর নির্বাচন আবশ্যক।'),
  board: z.string().min(1, 'বোর্ড নির্বাচন আবশ্যক।'),
  roll: z.string().min(1, 'রোল নম্বর আবশ্যক।'),
  reg: z.string().min(1, 'রেজিস্ট্রেশন নম্বর আবশ্যক।'),
  result_type: z.string(), // This is not used by the new backend, but kept for consistency
  captcha: z.string().min(1, 'ক্যাপচা আবশ্যক।'),
});

const boards = [
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'barisal', label: 'Barisal' },
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'comilla', label: 'Comilla' },
    { value: 'dinajpur', label: 'Dinajpur' },
    { value: 'jessore', label: 'Jessore' },
    { value: 'mymensingh', label: 'Mymensingh' },
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'sylhet', label: 'Sylhet' }, // Corrected from Shylet
    { value: 'madrasah', label: 'Madrasah' },
    { value: 'tec', label: 'Technical' },
    { value: 'dibs', label: 'DIBS(Dhaka)' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1995 }, (_, i) => currentYear - i).map(String);


const exams = [
    { value: 'jsc', label: 'JSC/JDC' },
    { value: 'ssc', label: 'SSC/Dakhil' },
    { value: 'hsc', label: 'HSC/Alim/Equivalent' },
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
}

export function ExamForm({ form, onSubmit, isSubmitting }: ExamFormProps) {
  const [captchaText, setCaptchaText] = useState<string | null>(null);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  const refreshCaptcha = async () => {
      setIsCaptchaLoading(true);
      try {
          const { captchaText: text } = await getCaptchaAction();
          setCaptchaText(text);
      } catch (error) {
          console.error(error);
          setCaptchaText("ক্যাপচা লোড করা যায়নি");
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4">
            <div className="flex items-center gap-2">
                <label htmlFor="captcha_q" className="text-sm font-medium">নিরাপত্তা প্রশ্ন:</label>
                {isCaptchaLoading ? (
                    <div className="h-10 flex items-center justify-center bg-muted rounded-md px-4">
                        <Loader2 className="h-6 w-6 animate-spin"/>
                    </div>
                ) : captchaText ? (
                    <div id="captcha_q" className="h-10 flex items-center justify-center bg-muted rounded-md px-4 font-mono text-lg">
                      {captchaText}
                    </div>
                ) : (
                    <div className="h-10 flex items-center justify-center bg-muted rounded-md px-4 text-xs text-muted-foreground">ক্যাপচা লোড করা যায়নি</div>
                )}
                <Button type="button" variant="outline" size="icon" onClick={refreshCaptcha} disabled={isCaptchaLoading}>
                    <RefreshCw className={cn("h-4 w-4", isCaptchaLoading && "animate-spin")} />
                </Button>
            </div>
            <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নিরাপত্তা কোডের উত্তর দিন</FormLabel>
                    <FormControl>
                        <Input 
                            placeholder="উপরের গণিতের উত্তর লিখুন" 
                            {...field} 
                            value={field.value || ''} 
                            autoComplete="off" 
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
