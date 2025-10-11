
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchemaWithCookie } from '@/lib/schema';
import { JSDOM } from 'jsdom';


async function searchResultLegacy(values: z.infer<typeof formSchemaWithCookie>): Promise<ExamResult> {
    const { exam, year, board, roll, reg, captcha, cookie } = values;

    const payload = new URLSearchParams({
        exam,
        year,
        board,
        roll,
        reg,
        result_type: '1',
        captcha,
    });
    
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    headers.append('Origin', 'https://eboardresults.com');
    headers.append('Referer', 'https://eboardresults.com/v2/home');

    if (cookie) {
        headers.append('Cookie', cookie);
    }

    try {
        const response = await fetch("https://eboardresults.com/v2/getres", {
            method: 'POST',
            headers: headers,
            body: payload.toString(),
            cache: 'no-store',
        });
        
        if (!response.ok) {
            throw new Error(`সার্ভার থেকে একটি ত্রুটিপূর্ণ প্রতিক্রিয়া এসেছে: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== 0 || data.message === 'Result not found' || data.message?.includes('captcha') || !data.data) {
             throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড, বছর এবং ক্যাপচা পরীক্ষা করে আবার চেষ্টা করুন।");
        }

        const html_content = data.data;
        
        const dom = new JSDOM(html_content);
        const document = dom.window.document;
        
        const result_div = document.querySelector('#result_display');
        if (!result_div || result_div.textContent?.includes('Result not found')) {
            throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }
        
        const tables = result_div.querySelectorAll('table');
        if (tables.length < 2) {
             throw new Error("ফলাফলের মার্কশিট পার্স করা যায়নি। ফলাফল কাঠামো পরিবর্তিত হতে পারে।");
        }
        
        const studentInfoTable = tables[0];
        const gradesTable = tables[1];

        const studentInfoRows = studentInfoTable.querySelectorAll('tbody tr');
        
        const getRowData = (label: string) => {
            for (const row of Array.from(studentInfoRows)) {
                const cells = row.querySelectorAll('td');
                if (cells.length > 1 && cells[0].textContent?.trim().toLowerCase() === label.toLowerCase()) {
                    return cells[1].textContent?.trim() || '';
                }
                 if (cells.length > 3 && cells[2].textContent?.trim().toLowerCase() === label.toLowerCase()) {
                    return cells[3].textContent?.trim() || '';
                }
            }
            return '';
        }
        
        const studentName = getRowData("Name of Student");
        const studentRoll = getRowData('Roll No');
        
        if (!studentName || !studentRoll) {
             throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }


        const resultText = getRowData('Result');
        const gpaMatch = resultText.match(/([0-9\.]+)/);
        const gpa = gpaMatch ? parseFloat(gpaMatch[1]) : 0;
        const status = resultText.toLowerCase().includes('pass') ? 'Pass' : 'Fail';
        
        const studentInfo = {
            name: studentName,
            fatherName: getRowData("Father's Name"),
            motherName: getRowData("Mother's Name"),
            group: getRowData('Group'),
            dob: getRowData('Date of Birth'),
            institute: document.querySelector('#i_name')?.textContent?.trim() || getRowData('Name of Institute'),
            session: getRowData('Session')
        };
        
        
        const grades: GradeInfo[] = [];
        const gradeRows = gradesTable.querySelectorAll('tbody tr');
        gradeRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if(cells.length >= 3) {
                grades.push({
                    code: cells[0].textContent?.trim() || '',
                    subject: cells[1].textContent?.trim() || '',
                    grade: cells[cells.length -1].textContent?.trim() || '' // Last cell is the grade
                });
            }
        });

        return {
            roll: studentRoll,
            reg: getRowData('Registration No'),
            board: getRowData('Board'),
            year: year,
            exam: exam,
            gpa: gpa,
            status: status,
            studentInfo: studentInfo,
            grades: grades,
        };

    } catch (error) {
        console.error("Error in searchResultLegacy:", error);
        if (error instanceof Error) {
            if (error.message.includes('ফলাফল')) {
                 throw error;
            }
        }
        throw new Error('ফলাফল আনতে একটি অপ্রত্যাশিত সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং কিছুক্ষণ পর আবার চেষ্টা করুন।');
    }
}

export { searchResultLegacy };
