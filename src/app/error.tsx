
'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl items-center justify-center py-12">
        <Card className="w-full text-center shadow-lg border-destructive">
            <CardHeader>
                <div className="mx-auto w-fit rounded-full bg-destructive/10 p-4">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="text-3xl text-destructive mt-4">একটি সমস্যা হয়েছে</CardTitle>
                <CardDescription className="text-lg">
                    দুঃখিত, একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-muted p-3 rounded-md">
                     <p className="text-sm text-muted-foreground">ত্রুটির বার্তা: {error.message || "Unknown Error"}</p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => reset()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        পুনরায় চেষ্টা করুন
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            হোমে ফিরে যান
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
