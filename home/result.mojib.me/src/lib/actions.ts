
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { JSDOM } from 'jsdom';
import { cookies } from 'next/headers';

async function getCaptchaAction(): Promise<{ captchaText: string }> {
    const cookieStore = cookies();
    
    try {
        const response = await fetch('http://www.educationboardresults.gov.bd/index.php', {
            method: 'GET',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            }
        });

        const newCookies = response.headers.get('set-cookie');
        if (newCookies) {
            const sessionCookie = newCookies.split(';')[0].split('=')[1];
            cookieStore.set('session_cookie', sessionCookie, { httpOnly: true });
        }
        
        const html = await response.text();
        const dom = new JSDOM(html);
        const soup = dom.window.document;
        
        const captchaField = soup.querySelector("body fieldset > table > tr:nth-child(7) > td:nth-child(2)");
        
        if (!captchaField || !captchaField.textContent) {
            console.error("Captcha element not found on page.");
            throw new Error("ক্যাপচা প্রশ্ন খুঁজে পাওয়া যায়নি। সাইটটি পরিবর্তিত হতে পারে।");
        }
        
        const captchaString = captchaField.textContent.trim();
        return { captchaText: captchaString };

    } catch (error) {
        console.error("Captcha fetch failed:", error);
        throw new Error("ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    }
}


// A simple and safe way to evaluate the math captcha
function solveCaptcha(captcha: string): number {
    const sanitized = captcha.replace(/[^-()\d/*+.]/g, '');
    try {
        // Using a safer method than eval
        const result = new Function('return ' + sanitized)();
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('Invalid captcha calculation');
        }
        return result;
    } catch (e) {
        console.error("Could not solve captcha:", e);
        throw new Error("ক্যাপচা সমাধান করা যায়নি।");
    }
}


async function searchResultLegacy(values: z.infer<typeof formSchema>): Promise<ExamResult> {
    const { exam, year, board, roll, reg, captcha } = values;

    const cookieJar = cookies().get('session_cookie')?.value;
    if (!cookieJar) {
        throw new Error("সেশন তৈরি করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।");
    }

    const captchaValue = solveCaptcha(captcha);
    
    const payload = new URLSearchParams();
    payload.append('sr', '3'); 
    payload.append('et', '2');
    payload.append('exam', exam);
    payload.append('year', year);
    payload.append('board', board);
    payload.append('roll', roll);
    payload.append('reg', reg);
    payload.append('value_s', captchaValue.toString());
    payload.append('button2', 'Submit');
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; BDResultFetcher/1.0; +https://bdedu.me)',
        'Origin': 'http://www.educationboardresults.gov.bd',
        'Referer': 'http://www.educationboardresults.gov.bd/index.php',
        'Cookie': `PHPSESSID=${cookieJar}`,
    };

    try {
        const response = await fetch("http://www.educationboardresults.gov.bd/result.php", {
            method: 'POST',
            headers: headers,
            body: payload.toString(),
        });
        
        if (!response.ok) {
            throw new Error(`সার্ভার থেকে একটি ত্রুটিপূর্ণ প্রতিক্রিয়া এসেছে: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        
        if (!responseText) {
            throw new Error("ফলাফল বোর্ড সার্ভার থেকে কোনো সাড়া পাওয়া যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
        }
        
        const dom = new JSDOM(responseText);
        const resultTables = dom.window.document.querySelectorAll('table.black12');
        
        if (resultTables.length === 0) {
            if (responseText.includes("Wrong information")) {
                 throw new Error("ভুল তথ্য। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
            }
             throw new Error("ফলাফল খুঁজে পাওয়া যায়নি বা ভুল ক্যাপচা। অনুগ্রহ করে আপনার তথ্য এবং ক্যাপচা পরীক্ষা করে আবার চেষ্টা করুন।");
        }

        const infoTable = resultTables[0];
        const gradeSheetTable = resultTables[resultTables.length - 1];

        const getCellText = (table: Element, rowIndex: number, cellIndex: number) => {
             const row = table.querySelectorAll('tr')[rowIndex];
             return row?.cells[cellIndex]?.textContent?.trim() || 'N/A';
        }
        
        const gpaText = getCellText(infoTable, 5, 1);
        // GPA might not exist for failed students, handle it gracefully
        const gpaMatch = gpaText.match(/(\d+\.\d+)/);
        const gpa = gpaMatch ? parseFloat(gpaMatch[0]) : 0;
        
        const statusText = getCellText(infoTable, 4, 1);
        const status = statusText === "PASSED" ? 'Pass' : 'Fail';
        
        const grades: GradeInfo[] = [];
        if(gradeSheetTable && gradeSheetTable !== infoTable) {
            const gradeRows = gradeSheetTable.querySelectorAll('tr');
            for(let i = 1; i < gradeRows.length; i++) {
                const cells = gradeRows[i].querySelectorAll('td');
                if (cells.length >= 3) {
                    grades.push({
                        code: cells[0].textContent?.trim() || '',
                        subject: cells[1].textContent?.trim() || '',
                        grade: cells[2].textContent?.trim() || ''
                    });
                }
            }
        }
        
        return {
            roll: roll,
            reg: reg,
            board: board.charAt(0).toUpperCase() + board.slice(1),
            year: year,
            exam: exam,
            gpa: gpa,
            status: status,
            studentInfo: {
                name: getCellText(infoTable, 0, 3),
                fatherName: getCellText(infoTable, 1, 3),
                motherName: getCellText(infoTable, 2, 3),
                group: getCellText(infoTable, 2, 1),
                dob: getCellText(infoTable, 3, 3),
                institute: getCellText(infoTable, 4, 3),
                session: '' // Not available from this source
            },
            grades: grades,
        };

    } catch (error) {
        console.error("Error in searchResultLegacy:", error);
        if (error instanceof Error) {
            // Re-throw the specific error message to be displayed in the UI
            throw error;
        }
        // Fallback for unknown errors
        throw new Error('একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।');
    }
}

export { getCaptchaAction, searchResultLegacy };
