
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">Result Beacon Portal</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Student Result Management System</p>
          </div>
        </div>
        
        <Card className="border-none card-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="username" 
                    placeholder="admin" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary border-none" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Demo credentials: admin / admin123
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/')} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            Back to Student Portal
          </Button>
        </div>
      </div>
    </div>
  );
}
