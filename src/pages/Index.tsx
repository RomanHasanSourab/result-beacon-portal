
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-3 bg-white p-3 rounded-full shadow-sm">
              <FileText className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold">Result Beacon Portal</h1>
            </div>
          </div>
          <p className="text-xl text-gray-600">
            Access your examination results quickly and securely
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold">Welcome to the Result Portal</h2>
          <p className="text-gray-600">
            Our advanced result publishing system allows students to access their examination results securely. 
            Enter your student ID, examination details, and semester to view your results.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/search')}
              className="flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search Results
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Simple Search</h3>
            <p className="text-gray-600">Find your results by entering your student ID and examination details.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Secure Access</h3>
            <p className="text-gray-600">Your results are protected and can only be accessed by you.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">PDF Downloads</h3>
            <p className="text-gray-600">Download and save your results as PDF for future reference.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
