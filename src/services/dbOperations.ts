
import supabase from './supabaseClient';
import { Result, ResultFilter } from './types';
import { mockResults } from './mockData';

// Helper function to map database results to our model
export function mapDatabaseResultToModel(dbResult: any): Result {
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
