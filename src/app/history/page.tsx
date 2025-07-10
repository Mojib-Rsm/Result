'use client';

import { useState } from 'react';
import { useHistory } from '@/hooks/use-history';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History as HistoryIcon, Search, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const { history, clearHistory, isInitialized } = useHistory();
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(
    item =>
      item.result.studentInfo.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.roll.includes(filter)
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="flex flex-col items-start mb-8 md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-bold tracking-tight">Search History</h1>
          <p className="mt-2 text-lg text-muted-foreground">Review your past result searches.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter by name or roll..."
            className="pl-10 w-full md:w-64"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button variant="destructive" size="sm" onClick={clearHistory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          </div>
        )}

      {isInitialized && filteredHistory.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            {history.length === 0 ? 'No History Yet' : 'No Matching Results'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
             {history.length === 0 ? 'Your previous searches will appear here.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHistory.map(item => (
            <Card key={`${item.roll}-${item.exam}`} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{item.result.studentInfo.name}</CardTitle>
                        <CardDescription>Roll: {item.roll} | Reg: {item.reg}</CardDescription>
                    </div>
                    <Badge variant={item.result.status === 'Pass' ? 'default' : 'destructive'} className={item.result.status === 'Pass' ? 'bg-green-600' : ''}>
                        {item.result.status}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p><strong>Exam:</strong> <span className="uppercase">{item.exam}</span>, {item.year}</p>
                <p><strong>Board:</strong> <span className="capitalize">{item.board}</span></p>
                {item.result.status === 'Pass' && <p><strong>GPA:</strong> {item.result.gpa.toFixed(2)}</p>}
              </CardContent>
              <CardFooter>
                 <Button variant="link" className="p-0 h-auto" disabled>
                    View Details (Feature coming soon)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
