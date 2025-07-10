'use server';

import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import type { GenerateRecommendationsInput } from '@/ai/flows/generate-recommendations';
import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { parse } from 'node-html-parser';

// This is a new type for the two-step form process
export type CaptchaChallenge = {
  captchaImage: string; // Base64 Data URI
  cookies: string;
};

// Action 1: Fetch the initial page and the captcha image
export async function getCaptchaAction(): Promise<CaptchaChallenge> {
  try {
    const homeRes = await fetch('https://app.eboardresults.com/v2/home', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      },
    });

    if (!homeRes.ok) {
      throw new Error('Could not connect to the result server. It may be offline.');
    }

    const cookies = homeRes.headers.get('set-cookie') || '';
    const homeHtml = await homeRes.text();
    
    // Use a regular expression to reliably find the base64 encoded captcha image
    const match = homeHtml.match(/<img class="captcha" src="(data:image\/png;base64,[^"]+)"/);

    if (match && match[1]) {
      const captchaImageUrl = match[1];
      return {
        captchaImage: captchaImageUrl,
        cookies,
      };
    } else {
      // If regex fails, throw the specific error.
      throw new Error('Could not find captcha image on the page.');
    }
  } catch (error) {
    console.error("Captcha fetch failed:", error);
    if (error instanceof Error) {
        // Re-throw the specific error message from the try block or a generic one
        throw new Error(`Failed to load captcha: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching the captcha.');
  }
}


// Action 2: Submit the form with the captcha to get the result
export async function searchResultAction(
  values: z.infer<typeof formSchema> & { captcha: string, cookies: string }
): Promise<ExamResult> {
  
  const params = new URLSearchParams();
  params.append('exam', values.exam);
  params.append('year', values.year);
  params.append('board', values.board);
  params.append('roll', values.roll);
  params.append('reg', values.reg);
  params.append('captcha', values.captcha);
  // These seem to be static or optional values for individual results
  params.append('result_type', '1');
  params.append('eiin', '');
  params.append('dcode', '');
  params.append('ccode', '');


  try {
    const res = await fetch("https://app.eboardresults.com/v2/getres", {
      method: 'POST',
      headers: {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "Referer": "https://app.eboardresults.com/v2/home",
        "Cookie": values.cookies,
      },
      body: params.toString(),
    });

    if (!res.ok) {
      throw new Error(`Result server responded with status: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.status === 0 && data.msg === "Success" && data.res) {
        const apiResult = data.res;
        const subjectDetails: Record<string, string> = data.sub_details.reduce((acc: Record<string, string>, sub: {SUB_CODE: string, SUB_NAME: string}) => {
            acc[sub.SUB_CODE] = sub.SUB_NAME;
            return acc;
        }, {});

        const grades: GradeInfo[] = apiResult.display_details.split(',').map((item: string) => {
            const [code, grade] = item.split(':').map(s => s.trim());
            return {
                code,
                subject: subjectDetails[code] || 'Unknown Subject',
                grade
            };
        });

        const result: ExamResult = {
            roll: apiResult.roll_no,
            reg: values.reg,
            board: apiResult.board_name,
            year: apiResult.pass_year,
            exam: apiResult.exam_name,
            gpa: parseFloat(apiResult.gpa) || 0,
            status: apiResult.result === 'P' ? 'Pass' : 'Fail',
            studentInfo: {
                name: apiResult.name,
                fatherName: apiResult.fname,
                motherName: apiResult.mname,
                group: apiResult.stud_group,
                dob: apiResult.dob,
            },
            grades: grades,
        };

        return result;
    } else {
        // Handle specific API errors
        if (data.msg && data.msg.toLowerCase().includes('captcha')) {
            throw new Error('The Security Key is incorrect. Please try again.');
        }
        if (data.msg && data.msg.toLowerCase().includes('not found')) {
             throw new Error("Result not found. Please check your roll, registration, board, and year and try again.");
        }
        throw new Error(data.msg || 'An unknown error occurred while fetching the result.');
    }

  } catch (error) {
     console.error("Result fetch failed:", error);
     if (error instanceof Error) {
        throw new Error(error.message);
     }
     throw new Error('An unknown error occurred while fetching the result.');
  }
}


export async function getRecommendationsAction(input: GenerateRecommendationsInput) {
  // Simulate network delay for AI call
  await new Promise(resolve => setTimeout(resolve, 1500));
  return generateRecommendations(input);
}
