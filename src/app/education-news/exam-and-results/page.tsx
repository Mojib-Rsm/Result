
'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Bookmark, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsPost } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ExamAndResultsNoticesPage() {
    const [articles, setArticles] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsRef = collection(db, 'news');
                // Fetch news that has 'exam' or 'result' in its tags array.
                // Firestore doesn't support logical OR on different fields in this way.
                // A workaround is to fetch both and merge, or denormalize data.
                // For simplicity, we'll fetch where tags array contains 'exam' OR 'result'.
                // This requires two separate queries.
                const examQuery = query(newsRef, where('tags', 'array-contains', 'exam'), orderBy('createdAt', 'desc'));
                const resultQuery = query(newsRef, where('tags', 'array-contains', 'result'), orderBy('createdAt', 'desc'));

                const [examSnapshot, resultSnapshot] = await Promise.all([
                    getDocs(examQuery),
                    getDocs(resultQuery)
                ]);

                const newsMap = new Map<string, NewsPost>();
                examSnapshot.docs.forEach(doc => newsMap.set(doc.id, { id: doc.id, ...doc.data() } as NewsPost));
                resultSnapshot.docs.forEach(doc => newsMap.set(doc.id, { id: doc.id, ...doc.data() } as NewsPost));

                const combinedNews = Array.from(newsMap.values())
                    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

                setArticles(combinedNews);

            } catch (error) {
                console.error('Error fetching exam/result news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [db]);

    const NewsSkeleton = () => (
        [...Array(4)].map((_, i) => (
             <Card key={i} className="flex flex-col overflow-hidden">
                <CardHeader>
                    <Skeleton className="aspect-video w-full" />
                </CardHeader>
                <CardContent className="flex-grow">
                     <Skeleton className="h-6 w-3/4 mb-4" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
                 <CardFooter className="flex flex-col items-start gap-4">
                     <div className="w-full flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                     </div>
                     <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                      </div>
                     <Skeleton className="h-9 w-24" />
                </CardFooter>
            </Card>
        ))
    );

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                 <div className="mx-auto w-fit rounded-full bg-primary/10 p-3 mb-4">
                    <Calendar className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">পরীক্ষা ও ফলাফল সংক্রান্ত নোটিশ</h1>
                <p className="mt-3 text-lg text-muted-foreground">পরীক্ষার রুটিন, সময়সূচি এবং ফলাফল প্রকাশের সর্বশেষ ঘোষণা।</p>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <NewsSkeleton />
                </div>
            ) : articles.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map((item) => (
                        <Card key={item.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                            <Link href={`/education-news/${item.id}`} className="block">
                                <CardHeader className="p-0">
                                    <div className="aspect-video relative">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-t-lg"
                                        />
                                    </div>
                                </CardHeader>
                            </Link>

                            <CardContent className="flex-grow p-4">
                                 <CardTitle className="text-lg leading-snug hover:text-primary transition-colors">
                                    <Link href={`/education-news/${item.id}`}>
                                        {item.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="mt-3 line-clamp-3 text-sm">
                                    {item.description}
                                </CardDescription>
                            </CardContent>

                            <CardFooter className="flex flex-col items-start gap-4 p-4">
                                 <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                    <span>{item.source || 'নিজস্ব'}</span>
                                    <span>{item.date}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags?.map((tag: string) => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                                <Button asChild variant="secondary" size="sm">
                                    <Link href={`/education-news/${item.id}`}>
                                        বিস্তারিত পড়ুন <ExternalLink className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">কোনো নোটিশ পাওয়া যায়নি</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        এই মুহূর্তে পরীক্ষা বা ফলাফল সংক্রান্ত কোনো নতুন নোটিশ নেই।
                    </p>
                </div>
            )}
        </div>
    );
}
