
'use server';

import type { ExamResult, GradeInfo, InstituteResult, StudentResult } from '@/types';
import { z } from 'zod';
import { formSchemaWithCookie } from '@/lib/schema';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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


async function searchResultLegacy(values: z.infer<typeof formSchemaWithCookie> & {result_type?: '1' | '2', eiin?: string}): Promise<ExamResult | InstituteResult | { error: string }> {
    const { exam, year, board, roll, reg, captcha, cookie, result_type = '1', eiin } = values;

    const payload = new URLSearchParams();
    payload.append('exam', exam);
    payload.append('year', year);
    payload.append('board', board);
    payload.append('result_type', result_type);
    
    if (result_type === '1') {
        payload.append('roll', roll || '');
        payload.append('reg', reg || '');
    } else {
        payload.append('eiin', eiin || '');
    }

    if (captcha) {
       payload.append('captcha', captcha);
    }
    
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
            return { error: `সার্ভার থেকে একটি ত্রুটিপূর্ণ প্রতিক্রিয়া এসেছে: ${response.status} ${response.statusText}` };
        }

        const data = await response.json();
        
        if (data.status !== 0 || !data.res) {
             const defaultError = "ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার দেওয়া তথ্য এবং ক্যাপচা পরীক্ষা করে আবার চেষ্টা করুন।";
             // The API sometimes returns HTML in the 'msg' field for captcha errors
             if (data.msg && (data.msg.includes('<') || data.msg.includes('>'))) {
                 return { error: "ক্যাপচা ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" }
             }
             return { error: data.msg || defaultError };
        }
        
        if (result_type === '2') {
            const res = data.res;
            const results: StudentResult[] = res.map((item: any) => ({
                roll: item.roll_no,
                reg: item.regno,
                gpa: item.gpa,
            }));

            return {
                instituteName: data.institute_name || "Unknown Institute",
                eiin: eiin || "N/A",
                exam: exam,
                year: year,
                board: board,
                results: results
            };
        }


        // Individual result processing
        const res = data.res;

        const gpaMatch = res.res_detail?.match(/([0-9\.]+)/);
        const gpa = gpaMatch ? parseFloat(gpaMatch[1]) : 0;
        const status = (res.res_detail?.toLowerCase().includes('pass') || res.res_detail?.toLowerCase().includes('gpa=')) ? 'Pass' : 'Fail';
        
        const allGrades = parseGrades(res.display_details, data.sub_details || []);
        if (res.display_details_ca) {
             const caGrades = parseGrades(res.display_details_ca, data.sub_details || []);
             allGrades.push(...caGrades);
        }
        
        const passingYear = parseInt(year, 10);
        const calculatedSession = res.session || `${passingYear - 2}-${passingYear - 1}`;


        const studentInfo = {
            name: res.name || 'N/A',
            fatherName: res.fname || 'N/A',
            motherName: res.mname || 'N/A',
            group: res.stud_group || 'N/A',
            dob: res.dob || 'N/A',
            institute: res.inst_name || 'N/A',
            eiin: res.eiin_code || 'N/A',
            session: calculatedSession,
        };
        
        const boardShortName = board.substring(0, 3).toLowerCase();
        const resultId = `${boardShortName}-${roll}`;

        const finalResult: ExamResult = {
            pdfId: resultId,
            roll: res.roll_no,
            reg: (res.regno && /^\d+$/.test(res.regno)) ? res.regno : values.reg,
            board: res.board_name,
            year: year,
            exam: exam,
            gpa: gpa,
            status: status,
            studentInfo: studentInfo,
            grades: allGrades,
        };

        if (status === 'Pass') {
            try {
                const resultDocRef = doc(db, 'results', resultId);
                await setDoc(resultDocRef, finalResult);
            } catch (dbError) {
                console.error("Failed to save result to Firestore:", dbError);
                // We don't return an error to the user, just log it. The result is still displayed.
            }
        }

        return finalResult;

    } catch (error) {
        console.error("Error in searchResultLegacy:", error);
        if (error instanceof Error && (error.message.includes('Incorrect registration number') || error.message.includes('You need to provide a valid Security Key') || error.message.includes('ফলাফল খুঁজে পাওয়া যায়নি'))) {
             return { error: error.message };
        }
        return { error: 'ফলাফল আনতে একটি অপ্রত্যাশিত সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং কিছুক্ষণ পর আবার চেষ্টা করুন।' };
    }
}

async function searchInstituteResult(values: { eiin: string; exam: string; year: string; board: string; }): Promise<InstituteResult | { error: string }> {
     // We don't need captcha for institute results via this API endpoint apparently
    const result = await searchResultLegacy({
        ...values,
        result_type: '2',
    });
    
    // Type assertion because we expect an institute result or an error
    return result as InstituteResult | { error: string };
}


export { searchResultLegacy, searchInstituteResult };
