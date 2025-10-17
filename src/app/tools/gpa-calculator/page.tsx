
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Calculator } from 'lucide-react';

const gradePoints: { [key: string]: number } = {
  'A+': 5.0,
  'A': 4.0,
  'A-': 3.5,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
};

const gradeOptions = Object.keys(gradePoints);

interface Subject {
  id: number;
  name: string;
  grade: string;
}

export default function GpaCalculatorPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: '', grade: '' },
  ]);
  const [gpa, setGpa] = useState<number | null>(null);

  const handleAddSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', grade: '' }]);
  };

  const handleRemoveSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleSubjectChange = (id: number, field: 'name' | 'grade', value: string) => {
    setSubjects(subjects.map(s => (s.id === id ? { ...s, [field]: value } : s)));
    setGpa(null); // Reset GPA when subjects change
  };

  const calculateGpa = () => {
    const validSubjects = subjects.filter(s => s.grade && gradePoints[s.grade] !== undefined);
    if (validSubjects.length === 0) {
      setGpa(0);
      return;
    }

    const totalPoints = validSubjects.reduce((acc, subject) => {
      return acc + gradePoints[subject.grade];
    }, 0);

    const averageGpa = totalPoints / validSubjects.length;
    setGpa(averageGpa);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">GPA ক্যালকুলেটর</h1>
        <p className="mt-2 text-lg text-muted-foreground">আপনার বিষয়ভিত্তিক গ্রেড ব্যবহার করে GPA গণনা করুন।</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>বিষয় এবং গ্রেড</CardTitle>
          <CardDescription>আপনার বিষয় এবং প্রাপ্ত গ্রেড যোগ করুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="flex items-center gap-2">
                <Input
                  placeholder={`বিষয় ${index + 1}`}
                  value={subject.name}
                  onChange={e => handleSubjectChange(subject.id, 'name', e.target.value)}
                  className="w-full"
                />
                <Select
                  value={subject.grade}
                  onValueChange={value => handleSubjectChange(subject.id, 'grade', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="গ্রেড নির্বাচন" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map(grade => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(subject.id)} disabled={subjects.length === 1}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">মুছুন</span>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
             <Button variant="outline" onClick={handleAddSubject}>
              <Plus className="mr-2 h-4 w-4" />
              নতুন বিষয় যোগ করুন
            </Button>
             <Button onClick={calculateGpa}>
              <Calculator className="mr-2 h-4 w-4" />
              GPA গণনা করুন
            </Button>
          </div>

          {gpa !== null && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">আপনার গণনাকৃত GPA হলো:</p>
              <p className="text-5xl font-bold text-primary">{gpa.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    