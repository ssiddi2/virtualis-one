
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/Login";
import Index from "@/pages/Index";
import Patients from "@/pages/Patients";
import Clinical from "@/pages/Clinical";
import Demo from "@/pages/Demo";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import VirtualisChat from "@/pages/VirtualisChat";
import NotFound from "@/pages/NotFound";
import EpicPatientWorkspace from "@/components/clinical/EpicPatientWorkspace";
import CPOESystem from "@/components/clinical/CPOESystem";
import EnhancedCPOESystem from "@/components/clinical/EnhancedCPOESystem";
import ClinicalDocumentation from "@/components/clinical/ClinicalDocumentation";
import BillingDashboard from "@/components/billing/BillingDashboard";
import EnhancedLISDashboard from "@/components/laboratory/EnhancedLISDashboard";
import PACSManager from "@/components/radiology/PACSManager";
import CMSQualityDashboard from "@/components/cms/CMSQualityDashboard";
import CodingDashboard from "@/components/coding/CodingDashboard";
import AIDashboard from "@/components/dashboard/AIDashboard";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import EpicStylePatientChart from "@/components/clinical/EpicStylePatientChart";
import MainDashboard from "@/components/dashboard/MainDashboard";
import CFODashboard from "@/components/dashboard/CFODashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import AppLayout from "@/components/layout/AppLayout";

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
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route - Login page (no sidebar) */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/hospital-selection" replace />} />
      
      {/* Redirect root to proper workflow start */}
      <Route path="/" element={user ? <Navigate to="/hospital-selection" replace /> : <Navigate to="/login" replace />} />
      
      {/* All authenticated routes wrapped in AppLayout (with sidebar) */}
      <Route 
        path="/hospital-selection" 
        element={user ? (
          <ProtectedRoute>
            <AppLayout>
              <EMRDashboard user={profile || user} />
            </AppLayout>
          </ProtectedRoute>
        ) : <Navigate to="/login" replace />} 
      />
      
      <Route 
        path="/hospital/:hospitalId" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <HospitalDashboard hospitalId="" user={profile || user} onBack={() => {}} />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <MainDashboard user={profile || user} />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cfo-dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CFODashboard hospitalId={profile?.hospital_id || ''} />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/epic-chart/:patientId" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <EpicStylePatientChart />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/patients" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Patients />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Updated patient routes to use Epic workspace */}
      <Route 
        path="/patients/:patientId" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <EpicPatientWorkspace />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/patients/:patientId/cpoe" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CPOESystem />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cpoe/:patientId" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <EnhancedCPOESystem />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/documentation/:patientId" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ClinicalDocumentation />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/documentation" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ClinicalDocumentation />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/clinical" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Clinical />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/virtualis-chat" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <VirtualisChat />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <BillingDashboard hospitalId={profile?.hospital_id || ''} />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/laboratory" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <EnhancedLISDashboard />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/radiology" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <PACSManager />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/quality" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CMSQualityDashboard />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coding" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CodingDashboard hospitalId={profile?.hospital_id || ''} />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/ai-dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <AIDashboard 
                user={profile || user} 
                hospitalId={profile?.hospital_id || ''} 
              />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/demo" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Demo />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Tasks />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
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
