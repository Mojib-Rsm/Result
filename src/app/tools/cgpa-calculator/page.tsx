
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Calculator } from 'lucide-react';

interface Semester {
  id: number;
  gpa: string;
  credits: string;
}

export default function CgpaCalculatorPage() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, gpa: '', credits: '' },
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);

  const handleAddSemester = () => {
    setSemesters([...semesters, { id: Date.now(), gpa: '', credits: '' }]);
  };

  const handleRemoveSemester = (id: number) => {
    setSemesters(semesters.filter(s => s.id !== id));
  };

  const handleSemesterChange = (id: number, field: 'gpa' | 'credits', value: string) => {
    // Allow only numbers and a single dot
    if (/^\d*\.?\d*$/.test(value)) {
        setSemesters(semesters.map(s => (s.id === id ? { ...s, [field]: value } : s)));
        setCgpa(null); // Reset CGPA when values change
    }
  };

  const calculateCgpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const semester of semesters) {
      const gpa = parseFloat(semester.gpa);
      const credits = parseFloat(semester.credits);

      if (!isNaN(gpa) && !isNaN(credits) && credits > 0) {
        totalPoints += gpa * credits;
        totalCredits += credits;
      }
    }

    if (totalCredits === 0) {
      setCgpa(0);
      return;
    }

    const averageCgpa = totalPoints / totalCredits;
    setCgpa(averageCgpa);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">CGPA ক্যালকুলেটর</h1>
        <p className="mt-2 text-lg text-muted-foreground">আপনার সেমিস্টারভিত্তিক GPA ও ক্রেডিট ব্যবহার করে CGPA গণনা করুন।</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সেমিস্টার এবং ক্রেডিট</CardTitle>
          <CardDescription>প্রতিটি সেমিস্টারের প্রাপ্ত GPA এবং মোট ক্রেডিট যোগ করুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {semesters.map((semester, index) => (
              <div key={semester.id} className="flex items-center gap-2">
                <span className="text-sm font-medium w-24">সেমিস্টার {index + 1}</span>
                <Input
                  type="text"
                  placeholder="GPA (যেমন: 3.75)"
                  value={semester.gpa}
                  onChange={e => handleSemesterChange(semester.id, 'gpa', e.target.value)}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="ক্রেডিট (যেমন: 15)"
                  value={semester.credits}
                  onChange={e => handleSemesterChange(semester.id, 'credits', e.target.value)}
                  className="w-full"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveSemester(semester.id)} disabled={semesters.length === 1}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">মুছুন</span>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
             <Button variant="outline" onClick={handleAddSemester}>
              <Plus className="mr-2 h-4 w-4" />
              নতুন সেমিস্টার যোগ করুন
            </Button>
             <Button onClick={calculateCgpa}>
              <Calculator className="mr-2 h-4 w-4" />
              CGPA গণনা করুন
            </Button>
          </div>

          {cgpa !== null && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">আপনার গণনাকৃত CGPA হলো:</p>
              <p className="text-5xl font-bold text-primary">{cgpa.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    