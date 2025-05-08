
export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  examName: string;
  semester: string;
  year: string;
  subjects: {
    name: string;
    marks: number;
    totalMarks: number;
    grade: string;
  }[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  uploadDate: string;
  pdfUrl?: string;
}

export interface ResultFilter {
  studentId?: string;
  examName?: string;
  semester?: string;
}
