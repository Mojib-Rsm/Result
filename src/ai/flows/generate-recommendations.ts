// src/ai/flows/generate-recommendations.ts
'use server';

/**
 * @fileOverview Provides AI-powered recommendations for students based on their exam results.
 *
 * - generateRecommendations - A function that generates recommendations based on exam results.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecommendationsInputSchema = z.object({
  examName: z.string().describe('The name of the exam (e.g., SSC, HSC).'),
  grades: z.record(z.string(), z.string()).describe('A record of subjects and their corresponding grades.'),
  examYear: z.string().describe('The year the exam was taken.'),
  boardName: z.string().describe('The name of the education board.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const ScholarshipInfoSchema = z.object({
  name: z.string().describe('The name of the scholarship.'),
  description: z.string().describe('A brief description of the scholarship.'),
  eligibilityCriteria: z.string().describe('The eligibility criteria for the scholarship.'),
  applicationDeadline: z.string().describe('The application deadline for the scholarship.'),
  link: z.string().url().describe('A link to the scholarship application page.'),
});

const CareerOptionSchema = z.object({
  name: z.string().describe('The name of the career option.'),
  description: z.string().describe('A brief description of the career option.'),
  requiredSkills: z.array(z.string()).describe('A list of required skills for the career option.'),
  jobOutlook: z.string().describe('The job outlook for the career option.'),
});

const GenerateRecommendationsOutputSchema = z.object({
  scholarshipRecommendations: z.array(ScholarshipInfoSchema).describe('A list of scholarship recommendations based on the grades.'),
  subjectSuggestions: z.array(z.string()).describe('A list of suggested subjects to consider for further studies.'),
  careerOptions: z.array(CareerOptionSchema).describe('A list of career options based on the grades and suggested subjects.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const getScholarshipInfo = ai.defineTool(
  {
    name: 'getScholarshipInfo',
    description: 'Retrieves the latest information about scholarships based on exam name, grades, and board name.',
    inputSchema: z.object({
      examName: z.string().describe('The name of the exam (e.g., SSC, HSC).'),
      grades: z.record(z.string(), z.string()).describe('A record of subjects and their corresponding grades.'),
      boardName: z.string().describe('The name of the education board.'),
    }),
    outputSchema: z.array(ScholarshipInfoSchema),
  },
  async input => {
    // Placeholder implementation:  In a real application, this would fetch data from a database or external API.
    return [
      {
        name: 'Example Scholarship',
        description: 'This is an example scholarship for high-achieving students.',
        eligibilityCriteria: 'GPA of 3.5 or higher.',
        applicationDeadline: '2024-12-31',
        link: 'https://example.com/scholarship',
      },
    ];
  }
);

const getCareerOptions = ai.defineTool(
  {
    name: 'getCareerOptions',
    description: 'Retrieves career options based on the subjects and grades.',
    inputSchema: z.object({
      subjects: z.array(z.string()).describe('A list of subjects.'),
      grades: z.record(z.string(), z.string()).describe('A record of subjects and their corresponding grades.'),
    }),
    outputSchema: z.array(CareerOptionSchema),
  },
  async input => {
    // Placeholder implementation: In a real application, this would fetch data from a database or external API.
    return [
      {
        name: 'Software Engineer',
        description: 'Develops software applications.',
        requiredSkills: ['Programming', 'Problem Solving', 'Data Structures'],
        jobOutlook: 'Excellent',
      },
    ];
  }
);

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  tools: [getScholarshipInfo, getCareerOptions],
  input: {schema: z.object({
    examName: z.string(),
    examYear: z.string(),
    boardName: z.string(),
    grades: z.record(z.string(), z.string())
  })},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an AI career counselor. Based on the student's exam results, provide personalized recommendations for scholarships, subject suggestions, and career options.

Exam Name: {{{examName}}}
Exam Year: {{{examYear}}}
Board Name: {{{boardName}}}
Grades: {{{jsonStringify grades}}}

First, use the getScholarshipInfo tool to find relevant scholarships.

Then, suggest a few subjects that the student might be interested in based on their grades.

Finally, use the getCareerOptions tool, along with the student's grades, to suggest potential career paths.
`,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const output = response?.output;
    if (!output) {
      throw new Error('Failed to generate recommendations. The AI model did not return any output.');
    }
    return output;
  }
);
