
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { JSDOM } from 'jsdom';

async function searchResultLegacy(values: z.infer<typeof formSchema>): Promise<ExamResult> {
    const { exam, year, board, roll, reg } = values;

    const payload = new URLSearchParams();
    payload.append('sr', '3');
    payload.append('et', '2');
    payload.append('exam', exam);
    payload.append('year', year);
    payload.append('board', board);
    payload.append('roll', roll);
    payload.append('reg', reg || ''); // Reg can be optional sometimes
    payload.append('button2', 'Submit');
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Origin': 'http://www.educationboardresults.gov.bd',
        'Referer': 'http://www.educationboardresults.gov.bd/',
    };

    try {
        const response = await fetch("http://www.educationboardresults.gov.bd/result.php", {
            method: 'POST',
            headers: headers,
            body: payload.toString(),
            redirect: 'follow',
        });
        
        if (!response.ok) {
            throw new Error(`সার্ভার থেকে একটি ত্রুটিপূর্ণ প্রতিক্রিয়া এসেছে: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        
        if (!responseText || responseText.includes("Sorry, the server is busy now")) {
            throw new Error("ফলাফল বোর্ড সার্ভার এই মুহূর্তে ব্যস্ত আছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
        }
        
        const dom = new JSDOM(responseText);
        const resultTables = dom.window.document.querySelectorAll('table.black12');
        
        if (resultTables.length === 0) {
             throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }

        const infoTable = resultTables[0];
        const gradeSheetTable = resultTables.length > 1 ? resultTables[resultTables.length - 1] : null;

        const getCellText = (table: Element, rowIndex: number, cellIndex: number) => {
             const row = table.querySelectorAll('tr')[rowIndex];
             return row?.cells[cellIndex]?.textContent?.trim() || 'N/A';
        }
        
        const gpaText = getCellText(infoTable, 5, 1);
        const gpaMatch = gpaText.match(/(\d\.\d+)/);
        const gpa = gpaMatch ? parseFloat(gpaMatch[0]) : 0;
        
        const statusText = getCellText(infoTable, 4, 1);
        const status = statusText.toUpperCase() === "PASSED" ? 'Pass' : 'Fail';
        
        const grades: GradeInfo[] = [];
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
            roll: roll,
            reg: reg || 'N/A',
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
