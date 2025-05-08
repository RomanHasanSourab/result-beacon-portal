
import { Result } from './types';

// Mock data for demonstration when Supabase fails
export const mockResults: Result[] = [
  {
    id: "1",
    studentId: "CS001",
    studentName: "John Doe",
    examName: "Mid Term",
    semester: "Fall 2023",
    year: "2023",
    subjects: [
      { name: "Mathematics", marks: 85, totalMarks: 100, grade: "A" },
      { name: "Physics", marks: 78, totalMarks: 100, grade: "B+" },
      { name: "Computer Science", marks: 92, totalMarks: 100, grade: "A+" },
    ],
    totalMarks: 300,
    obtainedMarks: 255,
    percentage: 85,
    grade: "A",
    uploadDate: "2023-12-15",
    pdfUrl: "/sample-result.pdf",
  },
  {
    id: "2",
    studentId: "CS002",
    studentName: "Jane Smith",
    examName: "Final Term",
    semester: "Spring 2023",
    year: "2023",
    subjects: [
      { name: "Mathematics", marks: 90, totalMarks: 100, grade: "A+" },
      { name: "Physics", marks: 85, totalMarks: 100, grade: "A" },
      { name: "Chemistry", marks: 88, totalMarks: 100, grade: "A" },
    ],
    totalMarks: 300,
    obtainedMarks: 263,
    percentage: 87.67,
    grade: "A",
    uploadDate: "2023-06-30",
    pdfUrl: "/sample-result.pdf",
  }
];
