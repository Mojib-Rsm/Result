'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const loginSchema = z.object({
  email: z.string().email('অনুগ্রহ করে একটি বৈধ ইমেইল দিন।'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'),
});

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'password123',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', values.email), where('password', '==', values.password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('আপনার ইমেইল বা পাসওয়ার্ড ভুল।');
      }

      const userDoc = querySnapshot.docs[0];
      const user = { uid: userDoc.id, ...userDoc.data() };
      
      login(user);

      toast({
        title: 'সফল',
        description: 'আপনি সফলভাবে লগইন করেছেন।',
      });
      router.push('/admin');
    } catch (error: any) {
      toast({
        title: 'লগইন ব্যর্থ হয়েছে',
        description: error.message || 'অনুগ্রহ করে আপনার ইমেইল এবং পাসওয়ার্ড পরীক্ষা করুন।',
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
          <CardTitle>অ্যাডমিন লগইন</CardTitle>
          <CardDescription>আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইমেইল</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
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
                লগইন করুন
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
