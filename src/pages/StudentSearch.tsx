
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Result, searchResults as fetchResults } from '@/services/resultService';
import { FileText, Search, User, BookOpen, Calendar, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export default function StudentSearch() {
  const [studentId, setStudentId] = useState('');
  const [examName, setExamName] = useState('');
  const [semester, setSemester] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId && !examName && !semester) {
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Please enter at least one search criteria.",
      });
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const searchData = await fetchResults({
        studentId,
        examName,
        semester
      });
      
      setResults(searchData);
      
      if (searchData.length === 0) {
        toast({
          variant: "default",
          title: "No Results Found",
          description: "No matching results found for your search criteria."
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "There was a problem processing your search. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FileText className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Result Beacon Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Search for your examination results by entering your student ID, exam name, or semester below
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-none card-shadow">
            <div className="h-1 gradient-primary"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Result Search
              </CardTitle>
              <CardDescription>
                Enter your details to find your results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="studentId" 
                      placeholder="e.g. CS001" 
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="examName">Exam Name</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="examName" 
                      placeholder="e.g. Mid Term" 
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="semester" 
                      placeholder="e.g. Spring 2023" 
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary"
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search Results"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t py-4 text-sm text-muted-foreground">
              <Button variant="link" onClick={() => navigate('/admin/login')}>
                Admin Login
              </Button>
            </CardFooter>
          </Card>
          
          <div className="md:col-span-2">
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={result.id} className="border-none card-shadow overflow-hidden">
                    <div className="h-2 gradient-secondary"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{result.studentName}</CardTitle>
                          <CardDescription>ID: {result.studentId} | {result.examName} | {result.semester}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500">Grade</span>
                          <span className="text-lg font-bold text-primary">{result.grade}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 py-2">
                          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Total Marks</p>
                            <p className="font-semibold">{result.totalMarks}</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Obtained</p>
                            <p className="font-semibold">{result.obtainedMarks}</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Percentage</p>
                            <p className="font-semibold">{result.percentage.toFixed(2)}%</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" /> Subject Scores
                          </h4>
                          <div className="space-y-2">
                            {result.subjects.map((subject, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/20 rounded">
                                <span className="text-sm">{subject.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm">{subject.marks}/{subject.totalMarks}</span>
                                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    {subject.grade}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-800/10 justify-between">
                      <div className="text-sm text-slate-500">
                        <span>Uploaded: {new Date(result.uploadDate).toLocaleDateString()}</span>
                      </div>
                      {result.pdfUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-1" /> View Original
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Results Found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  We couldn't find any results matching your search criteria. Please try again with different information.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-800/30 dark:to-indigo-900/30 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                <div className="h-16 w-16 rounded-full gradient-card flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-2">Find Your Academic Results</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Enter your student ID and other details in the search form to view your examination results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
