
'use server';

import type { ExamResult, GradeInfo, StudentInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { JSDOM } from 'jsdom';

// This function now fetches and returns the mathematical captcha string
async function getCaptchaAction() {
    try {
        const response = await fetch('http://www.educationboardresults.gov.bd/index.php', {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            }
        });
        const html = await response.text();
        const dom = new JSDOM(html);
        const captchaText = dom.window.document.querySelector("body fieldset > table > tr:nth-child(7) > td:nth-child(2)")?.textContent?.trim();

        if (!captchaText) {
            throw new Error("Captcha string not found in the page.");
        }
        return captchaText;

    } catch (error) {
        console.error("Captcha fetch failed", error);
        throw new Error("ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    }
}


async function searchResultLegacy(values: z.infer<typeof formSchema>): Promise<ExamResult> {
    const { exam, year, board, roll, reg, captcha } = values;

    const ss = new req.Session();

    try {
        const indexPage = await fetch("http://www.educationboardresults.gov.bd/index.php");
        const soup = new JSDOM(await indexPage.text()).window.document;
        const captchaString = soup.querySelector("body fieldset > table > tr:nth-child(7) > td:nth-child(2)")?.textContent || '';
        
        let captchaSolved;
        try {
            captchaSolved = eval(captchaString);
        } catch (e) {
            throw new Error("গাণিতিক ক্যাপচা সমাধান করা যায়নি।");
        }
        
        if (String(captchaSolved) !== captcha) {
            throw new Error("ভুল ক্যাপচা বা নিরাপত্তা কোড। অনুগ্রহ করে আবার চেষ্টা করুন।");
        }

        const formData = new URLSearchParams();
        formData.append('sr', '3');
        formData.append('et', '2');
        formData.append('exam', exam);
        formData.append('year', year);
        formData.append('board', board);
        formData.append('roll', roll);
        formData.append('reg', reg);
        formData.append('value_s', captcha);
        formData.append('button2', 'Submit');

        const resultPage = await fetch('http://www.educationboardresults.gov.bd/result.php', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
                "Referer": "http://www.educationboardresults.gov.bd/index.php"
            },
            body: formData.toString()
        });

        const resultHtml = await resultPage.text();
        const resultSoup = new JSDOM(resultHtml).window.document;
        
        const allInfoTable = resultSoup.querySelectorAll('table.black12');
        
        if (allInfoTable.length === 0) {
            throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }

        const infoTable = allInfoTable[0];
        const gradeSheet = allInfoTable[allInfoTable.length - 1];

        const studentInfo: StudentInfo = {
            name: infoTable.querySelector("tr:nth-child(1) > td:nth-child(4)")?.textContent?.trim() || 'N/A',
            fatherName: infoTable.querySelector("tr:nth-child(2) > td:nth-child(4)")?.textContent?.trim() || 'N/A',
            motherName: infoTable.querySelector("tr:nth-child(3) > td:nth-child(4)")?.textContent?.trim() || 'N/A',
            group: infoTable.querySelector("tr:nth-child(3) > td:nth-child(2)")?.textContent?.trim() || 'N/A',
            dob: infoTable.querySelector("tr:nth-child(4) > td:nth-child(4)")?.textContent?.trim() || 'N/A',
            institute: infoTable.querySelector("tr:nth-child(5) > td:nth-child(4)")?.textContent?.trim() || 'N/A',
            session: '', // Not available from this source
        };
        
        const resultText = infoTable.querySelector("tr:nth-child(5) > td:nth-child(2)")?.textContent?.trim() || 'Fail';
        const status: 'Pass' | 'Fail' = resultText.toUpperCase().includes('PASS') ? 'Pass' : 'Fail';
        
        const gpaText = infoTable.querySelector("tr:nth-child(6) > td:nth-child(2)")?.textContent?.trim() || '0';
        const gpa = parseFloat(gpaText) || 0;

        const grades: GradeInfo[] = [];
        const gradeRows = gradeSheet.querySelectorAll("tr");
        for (let i = 1; i < gradeRows.length; i++) {
            const row = gradeRows[i];
            const cells = row.querySelectorAll('td');
            if(cells.length === 3) {
                 grades.push({
                    code: cells[0].textContent?.trim() || '',
                    subject: cells[1].textContent?.trim() || '',
                    grade: cells[2].textContent?.trim() || ''
                });
            }
        }
        
        const finalResult: ExamResult = {
            roll,
            reg,
            board: board.charAt(0).toUpperCase() + board.slice(1),
            year,
            exam,
            gpa,
            status,
            studentInfo,
            grades,
            rawHtml: resultSoup.querySelector('.main-wrapper-content-container')?.innerHTML,
        };

        return finalResult;

    } catch (error) {
        console.error("Error in searchResultLegacy:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('একটি অজানা ত্রুটি ঘটেছে।');
    }
}

// Dummy req.Session for compatibility with the new logic, not actually used.
const req = {
    Session: class {
        get() {}
        post() {}
    }
}

export { getCaptchaAction, searchResultLegacy };
