
'use client';

import { useState } from 'react';
import { getFirestore, setDoc, doc, writeBatch, serverTimestamp, collection } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DatabaseZap } from 'lucide-react';
import { format } from 'date-fns';

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
        content: "MPO-তালিকাভুক্ত বেসরকারি শিক্ষা প্রতিষ্ঠানের শিক্ষক ও কর্মচারীরা তাদের চাকরি জাতীয়করণের দাবিতে টানা তৃতীয় দিনের মতো অবস্থান কর্মসূচি পালন করছেন। এর অংশ হিসেবে তারা সচিবালয়ের দিকে পদযাত্রার ঘোষণা দিয়েছিলেন, যা পরে বিকাল ৪টা পর্যন্ত স্থগিত করা হয়েছে। দাবি আদায় না হলে তারা কঠোর কর্মসূচির হুঁশিয়ারি দিয়েছেন। এর আগে, এমপিওভুক্ত শিক্ষক-কর্মচারী জাতীয়করণ প্রত্যাশী মহাজোটের ব্যানারে তারা এই কর্মসূচি শুরু করেন। তাদের প্রধান দাবিগুলোর মধ্যে রয়েছে—ঈদুল আজহার আগে জাতীয়করণের সুস্পষ্ট ঘোষণা, সরকারি শিক্ষক-কর্মচারীদের মতো পূর্ণাঙ্গ উৎসব ভাতা, বাড়ি ভাড়া ও মেডিকেল ভাতা প্রদান।",
        imageUrl: "https://www.tbsnews.net/sites/default/files/styles/media_gallery/public/media/images/2025/10/14/teachers_long_march.jpg",
        source: 'The Business Standard',
        date: format(new Date('2024-10-14'), 'MMMM dd, yyyy'),
        link: "https://www.tbsnews.net/bangladesh/teachers-continue-sit-3rd-day-announce-long-march-towards-secretariat-1260011",
        tags: ['teachers', 'protest', 'MPO'],
    },
    {
        id: 'news2',
        title: "‘March to Secretariat’: MPO teachers give govt deadline",
        description: "MPO-সংবলিত শিক্ষক ও কর্মীরা সরকারকে নির্ধারিত সময়ের মধ্যে তাদের দাবি মেটাতে বলেন, নাহলে তারা সচিবালয় পর্যন্ত মিছিল করবেন।",
        content: "এমপিওভুক্ত শিক্ষক-কর্মচারীরা তাদের চাকরি জাতীয়করণের দাবিতে সরকারকে একটি নির্দিষ্ট সময়সীমা বেঁধে দিয়েছেন। এই সময়ের মধ্যে দাবি পূরণ না হলে তারা সচিবালয়ের দিকে পদযাত্রার কর্মসূচি ঘোষণা করেছেন। শিক্ষকরা জানিয়েছেন, দীর্ঘদিন ধরে তারা তাদের ন্যায্য দাবিগুলো জানিয়ে আসছেন, কিন্তু কোনো সমাধান না হওয়ায় তারা কঠোর কর্মসূচিতে যেতে বাধ্য হচ্ছেন।",
        imageUrl: "https://picsum.photos/seed/news2/600/400",
        source: 'bdnews24.com',
        date: format(new Date('2024-10-13'), 'MMMM dd, yyyy'),
        link: "https://bdnews24.com/bangladesh/8e99209c1a04",
        tags: ['teachers', 'protest', 'deadline'],
    },
    {
        id: 'news3',
        title: "The broken ladder: Analysing the present and future of Bangladesh’s education system",
        description: "যদিও প্রাথমিক বিদ্যালয়ে শিশুর সংখ্যা বেশ, শিক্ষার মান ও পাঠ্য বোঝাপড়ার অভাব বাংলাদেশের শিক্ষা ব্যবস্থাকে চ্যালেঞ্জ করেছে।",
        content: "বাংলাদেশের শিক্ষা ব্যবস্থায় প্রাথমিক স্তরে তালিকাভুক্তির হার প্রায় শতভাগ হলেও, শিক্ষার মান নিয়ে गंभीर উদ্বেগ রয়েছে। অনেক শিক্ষার্থী প্রাথমিক শিক্ষা শেষ করেও সঠিকভাবে পড়তে বা লিখতে পারে না। এই সমস্যাটি 'শেখার সংকট' হিসেবে পরিচিত এবং এটি দেশের ভবিষ্যৎ মানবসম্পদ উন্নয়নের জন্য একটি বড় বাধা। নতুন পাঠ্যক্রম এবং শিক্ষাদান পদ্ধতির মাধ্যমে এই সংকট মোকাবিলার চেষ্টা করা হচ্ছে, তবে এর কার্যকারিতা এখনো পর্যালোচনার অধীনে।",
        imageUrl: "https://www.tbsnews.net/sites/default/files/styles/media_gallery/public/media/images/2025/08/07/broken_ladder.jpg",
        source: 'The Business Standard',
        date: format(new Date('2024-08-07'), 'MMMM dd, yyyy'),
        link: "https://www.tbsnews.net/features/big-picture/broken-ladder-analysing-present-and-future-bangladeshs-education-system-1207046",
        tags: ['education system', 'analysis'],
    },
    {
        id: 'news4',
        title: "Education left behind",
        description: "শিক্ষা খাতে রাজনৈতিক হস্তক্ষেপ, শিক্ষক পদে অপসারণ, কাজ থেকে সরে যাওয়া ইত্যাদির কারণে অনেক শিক্ষা প্রতিষ্ঠান অনিশ্চিত অবস্থায় রয়েছে।",
        content: "রাজনৈতিক অস্থিরতা এবং প্রশাসনিক জটিলতার কারণে বাংলাদেশের শিক্ষা খাত মারাত্মকভাবে ক্ষতিগ্রস্ত হয়েছে। অনেক শিক্ষককে রাজনৈতিক কারণে তাদের পদ থেকে সরিয়ে দেওয়া হয়েছে এবং নতুন নিয়োগ প্রক্রিয়াও স্থবির হয়ে আছে। এর ফলে, অনেক শিক্ষা প্রতিষ্ঠানে শিক্ষকের অভাব দেখা দিয়েছে এবং পাঠদান কার্যক্রম ব্যাহত হচ্ছে। এই অনিশ্চয়তা শিক্ষার্থীদের ভবিষ্যৎ এবং দেশের সামগ্রিক শিক্ষা ব্যবস্থার উপর নেতিবাচক প্রভাব ফেলছে।",
        imageUrl: "https://www.thedailystar.net/sites/default/files/styles/media_main_image/public/media/images/2025/08/11/education_left_behind.jpg",
        source: 'The Daily Star',
        date: format(new Date('2024-08-11'), 'MMMM dd, yyyy'),
        link: "https://www.thedailystar.net/news/bangladesh/news/education-left-behind-3959881",
        tags: ['education', 'politics'],
    },
].map(news => ({ ...news, createdAt: serverTimestamp() }));

const hsc2025Stats = {
    totalExaminees: 1251111,
    totalPassed: 726960,
    passRate: 58.83,
    totalGpa5: 69097,
    boardWiseGpa5: [
        { board: 'ঢাকা', gpa5: 26063 },
        { board: 'রাজশাহী', gpa5: 6259 },
        { board: 'কুমিল্লা', gpa5: 1704 },
        { board: 'যশোর', gpa5: 5498 },
        { board: 'চট্টগ্রাম', gpa5: 6097 },
        { board: 'বরিশাল', gpa5: 1674 },
        { board: 'সিলেট', gpa5: 1602 },
        { board: 'দিনাজপুর', gpa5: 6260 },
        { board: 'ময়মনসিংহ', gpa5: 2706 },
        { board: 'মাদ্রাসা', gpa5: 4268 },
        { board: 'কারিগরি', gpa5: 4231 },
    ],
    boardWisePassRate: [
        { board: 'ঢাকা', passRate: 64.62 },
        { board: 'রাজশাহী', passRate: 59.40 },
        { board: 'কুমিল্লা', passRate: 48.86 },
        { board: 'যশোর', passRate: 50.20 },
        { board: 'চট্টগ্রাম', passRate: 52.57 },
        { board: 'বরিশাল', passRate: 62.57 },
        { board: 'সিলেট', passRate: 51.86 },
        { board: 'দিনাজপুর', passRate: 57.49 },
        { board: 'ময়মনসিংহ', passRate: 51.54 },
        { board: 'মাদ্রাসা', passRate: 75.61 },
        { board: 'কারিগরি', passRate: 62.67 },
    ]
};


export default function SeedingPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();
    const db = getFirestore(app);

    const seedCollection = async (collectionName: string, data: any[], idKey = 'id') => {
        const batch = writeBatch(db);
        data.forEach((item) => {
            const docId = item[idKey];
            if (!docId) {
                console.warn(`Skipping item in ${collectionName} due to missing ID:`, item);
                return;
            }
            const docRef = doc(db, collectionName, docId);
            const { [idKey]: _, ...itemData } = item;
            batch.set(docRef, itemData);
        });
        await batch.commit();
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await Promise.all([
                seedCollection('users', usersToSeed),
                seedCollection('results', resultsToSeed, 'roll'),
                seedCollection('engineering-colleges', engineeringColleges),
                seedCollection('medical-colleges', medicalColleges),
                seedCollection('public-universities', publicUniversities),
                seedCollection('private-universities', privateUniversities),
                seedCollection('national-colleges', nationalColleges),
                seedCollection('polytechnic-institutes', polytechnicInstitutes),
                seedCollection('news', newsItems),
            ]);

            // For single doc statistics
            const statsRef = doc(db, 'statistics', 'hsc2025');
            await setDoc(statsRef, hsc2025Stats);

            // For site settings
            const settingsRef = doc(db, 'settings', 'config');
            await setDoc(settingsRef, {
                showSubscriptionForm: true,
                showNoticeBoard: true,
                showAdmissionUpdate: true,
                showEducationalResources: true,
                showCareerHub: true,
                showNewsSection: true,
                showTools: true,
                showCommunityForum: true,
                activeSmsApi: 'anbu',
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
