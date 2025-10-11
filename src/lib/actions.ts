
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { JSDOM } from 'jsdom';

async function searchResultLegacy(values: z.infer<typeof formSchema>): Promise<ExamResult> {
    const { exam, year, board, roll, reg } = values;

    // The captcha and result_type are seemingly static values for this endpoint.
    const payload = new URLSearchParams({
        exam,
        year,
        board,
        roll,
        reg,
        result_type: '1', // For individual result
        captcha: '1054' // This seems to be a static check
    });
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Origin': 'https://eboardresults.com',
        'Referer': 'https://eboardresults.com/v2/home',
    };

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

        if (data.error || data.message === 'Result not found') {
             throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }

        // The actual result data is nested inside a 'data' property which is a JSON string.
        const resultData = JSON.parse(data.data);

        const gpa = parseFloat(resultData.gpa) || 0;
        const status = gpa > 0 ? 'Pass' : 'Fail';
        
        const grades: GradeInfo[] = resultData.subject_wise_grade.map((g: any) => ({
            code: g.code,
            subject: g.name,
            grade: g.grade,
        }));
        
        return {
            roll: resultData.roll,
            reg: resultData.reg,
            board: resultData.board,
            year: resultData.year,
            exam: resultData.exam,
            gpa: gpa,
            status: status,
            studentInfo: {
                name: resultData.name,
                fatherName: resultData.fname,
                motherName: resultData.mname,
                group: resultData.group,
                dob: resultData.dob,
                institute: resultData.institute,
                session: '' 
            },
            grades: grades,
        };

    } catch (error) {
        console.error("Error in searchResultLegacy:", error);
        if (error instanceof Error) {
            // Re-throw specific, user-friendly messages
            if (error.message.startsWith('ফলাফল')) {
                 throw error;
            }
        }
        // Generic fallback for other errors
        throw new Error('ফলাফল আনতে একটি অপ্রত্যাশিত সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং কিছুক্ষণ পর আবার চেষ্টা করুন।');
    }
}

export { searchResultLegacy };
