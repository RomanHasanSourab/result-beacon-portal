
import { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Search, Upload, User, Home, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="page-container">
        {isAuthenticated && (
          <Sidebar className="border-r border-slate-200 dark:border-slate-800">
            <SidebarHeader className="py-6 px-5">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Result Beacon</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admin Portal</p>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={location.pathname === '/admin'} asChild>
                        <Link to="/admin" className="flex items-center">
                          <Home className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={location.pathname === '/admin/upload'} asChild>
                        <Link to="/admin/upload" className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          <span>Upload Results</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={location.pathname === '/search'} asChild>
                        <Link to="/search" className="flex items-center">
                          <Search className="mr-2 h-4 w-4" />
                          <span>Student Search</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full gradient-secondary flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        )}

        <main className="main-content">
          {isAuthenticated && (
            <SidebarTrigger className="absolute top-4 left-4 md:hidden z-10" />
          )}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
