

export interface GradeInfo {
  code: string;
  subject: string;
  grade: string;
  marks?: string;
}

export interface StudentInfo {
  name: string;
  fatherName: string;
  motherName: string;
  group: string;
  dob: string;
  institute: string;
  eiin?: string;
  session?: string;
}

export interface ExamResult {
  roll: string;
  reg: string;
  board: string;
  year: string;
  exam: string;
  gpa: number;
  status: 'Pass' | 'Fail';
  studentInfo: StudentInfo;
  grades: GradeInfo[];
  rawHtml?: string;
  pdfId?: string;
}


export interface HistoryItem {
    roll: string;
    reg: string;
    board: string;
    year: string;
    exam: string;
    result: ExamResult;
    timestamp: number;
    eiin?: string;
}

export interface CaptchaResponse {
    img: string;
    key: string;
}

export interface StudentResult {
    roll: string;
    reg?: string;
    gpa: string;
    name?: string;
}

export interface InstituteResult {
    instituteName: string;
    eiin: string;
    exam: string;
    year: string;
    board: string;
    results: StudentResult[];
}
