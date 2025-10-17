
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

const forumPostSchema = z.object({
  title: z.string().min(10, 'শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।'),
  content: z.string().min(20, 'আলোচনার বিষয়বস্তু কমপক্ষে ২০ অক্ষরের হতে হবে।'),
  tags: z.string().optional(),
});

export default function AddForumPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();
  const { user, loading } = useAuth();

  const form = useForm<z.infer<typeof forumPostSchema>>({
    resolver: zodResolver(forumPostSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof forumPostSchema>) => {
    if (!user) return;
    setIsSubmitting(true);
    
    const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

    try {
      await addDoc(collection(db, 'forum_posts'), {
        ...values,
        tags,
        author: user.name || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        comments: [],
      });
      toast({
        title: 'সাফল্য',
        description: 'আপনার আলোচনার পোস্ট সফলভাবে তৈরি করা হয়েছে।',
      });
      router.push('/community/forum');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'পোস্ট তৈরি করা যায়নি।',
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
                    <CardDescription>আলোচনা শুরু করতে অনুগ্রহ করে লগইন করুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/login?redirect=/community/forum/add">লগইন করুন</Link>
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
        <CardTitle>নতুন আলোচনা শুরু করুন</CardTitle>
        <CardDescription>
            শিক্ষামূলক যেকোনো বিষয়ে আপনার আলোচনা শুরু করুন।
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
                        <FormLabel>আলোচনার শিরোনাম</FormLabel>
                        <FormControl>
                        <Input placeholder="আপনার আলোচনার মূল বিষয় লিখুন..." {...field} />
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
                        <FormLabel>বিস্তারিত</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="আপনার আলোচনার বিষয়টি বিস্তারিত লিখুন..."
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
