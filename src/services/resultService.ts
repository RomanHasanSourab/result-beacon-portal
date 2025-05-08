
import supabase from './supabaseClient';
import { Result, ResultFilter } from './types';
import { extractTextFromPdf, parseResultsFromText } from './pdfUtils';
import { getAllResults, searchResults, getResultById, deleteResult, mapDatabaseResultToModel } from './dbOperations';
import { mockResults } from './mockData';

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

// Re-export types and functions from our modules
export { Result, ResultFilter, getAllResults, searchResults, getResultById, deleteResult };
