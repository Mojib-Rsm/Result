
'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Plus, MessageCircleQuestion, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  tags?: string[];
  createdAt: { seconds: number };
}

export default function QnaPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questionsRef = collection(db, 'questions');
                const q = query(questionsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                setQuestions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question)));
            } catch (error) {
                console.error("Error fetching questions: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [db]);

    const QuestionSkeleton = () => (
        [...Array(3)].map((_, i) => (
             <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-4 pt-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </CardHeader>
                <CardContent>
                     <Skeleton className="h-4 w-full" />
                </CardContent>
                 <CardFooter className="flex justify-between">
                     <Skeleton className="h-6 w-20" />
                     <Skeleton className="h-9 w-24" />
                </CardFooter>
            </Card>
        ))
    );

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
                <div className="text-center md:text-left w-full">
                    <MessageCircleQuestion className="h-12 w-12 mx-auto md:mx-0 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tight mt-2">প্রশ্নোত্তর পর্ব (Q&amp;A)</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        আপনার প্রশ্ন করুন এবং কমিউনিটির কাছ থেকে উত্তর পান।
                    </p>
                </div>
                <Button asChild className="hidden md:flex">
                    <Link href="/community/qna/add">
                        <Plus className="mr-2 h-4 w-4" />
                        নতুন প্রশ্ন করুন
                    </Link>
                </Button>
            </div>
            
             <Button asChild className="md:hidden w-full mb-6">
                <Link href="/community/qna/add">
                    <Plus className="mr-2 h-4 w-4" />
                    নতুন প্রশ্ন করুন
                </Link>
            </Button>

            <div className="space-y-6">
                {loading ? (
                    <QuestionSkeleton />
                ) : questions.length > 0 ? (
                    questions.map((question) => (
                        <Card key={question.id} className="hover:shadow-md transition-shadow">
                             <CardHeader>
                                <CardTitle className="text-xl hover:text-primary">
                                    <Link href={`/community/qna/${question.id}`}>{question.title}</Link>
                                </CardTitle>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3 w-3" />
                                        <span>{question.author}</span>
                                    </div>
                                     <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDistanceToNow(new Date(question.createdAt.seconds * 1000), { addSuffix: true, locale: bn })}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="line-clamp-2">
                                    {question.content}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <div className="flex flex-wrap gap-2">
                                    {question.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/community/qna/${question.id}`}>
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        উত্তর দেখুন
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <MessageCircleQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            প্রথম প্রশ্নটি আপনিই করুন।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
