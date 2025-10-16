
'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Bookmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsPost } from '@/types';

export default function EducationNewsPage() {
    const [newsItems, setNewsItems] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsRef = collection(db, 'news');
                const q = query(newsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                setNewsItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost)));
            } catch (error) {
                console.error("Error fetching news: ", error);
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
                        <Skeleton className="h-4 w-1/4" />
                     </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                     <Skeleton className="h-5 w-24" />
                </CardFooter>
            </Card>
        ))
    );

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">শিক্ষা সংবাদ</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    শিক্ষা জগতের সর্বশেষ খবর ও আপডেট জানুন।
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <NewsSkeleton />
                </div>
            ) : newsItems.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {newsItems.map((item) => (
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
                                <CardDescription className="mt-3">
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
                                <Link href={`/education-news/${item.id}`} className="text-sm font-semibold text-primary hover:underline flex items-center">
                                    বিস্তারিত পড়ুন <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">কোনো সংবাদ পাওয়া যায়নি</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        অনুগ্রহ করে稍পরে আবার চেষ্টা করুন।
                    </p>
                </div>
            )}
        </div>
    );
}
