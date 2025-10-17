
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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { uploadImage } from '@/lib/actions';

const jobPostSchema = z.object({
  title: z.string().min(1, 'চাকরির শিরোনাম আবশ্যক।'),
  companyName: z.string().min(1, 'কোম্পানির নাম আবশ্যক।'),
  companyLogoUrl: z.string().url('অনুগ্রহ করে একটি বৈধ লোগো লিঙ্ক দিন।').optional().or(z.literal('')),
  location: z.string().min(1, 'অবস্থান আবশ্যক।'),
  type: z.enum(['Full-time', 'Part-time', 'Internship', 'Contractual', 'Remote']),
  category: z.enum(['IT', 'Marketing', 'Finance', 'Teaching', 'Engineering', 'Healthcare', 'Other']),
  experienceLevel: z.enum(['Entry', 'Mid', 'Senior']),
  salary: z.string().optional(),
  description: z.string().min(1, 'কাজের বিবরণ আবশ্যক।'),
  requirements: z.string().min(1, 'যোগ্যতা আবশ্যক।'),
  preferredSkills: z.string().optional(),
  benefits: z.string().optional(),
  companyOverview: z.string().optional(),
  contactInfo: z.string().optional(),
  applyLink: z.string().url('অনুগ্রহ করে একটি বৈধ আবেদন লিঙ্ক দিন।'),
  howToApply: z.string().optional(),
  deadline: z.string().min(1, 'আবেদনের শেষ তারিখ আবশ্যক।'),
});


export default function EditJobPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        form.setValue('companyLogoUrl', result.url, { shouldValidate: true });
        toast({
            title: 'সফল',
            description: 'ছবি সফলভাবে আপলোড করা হয়েছে।',
        });
    }
    setIsUploading(false);
  };

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
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <FormField
                    control={form.control}
                    name="companyLogoUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>কোম্পানির লোগো</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Input type="url" placeholder="https://example.com/logo.png" {...field} />
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
                        name="salary"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>বেতন (ঐচ্ছিক)</FormLabel>
                            <FormControl>
                            <Input placeholder="যেমন: ৩০,০০০ - ৫০,০০০ টাকা বা আলোচনা সাপেক্ষে" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>চাকরির ধরন</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="ধরণ নির্বাচন করুন" /></SelectTrigger>
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
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>ক্যাটাগরি</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Teaching">Teaching</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>অভিজ্ঞতার স্তর</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="স্তর নির্বাচন করুন" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Entry">Entry</SelectItem>
                                    <SelectItem value="Mid">Mid</SelectItem>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>কাজের বিবরণ</FormLabel>
                        <FormControl>
                        <Textarea placeholder="চাকরির দায়িত্ব, দৈনন্দিন কাজ ইত্যাদি সম্পর্কে লিখুন..." rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>যোগ্যতা</FormLabel>
                        <FormControl>
                        <Textarea placeholder="শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, আবশ্যক স্কিল ইত্যাদি সম্পর্কে লিখুন..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="preferredSkills"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>অতিরিক্ত দক্ষতা (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="যোগাযোগ দক্ষতা, নির্দিষ্ট সফটওয়্যার জ্ঞান ইত্যাদি লিখুন..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>সুবিধাসমূহ (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="মেডিকেল, ইন্স্যুরেন্স, বোনাস, পেইড ছুটি ইত্যাদি লিখুন..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="companyOverview"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>সংস্থার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="কোম্পানির কাজ, সংস্কৃতি ইত্যাদি সম্পর্কে লিখুন..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
                 <FormField
                    control={form.control}
                    name="howToApply"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>কিভাবে আবেদন করবেন (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="যেমন: ইমেইলে সিভি পাঠান বা ওয়েবসাইটে আবেদন করুন..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>যোগাযোগের তথ্য (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                        <Input placeholder="ইমেইল, ফোন নম্বর ইত্যাদি" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        বাতিল
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
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

    