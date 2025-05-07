
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadResults } from '@/services/resultService';
import { FileText, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export default function UploadResults() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: "Please upload a PDF file.",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);
    
    try {
      const result = await uploadResults(file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        if (result.success) {
          toast({
            title: "Upload Successful",
            description: `Successfully processed ${result.count} student results.`,
          });
          navigate('/admin');
        }
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was a problem processing your upload. Please try again.",
      });
    } finally {
      clearInterval(interval);
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Upload Results</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF Results</CardTitle>
          <CardDescription>
            Upload PDF files containing student results. The system will automatically parse and extract individual student results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <FileText className="h-10 w-10 mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-1">Upload Result PDF</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag & drop your results PDF file here, or click to browse</p>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  <Upload className="mr-2 h-4 w-4" /> Select File
                </div>
                <Input id="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileSelect} />
              </Label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-md bg-secondary/50">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 mr-4 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile} disabled={isUploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
          >
            {isUploading ? "Processing..." : "Upload & Process Results"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
