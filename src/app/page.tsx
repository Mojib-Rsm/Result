
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExamForm } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import type { ExamResult, NewsPost } from '@/types';
import { z } from 'zod';
import { searchResultLegacy } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import { formSchema } from '@/lib/schema';
import ResultAlertForm from '@/components/result-alert-form';
import { Separator } from '@/components/ui/separator';
import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bell, BookOpen, Briefcase, Calendar, FileText, Rss, ExternalLink, Calculator, Phone, Trash2, Plus, MessageCircleQuestion, MessagesSquare, UserPlus, Award, Sparkles, TableIcon, Download } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const GpaCalculatorCard = () => {
  const gradePoints: { [key: string]: number } = {
    'A+': 5.0, 'A': 4.0, 'A-': 3.5, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0,
  };
  const gradeOptions = Object.keys(gradePoints);

  interface Subject {
    id: number;
    name: string;
    grade: string;
  }

  const [subjects, setSubjects] = useState<Subject[]>([{ id: 1, name: '', grade: '' }]);
  const [gpa, setGpa] = useState<number | null>(null);

  const handleAddSubject = () => setSubjects([...subjects, { id: Date.now(), name: '', grade: '' }]);
  const handleRemoveSubject = (id: number) => setSubjects(subjects.filter(s => s.id !== id));
  const handleSubjectChange = (id: number, field: 'name' | 'grade', value: string) => {
    setSubjects(subjects.map(s => (s.id === id ? { ...s, [field]: value } : s)));
    setGpa(null);
  };

  const calculateGpa = () => {
    const validSubjects = subjects.filter(s => s.grade && gradePoints[s.grade] !== undefined);
    if (validSubjects.length === 0) { setGpa(0); return; }
    const totalPoints = validSubjects.reduce((acc, subject) => acc + gradePoints[subject.grade], 0);
    setGpa(totalPoints / validSubjects.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3"><Calculator className="h-6 w-6" /> GPA ক্যালকুলেটর</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-2">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="flex items-center gap-2">
              <Input placeholder={`বিষয় ${index + 1}`} value={subject.name} onChange={e => handleSubjectChange(subject.id, 'name', e.target.value)} />
              <Select value={subject.grade} onValueChange={value => handleSubjectChange(subject.id, 'grade', value)}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="গ্রেড" /></SelectTrigger>
                <SelectContent>{gradeOptions.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(subject.id)} disabled={subjects.length === 1}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleAddSubject}><Plus className="mr-2 h-4 w-4" /> বিষয় যোগ করুন</Button>
            <Button onClick={calculateGpa}><Calculator className="mr-2 h-4 w-4" /> গণনা করুন</Button>
          </div>
          {gpa !== null && (
            <div className="mt-6 text-center p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">আপনার গণনাকৃত GPA হলো:</p>
              <p className="text-5xl font-bold text-primary">{gpa.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const BoardShortCodesCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-3"><TableIcon className="h-6 w-6" /> বোর্ড শর্ট কোড</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader><TableRow><TableHead>বোর্ডের নাম</TableHead><TableHead className="text-right">শর্ট কোড</TableHead></TableRow></TableHeader>
        <TableBody>
          {[
            { name: 'ঢাকা', code: 'DHA' }, { name: 'কুমিল্লা', code: 'COM' }, { name: 'রাজশাহী', code: 'RAJ' }, { name: 'যশোর', code: 'JES' },
            { name: 'চট্টগ্রাম', code: 'CHI' }, { name: 'বরিশাল', code: 'BAR' }, { name: 'সিলেট', code: 'SYL' }, { name: 'দিনাজপুর', code: 'DIN' },
            { name: 'ময়মনসিংহ', code: 'MYM' }, { name: 'মাদ্রাসা', code: 'MAD' }, { name: 'কারিগরি', code: 'TEC' },
          ].map(board => <TableRow key={board.code}><TableCell>{board.name}</TableCell><TableCell className="text-right font-mono">{board.code}</TableCell></TableRow>)}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const BoardHelplineCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-3"><Phone className="h-6 w-6" /> শিক্ষা বোর্ড হেল্পলাইন</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {[
          { board: 'সকল বোর্ডের জন্য', number: '16222' },
          { board: 'বাংলাদেশ পুলিশ হেল্পডেস্ক', number: '999' },
        ].map(line => (
          <li key={line.number} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
            <span>{line.board}</span>
            <a href={`tel:${line.number}`} className="font-bold text-primary">{line.number}</a>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const NewsCard = ({ article }: { article: NewsPost }) => (
  <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
    <Link href={`/education-news/${article.id}`}>
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image src={article.imageUrl || '/logo.png'} alt={article.title} fill objectFit="cover" className="rounded-t-lg" onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
        </div>
      </CardHeader>
    </Link>
    <CardContent className="p-4 flex-grow">
      <Link href={`/education-news/${article.id}`}>
        <h3 className="font-semibold leading-snug line-clamp-2 hover:text-primary">{article.title}</h3>
      </Link>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{article.description}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between items-center">
      <p className="text-xs text-muted-foreground">{article.date}</p>
      <Button asChild variant="secondary" size="sm"><Link href={`/education-news/${article.id}`}>বিস্তারিত <ExternalLink className="ml-1 h-3 w-3" /></Link></Button>
    </CardFooter>
  </Card>
);

const NewsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="p-0"><Skeleton className="aspect-video w-full rounded-t-lg" /></CardHeader>
        <CardContent className="p-4"><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-3 w-full" /></CardContent>
        <CardFooter className="p-4 pt-0"><Skeleton className="h-8 w-24" /></CardFooter>
      </Card>
    ))}
  </div>
);

const NewsSection = () => {
    const [news, setNews] = useState<NewsPost[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const { toast } = useToast();
    const db = getFirestore(app);

    const fetchNews = useCallback(async () => {
        setLoadingNews(true);
        try {
            const newsRef = collection(db, 'news');
            const q = query(newsRef, orderBy('createdAt', 'desc'), limit(6));
            const querySnapshot = await getDocs(q);
            setNews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsPost[]);
        } catch (error) {
            console.error(`Failed to fetch news:`, error);
            toast({ title: "সংবাদ আনতে ব্যর্থ", description: "সংবাদ লোড করা যায়নি।", variant: "destructive" });
        } finally {
            setLoadingNews(false);
        }
    }, [db, toast]);

    useEffect(() => { fetchNews(); }, [fetchNews]);

    return (
        <section>
            <h2 className="text-3xl font-bold text-center mb-8">সর্বশেষ শিক্ষা সংবাদ</h2>
            {loadingNews ? <NewsSkeleton /> : news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((article) => <NewsCard key={article.id} article={article} />)}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">এই বিভাগের জন্য কোনো সংবাদ পাওয়া যায়নি।</p>
            )}
        </section>
    );
};

export default function Home() {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [captchaCookie, setCaptchaCookie] = useState('');
  
  const [siteSettings, setSiteSettings] = useState({
      showSubscriptionForm: true, showNoticeBoard: true, showAdmissionUpdate: true,
      showEducationalResources: true, showCareerHub: true, showNewsSection: true,
      showTools: true, showCommunityForum: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const db = getFirestore(app);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { exam: 'hsc', year: String(new Date().getFullYear()), board: '', roll: '', reg: '', captcha: '' },
  });
  
  const selectedExam = form.watch('exam');
  useEffect(() => {
    if (selectedExam === 'hsc_bm') form.setValue('board', 'tec');
    else if (form.getValues('board') === 'tec') form.setValue('board', '');
  }, [selectedExam, form]);

  const refreshCaptcha = useCallback(async () => {
    form.setValue('captcha', '');
    try {
        const res = await fetch('/api/captcha');
        const data = await res.json();
        setCaptchaUrl(data.img);
        setCaptchaCookie(data.cookie);
    } catch(e) {
        console.error("Failed to refresh captcha", e);
        toast({ title: "ত্রুটি", description: "ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।", variant: "destructive" });
    }
  }, [form, toast]);

  useEffect(() => {
    refreshCaptcha();
    const fetchSettings = async () => {
      setLoadingSettings(true);
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'config'));
        if (settingsSnap.exists()) setSiteSettings(prev => ({...prev, ...settingsSnap.data()}));
      } catch (error) { console.error("Error fetching site settings: ", error); }
      finally { setLoadingSettings(false); }
    };
    fetchSettings();
  }, [refreshCaptcha, db]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true); setResult(null);
    try {
      const searchResult = await searchResultLegacy({ ...values, cookie: captchaCookie });
      if ('error' in searchResult) throw new Error(searchResult.error);
      setResult(searchResult);
      addHistoryItem({ roll: values.roll, reg: values.reg, board: values.board, year: values.year, exam: values.exam, result: searchResult });
    } catch (e: any) {
       toast({ title: "ত্রুটি", description: e.message, variant: "destructive" });
       refreshCaptcha();
    } finally { setIsSubmitting(false); }
  };

  const resetSearch = () => { setResult(null); form.reset(); refreshCaptcha(); };

  const contentSections = [
    { name: 'showNoticeBoard', title: 'নোটিশ বোর্ড', icon: Rss, link: '/education-news', items: [
        { icon: Rss, title: 'বোর্ড ও মন্ত্রণালয়ের নোটিশ', description: 'শিক্ষা বোর্ড ও মন্ত্রণালয়ের সকল নোটিশ।', link: '/education-news/board-and-ministry' },
        { icon: Calendar, title: 'পরীক্ষা ও ফলাফল', description: 'পরীক্ষার তারিখ ও ফলাফল প্রকাশের ঘোষণা।', link: '/education-news/exam-and-results' },
    ]},
    { name: 'showAdmissionUpdate', title: 'ভর্তি নির্দেশনা', icon: BookOpen, link: '/suggestions', items: [
        { icon: BookOpen, title: 'ভর্তি তথ্য', description: 'বিশ্ববিদ্যালয় ও কলেজ ভর্তি সংক্রান্ত সকল তথ্য।', link: '/suggestions' },
        { icon: Calendar, title: 'পরীক্ষার সময়সূচী', description: 'সকল পাবলিক পরীক্ষার সময়সূচী ও রুটিন।', link: '/education-news/exam-and-results' },
    ]},
    { name: 'showEducationalResources', title: 'রেজাল্ট গাইড', icon: FileText, link: '/suggestions', items: [
        { icon: FileText, title: 'মডেল টেস্ট / সাজেশন', description: 'পরীক্ষার প্রস্তুতির জন্য মডেল টেস্ট ও সাজেশন।', link: '/suggestions/model-test' },
        { icon: BookOpen, title: 'স্টাডি গাইড', description: 'SSC, HSC ও বিশ্ববিদ্যালয় ভর্তি গাইড।', link: '/suggestions/study-guide' },
        { icon: Download, title: 'eBook / PDF নোটস', description: 'প্রয়োজনীয় বই ও নোটস ডাউনলোড করুন।', link: '/suggestions/ebook-pdf-notes' },
    ]},
    { name: 'showCareerHub', title: 'ক্যারিয়ার হাব', icon: Briefcase, link: '/career', items: [
        { title: 'শিক্ষা সংক্রান্ত চাকরি', icon: Briefcase, description: 'শিক্ষা ক্ষেত্রে সর্বশেষ চাকরির খবর ও বিজ্ঞপ্তি।', link: '/career/education-jobs'},
        { title: 'শিক্ষক নিয়োগ', icon: UserPlus, description: 'সরকারি-বেসরকারি স্কুল, কলেজ ও বিশ্ববিদ্যালয়ে শিক্ষক নিয়োগের আপডেট।', link: '/career/teacher-recruitment'},
        { title: 'স্কলারশিপ ও ইন্টার্নশিপ', icon: Award, description: 'দেশ-বিদেশের বিভিন্ন স্কলারশিপ ও ইন্টার্নশিপের সুযোগ।', link: '/career/scholarships'},
        { title: 'ক্যারিয়ার গাইডলাইন', icon: Sparkles, description: 'সফল ক্যারিয়ার গড়ার জন্য সিভি তৈরি, ভাইভা প্রস্তুতি ও অন্যান্য টিপস।', link: '/career/guidelines'},
    ]},
];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12" id="main-content">
       <div className="flex flex-col items-center text-center mb-12 no-print">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent animate-fade-in-up">
          BD Edu: Your Education &amp; Career Hub
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground animate-fade-in-up animation-delay-200">
           রেজাল্ট, ভর্তি, শিক্ষা সংবাদ ও গাইড — সব BD Edu তে।
        </p>
      </div>

      {!result ? (
        <div className="space-y-16">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-4 md:p-8">
              <ExamForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} captchaUrl={captchaUrl} onCaptchaRefresh={refreshCaptcha} selectedExam={selectedExam} />
          </div>

          {contentSections.map(section => (
              siteSettings[section.name as keyof typeof siteSettings] && (
                  <div key={section.name}>
                    <Separator />
                    <section className="pt-12">
                      <h2 className="text-3xl font-bold text-center mb-8">{section.title}</h2>
                      <div className={`grid grid-cols-1 sm:grid-cols-2 ${section.items.length > 2 ? 'lg:grid-cols-' + Math.min(section.items.length, 4) : ''} gap-6`}>
                          {section.items.map(item => (
                              <Card key={item.title} className="hover:shadow-lg transition-shadow">
                                  <CardHeader><CardTitle className="flex items-center gap-3">{item.icon && <item.icon className="h-6 w-6 text-primary" />} {item.title}</CardTitle></CardHeader>
                                  <CardContent><CardDescription>{item.description}</CardDescription></CardContent>
                                  <CardFooter><Button variant="link" asChild><Link href={item.link}>আরও দেখুন...</Link></Button></CardFooter>
                              </Card>
                          ))}
                      </div>
                    </section>
                  </div>
              )
          ))}

          {siteSettings.showNewsSection && <><Separator /><div className="pt-12"><NewsSection /></div></>}
          
          {siteSettings.showTools && (
            <><Separator />
            <section className="pt-12">
              <h2 className="text-3xl font-bold text-center mb-8">টুলস ও ফিচার</h2>
              <div className="space-y-4">
                <GpaCalculatorCard />
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-3"><Rss className="h-6 w-6" /> রেজাল্ট SMS ফরম্যাট</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">যেকোনো মোবাইল থেকে SMS-এর মাধ্যমে ফলাফল পেতে নিচের ফরম্যাট অনুসরণ করুন এবং 16222 নম্বরে পাঠান।</p>
                    <div className="space-y-2">
                      <p><strong>HSC:</strong> <code className="bg-muted px-2 py-1 rounded">HSC &lt;Space&gt; বোর্ডের নামের প্রথম ৩ অক্ষর &lt;Space&gt; রোল নম্বর &lt;Space&gt; বছর</code></p>
                      <p><strong>SSC:</strong> <code className="bg-muted px-2 py-1 rounded">SSC &lt;Space&gt; বোর্ডের নামের প্রথম ৩ অক্ষর &lt;Space&gt; রোল নম্বর &lt;Space&gt; বছর</code></p>
                      <p><strong>JSC:</strong> <code className="bg-muted px-2 py-1 rounded">JSC &lt;Space&gt; বোর্ডের নামের প্রথম ৩ অক্ষর &lt;Space&gt; রোল নম্বর &lt;Space&gt; বছর</code></p>
                      <p><strong>Dakhil:</strong> <code className="bg-muted px-2 py-1 rounded">DAKHIL &lt;Space&gt; MAD &lt;Space&gt; রোল নম্বর &lt;Space&gt; বছর</code></p>
                    </div>
                  </CardContent>
                </Card>
                <BoardShortCodesCard />
                <BoardHelplineCard />
              </div>
            </section></>
          )}

          {siteSettings.showCommunityForum && (
            <><Separator />
             <section className="pt-12">
                <h2 className="text-3xl font-bold text-center mb-8">স্টুডেন্ট কমিউনিটি ফোরাম</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3"><MessageCircleQuestion className="h-6 w-6" /> প্রশ্নোত্তর পর্ব (Q&amp;A)</CardTitle>
                          <CardDescription>আপনার প্রশ্নটি এখানে জমা দিন এবং কমিউনিটির কাছ থেকে উত্তর পান।</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Button asChild className="w-full">
                              <Link href="/community/qna">প্রশ্ন করতে ক্লিক করুন</Link>
                          </Button>
                      </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3"><MessagesSquare className="h-6 w-6" /> আলোচনা ও মন্তব্য</CardTitle>
                          <CardDescription>শিক্ষার্থীরা এখানে বিভিন্ন বিষয় নিয়ে আলোচনা করতে পারেন।</CardDescription>
                      </CardHeader>
                      <CardContent>
                           <Button asChild className="w-full">
                              <Link href="/community/forum">আলোচনা শুরু করুন</Link>
                          </Button>
                      </CardContent>
                  </Card>
                </div>
            </section></>
           )}

           <Separator />
           {loadingSettings ? <Skeleton className="h-96 w-full" /> : siteSettings.showSubscriptionForm && <div className="pt-12"><ResultAlertForm /></div>}
        </div>
      ) : (
        <ResultsDisplay result={result} onReset={resetSearch} />
      )}
    </div>
  );
}
