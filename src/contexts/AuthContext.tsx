
import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const { toast } = useToast();

  // For demo purposes, hardcoded admin credentials
  const adminCredentials = {
    username: 'admin',
    password: 'admin123',
  };

  const login = async (username: string, password: string) => {
    // Mock authentication
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true);
      setUser({ username });
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${username}!`,
      });
      
      return true;
    } 
    
    toast({
      variant: 'destructive',
      title: 'Login failed',
      description: 'Invalid username or password.',
    });
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
