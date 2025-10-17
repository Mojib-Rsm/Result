
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { Separator } from '@/components/ui/separator';

const userSchema = z.object({
  name: z.string().min(1, 'নাম আবশ্যক।'),
  email: z.string().email('অবৈধ ইমেইল।'),
  role: z.enum(['user', 'editor', 'admin']),
  registration: z.string().optional(),
  newPassword: z.string().min(6, 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।').optional().or(z.literal('')),
});


export default function EditUserPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const db = getFirestore(app);
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const fetchUserData = useCallback(async () => {
    try {
      const userDocRef = doc(db, 'users', id);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        form.reset(userDocSnap.data());
      } else {
        toast({ title: "ত্রুটি", description: "ব্যবহারকারী খুঁজে পাওয়া যায়নি।", variant: "destructive" });
        router.push('/admin/users');
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      toast({ title: "ত্রুটি", description: "ডেটা আনতে সমস্যা হয়েছে।", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [db, id, form, toast, router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', id);
      
      const updateData: any = {
          name: values.name,
          email: values.email,
          role: values.role,
          registration: values.registration || '',
      };

      // Only include password if a new one is provided
      if (values.newPassword) {
          updateData.password = values.newPassword;
      }
      
      await updateDoc(userDocRef, updateData);
      
      toast({
        title: 'সাফল্য',
        description: 'ব্যবহারকারীর তথ্য সফলভাবে আপডেট করা হয়েছে।',
      });
      router.push('/admin/users');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'ব্যবহারকারীর তথ্য আপডেট করা যায়নি।',
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
        <CardTitle>ব্যবহারকারীর তথ্য সম্পাদনা</CardTitle>
        <CardDescription>
            ব্যবহারকারীর প্রোফাইল এবং ভূমিকা পরিবর্তন করুন।
        </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>নাম</FormLabel>
                        <FormControl>
                        <Input placeholder="ব্যবহারকারীর নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>ইমেইল</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="registration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>রেজিস্ট্রেশন নম্বর</FormLabel>
                        <FormControl>
                        <Input placeholder="রেজিস্ট্রেশন নম্বর (ঐচ্ছিক)" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>ভূমিকা</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="ভূমিকা নির্বাচন করুন" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Separator />
                
                <h3 className="text-lg font-medium">পাসওয়ার্ড রিসেট</h3>
                 <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>নতুন পাসওয়ার্ড</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="নতুন পাসওয়ার্ড (ঐচ্ছিক)" {...field} />
                        </FormControl>
                         <FormDescription>
                            আপনি যদি পাসওয়ার্ড পরিবর্তন করতে না চান তবে এই ঘরটি খালি রাখুন।
                        </FormDescription>
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

    