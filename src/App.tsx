import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AICopilotProvider } from "@/components/ai/AICopilotProvider";
import LoginPage from "@/pages/Login";
import Index from "@/pages/Index";
import Patients from "@/pages/Patients";
import MyPatients from "@/pages/MyPatients";
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
import ERDashboard from "@/components/clinical/ERDashboard";
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
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/my-patients" replace />} />
      
      {/* Redirect root to My Patients - simplified workflow */}
      <Route path="/" element={user ? <Navigate to="/my-patients" replace /> : <Navigate to="/login" replace />} />
      
      {/* Main workflow - My Patients Dashboard */}
      <Route 
        path="/my-patients" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <MyPatients />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      {/* Hospital selection for admin workflow */}
      <Route 
        path="/hospital-selection" 
        element={user ? (
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <EMRDashboard user={profile || user} />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        ) : <Navigate to="/login" replace />} 
      />
      
      
      
      <Route 
        path="/hospital/:hospitalId" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <HospitalDashboard hospitalId="" user={profile || user} onBack={() => {}} />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <MainDashboard user={profile || user} />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cfo-dashboard" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <CFODashboard hospitalId={profile?.hospital_id || ''} />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/er-dashboard" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <ERDashboard />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/epic-chart/:patientId" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <EpicStylePatientChart />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/patients" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <Patients />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      {/* Updated patient routes to use Epic workspace */}
      <Route 
        path="/patients/:patientId" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <EpicPatientWorkspace />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/patients/:patientId/cpoe" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <CPOESystem />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cpoe/:patientId" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <EnhancedCPOESystem />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/documentation/:patientId" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <ClinicalDocumentation />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/documentation" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <ClinicalDocumentation />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/clinical" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <Clinical />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/virtualis-chat" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <VirtualisChat />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <BillingDashboard hospitalId={profile?.hospital_id || ''} />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/laboratory" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <EnhancedLISDashboard />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/radiology" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <PACSManager />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/quality" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <CMSQualityDashboard />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coding" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <CodingDashboard hospitalId={profile?.hospital_id || ''} />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/ai-dashboard" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <AIDashboard 
                  user={profile || user} 
                  hospitalId={profile?.hospital_id || ''} 
                />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/demo" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <Demo />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <Settings />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <Tasks />
              </AppLayout>
            </AICopilotProvider>
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
