
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { JSDOM } from 'jsdom';
import { cookies } from 'next/headers';

async function getCaptchaAction(establishSession = false) {
    const cookieStore = cookies();
    const ss = cookieStore.get('session_cookie')?.value || '';

    try {
        const response = await fetch('http://www.educationboardresults.gov.bd/index.php', {
            method: 'GET',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
                ...(ss && { 'Cookie': `PHPSESSID=${ss}` })
            }
        });

        const newCookies = response.headers.get('set-cookie');
        let sessionCookie = ss;
        if (newCookies) {
            sessionCookie = newCookies.split(';')[0].split('=')[1];
            cookieStore.set('session_cookie', sessionCookie, { httpOnly: true });
        }
        
        const html = await response.text();
        const dom = new JSDOM(html);
        const soup = dom.window.document;
        
        const captchaField = soup.querySelector("body fieldset > table > tr:nth-child(7) > td:nth-child(2)");
        
        if (!captchaField || !captchaField.textContent) {
            throw new Error("ক্যাপচা প্রশ্ন খুঁজে পাওয়া যায়নি।");
        }
        
        const captchaString = captchaField.textContent.trim();
        
        return { captchaText: `Solve: ${captchaString}`, cookie: sessionCookie };

    } catch (error) {
        console.error("Captcha fetch failed", error);
        throw new Error("ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    }
}


async function searchResultLegacy(values: z.infer<typeof formSchema>): Promise<ExamResult> {
    const { exam, year, board, roll, reg, captcha } = values;

    const cookieJar = cookies().get('session_cookie')?.value;

    if (!cookieJar) {
        throw new Error("সেশন তৈরি করা যায়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।");
    }
    
    const formData = new URLSearchParams();
    formData.append('sr', '3'); 
    formData.append('et', '2');
    formData.append('exam', exam);
    formData.append('year', year);
    formData.append('board', board);
    formData.append('roll', roll || '');
    formData.append('reg', reg || '');
    formData.append('value_s', captcha);
    formData.append('button2', 'Submit');
    
    try {
        const response = await fetch("http://www.educationboardresults.gov.bd/result.php", {
            method: 'POST',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ne;q=0.7,bn;q=0.6",
                "content-type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
                "Referer": "http://www.educationboardresults.gov.bd/index.php",
                'Cookie': `PHPSESSID=${cookieJar}`,
            },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error('নেটওয়ার্ক প্রতিক্রিয়া ঠিক ছিল না।');
        }

        const responseText = await response.text();
        
        if (!responseText) {
            throw new Error("ফলাফল বোর্ড সার্ভার থেকে কোনো সাড়া পাওয়া যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
        }

        const dom = new JSDOM(responseText);
        const resultTable = dom.window.document.querySelector('.black12');
        
        if (!resultTable) {
             throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }

        const infoRows = resultTable.querySelectorAll('tr');

        const getCellText = (rowIndex: number, cellIndex: number) => infoRows[rowIndex]?.cells[cellIndex]?.textContent?.trim() || 'N/A';
        
        const gpaText = getCellText(5, 1);
        const gpa = parseFloat(gpaText.match(/(\d+\.\d+)/)?.[0] || '0');
        const status = getCellText(4, 1) === "PASSED" ? 'Pass' : 'Fail';
        
        const grades: GradeInfo[] = [];
        const gradeSheetTable = dom.window.document.querySelectorAll('.black12')[1];

        if(gradeSheetTable) {
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
            roll: getCellText(0, 1),
            reg: getCellText(0, 3),
            board: board.charAt(0).toUpperCase() + board.slice(1),
            year: year,
            exam: exam,
            gpa: gpa,
            status: status,
            studentInfo: {
                name: getCellText(1, 1),
                fatherName: getCellText(2, 1),
                motherName: getCellText(2, 3),
                group: getCellText(3, 1),
                dob: getCellText(3, 3),
                institute: getCellText(4, 3),
                session: '' // Not available from this source
            },
            grades: grades,
        };

    } catch (error) {
        console.error("Error in searchResultLegacy:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।');
    }
}

export { getCaptchaAction, searchResultLegacy };
