
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

// Mock data for demonstration
const mockResults: Result[] = [
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

// Simulate upload results
export const uploadResults = async (file: File): Promise<{ success: boolean; count: number }> => {
  // In a real app, this would upload the file to a server that would process the PDF
  console.log(`Uploading file: ${file.name}`);
  
  // Simulate successful processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, count: Math.floor(Math.random() * 30) + 10 });
    }, 2000);
  });
};

// Get all results (for admin)
export const getAllResults = async (): Promise<Result[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockResults]);
    }, 1000);
  });
};

// Search for results based on filters
export const searchResults = async (filters: ResultFilter): Promise<Result[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredResults = [...mockResults];
      
      if (filters.studentId) {
        filteredResults = filteredResults.filter(r => r.studentId.toLowerCase() === filters.studentId?.toLowerCase());
      }
      
      if (filters.examName) {
        filteredResults = filteredResults.filter(r => r.examName.toLowerCase().includes(filters.examName?.toLowerCase() || ''));
      }
      
      if (filters.semester) {
        filteredResults = filteredResults.filter(r => r.semester.toLowerCase().includes(filters.semester?.toLowerCase() || ''));
      }
      
      resolve(filteredResults);
    }, 800);
  });
};

// Get a single result by ID
export const getResultById = async (id: string): Promise<Result | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = mockResults.find(r => r.id === id) || null;
      resolve(result);
    }, 500);
  });
};

// Delete a result
export const deleteResult = async (id: string): Promise<boolean> => {
  console.log(`Deleting result with ID: ${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
