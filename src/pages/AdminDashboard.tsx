
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllResults, Result, deleteResult } from '@/services/resultService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function AdminDashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getAllResults();
        setResults(data);
      } catch (error) {
        console.error('Failed to load results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, []);

  const handleDelete = async (id: string, studentName: string) => {
    try {
      await deleteResult(id);
      setResults(results.filter(r => r.id !== id));
      toast({
        title: "Result Deleted",
        description: `${studentName}'s result has been removed.`,
      });
    } catch (error) {
      console.error('Failed to delete result:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the result. Please try again.",
      });
    }
  };

  // Calculate stats
  const totalResults = results.length;
  const examTypes = new Set(results.map(r => r.examName)).size;
  const semesters = new Set(results.map(r => r.semester)).size;

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage student results and uploads</p>
        </div>
        <Button onClick={() => navigate('/admin/upload')} className="mt-4 md:mt-0" size="sm">
          <Upload className="mr-2 h-4 w-4" /> Upload New Results
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResults}</div>
            <p className="text-xs text-muted-foreground">Student results in database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Types</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examTypes}</div>
            <p className="text-xs text-muted-foreground">Different examination types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semesters</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesters}</div>
            <p className="text-xs text-muted-foreground">Academic terms covered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-results">
        <TabsList>
          <TabsTrigger value="all-results">All Results</TabsTrigger>
          <TabsTrigger value="recent-uploads">Recent Uploads</TabsTrigger>
        </TabsList>
        <TabsContent value="all-results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
              <CardDescription>
                Complete list of all uploaded results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading results...</div>
              ) : results.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Exam</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead className="text-right">Grade</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.studentId}</TableCell>
                          <TableCell>{result.studentName}</TableCell>
                          <TableCell>{result.examName}</TableCell>
                          <TableCell>{result.semester}</TableCell>
                          <TableCell className="text-right">{result.percentage.toFixed(2)}%</TableCell>
                          <TableCell className="text-right">{result.grade}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleDelete(result.id, result.studentName)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">No results uploaded yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent-uploads" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>
                Results uploaded in the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading results...</div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Demo data - This tab would show recently uploaded results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
