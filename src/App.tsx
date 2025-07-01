
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Patients from "@/pages/Patients";
import Clinical from "@/pages/Clinical";
import Demo from "@/pages/Demo";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import VirtualisChat from "@/pages/VirtualisChat";
import NotFound from "@/pages/NotFound";
import PatientDetailsPage from "@/components/patient/PatientDetailsPage";
import CPOESystem from "@/components/clinical/CPOESystem";
import EnhancedCPOESystem from "@/components/clinical/EnhancedCPOESystem";
import ClinicalDocumentation from "@/components/clinical/ClinicalDocumentation";
import BillingDashboard from "@/components/billing/BillingDashboard";
import EnhancedLISDashboard from "@/components/laboratory/EnhancedLISDashboard";
import PACSManager from "@/components/radiology/PACSManager";
import CMSQualityDashboard from "@/components/cms/CMSQualityDashboard";
import CodingDashboard from "@/components/coding/CodingDashboard";
import AIDashboard from "@/components/dashboard/AIDashboard";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/patients" element={
        <ProtectedRoute>
          <Patients />
        </ProtectedRoute>
      } />
      
      <Route path="/patients/:patientId" element={
        <ProtectedRoute>
          <PatientDetailsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/patients/:patientId/cpoe" element={
        <ProtectedRoute>
          <CPOESystem />
        </ProtectedRoute>
      } />
      
      <Route path="/cpoe/:patientId" element={
        <ProtectedRoute>
          <EnhancedCPOESystem />
        </ProtectedRoute>
      } />
      
      <Route path="/documentation/:patientId" element={
        <ProtectedRoute>
          <ClinicalDocumentation />
        </ProtectedRoute>
      } />
      
      <Route path="/clinical" element={
        <ProtectedRoute>
          <Clinical />
        </ProtectedRoute>
      } />
      
      <Route path="/virtualis-chat" element={
        <ProtectedRoute>
          <VirtualisChat />
        </ProtectedRoute>
      } />
      
      <Route path="/billing" element={
        <ProtectedRoute>
          <BillingDashboard hospitalId={profile?.hospital_id || ''} />
        </ProtectedRoute>
      } />
      
      <Route path="/laboratory" element={
        <ProtectedRoute>
          <EnhancedLISDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/radiology" element={
        <ProtectedRoute>
          <PACSManager />
        </ProtectedRoute>
      } />
      
      <Route path="/quality" element={
        <ProtectedRoute>
          <CMSQualityDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/coding" element={
        <ProtectedRoute>
          <CodingDashboard hospitalId={profile?.hospital_id || ''} />
        </ProtectedRoute>
      } />
      
      <Route path="/ai-dashboard" element={
        <ProtectedRoute>
          <AIDashboard 
            user={profile || user} 
            hospitalId={profile?.hospital_id || ''} 
          />
        </ProtectedRoute>
      } />
      
      <Route path="/demo" element={
        <ProtectedRoute>
          <Demo />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
