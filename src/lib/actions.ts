
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { parse } from 'node-html-parser';
import { readCaptcha } from '@/ai/flows/read-captcha-flow';

export type CaptchaChallenge = {
  image: string; // Base64 Data URI
  cookies: string;
  text: string; // AI-read text from captcha
};

// Action 1: Fetch the initial page and the captcha image
export async function getCaptchaAction(): Promise<CaptchaChallenge> {
  try {
    const homeRes = await fetch('https://eboardresults.com/v2/home', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      },
    });

    if (!homeRes.ok) {
      throw new Error(`Could not connect to the result server. It may be offline or blocking requests. Status: ${homeRes.status}`);
    }

    const cookies = homeRes.headers.get('set-cookie') || '';
    
    // Now fetch the captcha image using the session cookie
    const captchaRes = await fetch(`https://eboardresults.com/v2/captcha?t=${Date.now()}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "Referer": "https://eboardresults.com/v2/home",
            "Cookie": cookies,
        }
    });

    if (!captchaRes.ok) {
        throw new Error('Could not fetch the captcha image.');
    }

    const imageBuffer = await captchaRes.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = captchaRes.headers.get('content-type') || 'image/jpeg';
    const captchaImageUrl = `data:${mimeType};base64,${base64Image}`;
    
    let captchaText = '';
    try {
        const result = await readCaptcha({ photoDataUri: captchaImageUrl });
        captchaText = result.text;
    } catch(aiError) {
        console.warn("AI captcha read failed, user will have to enter manually.", aiError);
    }
    
    return {
        image: captchaImageUrl,
        cookies: cookies,
        text: captchaText,
    };

  } catch (error) {
    console.error("Captcha fetch failed:", error);
    if (error instanceof Error) {
        if (error.message.includes('fetch failed')) {
            throw new Error('Failed to load captcha: A network error occurred. Please check your internet connection and if the result server is accessible.');
        }
        throw new Error(`Failed to load security code: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching the security code.');
  }
}

// Action 2: Submit the form with the captcha to get the result
export async function searchResultAction(
  values: z.infer<typeof formSchema> & { cookies: string }
): Promise<ExamResult> {
  return searchResultLegacy(values);
}


// Handler for Legacy E-Board Result API
async function searchResultLegacy(
  values: z.infer<typeof formSchema> & { cookies: string }
): Promise<ExamResult> {
  const apiUrl = "https://eboardresults.com/v2/getres";

  const body = `exam=${values.exam}&year=${values.year}&board=${values.board}&roll=${values.roll || ''}&reg=${values.reg || ''}&captcha=${values.captcha}&result_type=${values.result_type}&eiin=&dcode=&ccode=`;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "Origin": "https://eboardresults.com",
        "Referer": "https://eboardresults.com/v2/home",
        "Cookie": values.cookies,
      },
      body: body,
    });

    if (!res.ok) {
      throw new Error(`Result server responded with status: ${res.status}`);
    }
    
    let data;
    try {
        const text = await res.text();
        // Check for non-JSON error messages from the server
        if (text.trim().startsWith('<') || !text.trim().startsWith('{')) {
            const root = parse(text);
            const errorMessage = root.querySelector('.alert-danger')?.innerText.trim() || root.querySelector('.panel-body')?.innerText.trim();
            if (errorMessage) {
                if (errorMessage.toLowerCase().includes('captcha') || errorMessage.toLowerCase().includes('security key')) {
                    throw new Error('The Security Key is incorrect. Please try again.');
                }
                 if (errorMessage.toLowerCase().includes('result not yet published')) {
                    throw new Error("Result not yet published or your inputs are invalid.");
                }
                throw new Error(errorMessage);
            }
            throw new Error("The result server returned an invalid response.");
        }
        data = JSON.parse(text);
    } catch (e) {
        if (e instanceof Error) {
            throw e; // re-throw errors from the try block
        }
        console.error("Failed to parse JSON:", e);
        throw new Error("The result server returned an unreadable response. Please try again later.");
    }
    
    if (data.status === '1' && data.data) {
        const apiResult = data.data;

        // If the result is HTML content (for institution/center results), pass it directly.
        if (data.html) {
             return {
                roll: values.roll || '',
                reg: values.reg || '',
                board: values.board,
                year: values.year,
                exam: values.exam,
                gpa: 0,
                status: 'Pass', // Status might not be applicable here
                studentInfo: { name: '', fatherName: '', motherName: '', group: '', dob: '', institute: '', session: '' },
                grades: [],
                rawHtml: data.html,
            };
        }

        const subjectDetails: Record<string, string> = (data.sub_details || []).reduce((acc: Record<string, string>, sub: {SUB_CODE: string, SUB_NAME: string}) => {
            acc[sub.SUB_CODE] = sub.SUB_NAME;
            return acc;
        }, {});
        
        let rawGrades: GradeInfo[] = (apiResult.gpa_details || '').split(',').filter(Boolean).map((item: string) => {
            const [code, grade] = item.split(':').map((s: string) => s.trim());
            return {
                code,
                subject: subjectDetails[code] || code,
                grade
            };
        });

        const result: ExamResult = {
            roll: apiResult.roll,
            reg: values.reg || apiResult.reg_no || 'N/A', // Use registration from input, fallback to API or N/A
            board: apiResult.board,
            year: apiResult.year,
            exam: apiResult.exam,
            gpa: parseFloat(apiResult.gpa) || 0,
            status: parseFloat(apiResult.gpa) > 0 ? 'Pass' : 'Fail',
            studentInfo: {
                name: apiResult.name,
                fatherName: apiResult.fname,
                motherName: apiResult.mname,
                group: apiResult.group,
                dob: apiResult.dob,
                institute: apiResult.institute,
                session: apiResult.session || '',
            },
            grades: rawGrades.sort((a,b) => parseInt(a.code) - parseInt(b.code)),
        };

        return result;
    } else {
        if (data.message && (data.message.toLowerCase().includes('captcha') || data.message.toLowerCase().includes('security key'))) {
            throw new Error('The Security Key is incorrect. Please try again.');
        }
        if (data.message && (data.message.toLowerCase().includes('not found') || data.message.toLowerCase().includes('incorrect registration'))) {
             throw new Error("Result not found. Please check your roll, registration, board, and year and try again.");
        }
        throw new Error(data.message || 'An unknown error occurred while fetching the result.');
    }

  } catch (error) {
     console.error("Result fetch failed:", error);
     if (error instanceof Error) {
        if (error.message.includes('fetch failed')) {
            throw new Error('A network error occurred. Please check your internet connection and if the result server is accessible.');
        }
        throw new Error(error.message);
     }
     throw new Error('An unknown error occurred while fetching the result.');
  }
}
