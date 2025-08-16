
'use server';

import type { ExamResult, GradeInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { JSDOM } from 'jsdom';

// Store cookies globally
let cookieJar = '';

async function getCaptchaAction() {
    try {
        const response = await fetch('https://www.eboardresults.com/v2/captcha?t=' + Date.now(), {
            method: 'GET',
            headers: {
                "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ne;q=0.7,bn;q=0.6",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "image",
                "sec-fetch-mode": "no-cors",
                "sec-fetch-site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
                "Referer": "https://www.eboardresults.com/v2/home",
            }
        });

        const newCookies = response.headers.get('set-cookie');
        if (newCookies) {
            cookieJar = newCookies.split(';')[0];
        }

        const buffer = await response.arrayBuffer();
        const imageBase64 = Buffer.from(buffer).toString('base64');
        
        return `data:image/jpeg;base64,${imageBase64}`;

    } catch (error) {
        console.error("Captcha fetch failed", error);
        throw new Error("ক্যাপচা লোড করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    }
}


async function searchResultLegacy(values: z.infer<typeof formSchema>): Promise<ExamResult> {
  const { exam, year, board, result_type, roll, reg, eiin, dcode, ccode, captcha } = values;

  const formData = `exam=${exam}&year=${year}&board=${board}&result_type=${result_type}&roll=${roll || ''}&reg=${reg || ''}&eiin=${eiin || ''}&dcode=${dcode || ''}&ccode=${ccode || ''}&captcha=${captcha || ''}`;

  try {
    const response = await fetch("https://www.eboardresults.com/v2/getres", {
        method: 'POST',
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ne;q=0.7,bn;q=0.6",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            "Referer": "https://www.eboardresults.com/v2/home",
            ...(cookieJar && { 'Cookie': cookieJar }),
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('নেটওয়ার্ক প্রতিক্রিয়া ঠিক ছিল না।');
    }

    const data = await response.json();

    if (data.status === "0" || data.status === 0) { // Success
        const apiResult = data.res;

        if(result_type !== '1' && apiResult.content) {
            const dom = new JSDOM(apiResult.content);
            const titleElement = dom.window.document.querySelector('h3');
            const title = titleElement ? titleElement.textContent : 'Result';

            return {
                roll: roll || '',
                reg: reg || '',
                board: board,
                year: year,
                exam: exam,
                gpa: 0,
                status: 'Pass', 
                studentInfo: {
                    name: title || 'Institution/Center Result',
                    fatherName: '',
                    motherName: '',
                    group: '',
                    dob: '',
                    institute: '',
                    session: '',
                },
                grades: [],
                rawHtml: apiResult.content,
            };
        }

        const gpa = parseFloat(apiResult.gpa) || 0;
        const status = apiResult.result === 'P' ? 'Pass' : 'Fail';
        
        let grades: GradeInfo[] = [];

        const mainSubjects = apiResult.display_details || '';
        const optionalSubjects = apiResult.display_details_ca || '';
        
        const allSubjectsString = [mainSubjects, optionalSubjects].filter(Boolean).join(',');

        if (allSubjectsString) {
             grades = allSubjectsString.split(',').map((g: string) => {
                const parts = g.trim().split(':');
                if (parts.length < 2) return null;
                
                const code = parts[0].trim();
                let gradeInfo = parts.slice(1).join(':').trim();
                let grade;
                let marks;

                if (gradeInfo.includes('=')) {
                    const gradeParts = gradeInfo.split('=');
                    marks = gradeParts[0];
                    grade = gradeParts[1];
                } else {
                    grade = gradeInfo;
                }

                const subDetail = data.sub_details?.find((s: any) => s.SUB_CODE === code);
                const subject = subDetail ? subDetail.SUB_NAME : "বিষয় লোড হচ্ছে...";

                return { code, subject, grade, marks };
             }).filter((g): g is GradeInfo => g !== null);
        }

        const registrationNumber = apiResult.regno === '[NOT SHOWN]' ? values.reg : apiResult.regno;

        return {
            roll: apiResult.roll_no || values.roll,
            reg: registrationNumber || '',
            board: apiResult.board_name ? apiResult.board_name.toLowerCase() : values.board,
            year: values.year,
            exam: values.exam,
            gpa: gpa,
            status: status,
            studentInfo: {
                name: apiResult.name || 'N/A',
                fatherName: apiResult.fname || 'N/A',
                motherName: apiResult.mname || 'N/A',
                group: apiResult.stud_group || 'N/A',
                dob: apiResult.dob || 'N/A',
                institute: apiResult.inst_name || 'N/A',
                session: apiResult.session || 'N/A',
            },
            grades: grades,
        };
    } else { // Error from API
         if(data.message && data.message.toLowerCase().includes("not found")) {
             throw new Error("ফলাফল খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আপনার রোল, রেজিস্ট্রেশন, বোর্ড এবং বছর পরীক্ষা করে আবার চেষ্টা করুন।");
        }
        if(data.message && (data.message.toLowerCase().includes("captcha") || data.message.toLowerCase().includes("security key"))) {
            throw new Error("ভুল ক্যাপচা বা নিরাপত্তা কোড। অনুগ্রহ করে আবার চেষ্টা করুন।");
        }
        // For any other error, throw the message from the API
        throw new Error(data.message || 'ফলাফল আনার সময় একটি অজানা ত্রুটি ঘটেছে বা ভুল ক্যাপচা!');
    }

  } catch (error) {
    console.error("Error in searchResultLegacy:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes("captcha") || error.message.toLowerCase().includes("security key")) {
            throw new Error("ভুল ক্যাপচা বা নিরাপত্তা কোড। অনুগ্রহ করে আবার চেষ্টা করুন।");
        }
        throw error;
    }
    throw new Error('একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন বা ভুল ক্যাপচা!');
  }
}

export { getCaptchaAction, searchResultLegacy };
