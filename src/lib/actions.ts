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
  // 1. Fetch the homepage to get a session cookie and the captcha values.
  const mainPageRes = await fetch("http://www.educationboardresults.gov.bd/", {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const sessionCookie = mainPageRes.headers.get('set-cookie')?.split(';')[0] || '';
  
  if (!sessionCookie) {
    throw new Error('Could not establish session with the results server.');
  }

  const mainPageHtml = await mainPageRes.text();
  const mainRoot = parse(mainPageHtml);

  // 2. Extract captcha values from the form.
  const captchaRow = mainRoot.querySelector('tr:nth-child(8)');
  if (!captchaRow) {
    throw new Error('Could not find the captcha on the page.');
  }

  const captchaText = captchaRow.querySelector('td:nth-child(2)')?.innerText.trim();
  if (!captchaText) {
      throw new Error('Could not read the captcha text.');
  }
  const numbers = captchaText.match(/\d+/g);
  if (!numbers || numbers.length < 2) {
      throw new Error('Could not parse captcha numbers.');
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

  const res = await fetch("http://www.educationboardresults.gov.bd/result.php", {
    method: 'POST',
    headers: {
      "Cookie": sessionCookie,
      "Referer": "http://www.educationboardresults.gov.bd/",
      "User-Agent": "Mozilla/5.0"
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch result. Server responded with status: ${res.status}`);
  }

  const resultHtml = await res.text();
  const resultRoot = parse(resultHtml);

  const resultDiv = resultRoot.querySelector('.result_display');
  if (!resultDiv) {
    // Check for specific error messages
    const bodyText = resultRoot.querySelector('body')?.innerText.trim();
    if (bodyText && bodyText.includes('Roll No. does not exist')) {
        throw new Error('The provided Roll Number does not exist for the selected board and year.');
    }
    if (bodyText && bodyText.includes('Registration No. mismatched')) {
        throw new Error('Registration number mismatched.');
    }
    throw new Error('Could not parse the result page. The result format might have changed.');
  }

  // 4. Parse the result HTML.
  const infoTable = resultDiv.querySelector('table');
  if (!infoTable) {
    throw new Error('Could not find student information table.');
  }

  const getTableValue = (label: string): string => {
      const row = infoTable.querySelector(`tr:has(td:contains(${label}))`);
      return row?.querySelectorAll('td')[1]?.innerText.trim() || '';
  };

  const gpa = parseFloat(getTableValue('GPA'));
  const status = isNaN(gpa) || gpa === 0 ? 'Fail' : 'Pass';

  const grades: GradeInfo[] = [];
  const gradesTable = resultDiv.querySelectorAll('table')[1];
  if(gradesTable) {
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
  }


  const result: ExamResult = {
    roll: getTableValue('Roll No'),
    reg: values.reg, // This API doesn't return the reg no in the result page
    board: getTableValue('Board'),
    year: values.year, // Nor the year
    exam: values.exam.toUpperCase(), // Nor the exam name
    gpa: isNaN(gpa) ? 0 : gpa,
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
  await new Promise(resolve => setTimeout(resolve, 2000));
  return generateRecommendations(input);
}
