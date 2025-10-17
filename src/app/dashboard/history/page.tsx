
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History as HistoryIcon, Search, Trash2, Eye, School } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ResultsDisplay from '@/components/results-display';
import type { HistoryItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useHistory } from '@/hooks/use-history';

export default function DashboardHistoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedResult, setSelectedResult] = useState<HistoryItem | null>(null);

  const { removeHistoryItem, clearHistory } = useHistory();

  const loadData = () => {
     try {
      const localHistory = localStorage.getItem('bd-results-history-local');
      if (localHistory) {
          setHistory(JSON.parse(localHistory));
      }
    } catch(e) {
      console.error("Could not load local history", e)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
  }

  const handleRemoveItem = (timestamp: number) => {
    removeHistoryItem(timestamp);
    setHistory(prevHistory => prevHistory.filter(item => item.timestamp !== timestamp));
  };

  const filteredHistory = history.filter(
    item =>
      item.result.studentInfo.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.roll.includes(filter)
  ).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">আপনার অনুসন্ধানের ইতিহাস</h1>
        <p className="mt-2 text-lg text-muted-foreground">আপনার সংরক্ষিত ফলাফলগুলো এখানে দেখুন এবং পরিচালনা করুন।</p>
      </div>

      <div className="flex flex-col items-start mb-4 md:flex-row md:items-center md:justify-between">
         <h2 className="text-2xl font-bold mb-4 md:mb-0">সংরক্ষিত ফলাফল</h2>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="নাম বা রোল দিয়ে ফিল্টার করুন..."
            className="pl-10 w-full md:w-64"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>
      
       <AlertDialog>
          {history.length > 0 && (
              <div className="flex justify-end mb-4">
                  <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          সব ইতিহাস মুছুন
                      </Button>
                  </AlertDialogTrigger>
              </div>
          )}
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                  <AlertDialogDescription>
                      এই কাজটি ফিরিয়ে আনা যাবে না। এটি আপনার সমস্ত অনুসন্ধানের ইতিহাস স্থায়ীভাবে মুছে ফেলবে।
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>বাতিল</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>
                    মুছে ফেলুন
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>


      {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent><CardFooter><Skeleton className="h-8 w-1/2" /></CardFooter></Card>
            ))}
          </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            {history.length === 0 ? 'কোনো ইতিহাস নেই' : 'কোনো ফলাফল পাওয়া যায়নি'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
             {history.length === 0 ? 'আপনার অনুসন্ধানের ইতিহাস এখানে দেখা যাবে।' : 'অন্য কিছু দিয়ে ফিল্টার করুন।'}
          </p>
        </div>
      ) : (
         <Dialog>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map(item => (
                <Card key={item.timestamp} className="hover:shadow-lg transition-shadow relative group">
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

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">মুছুন</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                      <AlertDialogDescription>
                        এই ফলাফলটি আপনার ইতিহাস থেকে স্থায়ীভাবে মুছে ফেলা হবে।
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>বাতিল</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemoveItem(item.timestamp)}>
                        মুছে ফেলুন
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                </Card>
            ))}
            </div>
            {selectedResult && (
                <DialogContent className="max-w-4xl h-[95vh] flex flex-col">
                    <DialogHeader className="no-print">
                        <DialogTitle>ফলাফলের বিবরণ</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto">
                        <ResultsDisplay result={selectedResult.result} isDialog={true} />
                    </div>
                </DialogContent>
            )}
        </Dialog>
      )}
    </div>
  );
}
