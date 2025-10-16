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
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// Assuming you have an admin guard for this page
import AdminLayout from '@/app/admin/layout';

const jobPostSchema = z.object({
  title: z.string().min(1, 'চাকরির শিরোনাম আবশ্যক।'),
  companyName: z.string().min(1, 'কোম্পানির নাম আবশ্যক।'),
  location: z.string().min(1, 'অবস্থান আবশ্যক।'),
  type: z.string().min(1, 'চাকরির ধরন আবশ্যক।'),
  description: z.string().min(1, 'বিবরণ আবশ্যক।'),
  applyLink: z.string().url('অনুগ্রহ করে একটি বৈধ আবেদন লিঙ্ক দিন।'),
  deadline: z.string().min(1, 'আবেদনের শেষ তারিখ আবশ্যক।'),
});

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();

  const form = useForm<z.infer<typeof jobPostSchema>>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      companyName: '',
      location: '',
      type: 'Full-time',
      description: '',
      applyLink: '',
      deadline: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof jobPostSchema>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        ...values,
        postedAt: new Date(),
      });
      toast({
        title: 'সাফল্য',
        description: 'চাকরির পোস্ট সফলভাবে তৈরি করা হয়েছে।',
      });
      router.push('/admin/career');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'চাকরির পোস্ট তৈরি করা যায়নি।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        <Card>
            <CardHeader>
            <CardTitle>নতুন জব পোস্ট করুন</CardTitle>
            <CardDescription>
                চাকরির বিবরণ পূরণ করে নতুন বিজ্ঞপ্তি যোগ করুন।
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

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    জব পোস্ট করুন
                    </Button>
                </div>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    </AdminLayout>
  );
}
