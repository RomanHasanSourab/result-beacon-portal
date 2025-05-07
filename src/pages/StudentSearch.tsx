
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Result, ResultFilter, searchResults } from '@/services/resultService';
import { FileText, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ResultCard from '@/components/ResultCard';

export default function StudentSearch() {
  const [filters, setFilters] = useState<ResultFilter>({
    studentId: '',
    examName: '',
    semester: '',
  });
  const [results, setResults] = useState<Result[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!filters.studentId) {
      toast({
        variant: "destructive",
        title: "Student ID required",
        description: "Please enter your Student ID to search for results.",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const searchedResults = await searchResults(filters);
      setResults(searchedResults);
      setHasSearched(true);
      
      if (searchedResults.length === 0) {
        toast({
          variant: "default",
          title: "No results found",
          description: "No results match your search criteria. Please try different search terms.",
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "There was a problem processing your search. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Result Beacon Portal</h1>
          </div>
        </div>
        <p className="text-xl text-muted-foreground">
          Search and view your examination results
        </p>
      </div>
      
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            Enter your details to find your results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input 
                  id="studentId" 
                  name="studentId"
                  placeholder="e.g. CS001"
                  value={filters.studentId} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name (Optional)</Label>
                <Input 
                  id="examName" 
                  name="examName"
                  placeholder="e.g. Mid Term"
                  value={filters.examName} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester (Optional)</Label>
                <Input 
                  id="semester" 
                  name="semester"
                  placeholder="e.g. Fall 2023"
                  value={filters.semester} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSearching}>
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? "Searching..." : "Search Results"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {hasSearched && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">
            {results.length > 0 
              ? `Found ${results.length} result${results.length === 1 ? '' : 's'}`
              : 'No results found'}
          </h2>
          
          <div className="grid grid-cols-1 gap-8">
            {results.map(result => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
          
          {results.length === 0 && hasSearched && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                We couldn't find any results matching your search criteria. 
                Please check your Student ID and try again.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => window.location.href = '/admin/login'}>
          Admin Login
        </Button>
      </div>
    </div>
  );
}
