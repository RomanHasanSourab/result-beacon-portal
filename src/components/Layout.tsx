
import { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Search, Upload, User } from 'lucide-react';
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
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="font-bold text-lg">Result Portal Admin</h2>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={location.pathname === '/admin'} asChild>
                        <Link to="/admin">
                          <FileText />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={location.pathname === '/admin/upload'} asChild>
                        <Link to="/admin/upload">
                          <Upload />
                          <span>Upload Results</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 rounded-full bg-primary/10 p-1 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        )}

        <main className="main-content">
          {isAuthenticated && <SidebarTrigger className="absolute top-4 left-4 md:hidden" />}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
