
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const registerSchema = z.object({
  name: z.string().min(3, 'নাম কমপক্ষে ৩ অক্ষরের হতে হবে।'),
  email: z.string().email('অনুগ্রহ করে একটি বৈধ ইমেইল দিন।'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'),
});

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    try {
      // Check if user already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', values.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে।');
      }

      // Create new user
      // IMPORTANT: In a real app, use Firebase Auth. This is for demo purposes.
      // We are creating a user document with a plain text password, which is NOT secure.
      const newUserRef = doc(collection(db, 'users'));
      await setDoc(newUserRef, {
          name: values.name,
          email: values.email,
          password: values.password, // NOT SECURE
          role: 'user', // Default role
          createdAt: new Date(),
      });
      

      toast({
        title: 'নিবন্ধন সফল',
        description: 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে। এখন লগইন করুন।',
      });
      router.push('/login');

    } catch (error: any) {
      toast({
        title: 'নিবন্ধন ব্যর্থ হয়েছে',
        description: error.message || 'একটি অপ্রত্যাশিত সমস্যা হয়েছে।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-sm items-center justify-center py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>অ্যাকাউন্ট তৈরি করুন</CardTitle>
          <CardDescription>আপনার অ্যাকাউন্ট তৈরি করতে নিচের ফর্মটি পূরণ করুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>আপনার নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="যেমন: করিম আহমেদ" {...field} />
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
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পাসওয়ার্ড</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                নিবন্ধন করুন
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Separator />
            <p className="text-sm text-center text-muted-foreground">
                ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
                <Link href="/login" className="text-primary hover:underline">
                    লগইন করুন
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
