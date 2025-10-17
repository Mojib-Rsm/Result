
'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from '@/components/ui/scroll-area';
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

    const JobDetailsDialog = ({ job }: { job: JobPost }) => (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                 <div className="flex items-start gap-4">
                    {job.companyLogoUrl && (
                        <Image
                            src={job.companyLogoUrl}
                            alt={`${job.companyName} logo`}
                            width={64}
                            height={64}
                            className="rounded-lg border object-contain"
                        />
                    )}
                    <div className="flex-1">
                        <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                        <DialogDescription className="mt-1">
                           <span className="font-semibold">{job.companyName}</span> এ <span className="capitalize">{job.location}</span>
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
                 <div className="flex flex-wrap gap-x-6 gap-y-3 my-4 text-sm">
                    <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> {job.type}</div>
                    {job.salary && <div className="flex items-center gap-2"><span className="text-primary font-bold text-lg">৳</span>বেতন: {job.salary}</div>}
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> শেষ তারিখ: {new Date(job.deadline).toLocaleDateString('bn-BD')}</div>
                </div>

                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="description">বিবরণ</TabsTrigger>
                        <TabsTrigger value="requirements">যোগ্যতা</TabsTrigger>
                        <TabsTrigger value="company">সংস্থা</TabsTrigger>
                    </TabsList>
                    <div className="prose prose-sm dark:prose-invert max-w-none mt-4 p-1">
                        <TabsContent value="description">
                            <h4 className="font-bold">কাজের বিবরণ</h4>
                            <p>{job.description}</p>
                            {job.benefits && <>
                                <h4 className="font-bold mt-4">সুবিধাসমূহ</h4>
                                <p>{job.benefits}</p>
                            </>}
                             {job.howToApply && <>
                                <h4 className="font-bold mt-4">কিভাবে আবেদন করবেন</h4>
                                <p>{job.howToApply}</p>
                            </>}
                        </TabsContent>
                        <TabsContent value="requirements">
                            <h4 className="font-bold">যোগ্যতা</h4>
                            <p>{job.requirements}</p>
                             {job.preferredSkills && <>
                                <h4 className="font-bold mt-4">অতিরিক্ত দক্ষতা</h4>
                                <p>{job.preferredSkills}</p>
                            </>}
                        </TabsContent>
                        <TabsContent value="company">
                            {job.companyOverview && <>
                                <h4 className="font-bold">সংস্থার বিবরণ</h4>
                                <p>{job.companyOverview}</p>
                            </>}
                             {job.contactInfo && <>
                                <h4 className="font-bold mt-4">যোগাযোগ</h4>
                                <p>{job.contactInfo}</p>
                            </>}
                        </TabsContent>
                    </div>
                </Tabs>
            </ScrollArea>
             <DialogFooter className="mt-4">
                 <Button asChild className="w-full">
                    <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">
                        আবেদন করুন
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </DialogFooter>
        </DialogContent>
    );

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">ক্যারিয়ার হাব</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    আপনার স্বপ্নের চাকরির সন্ধান করুন এখানে।
                </p>
            </div>

            <Dialog>
                 <div className="space-y-8">
                    {loading ? (
                        <div className="space-y-8"><JobSkeleton /></div>
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex gap-4">
                                        {job.companyLogoUrl && (
                                            <Image
                                                src={job.companyLogoUrl}
                                                alt={`${job.companyName} logo`}
                                                width={48}
                                                height={48}
                                                className="rounded-md border object-contain h-12 w-12"
                                            />
                                        )}
                                        <div className="flex-1">
                                             <CardTitle className="text-xl">{job.title}</CardTitle>
                                             <CardDescription className="flex items-center gap-2 pt-1">
                                                <Building className="h-4 w-4" /> {job.companyName}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
                                            <span>শেষ তারিখ: {new Date(job.deadline).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                    </div>
                                     <div className="mt-4 flex flex-wrap gap-2">
                                        <Badge variant="secondary">{job.category}</Badge>
                                        <Badge variant="outline">{job.experienceLevel} Level</Badge>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <DialogTrigger asChild>
                                        <Button>
                                            বিস্তারিত দেখুন ও আবেদন করুন
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
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
                 {jobs.map(job => <JobDetailsDialog key={`dialog-${job.id}`} job={job} />)}
            </Dialog>
        </div>
    );
}
