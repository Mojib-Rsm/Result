
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
    { id: 'admin-user', email: 'admin@example.com', name: 'Admin User', role: 'admin', password: 'password123' },
    { id: 'editor-user', email: 'mojibrsm@gmail.com', name: 'Mojib Rsm', role: 'editor', password: 'password123' },
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
    {
        id: 'news1',
        title: "Teachers, MPO-listed employees suspend long march till 4pm",
        description: "MPO তালিকাভুক্ত শিক্ষক ও কর্মীরা তাদের তিনটি দাবি মেটানো না হলে সচিবালয়ের দিকে মিছিল করার ঘোষণা দিয়েছিলেন। সকালে মিছিল শুরু হলে দুপুর ৪টা পর্যন্ত তা স্থগিত রাখা হয়।",
        imageUrl: "https://www.tbsnews.net/sites/default/files/styles/media_gallery/public/media/images/2025/10/14/teachers_long_march.jpg",
        source: 'The Business Standard',
        date: 'অক্টোবর ১৪, ২০২৪',
        link: "https://www.tbsnews.net/bangladesh/teachers-continue-sit-3rd-day-announce-long-march-towards-secretariat-1260011",
        tags: ['teachers', 'protest', 'MPO'],
    },
    {
        id: 'news2',
        title: "‘March to Secretariat’: MPO teachers give govt deadline",
        description: "MPO-সংবলিত শিক্ষক ও কর্মীরা সরকারকে নির্ধারিত সময়ের মধ্যে তাদের দাবি মেটাতে বলেন, নাহলে তারা সচিবালয় পর্যন্ত মিছিল করবেন।",
        imageUrl: "https://picsum.photos/seed/news2/600/400",
        source: 'bdnews24.com',
        date: 'অক্টোবর ১৩, ২০২৪',
        link: "https://bdnews24.com/bangladesh/8e99209c1a04",
        tags: ['teachers', 'protest', 'deadline'],
    },
    {
        id: 'news3',
        title: "The broken ladder: Analysing the present and future of Bangladesh’s education system",
        description: "যদিও প্রাথমিক বিদ্যালয়ে শিশুর সংখ্যা বেশ, শিক্ষার মান ও পাঠ্য বোঝাপড়ার অভাব বাংলাদেশের শিক্ষা ব্যবস্থাকে চ্যালেঞ্জ করেছে।",
        imageUrl: "https://www.tbsnews.net/sites/default/files/styles/media_gallery/public/media/images/2025/08/07/broken_ladder.jpg",
        source: 'The Business Standard',
        date: 'আগস্ট ৭, ২০২৪',
        link: "https://www.tbsnews.net/features/big-picture/broken-ladder-analysing-present-and-future-bangladeshs-education-system-1207046",
        tags: ['education system', 'analysis'],
    },
    {
        id: 'news4',
        title: "Education left behind",
        description: "শিক্ষা খাতে রাজনৈতিক হস্তক্ষেপ, শিক্ষক পদে অপসারণ, কাজ থেকে সরে যাওয়া ইত্যাদির কারণে অনেক শিক্ষা প্রতিষ্ঠান অনিশ্চিত অবস্থায় রয়েছে।",
        imageUrl: "https://www.thedailystar.net/sites/default/files/styles/media_main_image/public/media/images/2025/08/11/education_left_behind.jpg",
        source: 'The Daily Star',
        date: 'আগস্ট ১১, ২০২৪',
        link: "https://www.thedailystar.net/news/bangladesh/news/education-left-behind-3959881",
        tags: ['education', 'politics'],
    },
    {
        id: 'news5',
        title: "Why Bangladesh must embrace career education now",
        description: "বিশ্ববিদ্যালয় শেষ ছাত্রদের ক্ষেত্রে কর্মসংস্থান নিশ্চিত করতে ক্যারিয়ার ভিত্তিক শিক্ষা দ্রুত চালু করার প্রয়োজনীয়তা তুলে ধরা হয়েছে।",
        imageUrl: "https://www.dhakatribune.com/uploads/media/2025/10/14/career_education_bd.jpg",
        source: 'Dhaka Tribune',
        date: 'অক্টোবর ১৪, ২০২৪',
        link: "https://www.dhakatribune.com/opinion/op-ed/393908/why-bangladesh-must-embrace-career-education-now",
        tags: ['career education', 'employment'],
    },
    {
        id: 'news6',
        title: "Can’t afford another lost decade for education",
        description: "২০২৫-২৬ সালের বাজেটে শিক্ষার বরাদ্দ কম হওয়ায়, বাংলাদেশ আরও একটো ‘শিক্ষার দশক’ নষ্ট হওয়ার ভয়ে রয়েছে।",
        imageUrl: "https://www.thedailystar.net/sites/default/files/styles/media_main_image/public/media/images/2025/06/06/lost_decade.jpg",
        source: 'The Daily Star',
        date: 'জুন ৬, ২০২৪',
        link: "https://www.thedailystar.net/news/bangladesh/education/news/cant-afford-another-lost-decade-education-3912291",
        tags: ['education budget', 'policy'],
    },
    {
        id: 'news7',
        title: "Children losing education due to funding cuts in Rohingya camps",
        description: "কক্সবাজার রোহিঙ্গা শিবিরে বাজেট সংকটের কারণে ৬,৪০০টি শিক্ষাপ্রতিষ্ঠান বন্ধ হয়েছে — প্রায় ৩ লাখ শিশু শিক্ষার সুযোগ হারাচ্ছে।",
        imageUrl: "https://www.savethechildren.org/sites/default/files/styles/media_gallery/public/media/images/2025/06/children_learning.jpg",
        source: 'Save the Children',
        date: 'জুন ১২, ২০২৪',
        link: "https://www.savethechildren.org/us/about-us/media-and-news/2025-press-releases/about-300000-children-risk-losing-education-learning",
        tags: ['Rohingya', 'education crisis'],
    },
    {
        id: 'news8',
        title: "Education, innovation, and celebration: Agami Fest 2025",
        description: "গুলশানে আয়োজিত Agami Fest ২০২৫-এ নিম্নবিত্ত সম্প্রদায় থেকে আগত শিক্ষার্থীদের জন্য শিক্ষামূলক কার্যক্রম ও উদ্ভাবনী উপস্থাপন করা হয়েছে।",
        imageUrl: "https://www.dhakatribune.com/uploads/media/2025/10/14/agami_fest_2025.jpg",
        source: 'Dhaka Tribune',
        date: 'অক্টোবর ১৪, ২০২৪',
        link: "https://www.dhakatribune.com/bangladesh/education/393812/education-innovation-and-celebration-agami-fest",
        tags: ['Agami Fest', 'innovation'],
    },
    {
        id: 'news9',
        title: "Bangladesh’s Global Brand for Higher Education",
        description: "বাংলাদেশের একাধিক বিশ্ববিদ্যালয় বিশ্ব র‌্যাংকিংয়ে জায়গা করে নিয়েছে এবং উচ্চ শিক্ষা খাতকে ‘গ্লোবাল ব্র্যান্ড’ হিসেবে তুলে ধরা হচ্ছে।",
        imageUrl: "https://www.thedailystar.net/sites/default/files/styles/media_main_image/public/media/images/2025/10/08/higher_education_global.jpg",
        source: 'The Daily Star',
        date: 'অক্টোবর ৮, ২০২৪',
        link: "https://www.thedailystar.net/supplements/superbrands-special-2025/news/bangladeshs-global-brand-higher-education-4005251",
        tags: ['higher education', 'global ranking'],
    },
    {
        id: 'news10',
        title: "Grameen University approved by government",
        description: "২০২৫ সালে সরকার ‘গ্রামীণ বিশ্ববিদ্যালয়’ নামে একটি নতুন বেসরকারি বিশ্ববিদ্যালয় প্রতিষ্ঠার অনুমোদন দিয়েছে, যা গ্রামীণ ট্রাস্ট দ্বারা পরিচালিত হবে।",
        imageUrl: "https://picsum.photos/seed/news10/600/400",
        source: 'Wikipedia',
        date: 'অক্টোবর ১০, ২০২৪',
        link: "https://en.wikipedia.org/wiki/Grameen_University",
        tags: ['Grameen University', 'private university'],
    }
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

            // For site settings
            const settingsRef = doc(db, 'settings', 'config');
            await setDoc(settingsRef, {
                showSubscriptionForm: true,
                activeSmsApi: 'anbu', // Set a default SMS API
            }, { merge: true });


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
                        এই প্রক্রিয়াটি নিম্নলিখিত কালেকশনগুলো তৈরি বা আপডেট করবে: <code className="bg-muted px-1 py-0.5 rounded">users</code>, <code className="bg-muted px-1 py-0.5 rounded">results</code>, <code className="bg-muted px-1 py-0.5 rounded">engineering-colleges</code>, <code className="bg-muted px-1 py-0.5 rounded">medical-colleges</code>, <code className="bg-muted px-1 py-0.5 rounded">public-universities</code>, <code className="bg-muted px-1 py-0.5 rounded">private-universities</code>, <code className="bg-muted px-1 py-0.5 rounded">national-colleges</code>, <code className="bg-muted px-1 py-0.5 rounded">polytechnic-institutes</code>, <code className="bg-muted px-1 py-0.5 rounded">news</code>, <code className="bg-muted px-1 py-0.5 rounded">statistics</code>, এবং <code className="bg-muted px-1 py-0.5 rounded">settings</code>। এটি নিরাপদে একাধিকবার চালানো যেতে পারে।
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
