'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Lightbulb, Link as LinkIcon, GraduationCap } from 'lucide-react';
import type { GenerateRecommendationsOutput } from '@/ai/flows/generate-recommendations';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AiRecommendationsProps {
  recommendations: GenerateRecommendationsOutput | null;
  isLoading: boolean;
}

export default function AiRecommendations({ recommendations, isLoading }: AiRecommendationsProps) {
  if (isLoading) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                 <Skeleton className="h-8 w-1/2" />
                 <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
            <Lightbulb className="text-accent" />
            <span>AI-Powered Recommendations</span>
        </CardTitle>
        <CardDescription>
            Based on your results, here are some personalized suggestions for your next steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="career" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="career">Career Options</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="subjects">Subject Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="career">
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.careerOptions.map((career) => (
                <Card key={career.name}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        {career.name}
                    </CardTitle>
                    <CardDescription>Job Outlook: {career.jobOutlook}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{career.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {career.requiredSkills.map(skill => <Badge variant="secondary" key={skill}>{skill}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scholarships">
             <div className="grid gap-4">
              {recommendations.scholarshipRecommendations.map((scholarship) => (
                <Card key={scholarship.name}>
                    <CardHeader>
                        <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                        <CardDescription>{scholarship.eligibilityCriteria}</CardDescription>
                    </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{scholarship.description}</p>
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Deadline: <span className="text-destructive">{scholarship.applicationDeadline}</span></p>
                        <Button asChild size="sm">
                            <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="w-4 h-4 mr-2" /> Apply Now
                            </a>
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        Subjects for Higher Studies
                    </CardTitle>
                    <CardDescription>Consider focusing on these subjects based on your strengths.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {recommendations.subjectSuggestions.map((subject) => (
                           <Badge key={subject} variant="default" className="text-base px-4 py-2">{subject}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
