
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { parse } from 'node-html-parser';
import { readCaptcha } from '@/ai/flows/read-captcha-flow';

export type CaptchaChallenge = {
  captchaImage: string; // Base64 Data URI
  cookies: string;
  solvedCaptcha: string;
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
      throw new Error(`Could not connect to the result server. It may be offline or blocking requests. Status: ${homeRes.status}`);
    }

    const cookies = homeRes.headers.get('set-cookie') || '';
    
    // Now fetch the captcha image using the session cookie
    const captchaRes = await fetch(`https://app.eboardresults.com/v2/captcha?t=${Date.now()}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "Referer": "https://app.eboardresults.com/v2/home",
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
    
    // Solve captcha using AI
    const { text: solvedCaptcha } = await readCaptcha({ photoDataUri: captchaImageUrl });

    if (!solvedCaptcha) {
      throw new Error('AI could not solve the captcha. Please refresh.');
    }

    return {
        captchaImage: captchaImageUrl,
        cookies: cookies,
        solvedCaptcha: solvedCaptcha,
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
  
  const yearNumber = parseInt(values.year, 10);
  const is2025Ctg = yearNumber === 2025 && values.board === 'chittagong';

  if (is2025Ctg) {
      return searchResult2025Ctg(values);
  }

  return searchResultLegacy(values);
}

// Handler for 2025 Chittagong Board API
async function searchResult2025Ctg(values: z.infer<typeof formSchema>): Promise<ExamResult> {
    try {
        const res = await fetch("https://sresult.bise-ctg.gov.bd/rxto2025/individual/result.php", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
                "Referer": "https://sresult.bise-ctg.gov.bd/rxto2025/individual/",
            },
            "body": `roll=${values.roll}&button2=`,
            "method": "POST"
        });

        if (!res.ok) {
            throw new Error(`Result server responded with status: ${res.status}`);
        }

        const html = await res.text();
        const root = parse(html);

        const infoTable = root.querySelector('.tftable');
        if (!infoTable) {
             const message = root.querySelector('h2')?.innerText.trim() || "Result not found";
             if (message.includes("Result Not Found")) {
                throw new Error("Result not found. Please check your roll number.");
             }
             throw new Error(message);
        }
        
        const infoData: Record<string, string> = {};
        const infoRows = infoTable.querySelectorAll('tr');
        
        const extractData = (label: string) => {
            const row = infoRows.find(r => r.innerText.toLowerCase().includes(label.toLowerCase()));
            if (!row) return '';
            const cells = row.querySelectorAll('td');
            // This handles rows with 2 or 4 cells
            for (let i = 0; i < cells.length; i += 2) {
                if (cells[i]?.innerText.trim().toLowerCase() === label.toLowerCase()) {
                    return cells[i + 1]?.innerText.trim() || '';
                }
            }
            return '';
        };

        infoData['Roll No'] = extractData('roll no');
        infoData['Name'] = extractData('name');
        infoData["Father's Name"] = extractData("father's name");
        infoData["Mother's Name"] = extractData("mother's name");
        infoData['Group'] = extractData('group');
        infoData['Reg. NO'] = extractData('reg. no');
        infoData['Board'] = extractData('board');
        infoData['Institute'] = extractData('institute');
        infoData['Result'] = extractData('result');
        infoData['DATE OF BIRTH'] = extractData('date of birth');
        infoData['Session'] = extractData('session');


        const gpaText = infoData['Result']?.split('=')[1] || '0';
        const gpa = parseFloat(gpaText);

        const gradesTable = root.querySelector('.tftable2');
        const gradeRows = gradesTable?.querySelectorAll('tr') || [];
        const grades: GradeInfo[] = [];

        for (let i = 1; i < gradeRows.length; i++) { // Skip header row
            const cells = gradeRows[i].querySelectorAll('td');
            if (cells.length === 3) {
                 const subject = cells[1].innerText.trim();
                 if (subject.toLowerCase().includes('result of ca')) continue;

                 const gradeText = cells[2].innerText.trim();
                 const gradeMatch = gradeText.match(/\((.*?)\)/);
                 const marksMatch = gradeText.match(/^(\d+)/);

                 const grade = gradeMatch ? gradeMatch[1].trim() : gradeText;
                 const marks = marksMatch ? marksMatch[1].trim() : '';

                grades.push({
                    code: cells[0].innerText.trim(),
                    subject: subject,
                    grade: grade,
                    marks: marks,
                });
            }
        }
        
        const result: ExamResult = {
            roll: infoData['Roll No'] || '',
            reg: infoData['Reg. NO'] || '',
            board: infoData['Board'] || '',
            year: values.year,
            exam: values.exam.toUpperCase(),
            gpa: gpa,
            status: gpa > 0 ? 'Pass' : 'Fail',
            
            studentInfo: {
                name: infoData['Name'] || '',
                fatherName: infoData["Father's Name"] || '',
                motherName: infoData["Mother's Name"] || '',
                group: infoData['Group'] || '',
                dob: infoData['DATE OF BIRTH'] || '',
                institute: infoData['Institute'] || '',
                session: infoData['Session'] || '',
            },
            grades: grades.filter(g => g.subject && g.code),
        };

        return result;

    } catch (error) {
        console.error("2025 Result fetch failed:", error);
        if (error instanceof Error) {
            if (error.message.includes('Result Not Found')) {
                throw new Error("Result not found. Please check your roll number and try again.");
            }
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching the 2025 result.');
    }
}


// Handler for Legacy E-Board Result API
async function searchResultLegacy(
  values: z.infer<typeof formSchema> & { cookies: string }
): Promise<ExamResult> {
  const apiUrl = "https://app.eboardresults.com/v2/getres";

  const params = new URLSearchParams();
  params.append('exam', values.exam);
  params.append('year', values.year);
  params.append('board', values.board);
  params.append('roll', values.roll);
  params.append('reg', values.reg);
  params.append('captcha', values.captcha);
  params.append('result_type', '1');
  params.append('eiin', '');
  params.append('dcode', '');
  params.append('ccode', '');

  try {
    const res = await fetch(apiUrl, {
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
        
        const madrasahSubjectMap: Record<string, string> = {
            '101-102': 'QURAN MAZID AND TAZBID AND HADITH SHARIF',
            '103-104': 'ARABIC I AND ARABIC II',
            '133': 'AQAID & FIQH',
            '134-135': 'BANGLA I AND BANGLA II',
            '136-137': 'ENGLISH I AND ENGLISH II',
        };

        let rawGrades: GradeInfo[] = apiResult.display_details.split(',').map((item: string) => {
            const [code, grade] = item.split(':').map((s: string) => s.trim());
            return {
                code,
                subject: subjectDetails[code] || code,
                grade
            };
        });

        if (values.board === 'madrasah') {
            const combinedGrades: GradeInfo[] = [];
            const processedCodes = new Set<string>();

            for (const combinedCode in madrasahSubjectMap) {
                const individualCodes = combinedCode.split('-');
                const firstCode = individualCodes[0];
                const firstCodeGrade = rawGrades.find(g => g.code === firstCode);

                if (firstCodeGrade) {
                    combinedGrades.push({
                        code: combinedCode,
                        subject: madrasahSubjectMap[combinedCode],
                        grade: firstCodeGrade.grade, 
                    });
                    individualCodes.forEach(code => processedCodes.add(code));
                }
            }
            const otherGrades = rawGrades.filter(g => !processedCodes.has(g.code));
            rawGrades = [...combinedGrades, ...otherGrades];
        }

        const result: ExamResult = {
            roll: apiResult.roll_no,
            reg: values.reg || apiResult.reg_no || 'N/A', // Use registration from input, fallback to API or N/A
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
                institute: apiResult.inst_name,
                session: apiResult.session,
            },
            grades: rawGrades,
        };

        return result;
    } else {
        if (data.msg && data.msg.toLowerCase().includes('captcha') || data.msg.toLowerCase().includes('security key')) {
            throw new Error('The Security Key is incorrect. Please try again.');
        }
        if (data.msg && data.msg.toLowerCase().includes('not found')) {
             throw new Error("Result not found. Please check your roll, registration, board, and year and try again.");
        }
        if (data.msg && data.msg.toLowerCase().includes('incorrect registration')) {
            throw new Error('Incorrect registration number. Please check and try again.');
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
