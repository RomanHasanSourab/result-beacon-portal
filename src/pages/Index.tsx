
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Search, LogIn, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-bold text-lg">Result Beacon</h2>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/login')}>
            <LogIn className="h-4 w-4 mr-2" />
            Admin Login
          </Button>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-sm text-blue-600 dark:text-blue-300 mb-4">
              <span className="mr-1">✨</span> Student Result Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Access Your Academic Results <span className="text-primary">Instantly</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Find your examination results with ease. Our secure platform provides quick access to your academic performance records.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                className="gradient-primary px-6 h-12 text-base"
                onClick={() => navigate('/search')}
              >
                <Search className="mr-2 h-5 w-5" />
                Search Your Results
              </Button>
              <Button variant="outline" className="px-6 h-12 text-base" onClick={() => navigate('/admin/login')}>
                Admin Panel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl card-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 blur-3xl -z-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-100 to-pink-100 dark:from-indigo-900/20 dark:to-pink-900/20 blur-3xl -z-10 rounded-full"></div>
            
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold flex items-center">
                <Search className="mr-2 h-5 w-5 text-primary" />
                Quick Result Search
              </h3>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Student ID</label>
                <Input placeholder="Enter your student ID" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Exam Name</label>
                <Input placeholder="E.g., Mid Term, Final Exam" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Semester</label>
                <Input placeholder="E.g., Spring 2023" />
              </div>
              
              <div className="pt-4">
                <Button className="w-full" onClick={() => navigate('/search')}>
                  <Search className="mr-2 h-4 w-4" />
                  Search Results
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800/80 rounded-lg card-shadow">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quick Search</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Find your results instantly by providing your student ID and exam details.
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-slate-800/80 rounded-lg card-shadow">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Comprehensive Reports</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Access detailed result reports including subject-wise marks and performance analytics.
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-slate-800/80 rounded-lg card-shadow">
            <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacy Focused</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Your academic information is kept secure and only accessible to authorized individuals.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <p className="font-medium">Result Beacon Portal</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Result Beacon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
