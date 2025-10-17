
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Loading from '@/app/loading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar, User, MessageCircle, CornerUpLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

interface Question {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    tags?: string[];
    createdAt: { seconds: number; nanoseconds: number };
}

interface Answer {
    id: string;
    content: string;
    author: string;
    authorId: string;
    createdAt: { seconds: number; nanoseconds: number };
}


export default function QuestionPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const answersRef = useMemo(() => {
    if (!id) return null;
    return collection(db, 'questions', id, 'answers');
  }, [id]);
  
  useEffect(() => {
    if (id) {
      const fetchQuestion = async () => {
        try {
          const questionDocRef = doc(db, 'questions', id);
          const questionDocSnap = await getDoc(questionDocRef);

          if (questionDocSnap.exists()) {
            setQuestion({ id: questionDocSnap.id, ...questionDocSnap.data() } as Question);
          } else {
            setError('দুঃখিত, এই প্রশ্নটি খুঁজে পাওয়া যায়নি।');
          }
        } catch (err) {
          console.error("Error fetching question:", err);
          setError('প্রশ্নটি আনতে একটি সমস্যা হয়েছে।');
        } finally {
          setLoading(false);
        }
      };

      fetchQuestion();
      
      if(answersRef){
         const q = query(answersRef, orderBy('createdAt', 'asc'));
         const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setAnswers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Answer)));
         });
         return () => unsubscribe();
      }

    }
  }, [id, answersRef]);
  
  const handleAnswerSubmit = async () => {
      if (!newAnswer.trim() || !user || !answersRef) return;
      
      setIsSubmitting(true);
      try {
          await addDoc(answersRef, {
              content: newAnswer,
              author: user.name || 'Anonymous',
              authorId: user.uid,
              createdAt: serverTimestamp(),
          });
          setNewAnswer('');
      } catch (error) {
          console.error("Error adding answer: ", error);
      } finally {
          setIsSubmitting(false);
      }
  }


  if (loading) return <Loading />;

  if (error) {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
            <Card className="border-destructive">
                <CardHeader className="items-center text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <CardTitle className="text-destructive">ত্রুটি</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  if (!question) return null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">{question.title}</CardTitle>
                 <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{question.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(question.createdAt.seconds * 1000), { addSuffix: true, locale: bn })}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
                <p>{question.content}</p>
            </CardContent>
        </Card>
        
        <Separator />

        <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                উত্তরসমূহ ({answers.length})
            </h2>
            <div className="space-y-6">
                {answers.map(answer => (
                    <Card key={answer.id} className="bg-muted/50">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{answer.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{answer.author}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(answer.createdAt.seconds * 1000), { addSuffix: true, locale: bn })}
                                    </p>
                                </div>
                                <p className="text-sm mt-1">{answer.content}</p>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
                 {answers.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">এখনও কোনো উত্তর দেওয়া হয়নি। প্রথম উত্তরটি আপনি দিন।</p>
                )}
            </div>
        </div>

        {user ? (
            <Card>
                <CardHeader>
                    <CardTitle>আপনার উত্তর দিন</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full gap-2">
                        <Textarea 
                            placeholder="এখানে আপনার উত্তর লিখুন..." 
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                        />
                        <Button onClick={handleAnswerSubmit} disabled={isSubmitting || !newAnswer.trim()}>
                            {isSubmitting ? 'পোস্ট করা হচ্ছে...' : 'উত্তর পোস্ট করুন'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <Card className="text-center">
                 <CardHeader>
                    <CardTitle>আলোচনায় যোগ দিন</CardTitle>
                    <CardDescription>উত্তর দিতে অনুগ্রহ করে লগইন করুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/login">লগইন করুন</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
