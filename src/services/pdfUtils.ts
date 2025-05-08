
import * as pdfjsLib from 'pdfjs-dist';
import { Result } from './types';

// Set the worker source path (required for PDF.js)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// Helper function to extract text content from a PDF
export async function extractTextFromPdf(file: File): Promise<string[]> {
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
export function parseResultsFromText(textContent: string[]): Result[] {
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
