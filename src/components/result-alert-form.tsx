
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
import { useState } from 'react';
import { Loader2, MailCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const alertSchema = z.object({
  email: z.string().email('অনুগ্রহ করে একটি বৈধ ইমেইল দিন।'),
  exam: z.string().min(1, 'পরীক্ষা নির্বাচন আবশ্যক।'),
  year: z.string().min(1, 'বছর নির্বাচন আবশ্যক।'),
});

const exams = [
    { value: 'jsc', label: 'JSC/JDC' },
    { value: 'ssc', label: 'SSC/Dakhil' },
    { value: 'hsc', label: 'HSC/Alim' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear + i).map(String);

export default function ResultAlertForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);

  const form = useForm<z.infer<typeof alertSchema>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      email: '',
      exam: '',
      year: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof alertSchema>) => {
    setIsSubmitting(true);
    try {
      const subscriptionsRef = collection(db, 'subscriptions');
      
      // Check for existing subscription
      const q = query(subscriptionsRef, 
        where('email', '==', values.email),
        where('exam', '==', values.exam),
        where('year', '==', values.year)
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
      
      // Add new subscription
      await addDoc(subscriptionsRef, {
        ...values,
        createdAt: new Date(),
      });

      toast({
        title: 'সাবস্ক্রিপশন সফল',
        description: 'ফলাফল প্রকাশিত হলে আপনাকে ইমেইলে জানানো হবে।',
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
        <CardTitle className="text-2xl mt-4">ফলাফলের জন্য সতর্ক হোন!</CardTitle>
        <CardDescription>
          “Get notified when {form.watch('exam')?.toUpperCase() || 'EXAM'} Result {form.watch('year') || 'YEAR'} is published!”
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>ইমেইল</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
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
              <div className="flex items-end">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  সাবস্ক্রাইব করুন
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
