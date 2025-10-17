
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
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { uploadImage } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const newsPostSchema = z.object({
  title: z.string().min(1, 'শিরোনাম আবশ্যক।'),
  description: z.string().min(1, 'বিবরণ আবশ্যক।'),
  content: z.string().min(1, 'সম্পূর্ণ বিবরণ আবশ্যক।'),
  imageUrl: z.string().url('অনুগ্রহ করে একটি বৈধ ছবির লিঙ্ক দিন।'),
  source: z.string().optional(),
  link: z.string().url('অনুগ্রহ করে একটি বৈধ খবরের লিঙ্ক দিন।').optional().or(z.literal('')),
  tags: z.string().optional(),
  category: z.enum(['General', 'Notice', 'Board', 'Ministry', 'Exam', 'Result']).optional(),
});

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();
  const id = params.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof newsPostSchema>>({
    resolver: zodResolver(newsPostSchema),
  });

  const fetchNewsData = useCallback(async () => {
    try {
      const newsDocRef = doc(db, 'news', id);
      const newsDocSnap = await getDoc(newsDocRef);
      if (newsDocSnap.exists()) {
        const newsData = newsDocSnap.data();
        if (Array.isArray(newsData.tags)) {
            newsData.tags = newsData.tags.join(', ');
        }
        form.reset(newsData);
      } else {
        toast({ title: "ত্রুটি", description: "সংবাদটি খুঁজে পাওয়া যায়নি।", variant: "destructive" });
        router.push('/admin/news');
      }
    } catch (error) {
      console.error("Error fetching news data: ", error);
      toast({ title: "ত্রুটি", description: "ডেটা আনতে সমস্যা হয়েছে।", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [db, id, form, toast, router]);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await uploadImage(formData);

    if (result.error) {
        toast({
            title: 'ছবি আপলোড ব্যর্থ হয়েছে',
            description: result.error,
            variant: 'destructive',
        });
    } else if (result.url) {
        form.setValue('imageUrl', result.url, { shouldValidate: true });
        toast({
            title: 'সফল',
            description: 'ছবি সফলভাবে আপলোড করা হয়েছে।',
        });
    }
    setIsUploading(false);
  };

  const onSubmit = async (values: z.infer<typeof newsPostSchema>) => {
    setIsSubmitting(true);
    const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
    if(values.category && !tags.includes(values.category.toLowerCase())){
        tags.push(values.category.toLowerCase());
    }

    try {
      const newsDocRef = doc(db, 'news', id);
      const updateData = {
          ...values,
          tags,
      };
      await updateDoc(newsDocRef, updateData as any);
      toast({
        title: 'সাফল্য',
        description: 'সংবাদটি সফলভাবে আপডেট করা হয়েছে।',
      });
      router.push('/admin/news');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'সংবাদটি আপডেট করা যায়নি।',
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
        <CardTitle>সংবাদ সম্পাদনা করুন</CardTitle>
        <CardDescription>
            খবর বা নোটিশের তথ্য পরিবর্তন করুন।
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
                    name="content"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>সম্পূর্ণ বিবরণ</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="সম্পূর্ণ আর্টিকেল এখানে লিখুন..."
                            rows={10}
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
                        <FormLabel>ছবি</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                <span className="ml-2">ছবি আপলোড করুন</span>
                            </Button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>ক্যাটাগরি</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="Notice">Notice</SelectItem>
                                    <SelectItem value="Board">Board</SelectItem>
                                    <SelectItem value="Ministry">Ministry</SelectItem>
                                    <SelectItem value="Exam">Exam</SelectItem>
                                    <SelectItem value="Result">Result</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>অতিরিক্ত ট্যাগ (ঐচ্ছিক)</FormLabel>
                            <FormControl>
                            <Input placeholder="যেমন: ssc, admission (কমা দিয়ে)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>উৎস (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Input placeholder="যেমন: The Daily Star বা লেখকের নাম" {...field} />
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
                        <FormLabel>বহিরাগত লিঙ্ক (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Input type="url" placeholder="https://example.com/full-news" {...field} />
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
