
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, Calendar } from 'lucide-react';
import { differenceInYears, differenceInMonths, differenceInDays, sub } from 'date-fns';

interface Age {
  years: number;
  months: number;
  days: number;
}

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState<string>('');
  const [age, setAge] = useState<Age | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = () => {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      setError('অনুগ্রহ করে একটি বৈধ জন্ম তারিখ দিন।');
      setAge(null);
      return;
    }
    
    if (birthDate > new Date()) {
      setError('জন্ম তারিখ আজকের তারিখের পরে হতে পারে না।');
      setAge(null);
      return;
    }

    setError(null);
    const today = new Date();
    
    const years = differenceInYears(today, birthDate);
    const dateAfterYears = sub(today, { years });
    const months = differenceInMonths(dateAfterYears, birthDate);
    const dateAfterMonths = sub(dateAfterYears, { months });
    const days = differenceInDays(dateAfterMonths, birthDate);

    setAge({ years, months, days });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">বয়স ক্যালকুলেটর</h1>
        <p className="mt-2 text-lg text-muted-foreground">আপনার জন্ম তারিখ ব্যবহার করে সঠিক বয়স গণনা করুন।</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>বয়স গণনা</CardTitle>
          <CardDescription>আপনার জন্ম তারিখ এখানে ইনপুট দিন।</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
             <div className="w-full space-y-2">
                <label htmlFor="dob" className="text-sm font-medium">আপনার জন্ম তারিখ</label>
                <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={e => {
                        setDob(e.target.value)
                        setAge(null);
                        setError(null);
                    }}
                    className="w-full"
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                />
            </div>
             <Button onClick={calculateAge} className="w-full sm:w-auto">
              <Calculator className="mr-2 h-4 w-4" />
              বয়স গণনা করুন
            </Button>
          </div>
          {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}
          
          {age !== null && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">আপনার বর্তমান বয়স হলো:</p>
              <div className="flex justify-center items-end gap-4 mt-2">
                <div className="p-4 bg-muted rounded-lg w-28">
                    <p className="text-4xl font-bold text-primary">{age.years}</p>
                    <p className="text-sm text-muted-foreground">বছর</p>
                </div>
                 <div className="p-4 bg-muted rounded-lg w-28">
                    <p className="text-4xl font-bold text-primary">{age.months}</p>
                    <p className="text-sm text-muted-foreground">মাস</p>
                </div>
                 <div className="p-4 bg-muted rounded-lg w-28">
                    <p className="text-4xl font-bold text-primary">{age.days}</p>
                    <p className="text-sm text-muted-foreground">দিন</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    