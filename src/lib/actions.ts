
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchemaWithCookie } from '@/lib/schema';

type SubjectDetail = {
    SUB_CODE: string;
    SUB_NAME: string;
};

function parseGrades(displayDetails: string, subDetails: SubjectDetail[]): GradeInfo[] {
    if (!displayDetails) return [];
    
    const subjectMap = new Map(subDetails.map(sub => [sub.SUB_CODE, sub.SUB_NAME]));

    return displayDetails.split(',').map(item => {
        const [codes, grade] = item.trim().split(':');
        
        const subjectNames = codes.split('+')
            .map(code => subjectMap.get(code.trim()) || 'Unknown Subject')
            .join(' / ');

        return {
            code: codes.replace(/\+/g, ' + '), // For display
            subject: subjectNames,
            grade: grade,
        };
    });
}


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

        if (data.status !== 0 || !data.res) {
             throw new Error(data.msg || "ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড, বছর এবং ক্যাপচা পরীক্ষা করে আবার চেষ্টা করুন।");
        }
        
        const res = data.res;

        const gpaMatch = res.res_detail?.match(/([0-9\.]+)/);
        const gpa = gpaMatch ? parseFloat(gpaMatch[1]) : 0;
        const status = res.res_detail?.toLowerCase().includes('pass') || res.res_detail?.toLowerCase().includes('gpa=') ? 'Pass' : 'Fail';
        
        const allGrades = parseGrades(res.display_details, data.sub_details || []);
        if (res.display_details_ca) {
             const caGrades = parseGrades(res.display_details_ca, data.sub_details || []);
             allGrades.push(...caGrades);
        }

        const studentInfo = {
            name: res.name || 'N/A',
            fatherName: res.fname || 'N/A',
            motherName: res.mname || 'N/A',
            group: res.stud_group || 'N/A',
            dob: res.dob || 'N/A',
            institute: res.inst_name || 'N/A',
            session: res.session || 'N/A',
        };

        return {
            roll: res.roll_no,
            reg: res.regno,
            board: res.board_name,
            year: year,
            exam: exam,
            gpa: gpa,
            status: status,
            studentInfo: studentInfo,
            grades: allGrades,
        };

    } catch (error) {
        console.error("Error in searchResultLegacy:", error);
        if (error instanceof Error) {
            if (error.message.includes('ফলাফল') || error.message.includes('সার্ভার')) {
                 throw error;
            }
        }
        throw new Error('ফলাফল আনতে একটি অপ্রত্যাশিত সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং কিছুক্ষণ পর আবার চেষ্টা করুন।');
    }
}

export { searchResultLegacy };
