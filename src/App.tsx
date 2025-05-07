
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentSearch from "./pages/StudentSearch";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UploadResults from "./pages/UploadResults";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import AdminGuard from "./components/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<StudentSearch />} />
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={
              <Layout>
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              </Layout>
            } />
            <Route path="/admin/upload" element={
              <Layout>
                <AdminGuard>
                  <UploadResults />
                </AdminGuard>
              </Layout>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
