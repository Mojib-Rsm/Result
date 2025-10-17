
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Rss, ExternalLink, Bookmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface NewsArticle {
    title: string;
    url: string;
    description: string;
    urlToImage: string | null;
    publishedAt: string;
    source: { name: string };
}

export default function BoardAndMinistryNoticesPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news?category=education');
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

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
                     <Skeleton className="h-5 w-24" />
                </CardFooter>
            </Card>
        ))
    );

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                 <div className="mx-auto w-fit rounded-full bg-primary/10 p-3 mb-4">
                    <Rss className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">বোর্ড ও মন্ত্রণালয়ের নোটিশ</h1>
                <p className="mt-3 text-lg text-muted-foreground">শিক্ষা বোর্ড এবং শিক্ষা মন্ত্রণালয় থেকে আসা সকল নোটিশ।</p>
                 <Button asChild variant="outline" className="mt-6">
                    <Link href="/education-news">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        সকল শিক্ষা সংবাদ দেখুন
                    </Link>
                </Button>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <NewsSkeleton />
                </div>
            ) : articles.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map((item, index) => (
                        <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                                <CardHeader className="p-0">
                                    <div className="aspect-video relative">
                                        <Image
                                            src={item.urlToImage || '/logo.png'}
                                            alt={item.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-t-lg"
                                            onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                                        />
                                    </div>
                                </CardHeader>
                            </a>

                            <CardContent className="flex-grow p-4">
                                 <CardTitle className="text-lg leading-snug hover:text-primary transition-colors">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        {item.title}
                                    </a>
                                </CardTitle>
                                <CardDescription className="mt-3 line-clamp-3">
                                    {item.description}
                                </CardDescription>
                            </CardContent>

                            <CardFooter className="flex flex-col items-start gap-4 p-4">
                                 <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                    <span>{item.source.name}</span>
                                    <span>{new Date(item.publishedAt).toLocaleDateString('bn-BD')}</span>
                                </div>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline flex items-center">
                                    বিস্তারিত পড়ুন <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">কোনো সংবাদ পাওয়া যায়নি</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        এই মুহূর্তে কোনো নতুন নোটিশ নেই। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
                    </p>
                </div>
            )}
        </div>
    );
}
