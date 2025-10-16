'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';


const newsPostSchema = z.object({
  title: z.string().min(1, 'শিরোনাম আবশ্যক।'),
  description: z.string().min(1, 'বিবরণ আবশ্যক।'),
  imageUrl: z.string().url('অনুগ্রহ করে একটি বৈধ ছবির লিঙ্ক দিন।'),
  source: z.string().min(1, 'উৎস আবশ্যক।'),
  link: z.string().url('অনুগ্রহ করে একটি বৈধ খবরের লিঙ্ক দিন।'),
  tags: z.string().optional(),
});

export default function AddNewsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();

  const form = useForm<z.infer<typeof newsPostSchema>>({
    resolver: zodResolver(newsPostSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      source: '',
      link: '',
      tags: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof newsPostSchema>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'news'), {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        date: format(new Date(), 'MMMM dd, yyyy'),
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'সাফল্য',
        description: 'সংবাদটি সফলভাবে পোস্ট করা হয়েছে।',
      });
      router.push('/admin/news');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'সংবাদটি পোস্ট করা যায়নি।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
    <Card>
        <CardHeader>
        <CardTitle>নতুন সংবাদ পোস্ট করুন</CardTitle>
        <CardDescription>
            নতুন খবর বা নোটিশ যোগ করতে ফর্মটি পূরণ করুন।
        </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>শিরোনাম</FormLabel>
                        <FormControl>
                        <Input placeholder="সংবাদের শিরোনাম লিখুন" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>সংক্ষিপ্ত বিবরণ</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="সংবাদের একটি সংক্ষিপ্ত সারসংক্ষেপ লিখুন..."
                            rows={4}
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>ছবির লিঙ্ক</FormLabel>
                        <FormControl>
                        <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>উৎস</FormLabel>
                        <FormControl>
                        <Input placeholder="যেমন: The Daily Star" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>খবরের লিঙ্ক</FormLabel>
                        <FormControl>
                        <Input type="url" placeholder="https://example.com/full-news" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>ট্যাগ</FormLabel>
                        <FormControl>
                        <Input placeholder="যেমন: ssc, result, admission" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                     <Button type="button" variant="outline" onClick={() => router.back()}>
                        বাতিল
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        পোস্ট করুন
                    </Button>
                </div>
            </form>
        </Form>
        </CardContent>
    </Card>
    </div>
  );
}
