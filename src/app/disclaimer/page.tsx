
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        হোমে ফিরে যান
                    </Link>
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="text-center p-6 bg-muted/30">
                     <AlertTriangle className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">দাবিত্যাগ</CardTitle>
                    <CardDescription className="text-lg">অনুগ্রহ করে মনোযোগ দিয়ে পড়ুন</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 prose dark:prose-invert max-w-none">
                    <p>
                        BD Edu Hub ওয়েবসাইটের সমস্ত তথ্য শুধুমাত্র সাধারণ তথ্যের উদ্দেশ্যে সরবরাহ করা হয়েছে। আমরা এই তথ্যের সম্পূর্ণতা, নির্ভুলতা, নির্ভরযোগ্যতা, উপযুক্ততা বা প্রাপ্যতার বিষয়ে কোনো ওয়ারেন্টি বা গ্যারান্টি প্রদান করি না। এই সাইটের তথ্যের উপর ভিত্তি করে কোনো সিদ্ধান্ত গ্রহণের সম্পূর্ণ ঝুঁকি আপনার নিজের।
                    </p>

                    <h2>তথ্যের উৎস</h2>
                    <p>
                        এই ওয়েবসাইটে প্রদর্শিত পরীক্ষার ফলাফল এবং অন্যান্য তথ্য বাংলাদেশ শিক্ষা বোর্ডের অফিসিয়াল ওয়েবসাইট এবং অন্যান্য নির্ভরযোগ্য উৎস থেকে সংগ্রহ করা হয়। আমরা তথ্যের নির্ভুলতা নিশ্চিত করার জন্য সর্বাত্মক চেষ্টা করি, তবে যেকোনো অনিচ্ছাকৃত ভুলের জন্য আমরা দায়ী থাকব না।
                    </p>

                    <h2>চূড়ান্ত ফলাফলের জন্য</h2>
                    <p>
                        এই ওয়েবসাইটে প্রদর্শিত ফলাফল প্রাথমিক তথ্য হিসেবে গণ্য হবে। যেকোনো আইনি বা অফিসিয়াল উদ্দেশ্যে, অনুগ্রহ করে আপনার নিজ নিজ শিক্ষা বোর্ডের জারি করা মূল মার্কশিট বা অফিসিয়াল ডকুমেন্ট ব্যবহার করুন। ফলাফলের কোনো অমিলের জন্য BD Edu Hub দায়ী থাকবে না।
                    </p>

                    <h2>তৃতীয় পক্ষের লিঙ্ক</h2>
                    <p>
                        আমাদের ওয়েবসাইট থেকে আপনি অন্যান্য ওয়েবসাইটের লিঙ্ক পেতে পারেন। আমাদের এই বাহ্যিক সাইটগুলোর বিষয়বস্তু বা প্রকৃতির উপর কোনো নিয়ন্ত্রণ নেই। এই লিঙ্কগুলো শুধুমাত্র তথ্যের সুবিধার জন্য প্রদান করা হয় এবং এটি কোনো সুপারিশ বোঝায় না।
                    </p>
                    
                    <h2>শর্তাবলীতে সম্মতি</h2>
                    <p>
                        এই সাইটটি ব্যবহার করার মাধ্যমে, আপনি আমাদের দাবিত্যাগের শর্তাবলীতে সম্মত হচ্ছেন এবং এর শর্তাবলী মেনে চলতে বাধ্য থাকবেন।
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
