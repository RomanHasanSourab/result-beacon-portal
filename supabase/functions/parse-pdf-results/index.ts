
// Follow these steps in Supabase Studio to create this function:
// 1. Go to Edge Functions in Supabase Dashboard
// 2. Create a new function named "parse-pdf-results" 
// 3. Copy and paste this code

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Allow": "POST, OPTIONS",
      },
      status: 204,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return new Response(JSON.stringify({ error: "File URL is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch the PDF file
    const pdfResponse = await fetch(fileUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
    }

    const pdfData = await pdfResponse.arrayBuffer();
    
    // Load PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    // Extract text from all pages
    const results = [];
    const numPages = pdf.numPages;
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      
      // Pattern matching for student results - adjust based on your PDF format
      // This is a simplified example - you'll need to adjust the parsing logic
      // based on your actual PDF structure
      const studentMatches = pageText.match(/Student ID: ([A-Z0-9]+).*?Student Name: ([^\n]+).*?Exam: ([^\n]+).*?Semester: ([^\n]+).*?Year: ([0-9]{4})/gs);
      
      if (studentMatches) {
        for (const match of studentMatches) {
          const idMatch = match.match(/Student ID: ([A-Z0-9]+)/);
          const nameMatch = match.match(/Student Name: ([^\n]+)/);
          const examMatch = match.match(/Exam: ([^\n]+)/);
          const semesterMatch = match.match(/Semester: ([^\n]+)/);
          const yearMatch = match.match(/Year: ([0-9]{4})/);
          
          if (idMatch && nameMatch && examMatch && semesterMatch && yearMatch) {
            const studentId = idMatch[1];
            const studentName = nameMatch[1].trim();
            const examName = examMatch[1].trim();
            const semester = semesterMatch[1].trim();
            const year = yearMatch[1];
            
            // Extract subject results
            const subjectPattern = /Subject: ([^\n]+).*?Marks: ([0-9]+)\/([0-9]+).*?Grade: ([A-F][+-]?)/gs;
            const subjectMatches = match.matchAll(subjectPattern);
            
            const subjects = [];
            let totalMarks = 0;
            let obtainedMarks = 0;
            
            for (const subjectMatch of subjectMatches) {
              const subjectName = subjectMatch[1].trim();
              const marks = parseInt(subjectMatch[2]);
              const totalSubjectMarks = parseInt(subjectMatch[3]);
              const grade = subjectMatch[4];
              
              subjects.push({
                name: subjectName,
                marks: marks,
                totalMarks: totalSubjectMarks,
                grade: grade
              });
              
              totalMarks += totalSubjectMarks;
              obtainedMarks += marks;
            }
            
            // Calculate percentage and overall grade
            const percentage = (obtainedMarks / totalMarks) * 100;
            let grade = "F";
            
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 75) grade = "B+";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 65) grade = "C+";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 50) grade = "D";
            
            results.push({
              studentId,
              studentName,
              examName,
              semester,
              year,
              subjects,
              totalMarks,
              obtainedMarks,
              percentage,
              grade
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
