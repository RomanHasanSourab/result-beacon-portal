
import { createClient } from '@supabase/supabase-js';

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

// Upload PDF and process results
export const uploadResults = async (file: File): Promise<{ success: boolean; count: number }> => {
  try {
    // Upload file to Supabase storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('results-pdf')
      .upload(fileName, file);
    
    if (uploadError) {
      console.error('File upload error:', uploadError);
      throw new Error('Failed to upload PDF file');
    }

    // Get the file URL for further processing
    const { data: urlData } = supabase.storage
      .from('results-pdf')
      .getPublicUrl(fileName);
    
    const fileUrl = urlData?.publicUrl;

    // Call the edge function to process the PDF
    const { data: extractionData, error: extractionError } = await supabase.functions
      .invoke('parse-pdf-results', {
        body: { fileUrl, fileName }
      });
    
    if (extractionError) {
      console.error('Extraction error:', extractionError);
      throw new Error('Failed to extract data from PDF');
    }
    
    const processedResults = extractionData.results;
    
    // For each result in the processed data, store it in the database
    const insertPromises = processedResults.map(async (result: any) => {
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
