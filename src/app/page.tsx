
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExamForm } from '@/components/exam-form';
import ResultsDisplay from '@/components/results-display';
import type { ExamResult } from '@/types';
import { z } from 'zod';
import { searchResultLegacy } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import { formSchema } from '@/lib/schema';
import ResultAlertForm from '@/components/result-alert-form';
import { Separator } from '@/components/ui/separator';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bell, BookOpen, Briefcase, Calendar, FileText, Rss, ExternalLink, Calculator, MessageSquare, ListChecks, Phone, Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewsArticle {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: { name: string };
}

const gradePoints: { [key: string]: number } = {
  'A+': 5.0,
  'A': 4.0,
  'A-': 3.5,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
};

const gradeOptions = Object.keys(gradePoints);

interface Subject {
  id: number;
  name: string;
  grade: string;
}


const GpaCalculatorCard = () => {
  const [subjects, setSubjects] = useState<Subject[]>([{ id: 1, name: '', grade: '' }]);
  const [gpa, setGpa] = useState<number | null>(null);

  const handleAddSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', grade: '' }]);
  };

  const handleRemoveSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleSubjectChange = (id: number, field: 'name' | 'grade', value: string) => {
    setSubjects(subjects.map(s => (s.id === id ? { ...s, [field]: value } : s)));
    setGpa(null); // Reset GPA when subjects change
  };

  const calculateGpa = () => {
    const validSubjects = subjects.filter(s => s.grade && gradePoints[s.grade] !== undefined);
    if (validSubjects.length === 0) {
      setGpa(0);
      return;
    }

    const totalPoints = validSubjects.reduce((acc, subject) => {
      return acc + gradePoints[subject.grade];
    }, 0);

    const averageGpa = totalPoints / validSubjects.length;
    setGpa(averageGpa);
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Calculator className="h-6 w-6" /> GPA ক্যালকুলেটর
            </CardTitle>
            <CardDescription>আপনার বিষয়ভিত্তিক গ্রেড ব্যবহার করে GPA গণনা করুন।</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-2">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="flex items-center gap-2">
              <Input
                placeholder={`বিষয় ${index + 1}`}
                value={subject.name}
                onChange={e => handleSubjectChange(subject.id, 'name', e.target.value)}
                className="w-full"
              />
              <Select value={subject.grade} onValueChange={value => handleSubjectChange(subject.id, 'grade', value)}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="গ্রেড" /></SelectTrigger>
                <SelectContent>
                  {gradeOptions.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(subject.id)} disabled={subjects.length === 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
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


const NewsCard = ({ article }: { article: NewsArticle }) => (
    <Card className="flex flex-col overflow-hidden">
        <CardHeader className="p-0">
            <div className="aspect-video relative">
                <Image
                    src={article.urlToImage || '/logo.png'}
                    alt={article.title}
                    fill
                    objectFit="cover"
                    className="rounded-t-lg"
                    onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                />
            </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <h3 className="font-semibold leading-snug line-clamp-2">{article.title}</h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{article.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: bn })}
            </p>
            <Button asChild variant="secondary" size="sm">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    বিস্তারিত <ExternalLink className="ml-1 h-3 w-3" />
                </a>
            </Button>
        </CardFooter>
    </Card>
);

const NewsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="p-0"><Skeleton className="aspect-video w-full rounded-t-lg" /></CardHeader>
                <CardContent className="p-4"><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-3 w-full" /></CardContent>
                <CardFooter className="p-4 pt-0"><Skeleton className="h-8 w-24" /></CardFooter>
            </Card>
        ))}
    </div>
);


const NewsSection = () => {
    const [news, setNews] = useState<Record<string, NewsArticle[]>>({});
    const [loadingNews, setLoadingNews] = useState<Record<string, boolean>>({ all: true });
    const { toast } = useToast();

    const fetchNews = useCallback(async (category: string) => {
        if (news[category] && news[category].length > 0) return; 

        setLoadingNews(prev => ({ ...prev, [category]: true }));
        try {
            const response = await fetch(`/api/news?category=${category}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const articles: NewsArticle[] = await response.json();
            setNews(prev => ({ ...prev, [category]: articles }));
        } catch (error) {
            console.error(`Failed to fetch ${category} news:`, error);
            toast({
                title: "সংবাদ আনতে ব্যর্থ",
                description: "সংবাদ লোড করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
                variant: "destructive"
            });
        } finally {
            setLoadingNews(prev => ({ ...prev, [category]: false }));
        }
    }, [news, toast]);

    useEffect(() => {
        fetchNews('all');
    }, [fetchNews]);
    
    const newsCategories = ['all', 'exam', 'ssc', 'hsc', 'admission', 'jobs'];


    return (
         <section>
              <h2 className="text-2xl font-bold text-center mb-6">সর্বশেষ শিক্ষা সংবাদ</h2>
              <Tabs defaultValue="all" className="w-full" onValueChange={fetchNews}>
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                      <TabsTrigger value="all">সব খবর</TabsTrigger>
                      <TabsTrigger value="exam">পরীক্ষা</TabsTrigger>
                      <TabsTrigger value="ssc">SSC</TabsTrigger>
                      <TabsTrigger value="hsc">HSC</TabsTrigger>
                      <TabsTrigger value="admission">ভর্তি</TabsTrigger>
                      <TabsTrigger value="jobs">চাকরি</TabsTrigger>
                  </TabsList>
                    {newsCategories.map(cat => (
                        <TabsContent key={cat} value={cat}>
                           {loadingNews[cat] ? (
                                <NewsSkeleton />
                           ) : news[cat] && news[cat].length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                   {news[cat].slice(0, 3).map((article, index) => (
                                       <NewsCard key={index} article={article} />
                                   ))}
                                </div>
                           ) : (
                               <p className="text-center text-muted-foreground py-8">এই বিভাগের জন্য কোনো সংবাদ পাওয়া যায়নি।</p>
                           )}
                        </TabsContent>
                    ))}
              </Tabs>
          </section>
    );
}


export default function Home() {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [captchaCookie, setCaptchaCookie] = useState('');
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const db = getFirestore(app);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exam: 'hsc',
      year: '2025',
      board: '',
      roll: '',
      reg: '',
      captcha: '',
    },
  });
  
  const selectedExam = form.watch('exam');

  useEffect(() => {
    if (selectedExam === 'hsc_bm') {
      form.setValue('board', 'tec');
    } else {
      // Don't reset if it's already set by the user for other exams
      if (form.getValues('board') === 'tec') {
        form.setValue('board', '');
      }
    }
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
        toast({
            title: "ত্রুটি",
            description: "ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।",
            variant: "destructive"
        });
    }
  }, [form, toast]);


  useEffect(() => {
    refreshCaptcha();
    
    const fetchSettings = async () => {
        try {
            const settingsRef = doc(db, 'settings', 'config');
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
                setShowSubscriptionForm(settingsSnap.data().showSubscriptionForm);
            } else {
                setShowSubscriptionForm(true); // Default to true if not set
            }
        } catch (error) {
            console.error("Error fetching site settings: ", error);
            setShowSubscriptionForm(true); // Default to true on error
        } finally {
            setLoadingSettings(false);
        }
    };

    fetchSettings();
  }, [refreshCaptcha, db]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setResult(null);

    const valuesWithCookie = { ...values, cookie: captchaCookie };

    try {
      const searchResult = await searchResultLegacy(valuesWithCookie);
      
      if ('error' in searchResult) {
          throw new Error(searchResult.error);
      }

      setResult(searchResult);
      addHistoryItem({
          roll: values.roll,
          reg: values.reg,
          board: values.board,
          year: values.year,
          exam: values.exam,
          result: searchResult,
      });
    } catch (e: any) {
       toast({
        title: "ত্রুটি",
        description: e.message,
        variant: "destructive"
       });
       refreshCaptcha();
    } finally {
        setIsSubmitting(false);
    }
  };

  const resetSearch = () => {
    setResult(null);
    form.reset();
    refreshCaptcha();
  };

  const FeatureCard = ({ icon: Icon, title, description, href }: { icon: React.ElementType, title: string, description: string, href: string }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <Button variant="link" asChild><a href={href}>আরও দেখুন...</a></Button>
        </CardContent>
    </Card>
);


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12" id="main-content">
       <div className="flex flex-col items-center text-center mb-12 no-print">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent animate-fade-in-up">
          BD Edu: Your Education & Career Hub
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground animate-fade-in-up animation-delay-200">
           রেজাল্ট, ভর্তি, শিক্ষা সংবাদ ও গাইড — সব BD Edu তে।
        </p>
      </div>

      {!result ? (
        <div className="space-y-12">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-4 md:p-8">
              <ExamForm 
                form={form} 
                onSubmit={onSubmit} 
                isSubmitting={isSubmitting}
                captchaUrl={captchaUrl}
                onCaptchaRefresh={refreshCaptcha}
                selectedExam={selectedExam}
              />
          </div>

          <Separator />
          
          <NewsSection />
          

          <Separator />

          {/* Features Section */}
          <section>
                <h2 className="text-2xl font-bold text-center mb-6">অন্যান্য ফিচারসমূহ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard icon={Calendar} title="ভর্তি ও পরীক্ষা আপডেট" description="বিশ্ববিদ্যালয় ও কলেজের ভর্তি বিজ্ঞপ্তি, পরীক্ষার রুটিন ইত্যাদি।" href="/education-news" />
                    <FeatureCard icon={Briefcase} title="চাকরি ও ক্যারিয়ার কর্নার" description="শিক্ষকতা ও অন্যান্য চাকরির খবর এবং স্কলারশিপের তথ্য।" href="/education-news" />
                    <FeatureCard icon={BookOpen} title="স্টাডি রিসোর্স" description="মডেল টেস্ট, সাজেশন এবং নোটস ডাউনলোড করুন।" href="/suggestions" />
                    <FeatureCard icon={Rss} title="নোটিশ বোর্ড" description="শিক্ষা বোর্ড ও মন্ত্রণালয়ের সকল নোটিশ।" href="/education-news" />
                </div>
          </section>

          <Separator />
          
           {/* Tools & Features Section */}
          <section>
              <h2 className="text-2xl font-bold text-center mb-6">টুলস ও ফিচার</h2>
              <div className="space-y-4">
                  <GpaCalculatorCard />
                  <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <MessageSquare className="h-6 w-6" /> রেজাল্ট SMS ফরম্যাট
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-muted-foreground">Coming soon...</p>
                      </CardContent>
                  </Card>
                   <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                             <ListChecks className="h-6 w-6" /> বোর্ড শর্ট কোড
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                         <p className="text-muted-foreground">Coming soon...</p>
                      </CardContent>
                  </Card>
                   <Card>
                      <CardHeader>
                           <CardTitle className="flex items-center gap-3">
                               <Phone className="h-6 w-6" /> শিক্ষা বোর্ড হেল্পলাইন
                           </CardTitle>
                      </CardHeader>
                      <CardContent>
                         <p className="text-muted-foreground">Coming soon...</p>
                      </CardContent>
                  </Card>
              </div>
          </section>

           <Separator />

           {loadingSettings ? (
              <Card className="border-dashed">
                  <CardHeader className="text-center">
                       <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                       <Skeleton className="h-7 w-64 mx-auto mt-4" />
                       <Skeleton className="h-5 w-80 mx-auto mt-2" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-40 w-full" />
                  </CardContent>
              </Card>
            ) : showSubscriptionForm && <ResultAlertForm />}
        </div>
      ) : (
        <>
          <ResultsDisplay 
            result={result} 
            onReset={resetSearch}
          />
        </>
      )}
    </div>
  );
}
