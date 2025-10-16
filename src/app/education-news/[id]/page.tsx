
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewsPost } from '@/types';
import Loading from '@/app/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetchArticle = async () => {
        try {
          const articleDocRef = doc(db, 'news', params.id);
          const articleDocSnap = await getDoc(articleDocRef);

          if (articleDocSnap.exists()) {
            setArticle(articleDocSnap.data() as NewsPost);
          } else {
            setError('দুঃখিত, এই সংবাদটি খুঁজে পাওয়া যায়নি।');
          }
        } catch (err) {
          console.error("Error fetching article from Firestore:", err);
          setError('সংবাদটি আনতে একটি সমস্যা হয়েছে।');
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
            <Card className="border-destructive">
                <CardHeader className="items-center text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <CardTitle className="text-destructive">ত্রুটি</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                     <p className="text-sm text-muted-foreground">অনুগ্রহ করে লিঙ্কটি সঠিক কিনা তা পরীক্ষা করুন অথবা আবার চেষ্টা করুন।</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (article) {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
            <article className="prose dark:prose-invert max-w-none">
                <div className="mb-8">
                     {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    )}
                    <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        {article.source && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{article.source}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{article.date}</span>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-video mb-8">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>

                <p className="lead">{article.description}</p>
                
                {/* Render the full content with paragraphs */}
                <div className="whitespace-pre-wrap">
                    {article.content}
                </div>
            </article>
        </div>
    );
  }

  return null;
}
