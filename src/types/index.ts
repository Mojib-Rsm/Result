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
  session: string;
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
}


export interface HistoryItem {
    roll: string;
    reg?: string;
    board: string;
    year: string;
    exam: string;
    result: ExamResult;
}
