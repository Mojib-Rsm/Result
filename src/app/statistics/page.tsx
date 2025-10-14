
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as BarChartIcon, PieChart, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Data for HSC 2024
const hsc2024Stats = {
    totalExaminees: 1346541,
    totalPassed: 1207703,
    passRate: 89.69,
    totalGpa5: 130781,
};

const boardWiseGpa5 = [
    { board: 'ঢাকা', gpa5: 39560 },
    { board: 'রাজশাহী', gpa5: 14034 },
    { board: 'কুমিল্লা', gpa5: 8875 },
    { board: 'যশোর', gpa5: 11234 },
    { board: 'চট্টগ্রাম', gpa5: 8012 },
    { board: 'বরিশাল', gpa5: 7506 },
    { board: 'সিলেট', gpa5: 5670 },
    { board: 'দিনাজপুর', gpa5: 8890 },
    { board: 'ময়মনসিংহ', gpa5: 6950 },
    { board: 'মাদ্রাসা', gpa5: 12050 },
    { board: 'কারিগরি', gpa5: 8000 },
];

const boardWisePassRate = [
    { board: 'ঢাকা', passRate: 91.53 },
    { board: 'রাজশাহী', passRate: 93.35 },
    { board: 'কুমিল্লা', passRate: 86.89 },
    { board: 'যশোর', passRate: 90.12 },
    { board: 'চট্টগ্রাম', passRate: 85.48 },
    { board: 'বরিশাল', passRate: 89.91 },
    { board: 'সিলেট', passRate: 82.34 },
    { board: 'দিনাজপুর', passRate: 88.76 },
    { board: 'ময়মনসিংহ', passRate: 87.21 },
    { board: 'মাদ্রাসা', passRate: 94.02 },
    { board: 'কারিগরি', passRate: 91.88 },
];

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
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">ফলাফল পরিসংখ্যান (HSC-2024)</h1>
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
                        <div className="text-2xl font-bold">{hsc2024Stats.totalExaminees.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">১১টি শিক্ষা বোর্ডে</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট পাস</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hsc2024Stats.totalPassed.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">পাসের হার: {hsc2024Stats.passRate}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট GPA-5</CardTitle>
                        <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hsc2024Stats.totalGpa5.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">সকল বোর্ডের মধ্যে</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">গড় পাসের হার</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hsc2024Stats.passRate}%</div>
                        <p className="text-xs text-muted-foreground">সাধারণ, মাদ্রাসা ও কারিগরি</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>বোর্ডভিত্তিক GPA-5 প্রাপ্ত শিক্ষার্থীর সংখ্যা</CardTitle>
                        <CardDescription>HSC পরীক্ষা ২০২৪</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigGpa5} className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={boardWiseGpa5} layout="vertical" margin={{ left: 10, right: 30 }}>
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
                        <CardDescription>HSC পরীক্ষা ২০২৪</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfigPassRate} className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={boardWisePassRate} margin={{ top: 20 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis 
                                        dataKey="board" 
                                        tickLine={false} 
                                        tickMargin={10} 
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                     />
                                    <YAxis domain={[60, 100]} />
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
