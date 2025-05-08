
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadResults } from '@/services/resultService';
import { FileText, Upload, X, ArrowLeft } from 'lucide-react';
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
    setUploadProgress(10);
    
    // Create progress simulation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 5) + 1;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 500);
    
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
        } else {
          toast({
            variant: "destructive",
            title: "Processing Failed",
            description: "There was a problem extracting data from the PDF. Please check the format and try again.",
          });
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
    <div className="max-w-3xl mx-auto my-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Upload Results</h1>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <Card className="border-none card-shadow overflow-hidden">
        <div className="h-2 gradient-primary"></div>
        <CardHeader>
          <CardTitle>Upload PDF Results</CardTitle>
          <CardDescription>
            Upload PDF files containing student results. The system will automatically extract and process individual student results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center bg-slate-50 dark:bg-slate-800/30">
              <div className="h-16 w-16 rounded-full gradient-card p-4 mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">Upload Result PDF</h3>
              <p className="text-sm text-muted-foreground mb-6">Drag & drop your results PDF file here, or click to browse</p>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gradient-primary text-white hover:opacity-90 h-10 px-6 py-2">
                  <Upload className="mr-2 h-4 w-4" /> Select File
                </div>
                <Input id="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileSelect} />
              </Label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-lg gradient-card">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
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
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Uploading & Processing...</span>
                    <span className="text-primary font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-slate-50/50 dark:bg-slate-800/10 py-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className={isUploading ? "bg-blue-500" : "gradient-primary"}
          >
            {isUploading ? "Processing..." : "Upload & Process Results"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
