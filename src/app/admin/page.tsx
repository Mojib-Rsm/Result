
'use client';

import { useEffect, useState } from 'react';
import { useHistory } from '@/hooks/use-history';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, School, User, Search, BarChart2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ResultsDisplay from '@/components/results-display';
import type { HistoryItem } from '@/types';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAuthenticated } = useAdminAuth();
  const { history } = useHistory();
  const router = useRouter();
  const [stats, setStats] = useState<{ visits: number; searches: number }>({ visits: 0, searches: 0 });
  const [selectedResult, setSelectedResult] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // This now runs only on the client, avoiding hydration errors
    const visits = parseInt(localStorage.getItem('app-visits') || '0', 10);
    const searches = parseInt(localStorage.getItem('app-searches') || '0', 10);
    setStats({ visits, searches });
  }, []);

  if (isAuthenticated === null || !isAuthenticated) {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
            <p>প্রবেশাধিকার যাচাই করা হচ্ছে...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">অ্যাডমিন প্যানেল</h1>
        <p className="mt-2 text-lg text-muted-foreground">সাইটের ব্যবহার এবং অনুসন্ধানের ইতিহাস দেখুন।</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">মোট ভিজিট</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.visits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">এই ব্রাউজার থেকে মোট ভিজিট সংখ্যা</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">মোট অনুসন্ধান</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.searches.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">এই ব্রাউজার থেকে মোট ফলাফল অনুসন্ধান</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">সংরক্ষিত ইতিহাস</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{history.length}</div>
                <p className="text-xs text-muted-foreground">সর্বশেষ ২০টি অনুসন্ধানের ফলাফল</p>
            </CardContent>
        </Card>
      </div>


      <div>
        <h2 className="text-2xl font-bold mb-4">অনুসন্ধানের ইতিহাস</h2>
        {history.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">কোনো ইতিহাস পাওয়া যায়নি</h3>
            <p className="mt-1 text-sm text-muted-foreground">এই ব্রাউজার থেকে এখনো কোনো ফলাফল অনুসন্ধান করা হয়নি।</p>
          </div>
        ) : (
          <Dialog>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {history.map(item => (
                <Card key={`${item.roll}-${item.exam}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.result.studentInfo.name}</CardTitle>
                        <CardDescription>রোল: {item.roll} | রেজি: {item.reg}</CardDescription>
                      </div>
                      <Badge variant={item.result.status === 'Pass' ? 'default' : 'destructive'} className={item.result.status === 'Pass' ? 'bg-green-600' : ''}>
                        {item.result.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>পরীক্ষা:</strong> <span className="uppercase">{item.exam}</span>, {item.year}</p>
                    <p><strong>বোর্ড:</strong> <span className="capitalize">{item.board}</span></p>
                    {item.result.status === 'Pass' && <p><strong>GPA:</strong> {item.result.gpa.toFixed(2)}</p>}
                    <div className="flex items-start pt-1">
                      <School className="h-4 w-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground flex-1">
                        {item.result.studentInfo.institute}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedResult(item)}>
                        <Eye className="mr-2 h-4 w-4" />
                        বিস্তারিত দেখুন
                      </Button>
                    </DialogTrigger>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {selectedResult && (
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="no-print">
                  <DialogTitle>ফলাফলের বিবরণ</DialogTitle>
                </DialogHeader>
                <ResultsDisplay result={selectedResult.result} isDialog={true} />
              </DialogContent>
            )}
          </Dialog>
        )}
      </div>
    </div>
  );
}
