'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

const jobPostSchema = z.object({
  title: z.string().min(1, 'চাকরির শিরোনাম আবশ্যক।'),
  companyName: z.string().min(1, 'কোম্পানির নাম আবশ্যক।'),
  location: z.string().min(1, 'অবস্থান আবশ্যক।'),
  type: z.string().min(1, 'চাকরির ধরন আবশ্যক।'),
  description: z.string().min(1, 'বিবরণ আবশ্যক।'),
  applyLink: z.string().url('অনুগ্রহ করে একটি বৈধ আবেদন লিঙ্ক দিন।'),
  deadline: z.string().min(1, 'আবেদনের শেষ তারিখ আবশ্যক।'),
});

export default function EditJobPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();
  const { id } = params;

  const form = useForm<z.infer<typeof jobPostSchema>>({
    resolver: zodResolver(jobPostSchema),
  });

  const fetchJobData = useCallback(async () => {
    try {
      const jobDocRef = doc(db, 'jobs', id);
      const jobDocSnap = await getDoc(jobDocRef);
      if (jobDocSnap.exists()) {
        const jobData = jobDocSnap.data();
        // Convert Firestore timestamp to yyyy-mm-dd for date input
        if (jobData.deadline && typeof jobData.deadline === 'string' && jobData.deadline.includes('T')) {
            jobData.deadline = jobData.deadline.split('T')[0];
        }
        form.reset(jobData);
      } else {
        toast({ title: "ত্রুটি", description: "চাকরির পোস্ট খুঁজে পাওয়া যায়নি।", variant: "destructive" });
        router.push('/admin/career');
      }
    } catch (error) {
      console.error("Error fetching job data: ", error);
      toast({ title: "ত্রুটি", description: "ডেটা আনতে সমস্যা হয়েছে।", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [db, id, form, toast, router]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  const onSubmit = async (values: z.infer<typeof jobPostSchema>) => {
    setIsSubmitting(true);
    try {
      const jobDocRef = doc(db, 'jobs', id);
      await updateDoc(jobDocRef, values);
      toast({
        title: 'সাফল্য',
        description: 'চাকরির পোস্ট সফলভাবে আপডেট করা হয়েছে।',
      });
      router.push('/admin/career');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'চাকরির পোস্ট আপডেট করা যায়নি।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
    <Card>
        <CardHeader>
        <CardTitle>জব পোস্ট সম্পাদনা করুন</CardTitle>
        <CardDescription>
            চাকরির বিবরণ পরিবর্তন করে বিজ্ঞপ্তি আপডেট করুন।
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
                    <FormLabel>পদের নাম</FormLabel>
                    <FormControl>
                    <Input placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>কোম্পানির নাম</FormLabel>
                    <FormControl>
                    <Input placeholder="যেমন: Oftern IT" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>অবস্থান</FormLabel>
                    <FormControl>
                    <Input placeholder="যেমন: ঢাকা, বাংলাদেশ" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>চাকরির ধরন</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="ধরণ নির্বাচন করুন" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Contractual">Contractual</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>চাকরির বিবরণ</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="চাকরির দায়িত্ব, যোগ্যতা ইত্যাদি সম্পর্কে লিখুন..."
                        rows={6}
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="applyLink"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>আবেদন লিঙ্ক</FormLabel>
                    <FormControl>
                    <Input type="url" placeholder="https://example.com/apply" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>আবেদনের শেষ তারিখ</FormLabel>
                    <FormControl>
                    <Input type="date" {...field} />
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
                আপডেট করুন
                </Button>
            </div>
            </form>
        </Form>
        </CardContent>
    </Card>
    </div>
  );
}
