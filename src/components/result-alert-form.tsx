
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { Loader2, MailCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const alertSchema = z.object({
  phone: z.string().min(11, 'অনুগ্রহ করে একটি বৈধ ফোন নম্বর দিন।').max(14),
  roll: z.string().min(1, 'রোল নম্বর আবশ্যক।'),
  reg: z.string().min(1, 'রেজিস্ট্রেশন নম্বর আবশ্যক।'),
  exam: z.string().min(1, 'পরীক্ষা নির্বাচন আবশ্যক।'),
  year: z.string().min(1, 'বছর নির্বাচন আবশ্যক।'),
  board: z.string().min(1, 'বোর্ড নির্বাচন আবশ্যক।'),
});

const exams = [
    { value: 'jsc', label: 'JSC/JDC' },
    { value: 'ssc', label: 'SSC/Dakhil' },
    { value: 'hsc', label: 'HSC/Alim' },
    { value: 'hsc_bm', label: 'HSC(BM)' },
    { value: 'dibs', label: 'Diploma in Business Studies' },
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
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(String);

async function sendNotification(payload: { message: string; type: 'sms' | 'telegram', recipient?: string }): Promise<{success: boolean, error?: string}> {
    try {
        const response = await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if(response.ok && result.success) {
            return { success: true };
        }
        return { success: false, error: result.error || 'Unknown notification error' };
    } catch (error) {
        console.error(`Failed to send ${payload.type} notification:`, error);
        return { success: false, error: 'Network error during notification.' };
    }
}


export default function ResultAlertForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);

  const form = useForm<z.infer<typeof alertSchema>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      phone: '',
      roll: '',
      reg: '',
      exam: 'hsc',
      year: '2024',
      board: '',
    },
  });

  const selectedExam = form.watch('exam');

  useEffect(() => {
    if (selectedExam === 'hsc_bm') {
      form.setValue('board', 'tec');
    } else {
      // Don't reset if it's already set by the user for other exams
      if (form.getValues('board') === 'tec') {
        form.setValue('board', '');
      }
    }
  }, [selectedExam, form]);
  
  const showBoardField = selectedExam !== 'hsc_bm';


  const onSubmit = async (values: z.infer<typeof alertSchema>) => {
    setIsSubmitting(true);
    let smsError = '';
    
    const submissionValues = {...values};
    if (submissionValues.exam === 'hsc_bm') {
        submissionValues.board = 'tec';
    }


    try {
      const subscriptionsRef = collection(db, 'subscriptions');
      
      const q = query(subscriptionsRef, 
        where('phone', '==', submissionValues.phone),
        where('roll', '==', submissionValues.roll),
        where('exam', '==', submissionValues.exam),
        where('year', '==', submissionValues.year),
        where('board', '==', submissionValues.board)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({
          title: 'ইতিমধ্যে সাবস্ক্রাইব করা হয়েছে',
          description: 'আপনি এই পরীক্ষার জন্য ইতিমধ্যে সাবস্ক্রাইব করেছেন।',
          variant: 'default',
        });
        return;
      }
      
      await addDoc(subscriptionsRef, {
        ...submissionValues,
        createdAt: new Date(),
      });
      
      // Send confirmation SMS to user
      const userMessage = `BD Edu Result-এ স্বাগতম! আপনার পরীক্ষার ফলাফল প্রকাশিত হলে আপনাকে SMS-এর মাধ্যমে জানানো হবে। ধন্যবাদ। - www.bdedu.me`;
      const userSmsResult = await sendNotification({ message: userMessage, type: 'sms', recipient: submissionValues.phone });

      if (!userSmsResult.success) {
        smsError = userSmsResult.error || 'কনফার্মেশন SMS পাঠানো যায়নি।';
      }

      // Prepare admin notification message
      const adminMessage = `New Subscription on BD Edu Result:\nRoll: ${submissionValues.roll}\nExam: ${submissionValues.exam.toUpperCase()}\nYear: ${submissionValues.year}\nBoard: ${submissionValues.board}\nPhone: ${submissionValues.phone}`;
      
      // Send notification SMS to admin
      await sendNotification({ message: `${adminMessage} - www.bdedu.me`, type: 'sms' });
      
      // Send Telegram notification
      await sendNotification({ message: adminMessage, type: 'telegram' });

      toast({
        title: 'সাবস্ক্রিপশন সফল',
        description: smsError ? `কিন্তু, কনফার্মেশন SMS পাঠানো যায়নি: ${smsError}` : 'ফলাফল প্রকাশিত হলে আপনাকে জানানো হবে। একটি কনফার্মেশন SMS পাঠানো হয়েছে।',
        variant: smsError ? 'default' : 'default', // could be different style
        duration: smsError ? 10000 : 5000,
      });


      form.reset();
    } catch (error: any) {
      toast({
        title: 'সাবস্ক্রিপশন ব্যর্থ হয়েছে',
        description: error.message || 'একটি অপ্রত্যাশিত সমস্যা হয়েছে।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <MailCheck className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl mt-4">ফলাফল প্রকাশিত হলে সবার আগে জানুন!</CardTitle>
        <CardDescription>
          ফলাফল প্রকাশিত হলে আপনাকে SMS-এর মাধ্যমে জানানো হবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ফোন নম্বর</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="01xxxxxxxxx" {...field} />
                    </FormControl>
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
                      <Input placeholder="আপনার রোল নম্বর" {...field} />
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
                      <Input placeholder="আপনার রেজিস্ট্রেশন নম্বর" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
               <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  সাবস্ক্রাইব করুন
                </Button>
              </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
