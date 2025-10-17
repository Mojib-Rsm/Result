
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
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

const questionSchema = z.object({
  title: z.string().min(10, 'শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।'),
  content: z.string().min(20, 'প্রশ্নটি কমপক্ষে ২০ অক্ষরের হতে হবে।'),
  tags: z.string().optional(),
});

export default function AddQuestionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();
  const { user, loading } = useAuth();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof questionSchema>) => {
    if (!user) return;
    setIsSubmitting(true);
    
    const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

    try {
      await addDoc(collection(db, 'questions'), {
        ...values,
        tags,
        author: user.name || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        answers: [],
      });
      toast({
        title: 'সাফল্য',
        description: 'আপনার প্রশ্নটি সফলভাবে পোস্ট করা হয়েছে।',
      });
      router.push('/community/qna');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'প্রশ্ন পোস্ট করা যায়নি।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return null;

  if (!user) {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle>আপনাকে লগইন করতে হবে</CardTitle>
                    <CardDescription>প্রশ্ন করতে অনুগ্রহ করে লগইন করুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/login?redirect=/community/qna/add">লগইন করুন</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
    <Card>
        <CardHeader>
        <CardTitle>নতুন প্রশ্ন করুন</CardTitle>
        <CardDescription>
            আপনার প্রশ্নটি এখানে লিখুন এবং কমিউনিটির কাছ থেকে উত্তর পান।
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
                        <FormLabel>প্রশ্নের শিরোনাম</FormLabel>
                        <FormControl>
                        <Input placeholder="আপনার প্রশ্নের একটি সংক্ষিপ্ত শিরোনাম দিন..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>আপনার প্রশ্ন</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="আপনার প্রশ্নটি বিস্তারিত লিখুন..."
                            rows={8}
                            {...field}
                        />
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
                        <FormLabel>ট্যাগ (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Input placeholder="যেমন: admission, math, ssc (কমা দিয়ে আলাদা করুন)" {...field} />
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
                        প্রশ্ন পোস্ট করুন
                    </Button>
                </div>
            </form>
        </Form>
        </CardContent>
    </Card>
    </div>
  );
}
