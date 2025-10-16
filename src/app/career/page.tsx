'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Briefcase, MapPin, Clock, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { JobPost } from '@/types';

export default function CareerPage() {
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobsRef = collection(db, 'jobs');
                const q = query(jobsRef, orderBy('postedAt', 'desc'));
                const querySnapshot = await getDocs(q);
                setJobs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPost)));
            } catch (error) {
                console.error("Error fetching jobs: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [db]);

    const JobSkeleton = () => (
        [...Array(4)].map((_, i) => (
             <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-28" />
                     </div>
                </CardContent>
                 <CardFooter>
                     <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        ))
    );

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">ক্যারিয়ার হাব</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    আপনার স্বপ্নের চাকরির সন্ধান করুন এখানে।
                </p>
            </div>

            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-8"><JobSkeleton /></div>
                ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">{job.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 pt-1">
                                    <Building className="h-4 w-4" /> {job.companyName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-primary" />
                                        <span>{job.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>আবেদনের শেষ তারিখ: {job.deadline}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild>
                                    <Link href={job.applyLink || '#'} target="_blank" rel="noopener noreferrer">
                                        বিস্তারিত ও আবেদন
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">কোনো চাকরির বিজ্ঞপ্তি পাওয়া যায়নি</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            অনুগ্রহ করে পরে আবার চেষ্টা করুন।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
