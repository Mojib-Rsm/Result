
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Loading from '@/app/loading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar, User, MessageSquare, CornerUpLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

interface ForumPost {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    tags?: string[];
    createdAt: { seconds: number; nanoseconds: number };
}

interface Comment {
    id: string;
    content: string;
    author: string;
    authorId: string;
    createdAt: { seconds: number; nanoseconds: number };
}


export default function ForumPostPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const commentsRef = useMemo(() => {
    if (!id) return null;
    return collection(db, 'forum_posts', id, 'comments');
  }, [id]);
  
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const postDocRef = doc(db, 'forum_posts', id);
          const postDocSnap = await getDoc(postDocRef);

          if (postDocSnap.exists()) {
            setPost({ id: postDocSnap.id, ...postDocSnap.data() } as ForumPost);
          } else {
            setError('দুঃখিত, এই পোস্টটি খুঁজে পাওয়া যায়নি।');
          }
        } catch (err) {
          console.error("Error fetching post:", err);
          setError('পোস্টটি আনতে একটি সমস্যা হয়েছে।');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
      
      if(commentsRef){
         const q = query(commentsRef, orderBy('createdAt', 'asc'));
         const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
         });
         return () => unsubscribe();
      }

    }
  }, [id, commentsRef]);
  
  const handleCommentSubmit = async () => {
      if (!newComment.trim() || !user || !commentsRef) return;
      
      setIsSubmitting(true);
      try {
          await addDoc(commentsRef, {
              content: newComment,
              author: user.name || 'Anonymous',
              authorId: user.uid,
              createdAt: serverTimestamp(),
          });
          setNewComment('');
      } catch (error) {
          console.error("Error adding comment: ", error);
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

  if (!post) return null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">{post.title}</CardTitle>
                 <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true, locale: bn })}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
                <p>{post.content}</p>
            </CardContent>
        </Card>
        
        <Separator />

        <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                মন্তব্য ({comments.length})
            </h2>
            <div className="space-y-6">
                {comments.map(comment => (
                    <Card key={comment.id} className="bg-muted/50">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{comment.author}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true, locale: bn })}
                                    </p>
                                </div>
                                <p className="text-sm mt-1">{comment.content}</p>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">এখনও কোনো মন্তব্য করা হয়নি।</p>
                )}
            </div>
        </div>

        {user ? (
            <Card>
                <CardHeader>
                    <CardTitle>আপনার মন্তব্য যোগ করুন</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full gap-2">
                        <Textarea 
                            placeholder="এখানে আপনার মন্তব্য লিখুন..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button onClick={handleCommentSubmit} disabled={isSubmitting || !newComment.trim()}>
                            {isSubmitting ? 'পোস্ট করা হচ্ছে...' : 'মন্তব্য পোস্ট করুন'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <Card className="text-center">
                 <CardHeader>
                    <CardTitle>আলোচনায় যোগ দিন</CardTitle>
                    <CardDescription>মন্তব্য করতে অনুগ্রহ করে লগইন করুন।</CardDescription>
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
