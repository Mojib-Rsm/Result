
'use client';

import { useState } from 'react';
import { getFirestore, writeBatch, doc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DatabaseZap } from 'lucide-react';

const usersToSeed = [
    { id: 'admin-user', email: 'admin@example.com', password: 'password123', name: 'Admin User', role: 'admin' },
    { id: 'editor-user', email: 'mojibrsm@gmail.com', password: 'password123', name: 'Mojib Rsm', role: 'editor' },
];

const resultsToSeed = [
    { roll: '123456', exam: 'HSC', year: '2023', gpa: '5.00' },
    { roll: '654321', exam: 'SSC', year: '2023', gpa: '4.89' },
    { roll: '101010', exam: 'JSC', year: '2023', gpa: 'Pass' },
    { roll: '112233', exam: 'HSC', year: '2022', gpa: '4.50' },
    { roll: '445566', exam: 'DAKHIL', year: '2023', gpa: '4.95' },
];


export default function SeedingPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();
    const db = getFirestore(app);

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const batch = writeBatch(db);

            // Seed users
            usersToSeed.forEach(user => {
                const userRef = doc(db, 'users', user.id);
                // The user object is spread to include all its properties.
                // The 'id' property is used for the document ID and not stored in the document fields.
                const { id, ...userData } = user;
                batch.set(userRef, userData);
            });

            // Seed results
            resultsToSeed.forEach(result => {
                // Using roll as the document ID for simplicity, could be a generated ID as well
                const resultRef = doc(db, 'results', result.roll);
                batch.set(resultRef, result);
            });

            await batch.commit();

            toast({
                title: 'সাফল্য',
                description: 'ডাটাবেস সফলভাবে সিড করা হয়েছে!',
            });
        } catch (error: any) {
            console.error("Seeding failed: ", error);
            toast({
                title: 'ব্যর্থতা',
                description: error.message || 'ডাটাবেস সিড করা যায়নি।',
                variant: 'destructive',
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                         <DatabaseZap className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>ডাটাবেস সিডিং</CardTitle>
                            <CardDescription>
                                ফায়ারস্টোর ডাটাবেসটি ডেমো ডেটা দিয়ে পূর্ণ করতে এই বাটনটি চাপুন।
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                        এই প্রক্রিয়াটি <code className="bg-muted px-1 py-0.5 rounded">users</code> এবং <code className="bg-muted px-1 py-0.5 rounded">results</code> কালেকশন তৈরি করবে (যদি না থাকে) এবং সেগুলিতে কিছু ডেমো ডেটা যুক্ত করবে। এটি নিরাপদে একাধিকবার চালানো যেতে পারে।
                    </p>
                    <Button onClick={handleSeed} disabled={isSeeding} className="w-full">
                        {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSeeding ? 'সিড করা হচ্ছে...' : 'ডাটাবেস সিড করুন'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
