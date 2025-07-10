'use server';

import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import type { GenerateRecommendationsInput } from '@/ai/flows/generate-recommendations';
import type { ExamResult, GradeInfo, StudentInfo } from '@/types';
import { z } from 'zod';
import { formSchema } from '@/components/exam-form';
import { parse } from 'node-html-parser';

export async function searchResultAction(
  values: z.infer<typeof formSchema>
): Promise<ExamResult> {
  let mainPageRes;
  try {
    // 1. Fetch the homepage to get a session cookie and the captcha values.
    mainPageRes = await fetch("http://www.educationboardresults.gov.bd/", {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' }
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    throw new Error("Could not connect to the education board's result server. It may be offline or blocking requests. Please try again later.");
  }
  
  const sessionCookie = mainPageRes.headers.get('set-cookie')?.split(';')[0] || '';

  const mainPageHtml = await mainPageRes.text();
  const mainRoot = parse(mainPageHtml);

  // 2. Extract captcha values from the form.
  const captchaRow = mainRoot.querySelector('form table tr:nth-child(7)'); // The captcha is usually in the 7th row.
  if (!captchaRow) {
    throw new Error('Could not find the captcha on the page. The website layout may have changed.');
  }

  const captchaText = captchaRow.querySelector('td:nth-child(2)')?.innerText.trim();
  if (!captchaText) {
      throw new Error('Could not read the captcha text.');
  }

  // The text is usually like "2 + 8 ="
  const numbers = captchaText.match(/\d+/g);
  if (!numbers || numbers.length < 2) {
      throw new Error('Could not parse captcha numbers from text: ' + captchaText);
  }

  const value_a = parseInt(numbers[0], 10);
  const value_b = parseInt(numbers[1], 10);
  const value_s = value_a + value_b;

  // 3. Construct and send the result request.
  const formData = new FormData();
  formData.append('sr', '1');
  formData.append('et', '2'); // These seem to be static values for individual results
  formData.append('exam', values.exam);
  formData.append('year', values.year);
  formData.append('board', values.board);
  formData.append('roll', values.roll);
  formData.append('reg', values.reg);
  formData.append('value_a', String(value_a));
  formData.append('value_b', String(value_b));
  formData.append('value_s', String(value_s));

  const headers: HeadersInit = {
    "Referer": "http://www.educationboardresults.gov.bd/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "Origin": "http://www.educationboardresults.gov.bd",
  };

  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }

  const res = await fetch("http://www.educationboardresults.gov.bd/result.php", {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch result. Server responded with status: ${res.status}`);
  }

  const resultHtml = await res.text();
  const resultRoot = parse(resultHtml);

  // Check for result not found message
  if (resultHtml.includes("Result not found") || resultHtml.includes("Result Not Found")) {
      throw new Error("Result not found. Please check your roll, registration, board, and year and try again.");
  }
  
  const resultDiv = resultRoot.querySelector('.result_display');
  if (!resultDiv) {
    const bodyText = resultRoot.querySelector('body')?.innerText.trim();
    if (bodyText && bodyText.includes('Roll No. does not exist')) {
        throw new Error('The provided Roll Number does not exist for the selected board and year.');
    }
    if (bodyText && bodyText.includes('Registration No. mismatched')) {
        throw new Error('Registration number mismatched.');
    }
    if (bodyText && bodyText.includes('are not numeric')) {
        throw new Error('Security answer is not correct. Please try again.');
    }
    // Generic error if no specific message is found
    throw new Error('Could not parse the result page. The website may be down or the layout has changed.');
  }

  // 4. Parse the result HTML.
  const infoTables = resultDiv.querySelectorAll('table');
  if (infoTables.length < 2) {
    throw new Error('Could not find the required data tables on the result page.');
  }
  const infoTable = infoTables[0];
  const gradesTable = infoTables[1];

  const getTableValue = (label: string): string => {
      const row = infoTable.querySelector(`tr:has(td:contains(${label}))`);
      return row?.querySelectorAll('td')[1]?.innerText.trim() || '';
  };

  const gpaStr = getTableValue('GPA');
  const gpa = gpaStr && !isNaN(parseFloat(gpaStr)) ? parseFloat(gpaStr) : 0;
  const status = gpa > 0 ? 'Pass' : 'Fail';


  const grades: GradeInfo[] = [];
  const gradeRows = gradesTable.querySelectorAll('tr');
  gradeRows.slice(1).forEach(row => { // Skip header row
    const cols = row.querySelectorAll('td');
    if (cols.length === 3) {
      grades.push({
        code: cols[0].innerText.trim(),
        subject: cols[1].innerText.trim(),
        grade: cols[2].innerText.trim(),
      });
    }
  });


  const result: ExamResult = {
    roll: getTableValue('Roll No'),
    reg: values.reg, 
    board: getTableValue('Board'),
    year: values.year,
    exam: values.exam.toUpperCase(),
    gpa: gpa,
    status,
    studentInfo: {
      name: getTableValue('Name'),
      fatherName: getTableValue("Father's Name"),
      motherName: getTableValue("Mother's Name"),
      group: getTableValue('Group'),
      dob: getTableValue('Date of Birth'),
    },
    grades,
  };

  return result;
}


export async function getRecommendationsAction(input: GenerateRecommendationsInput) {
  // Simulate network delay for AI call
  await new Promise(resolve => setTimeout(resolve, 1500));
  return generateRecommendations(input);
}
