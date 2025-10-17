
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

const jobsToSeed = [
    {
        id: 'job1',
        title: 'Senior Software Engineer (React)',
        companyName: 'Oftern IT',
        companyLogoUrl: 'https://www.oftern.com/images/logo-light.png',
        location: 'ঢাকা, বাংলাদেশ',
        type: 'Full-time',
        category: 'IT',
        experienceLevel: 'Senior',
        salary: 'আলোচনা সাপেক্ষে',
        description: 'আমরা একজন অভিজ্ঞ সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার খুঁজছি যিনি আমাদের ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট টিমে নেতৃত্ব দেবেন। প্রার্থীকে অবশ্যই React এবং আধুনিক ওয়েব প্রযুক্তিতে দক্ষ হতে হবে।',
        requirements: 'কম্পিউটার সায়েন্সে স্নাতক ডিগ্রি। React এবং Node.js-এ কমপক্ষে ৪ বছরের অভিজ্ঞতা। ক্লাউড টেকনোলজি (AWS/GCP) সম্পর্কে ভালো ধারণা।',
        applyLink: 'https://www.oftern.com/career',
        deadline: '2025-12-31',
    },
    {
        id: 'job2',
        title: 'Lecturer in English',
        companyName: 'Dhaka City College',
        companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Dhaka_City_College_Logo.png',
        location: 'ঢাকা',
        type: 'Full-time',
        category: 'Teaching',
        experienceLevel: 'Mid',
        salary: 'কলেজের বেতন কাঠামো অনুযায়ী',
        description: 'ইংরেজি বিভাগে লেকচারার পদে নিয়োগের জন্য আবেদনপত্র আহ্বান করা হচ্ছে। প্রার্থীকে অবশ্যই ইউজিসি-এর নিয়ম অনুযায়ী যোগ্যতা সম্পন্ন হতে হবে।',
        requirements: 'ইংরেজি সাহিত্যে স্নাতক ও স্নাতকোত্তর ডিগ্রি। উভয় পরীক্ষায় প্রথম শ্রেণি থাকতে হবে। পূর্ববর্তী শিক্ষকতার অভিজ্ঞতা অগ্রাধিকার পাবে।',
        applyLink: '#',
        deadline: '2025-11-30',
    },
    {
        id: 'job3',
        title: 'Digital Marketing Manager',
        companyName: 'BartaNow',
        companyLogoUrl: 'https://www.mojib.me/img/work/bartanow.png',
        location: 'Remote',
        type: 'Remote',
        category: 'Marketing',
        experienceLevel: 'Mid',
        description: 'আমাদের ডিজিটাল মার্কেটিং টিমের জন্য একজন দক্ষ ম্যানেজার প্রয়োজন। প্রার্থীকে SEO, SMM এবং কন্টেন্ট মার্কেটিং-এ অভিজ্ঞ হতে হবে।',
        requirements: 'মার্কেটিং বা সংশ্লিষ্ট বিষয়ে স্নাতক। ডিজিটাল মার্কেটিং-এ কমপক্ষে ৩ বছরের অভিজ্ঞতা। চমৎকার যোগাযোগ দক্ষতা।',
        applyLink: '#',
        deadline: '2025-11-20',
    }
].map(job => ({ ...job, postedAt: serverTimestamp() }));


const newsItems = [
    {
        id: 'news1',
        title: "শিক্ষকদের এমপিওভুক্তির দাবিতে পদযাত্রা স্থগিত",
        description: "এমপিওভুক্ত শিক্ষক ও কর্মীরা তাদের দাবি আদায়ে সচিবালয়ের দিকে পদযাত্রার ঘোষণা দিলেও পরে তা স্থগিত করেন।",
        content: "এমপিওভুক্ত বেসরকারি শিক্ষা প্রতিষ্ঠানের শিক্ষক ও কর্মচারীরা তাদের চাকরি জাতীয়করণের দাবিতে টানা তৃতীয় দিনের মতো অবস্থান কর্মসূচি পালন করছেন। এর অংশ হিসেবে তারা সচিবালয়ের দিকে পদযাত্রার ঘোষণা দিয়েছিলেন, যা পরে বিকাল ৪টা পর্যন্ত স্থগিত করা হয়েছে। দাবি আদায় না হলে তারা কঠোর কর্মসূচির হুঁশিয়ারি দিয়েছেন।",
        imageUrl: "https://www.tbsnews.net/sites/default/files/styles/media_gallery/public/media/images/2025/10/14/teachers_long_march.jpg",
        source: 'The Business Standard',
        date: format(new Date('2024-10-14'), 'MMMM dd, yyyy'),
        link: "https://www.tbsnews.net/bangladesh/teachers-continue-sit-3rd-day-announce-long-march-towards-secretariat-1260011",
        category: 'Notice',
        tags: ['teachers', 'protest', 'MPO', 'notice'],
    },
    {
        id: 'news2',
        title: "শিক্ষামন্ত্রীর সাথে শিক্ষকদের বৈঠক, সমাধানের আশ্বাস",
        description: "আন্দোলনরত শিক্ষকদের একটি প্রতিনিধি দল শিক্ষামন্ত্রীর সাথে বৈঠক করেছে। মন্ত্রী তাদের দাবিগুলো বিবেচনার আশ্বাস দিয়েছেন।",
        content: "এমপিওভুক্ত শিক্ষক-কর্মচারীরা তাদের চাকরি জাতীয়করণের দাবিতে আন্দোলন চালিয়ে যাচ্ছেন। এর পরিপ্রেক্ষিতে, শিক্ষকদের একটি প্রতিনিধি দল শিক্ষামন্ত্রীর সাথে বৈঠক করেছেন। বৈঠকে শিক্ষামন্ত্রী তাদের দাবিগুলো মনোযোগ দিয়ে শোনেন এবং যত দ্রুত সম্ভব সমাধানের আশ্বাস দেন।",
        imageUrl: "https://images.prothomalo.com/prothomalo-bangla%2F2023-07%2F98f49359-a51c-433f-b674-8b6b135c363e%2FIMG_5016.JPG",
        source: 'প্রথম আলো',
        date: format(new Date('2024-10-15'), 'MMMM dd, yyyy'),
        link: "#",
        category: 'Ministry',
        tags: ['ministry', 'teachers', 'meeting'],
    },
    {
        id: 'news3',
        title: "শিক্ষা ব্যবস্থার সংকট ও ভবিষ্যৎ করণীয়",
        description: "প্রাথমিক স্তরে শিক্ষার মান এবং পাঠ্যক্রমের কার্যকারিতা নিয়ে একটি বিশ্লেষণধর্মী প্রতিবেদন।",
        content: "বাংলাদেশের শিক্ষা ব্যবস্থায় প্রাথমিক স্তরে তালিকাভুক্তির হার প্রায় শতভাগ হলেও, শিক্ষার মান নিয়ে गंभीर উদ্বেগ রয়েছে। অনেক শিক্ষার্থী প্রাথমিক শিক্ষা শেষ করেও সঠিকভাবে পড়তে বা লিখতে পারে না। এই সমস্যাটি 'শেখার সংকট' হিসেবে পরিচিত এবং এটি দেশের ভবিষ্যৎ মানবসম্পদ উন্নয়নের জন্য একটি বড় বাধা। নতুন পাঠ্যক্রম এবং শিক্ষাদান পদ্ধতির মাধ্যমে এই সংকট মোকাবিলার চেষ্টা করা হচ্ছে, তবে এর কার্যকারিতা এখনো পর্যালোচনার অধীনে।",
        imageUrl: "https://www.tbsnews.net/sites/default/files/styles/media_gallery/public/media/images/2025/08/07/broken_ladder.jpg",
        source: 'The Business Standard',
        date: format(new Date('2024-08-07'), 'MMMM dd, yyyy'),
        link: "https://www.tbsnews.net/features/big-picture/broken-ladder-analysing-present-and-future-bangladeshs-education-system-1207046",
        category: 'General',
        tags: ['education system', 'analysis', 'general'],
    },
    {
        id: 'news4',
        title: "এইচএসসি পরীক্ষার ফলাফল প্রকাশের সম্ভাব্য তারিখ ঘোষণা",
        description: "আগামী মাসের প্রথম সপ্তাহে এইচএসসি ও সমমান পরীক্ষার ফলাফল প্রকাশিত হতে পারে বলে জানিয়েছে শিক্ষা বোর্ড।",
        content: "২০২৪ সালের এইচএসসি ও সমমান পরীক্ষার ফলাফল আগামী মাসের প্রথম সপ্তাহে প্রকাশিত হতে পারে। শিক্ষা বোর্ডগুলো জানিয়েছে, ফলাফল তৈরির কাজ প্রায় শেষ পর্যায়ে এবং প্রধানমন্ত্রীর সম্মতি পেলেই তারিখ চূড়ান্ত করা হবে। শিক্ষার্থীরা অধীর আগ্রহে ফলাফলের জন্য অপেক্ষা করছে।",
        imageUrl: "https://images.somoynews.tv/medium/img_650x366_2023_11_26_16_17_26_65631c3ad94d2.jpg",
        source: 'সময় নিউজ',
        date: format(new Date('2024-10-16'), 'MMMM dd, yyyy'),
        link: "#",
        category: 'Result',
        tags: ['hsc', 'result', 'education board'],
    },
     {
        id: 'news5',
        title: "HSC পরীক্ষার নতুন মানবণ্টন প্রকাশ করলো ঢাকা বোর্ড",
        description: "ঢাকা শিক্ষা বোর্ড ২০২৫ সালের এইচএসসি পরীক্ষার জন্য নতুন মানবণ্টন প্রকাশ করেছে। এতে সৃজনশীল ও বহুনির্বাচনী প্রশ্নের নম্বরে পরিবর্তন আনা হয়েছে।",
        content: "২০২৫ সাল থেকে অনুষ্ঠেয় এইচএসসি পরীক্ষার জন্য নতুন মানবণ্টন প্রকাশ করেছে ঢাকা শিক্ষা বোর্ড। নতুন এই মানবণ্টনে সৃজনশীল এবং বহুনির্বাচনী অংশের নম্বরের অনুপাতে পরিবর্তন আনা হয়েছে। বোর্ড জানিয়েছে, শিক্ষার্থীদের মুখস্থনির্ভরতা কমিয়ে চিন্তাশীল ও সৃজনশীল করে তুলতেই এই উদ্যোগ নেওয়া হয়েছে।",
        imageUrl: "https://www.jugantor.com/assets/news_photos/2022/11/06/image-327573-1667755376.jpg",
        source: 'যুগান্তর',
        date: format(new Date('2024-10-12'), 'MMMM dd, yyyy'),
        link: "#",
        category: 'Board',
        tags: ['hsc', 'board', 'dhaka board', 'notice'],
    },
    {
        id: 'news6',
        title: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষার সম্ভাব্য তারিখ ঘোষণা",
        description: "পাবলিক বিশ্ববিদ্যালয়গুলোর সমন্বিত ভর্তি পরীক্ষার সম্ভাব্য তারিখ ঘোষণা করেছে কর্তৃপক্ষ। পরীক্ষা আগামী বছরের মার্চ মাসে শুরু হতে পারে।",
        content: "দেশের পাবলিক বিশ্ববিদ্যালয়গুলোতে গুচ্ছ পদ্ধতিতে ভর্তি পরীক্ষার সম্ভাব্য তারিখ ঘোষণা করা হয়েছে। জানা গেছে, আগামী বছরের মার্চ মাস থেকে বিভিন্ন ইউনিটের পরীক্ষা শুরু হতে পারে। ভর্তিচ্ছু শিক্ষার্থীদের সে অনুযায়ী প্রস্তুতি নেওয়ার আহ্বান জানানো হয়েছে।",
        imageUrl: "https://www.kalerkantho.com/images/2022/10/18/69595_Guccho-Vorti.jpg",
        source: 'কালের কণ্ঠ',
        date: format(new Date('2024-10-11'), 'MMMM dd, yyyy'),
        link: "#",
        category: 'Exam',
        tags: ['admission', 'exam', 'university'],
    }
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

const pagesToSeed = [
    {
        slug: 'about-us',
        title: 'আমাদের সম্পর্কে',
        content: `BD Edu Hub হলো বাংলাদেশের শিক্ষার্থীদের জন্য একটি ওয়ান-স্টপ সমাধান। আমাদের লক্ষ্য হলো পরীক্ষার ফলাফল, ভর্তি তথ্য, ক্যারিয়ার গাইডলাইন এবং শিক্ষামূলক রিসোর্সগুলোকে সবার জন্য সহজলভ্য করে তোলা। আমরা বিশ্বাস করি, সঠিক তথ্য এবং দিকনির্দেশনা শিক্ষার্থীদের তাদের স্বপ্নের পথে এগিয়ে যেতে সাহায্য করে।\n\nএই প্ল্যাটফর্মটি Oftern দ্বারা পরিচালিত। Oftern একটি প্রযুক্তি-ভিত্তিক প্রতিষ্ঠান, যা ডিজিটাল সমাধান তৈরির মাধ্যমে মানুষের জীবনকে সহজ করতে প্রতিশ্রুতিবদ্ধ। আমাদের ডেভেলপার এবং ডিজাইনারদের টিম শিক্ষার্থীদের জন্য একটি সুন্দর এবং কার্যকরী অভিজ্ঞতা নিশ্চিত করতে অক্লান্ত পরিশ্রম করে যাচ্ছে।`
    },
    {
        slug: 'privacy-policy',
        title: 'গোপনীয়তা নীতি',
        content: `BD Edu Hub আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই নীতিটি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।\n\n**যে তথ্য আমরা সংগ্রহ করি:**\n- ফলাফল অনুসন্ধানের তথ্য (রোল, বোর্ড, ইত্যাদি)\n- সাবস্ক্রিপশন তথ্য (ফোন নম্বর)\n- যোগাযোগের তথ্য (নাম, ইমেইল)\n\n**তথ্যের ব্যবহার:**\nআপনার তথ্য শুধুমাত্র ফলাফল প্রদর্শন, SMS অ্যালার্ট পাঠানো এবং আমাদের পরিষেবা উন্নত করার জন্য ব্যবহৃত হয়। আমরা আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রয় করি না।`
    },
    {
        slug: 'disclaimer',
        title: 'দাবিত্যাগ',
        content: `BD Edu Hub ওয়েবসাইটের সমস্ত তথ্য শুধুমাত্র সাধারণ তথ্যের উদ্দেশ্যে সরবরাহ করা হয়েছে। আমরা এই তথ্যের সম্পূর্ণতা বা নির্ভুলতার বিষয়ে কোনো গ্যারান্টি প্রদান করি না। এই সাইটের তথ্যের উপর ভিত্তি করে কোনো সিদ্ধান্ত গ্রহণের সম্পূর্ণ ঝুঁকি আপনার নিজের। চূড়ান্ত ফলাফলের জন্য নিজ নিজ শিক্ষা বোর্ডের অফিসিয়াল ডকুমেন্ট ব্যবহার করুন।`
    },
    {
        slug: 'terms-and-conditions',
        title: 'শর্তাবলী',
        content: `এই ওয়েবসাইটটি ব্যবহার করার মাধ্যমে, আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।\n\n- এই সাইটটি শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে ব্যবহৃত হবে।\n- ফলাফলের নির্ভুলতার জন্য আমরা দায়ী নই। চূড়ান্ত ফলাফলের জন্য বোর্ডের অফিসিয়াল ডকুমেন্ট দেখুন।\n- আমরা কোনো পূর্ব বিজ্ঞপ্তি ছাড়াই পরিষেবা পরিবর্তন করার অধিকার রাখি।`
    }
];

const questionsToSeed = [
  {
    id: 'q1',
    title: 'HSC পরীক্ষার পর কোন বিষয়ে পড়লে ভালো হবে?',
    content: 'আমি এইবার এইচএসসি পরীক্ষা দিয়েছি। এখন কোন বিষয়ে অনার্স করলে ভবিষ্যতে চাকরির বাজারে ভালো সুযোগ পাওয়া যাবে, এ বিষয়ে পরামর্শ প্রয়োজন। আমার গ্রুপ ছিল বিজ্ঞান।',
    author: 'সাকিব আল হাসান',
    authorId: 'user1',
    tags: ['hsc', 'admission', 'career'],
    createdAt: serverTimestamp(),
    answers: [],
  },
  {
    id: 'q2',
    title: 'ঢাকা বিশ্ববিদ্যালয়ে "ক" ইউনিটে ভর্তির জন্য কীভাবে প্রস্তুতি নেব?',
    content: 'আমি একজন এইচএসসি পরীক্ষার্থী এবং আমার স্বপ্ন ঢাকা বিশ্ববিদ্যালয়ে পড়া। "ক" ইউনিটে ভর্তির জন্য সেরা প্রস্তুতির কৌশল কী হতে পারে? কোন কোন বই পড়া উচিত?',
    author: 'আফিফা খাতুন',
    authorId: 'user2',
    tags: ['admission', 'dhaka-university', 'preparation'],
    createdAt: serverTimestamp(),
    answers: [],
  }
];

const forumPostsToSeed = [
  {
    id: 'fp1',
    title: 'নতুন শিক্ষাক্রম নিয়ে আলোচনা',
    content: 'সরকারের নতুন শিক্ষাক্রম সম্পর্কে আপনাদের মতামত কী? এটি কি সত্যিই শিক্ষার্থীদের জন্য উপকারী হবে? আমার মনে হয়, এর কিছু ভালো দিক থাকলেও প্রায়োগিক ক্ষেত্রে অনেক চ্যালেঞ্জ রয়েছে।',
    author: 'একজন অভিভাবক',
    authorId: 'user3',
    tags: ['curriculum', 'education-system'],
    createdAt: serverTimestamp(),
    comments: [],
  },
  {
    id: 'fp2',
    title: 'পাবলিক ভার্সেস প্রাইভেট বিশ্ববিদ্যালয়: কোনটি ভালো?',
    content: 'আমি দ্বিধায় আছি, পাবলিক বিশ্ববিদ্যালয়ে পড়ব নাকি প্রাইভেট বিশ্ববিদ্যালয়ে? খরচের পাশাপাশি শিক্ষার মান, চাকরির সুযোগ এবং অন্যান্য বিষয়গুলো নিয়ে আলোচনা করতে চাই।',
    author: 'রিফাত আহমেদ',
    authorId: 'user4',
    tags: ['university', 'admission', 'public-vs-private'],
    createdAt: serverTimestamp(),
    comments: [],
  }
];

export default function SeedingPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();
    const db = getFirestore(app);

    const seedCollection = async (collectionName: string, data: any[], idKey = 'id') => {
        const batch = writeBatch(db);
        data.forEach((item) => {
            const docId = item[idKey];
            if (!docId) {
                console.warn(`Skipping item in ${'${collectionName}'} due to missing ID:`, item);
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
                seedCollection('news', newsItems),
                seedCollection('jobs', jobsToSeed),
                seedCollection('pages', pagesToSeed, 'slug'),
                seedCollection('questions', questionsToSeed),
                seedCollection('forum_posts', forumPostsToSeed),
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
                        এই প্রক্রিয়াটি নিম্নলিখিত কালেকশনগুলো তৈরি বা আপডেট করবে: <code className="bg-muted px-1 py-0.5 rounded">users</code>, <code className="bg-muted px-1 py-0.5 rounded">news</code>, <code className="bg-muted px-1 py-0.5 rounded">jobs</code>, <code className="bg-muted px-1 py-0.5 rounded">pages</code>, <code className="bg-muted px-1 py-0.5 rounded">questions</code>, <code className="bg-muted px-1 py-0.5 rounded">forum_posts</code>, <code className="bg-muted px-1 py-0.5 rounded">statistics</code>, এবং <code className="bg-muted px-1 py-0.5 rounded">settings</code>। এটি নিরাপদে একাধিকবার চালানো যেতে পারে।
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
