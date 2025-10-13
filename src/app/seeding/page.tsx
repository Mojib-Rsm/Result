
'use client';

import { useState } from 'react';
import { getFirestore, setDoc, doc, writeBatch } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DatabaseZap } from 'lucide-react';

// Data to be seeded
const usersToSeed = [
    { id: 'admin-user', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
    { id: 'editor-user', email: 'mojibrsm@gmail.com', name: 'Mojib Rsm', role: 'editor' },
];

const resultsToSeed = [
    { roll: '123456', exam: 'HSC', year: '2023', gpa: '5.00' },
    { roll: '654321', exam: 'SSC', year: '2023', gpa: '4.89' },
    { roll: '101010', exam: 'JSC', year: '2023', gpa: 'Pass' },
    { roll: '112233', exam: 'HSC', year: '2022', gpa: '4.50' },
    { roll: '445566', exam: 'DAKHIL', year: '2023', gpa: '4.95' },
];

const engineeringColleges = [
    { id: 'buet', name: 'Bangladesh University of Engineering and Technology (BUET)', location: 'ঢাকা', website: 'https://www.buet.ac.bd' },
    { id: 'kuet', name: 'Khulna University of Engineering & Technology (KUET)', location: 'খুলনা', website: 'https://www.kuet.ac.bd' },
    { id: 'ruet', name: 'Rajshahi University of Engineering & Technology (RUET)', location: 'রাজশাহী', website: 'https://www.ruet.ac.bd' },
    { id: 'cuet', name: 'Chittagong University of Engineering & Technology (CUET)', location: 'চট্টগ্রাম', website: 'https://www.cuet.ac.bd' },
    { id: 'duet', name: 'Dhaka University of Engineering & Technology (DUET)', location: 'গাজীপুর', website: 'http://www.duet.ac.bd' },
];

const medicalColleges = [
    { id: 'dmc', name: 'ঢাকা মেডিকেল কলেজ', location: 'ঢাকা' },
    { id: 'ssmc', name: 'স্যার সলিমুল্লাহ মেডিকেল কলেজ', location: 'ঢাকা' },
    { id: 'shsmc', name: 'শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ', location: 'ঢাকা' },
];

const publicUniversities = [
    { id: 'du', name: 'University of Dhaka', location: 'ঢাকা', website: 'http://www.du.ac.bd' },
    { id: 'ru', name: 'University of Rajshahi', location: 'রাজশাহী', website: 'http://www.ru.ac.bd' },
];

const privateUniversities = [
    { id: 'nsu', name: 'North South University', location: 'ঢাকা', website: 'http://www.northsouth.edu' },
    { id: 'iub', name: 'Independent University, Bangladesh', location: 'ঢাকা', website: 'http://www.iub.edu.bd' },
];

const nationalColleges = [
    { id: 'dhaka-college', name: 'ঢাকা কলেজ', location: 'ঢাকা', website: 'https://www.dhakacollege.edu.bd' },
    { id: 'eden-college', name: 'ইডেন মহিলা কলেজ', location: 'ঢাকা', website: 'https://www.emc.edu.bd' },
];

const polytechnicInstitutes = [
    { id: 'dhaka-poly', name: 'Dhaka Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 200 }, { name: 'Electrical Technology', seats: 150 } ] },
    { id: 'mymensingh-poly', name: 'Mymensingh Polytechnic Institute', departments: [ { name: 'Civil Technology', seats: 150 }, { name: 'Electrical Technology', seats: 150 } ] },
];

const newsItems = [
    { id: 'news1', title: '২০২৫ সালের এসএসসি পরীক্ষা ফেব্রুয়ারিতে, এইচএসসি এপ্রিলে', description: 'আগামী বছরের (২০২৫) এসএসসি ও সমমান পরীক্ষা ফেব্রুয়ারিতে এবং এইচএসসি ও সমমান পরীক্ষা এপ্রিলে অনুষ্ঠিত হবে।', imageUrl: 'https://picsum.photos/seed/news1/600/400', source: 'প্রথম আলো', date: 'জুলাই ২১, ২০২৪', link: '#', tags: ['এসএসসি', 'এইচএসসি', '২০২৫'], },
    { id: 'news2', title: 'পাবলিক বিশ্ববিদ্যালয়ে থাকছে না দ্বিতীয়বার ভর্তির সুযোগ', description: 'দেশের পাবলিক বিশ্ববিদ্যালয়গুলোতে স্নাতক প্রথম বর্ষে দ্বিতীয়বার ভর্তির সুযোগ আর থাকছে না। अगले শিক্ষাবর্ষ থেকে এটি কার্যকর হবে।', imageUrl: 'https://picsum.photos/seed/news2/600/400', source: 'The Daily Star', date: 'জুলাই ২০, ২০২৪', link: '#', tags: ['ভর্তি', 'পাবলিক বিশ্ববিদ্যালয়'], },
    { id: 'news3', title: 'গুচ্ছ ভর্তি পরীক্ষা: প্রাথমিক আবেদন শুরু', description: 'দেশের ২২টি সাধারণ এবং বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের গুচ্ছ ভর্তি পরীক্ষার প্রাথমিক আবেদন শুরু হয়েছে।', imageUrl: 'https://picsum.photos/seed/news3/600/400', source: 'দৈনিক শিক্ষা', date: 'জুলাই ১৯, ২০২৪', link: '#', tags: ['গুচ্ছ', 'ভর্তি পরীক্ষা'], },
    { id: 'news4', title: 'জুলাইয়ে খুলছে না শিক্ষা প্রতিষ্ঠান, ছুটি আরও বাড়তে পারে', description: 'সারা দেশে বন্যা পরিস্থিতির অবনতি হওয়ায় জুলাই মাসে শিক্ষা প্রতিষ্ঠান খোলার সম্ভাবনা নেই। ছুটি আরও বাড়তে পারে বলে জানিয়েছে শিক্ষা মন্ত্রণালয়।', imageUrl: 'https://picsum.photos/seed/news4/600/400', source: 'Jago News 24', date: 'জুলাই ১৮, ২০২৪', link: '#', tags: ['ছুটি', 'বন্যা'], },
];

const hsc2023Stats = {
    totalExaminees: 1359342,
    totalPassed: 1067852,
    passRate: 78.64,
    totalGpa5: 92595,
};

const boardWiseGpa5 = [
    { board: 'ঢাকা', gpa5: 32801 }, { board: 'রাজশাহী', gpa5: 7853 },
];

const boardWisePassRate = [
    { board: 'ঢাকা', passRate: 79.44 }, { board: 'রাজশাহী', passRate: 78.46 },
];

export default function SeedingPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();
    const db = getFirestore(app);

    const seedCollection = async (collectionName: string, data: any[]) => {
        const batch = writeBatch(db);
        data.forEach((item) => {
            const docRef = doc(db, collectionName, item.id || item.roll);
            const { id, ...itemData } = item;
            batch.set(docRef, itemData);
        });
        await batch.commit();
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await Promise.all([
                seedCollection('users', usersToSeed),
                seedCollection('results', resultsToSeed),
                seedCollection('engineering-colleges', engineeringColleges),
                seedCollection('medical-colleges', medicalColleges),
                seedCollection('public-universities', publicUniversities),
                seedCollection('private-universities', privateUniversities),
                seedCollection('national-colleges', nationalColleges),
                seedCollection('polytechnic-institutes', polytechnicInstitutes),
                seedCollection('news', newsItems),
            ]);

            // For single doc statistics
            const statsRef = doc(db, 'statistics', 'hsc2023');
            await setDoc(statsRef, {
                ...hsc2023Stats,
                boardWiseGpa5,
                boardWisePassRate,
            });

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
                        এই প্রক্রিয়াটি নিম্নলিখিত কালেকশনগুলো তৈরি বা আপডেট করবে: <code className="bg-muted px-1 py-0.5 rounded">users</code>, <code className="bg-muted px-1 py-0.5 rounded">results</code>, <code className="bg-muted px-1 py-0.5 rounded">engineering-colleges</code>, <code className="bg-muted px-1 py-0.5 rounded">medical-colleges</code>, <code className="bg-muted px-1 py-0.5 rounded">public-universities</code>, <code className="bg-muted px-1 py-0.5 rounded">private-universities</code>, <code className="bg-muted px-1 py-0.5 rounded">national-colleges</code>, <code className="bg-muted px-1 py-0.5 rounded">polytechnic-institutes</code>, <code className="bg-muted px-1 py-0.5 rounded">news</code>, এবং <code className="bg-muted px-1 py-0.5 rounded">statistics</code>। এটি নিরাপদে একাধিকবার চালানো যেতে পারে।
                    </p>
                    <Button onClick={handleSeed} disabled={isSeeding} className="w-full">
                        {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSeeding ? 'সিড করা হচ্ছে...' : 'সম্পূর্ণ সাইটের ডেটা সিড করুন'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
