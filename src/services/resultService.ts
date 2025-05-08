
import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source path (required for PDF.js)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize supabase client only if credentials are available
let supabase: ReturnType<typeof createClient>;

try {
  // Check if Supabase credentials are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or anon key is missing. Please check your .env file.');
    throw new Error('Missing Supabase credentials');
  }
  
  // Create Supabase client with valid credentials
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a mock supabase object with methods that return mock data
  // This prevents crashes when Supabase operations are called
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase not initialized') }),
          then: async () => ({ data: [], error: new Error('Supabase not initialized') })
        }),
        ilike: () => ({
          then: async () => ({ data: [], error: new Error('Supabase not initialized') })
        }),
        then: async () => ({ data: [], error: new Error('Supabase not initialized') })
      }),
      insert: () => ({
        then: async () => ({ error: new Error('Supabase not initialized') })
      }),
      delete: () => ({
        eq: () => ({
          then: async () => ({ error: new Error('Supabase not initialized') })
        })
      })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Supabase not initialized') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    functions: {
      invoke: async () => ({ data: { results: [] }, error: new Error('Supabase not initialized') })
    }
  } as unknown as ReturnType<typeof createClient>;
}

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

// Mock data for demonstration when Supabase fails
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

// Helper function to extract text content from a PDF
async function extractTextFromPdf(file: File): Promise<string[]> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    
    // Extract text from each page
    const textContent: string[] = [];
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      textContent.push(strings.join(' '));
    }
    
    return textContent;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Parse PDF content to extract student result data
function parseResultsFromText(textContent: string[]): Result[] {
  const results: Result[] = [];
  
  try {
    // Join all pages text
    const fullText = textContent.join(' ');
    
    // Define regex patterns for extracting information
    const studentInfoPattern = /Student ID:\s*(\w+)\s*Name:\s*([^,]+),?\s*Exam:\s*([^,]+),?\s*Semester:\s*([^,]+),?\s*Year:\s*(\d{4})/gi;
    const subjectPattern = /(\w[\w\s]+):\s*(\d+)\s*\/\s*(\d+)\s*\(([A-F][+-]?)\)/gi;
    const overallPattern = /Total:\s*(\d+)\s*\/\s*(\d+)\s*\((\d+\.?\d*)%\)\s*Grade:\s*([A-F][+-]?)/gi;
    
    // Extract student records (assuming multiple students might be in one PDF)
    let studentMatch;
    let lastIndex = 0;
    
    while ((studentMatch = studentInfoPattern.exec(fullText)) !== null) {
      const studentId = studentMatch[1];
      const studentName = studentMatch[2].trim();
      const examName = studentMatch[3].trim();
      const semester = studentMatch[4].trim();
      const year = studentMatch[5];
      
      // Get the text segment for this student (until the next student or end of file)
      const startIndex = studentMatch.index;
      const nextStudentIndex = fullText.indexOf("Student ID:", startIndex + 1);
      const endIndex = nextStudentIndex > -1 ? nextStudentIndex : fullText.length;
      const studentSegment = fullText.substring(startIndex, endIndex);
      
      // Extract subjects for this student
      const subjects = [];
      let subjectMatch;
      const subjectRegex = new RegExp(subjectPattern);
      
      while ((subjectMatch = subjectRegex.exec(studentSegment)) !== null) {
        const name = subjectMatch[1].trim();
        const marks = parseInt(subjectMatch[2], 10);
        const totalMarks = parseInt(subjectMatch[3], 10);
        const grade = subjectMatch[4];
        
        subjects.push({
          name,
          marks,
          totalMarks,
          grade
        });
      }
      
      // Extract overall results
      let totalMarks = 0;
      let obtainedMarks = 0;
      let percentage = 0;
      let grade = "N/A";
      
      const overallRegex = new RegExp(overallPattern);
      const overallMatch = overallRegex.exec(studentSegment);
      
      if (overallMatch) {
        obtainedMarks = parseInt(overallMatch[1], 10);
        totalMarks = parseInt(overallMatch[2], 10);
        percentage = parseFloat(overallMatch[3]);
        grade = overallMatch[4];
      } else {
        // Calculate if not found explicitly
        subjects.forEach(subject => {
          totalMarks += subject.totalMarks;
          obtainedMarks += subject.marks;
        });
        
        percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
        
        // Determine grade based on percentage
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 85) grade = "A";
        else if (percentage >= 80) grade = "A-";
        else if (percentage >= 75) grade = "B+";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 65) grade = "B-";
        else if (percentage >= 60) grade = "C+";
        else if (percentage >= 55) grade = "C";
        else if (percentage >= 50) grade = "C-";
        else if (percentage >= 40) grade = "D";
        else grade = "F";
      }
      
      // Create student result object
      results.push({
        id: `tmp_${Date.now()}_${results.length}`, // Temporary ID
        studentId,
        studentName,
        examName,
        semester,
        year,
        subjects,
        totalMarks,
        obtainedMarks,
        percentage,
        grade,
        uploadDate: new Date().toISOString()
      });
      
      lastIndex = endIndex;
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing results from text:', error);
    return [];
  }
}

// Upload PDF and process results
export const uploadResults = async (file: File): Promise<{ success: boolean; count: number }> => {
  try {
    // Upload file to Supabase storage first
    const fileName = `${Date.now()}-${file.name}`;
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('results-pdf')
      .upload(fileName, file);
    
    if (uploadError) {
      console.error('File upload error:', uploadError);
      throw new Error('Failed to upload PDF file');
    }

    // Get the file URL
    const { data: urlData } = supabase.storage
      .from('results-pdf')
      .getPublicUrl(fileName);
    
    const fileUrl = urlData?.publicUrl;
    
    // Extract text from the PDF
    const textContent = await extractTextFromPdf(file);
    
    // Parse the text to extract student results
    const processedResults = parseResultsFromText(textContent);
    
    // For each result, store it in the database
    const insertPromises = processedResults.map(async (result) => {
      // Update result with file URL
      const resultWithUrl = {
        ...result,
        pdf_url: fileUrl
      };
      
      const { error } = await supabase
        .from('student_results')
        .insert({
          student_id: result.studentId,
          student_name: result.studentName,
          exam_name: result.examName,
          semester: result.semester,
          year: result.year,
          subjects: result.subjects,
          total_marks: result.totalMarks,
          obtained_marks: result.obtainedMarks,
          percentage: result.percentage,
          grade: result.grade,
          upload_date: new Date().toISOString(),
          pdf_url: fileUrl
        });
      
      if (error) {
        console.error('Error inserting result:', error);
      }
    });
    
    await Promise.all(insertPromises);
    
    return { 
      success: true, 
      count: processedResults.length 
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    return { success: false, count: 0 };
  }
};

// Get all results (for admin)
export const getAllResults = async (): Promise<Result[]> => {
  try {
    const { data, error } = await supabase
      .from('student_results')
      .select('*');
    
    if (error) {
      console.error('Error fetching results:', error);
      return mockResults; // Fallback to mock data
    }
    
    return data.map(mapDatabaseResultToModel);
  } catch (error) {
    console.error('Error in getAllResults:', error);
    return mockResults; // Fallback to mock data
  }
};

// Search for results based on filters
export const searchResults = async (filters: ResultFilter): Promise<Result[]> => {
  try {
    let query = supabase.from('student_results').select('*');
    
    if (filters.studentId) {
      query = query.eq('student_id', filters.studentId);
    }
    
    if (filters.examName) {
      query = query.ilike('exam_name', `%${filters.examName}%`);
    }
    
    if (filters.semester) {
      query = query.ilike('semester', `%${filters.semester}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error searching results:', error);
      // Fallback to filtering mock data
      return mockResults.filter(r => 
        (!filters.studentId || r.studentId.toLowerCase() === filters.studentId?.toLowerCase()) &&
        (!filters.examName || r.examName.toLowerCase().includes(filters.examName?.toLowerCase() || '')) &&
        (!filters.semester || r.semester.toLowerCase().includes(filters.semester?.toLowerCase() || ''))
      );
    }
    
    return data.map(mapDatabaseResultToModel);
  } catch (error) {
    console.error('Error in searchResults:', error);
    // Fallback to filtering mock data
    return mockResults.filter(r => 
      (!filters.studentId || r.studentId.toLowerCase() === filters.studentId?.toLowerCase()) &&
      (!filters.examName || r.examName.toLowerCase().includes(filters.examName?.toLowerCase() || '')) &&
      (!filters.semester || r.semester.toLowerCase().includes(filters.semester?.toLowerCase() || ''))
    );
  }
};

// Get a single result by ID
export const getResultById = async (id: string): Promise<Result | null> => {
  try {
    const { data, error } = await supabase
      .from('student_results')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching result by ID:', error);
      return mockResults.find(r => r.id === id) || null;
    }
    
    return mapDatabaseResultToModel(data);
  } catch (error) {
    console.error('Error in getResultById:', error);
    return mockResults.find(r => r.id === id) || null;
  }
};

// Delete a result
export const deleteResult = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('student_results')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting result:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteResult:', error);
    return false;
  }
};

// Helper function to map database results to our model
function mapDatabaseResultToModel(dbResult: any): Result {
  return {
    id: dbResult.id,
    studentId: dbResult.student_id,
    studentName: dbResult.student_name,
    examName: dbResult.exam_name,
    semester: dbResult.semester,
    year: dbResult.year,
    subjects: dbResult.subjects,
    totalMarks: dbResult.total_marks,
    obtainedMarks: dbResult.obtained_marks,
    percentage: dbResult.percentage,
    grade: dbResult.grade,
    uploadDate: dbResult.upload_date,
    pdfUrl: dbResult.pdf_url
  };
}
