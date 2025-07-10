'use server';

import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import type { GenerateRecommendationsInput } from '@/ai/flows/generate-recommendations';
import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';

// Mock data generation
const createMockGrades = (exam: string): GradeInfo[] => {
    const subjects = exam === 'hsc' ? 
        ['Bangla', 'English', 'ICT', 'Physics', 'Chemistry', 'Math'] :
        ['Bangla', 'English', 'Math', 'Science', 'Social Science', 'Religion'];
    const grades = ['A+', 'A', 'A-', 'B', 'C', 'D'];
    return subjects.map((subject, i) => ({
        code: (101 + i).toString(),
        subject,
        grade: grades[Math.floor(Math.random() * grades.length)],
    }));
};

const calculateGpa = (grades: GradeInfo[]): number => {
    const gradePoints: { [key: string]: number } = { 'A+': 5.0, 'A': 4.0, 'A-': 3.5, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
    const totalPoints = grades.reduce((sum, g) => sum + (gradePoints[g.grade] || 0), 0);
    const gpa = totalPoints / grades.length;
    return gpa < 1 ? 0 : gpa;
};


export async function searchResultAction(
  values: z.infer<typeof formSchema>
): Promise<ExamResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate potential API failure
  if (values.roll === '000000') {
    throw new Error('The results server is currently busy. Please try again.');
  }
   if (values.roll === '999999') {
    throw new Error('Result not found for the provided information.');
  }

  const grades = createMockGrades(values.exam);
  const gpa = calculateGpa(grades);
  const status = gpa > 0 ? 'Pass' : 'Fail';

  // Mock result
  const result: ExamResult = {
    roll: values.roll,
    reg: values.reg,
    board: values.board,
    year: values.year,
    exam: values.exam,
    gpa,
    status,
    studentInfo: {
      name: 'Abul Kalam',
      fatherName: 'Babul Kalam',
      motherName: 'Amina Begum',
      group: 'Science',
      dob: '2004-01-15',
    },
    grades,
  };

  return result;
}


export async function getRecommendationsAction(input: GenerateRecommendationsInput) {
  // Simulate network delay for AI call
  await new Promise(resolve => setTimeout(resolve, 2000));
  return generateRecommendations(input);
}
