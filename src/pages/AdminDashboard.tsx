
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllResults, Result, deleteResult } from '@/services/resultService';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Upload, 
  User, 
  Calendar, 
  BarChart, 
  Trash2, 
  Eye, 
  List
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAllResults();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load results data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await deleteResult(id);
        setResults(results.filter(result => result.id !== id));
        toast({
          title: "Result Deleted",
          description: "The result has been successfully deleted.",
        });
      } catch (error) {
        console.error('Failed to delete result:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the result.",
        });
      }
    }
  };

  // Prepare data for statistics
  const totalStudents = new Set(results.map(r => r.studentId)).size;
  const totalExams = new Set(results.map(r => r.examName)).size;
  const averagePercentage = results.length > 0
    ? (results.reduce((acc, result) => acc + result.percentage, 0) / results.length).toFixed(1)
    : '0';

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and view all student results</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="gradient-primary">
            <Link to="/admin/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Results
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-none card-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Results uploaded</p>
          </CardContent>
        </Card>
        
        <Card className="border-none card-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique students</p>
          </CardContent>
        </Card>
        
        <Card className="border-none card-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Exams</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExams}</div>
            <p className="text-xs text-muted-foreground mt-1">Different exams</p>
          </CardContent>
        </Card>
        
        <Card className="border-none card-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all results</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="border-none card-shadow overflow-hidden">
        <div className="h-1 gradient-primary"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Student Results
          </CardTitle>
          <CardDescription>
            Manage all uploaded student examination results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Student</th>
                      <th className="py-3 px-4 text-left font-medium">Exam & Semester</th>
                      <th className="py-3 px-4 text-left font-medium">Score</th>
                      <th className="py-3 px-4 text-left font-medium">Grade</th>
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-t hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{result.studentName}</p>
                            <p className="text-xs text-slate-500">{result.studentId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p>{result.examName}</p>
                            <p className="text-xs text-slate-500">{result.semester}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p>{result.obtainedMarks}/{result.totalMarks}</p>
                          <p className="text-xs text-slate-500">{result.percentage.toFixed(1)}%</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {result.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-sm">
                          {new Date(result.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/result/${result.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(result.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="mx-auto h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <FileText className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No results yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Get started by uploading your first result file
              </p>
              <Button asChild>
                <Link to="/admin/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Results
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
