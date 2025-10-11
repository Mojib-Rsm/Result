
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { JSDOM } from 'jsdom';

async function searchResultLegacy(values: z.infer<typeof formSchema>): Promise<ExamResult> {
    const { exam, year, board, roll, reg } = values;

    const payload = new URLSearchParams();
    payload.append('exam', exam);
    payload.append('year', year);
    payload.append('board', board);
    payload.append('roll', roll);
    payload.append('reg', reg);
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Origin': 'https://eboardresults.com',
        'Referer': 'https://eboardresults.com/v2/home',
    };

    try {
        const response = await fetch("https://eboardresults.com/v2/getres", {
            method: 'POST',
            headers: headers,
            body: payload.toString(),
        });
        
        if (!response.ok) {
            throw new Error(`সার্ভার থেকে একটি ত্রুটিপূর্ণ প্রতিক্রিয়া এসেছে: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        
        if (!responseText || responseText.includes("Sorry, the server is busy now")) {
            throw new Error("ফলাফল বোর্ড সার্ভার এই মুহূর্তে ব্যস্ত আছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
        }

        if (responseText.includes("Result not found")) {
            throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }
        
        const dom = new JSDOM(responseText);
        const document = dom.window.document;
        
        const getCellText = (label: string) => {
            const ths = Array.from(document.querySelectorAll('th'));
            const th = ths.find(el => el.textContent?.trim() === label);
            return th?.nextElementSibling?.textContent?.trim() || 'N/A';
        };

        const gpaText = getCellText('GPA');
        const gpa = parseFloat(gpaText) || 0;
        const status = gpa > 0 ? 'Pass' : 'Fail';

        const grades: GradeInfo[] = [];
        const gradeRows = document.querySelectorAll('table.table-bordered tbody tr');
        gradeRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 3) {
                grades.push({
                    code: cells[0].textContent?.trim() || '',
                    subject: cells[1].textContent?.trim() || '',
                    grade: cells[2].textContent?.trim() || ''
                });
            }
        });
        
        return {
            roll: getCellText('Roll No'),
            reg: getCellText('Registration No'),
            board: getCellText('Board'),
            year: getCellText('Year'),
            exam: getCellText('Examination'),
            gpa: gpa,
            status: status,
            studentInfo: {
                name: getCellText('Student Name'),
                fatherName: getCellText("Father's Name"),
                motherName: getCellText("Mother's Name"),
                group: getCellText('Group'),
                dob: getCellText('Date of Birth'),
                institute: getCellText('Institute'),
                session: '' 
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

export { searchResultLegacy };
