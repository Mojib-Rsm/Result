
'use client';

import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as BarChartIcon, PieChart, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfigGpa5 = {
  gpa5: {
    label: 'GPA-5',
    color: 'hsl(var(--primary))',
  },
};

const chartConfigPassRate = {
  passRate: {
    label: 'Pass Rate (%)',
    color: 'hsl(var(--accent))',
  },
};

export default function StatisticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsRef = doc(db, 'statistics', 'hsc2025');
                const docSnap = await getDoc(statsRef);
                if (docSnap.exists()) {
                    setStats(docSnap.data());
                } else {
                    console.log("No statistics found!");
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [db]);

    if (loading) {
        return (
             <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
                <Skeleton className="h-12 w-1/2 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-10" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        )
    }

    if (!stats) {
        return (
             <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
                 <h1 className="text-3xl font-bold">No Statistics Found</h1>
                 <p>Please seed the database to view statistics.</p>
            </div>
        )
    }


    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">ফলাফল পরিসংখ্যান (HSC-2025)</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    বিগত পরীক্ষার ফলাফলের পরিসংখ্যান দেখুন এবং বোর্ডগুলোর পারফরম্যান্স তুলনা করুন।
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট পরীক্ষার্থী</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalExaminees.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">১১টি শিক্ষা বোর্ডে</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট পাস</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPassed.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">পাসের হার: {stats.passRate}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট GPA-5</CardTitle>
                        <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalGpa5.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">সকল বোর্ডের মধ্যে</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">গড় পাসের হার</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.passRate}%</div>
                        <p className="text-xs text-muted-foreground">সাধারণ, মাদ্রাসা ও কারিগরি</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>বোর্ডভিত্তিক GPA-5 প্রাপ্ত শিক্ষার্থীর সংখ্যা</CardTitle>
                        <CardDescription>HSC পরীক্ষা ২০২৩</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigGpa5} className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={stats.boardWiseGpa5} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="board" type="category" width={80} tick={{ fontSize: 12 }} />
                                    <ChartTooltip
                                        cursor={{ fill: 'hsl(var(--muted))' }}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="gpa5" fill="var(--color-gpa5)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>বোর্ডভিত্তিক পাসের হার (%)</CardTitle>
                        <CardDescription>HSC পরীক্ষা ২০২৩</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfigPassRate} className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={stats.boardWisePassRate} margin={{ top: 20 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis 
                                        dataKey="board" 
                                        tickLine={false} 
                                        tickMargin={10} 
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                     />
                                    <YAxis domain={[40, 80]} />
                                    <ChartTooltip
                                        cursor={{ fill: 'hsl(var(--muted))' }}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="passRate" fill="var(--color-passRate)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
