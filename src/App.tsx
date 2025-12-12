import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AICopilotProvider } from "@/components/ai/AICopilotProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlisAIProvider } from "@/contexts/AlisAIContext";
import { AlisAIFloatingPanel } from "@/components/ambient/AlisAIFloatingPanel";
import LoginPage from "@/pages/Login";
import Index from "@/pages/Index";
import DemoConnect from "@/pages/DemoConnect";
import DemoDashboard from "@/pages/DemoDashboard";
import Patients from "@/pages/Patients";
import MyPatients from "@/pages/MyPatients";
import Clinical from "@/pages/Clinical";
import CPOE from "@/pages/CPOE";
import Demo from "@/pages/Demo";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import VirtualisChat from "@/pages/VirtualisChat";
import Certification from "@/pages/Certification";
import Ambient from "@/pages/Ambient";
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
import EMRDashboard from "@/components/emr/EMRDashboard";
import EpicStylePatientChart from "@/components/clinical/EpicStylePatientChart";
import ComprehensivePatientChart from "@/components/clinical/ComprehensivePatientChart";
import EpicPatientWorkflowCenter from "@/components/clinical/EpicPatientWorkflowCenter";
import MainDashboard from "@/components/dashboard/MainDashboard";
import CFODashboard from "@/components/dashboard/CFODashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import ERDashboard from "@/components/clinical/ERDashboard";
import HospitalSelector from "@/components/dashboard/HospitalSelector";
import AppLayout from "@/components/layout/AppLayout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import PageTransition from "@/components/ui/page-transition";
import { BetaOnboarding } from "@/components/onboarding/BetaOnboarding";
import ToolsCreateUser from "@/pages/ToolsCreateUser";
import AuditLog from "@/pages/AuditLog";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <LoadingSpinner size="lg" text="Loading EMR System..." />
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
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <LoadingSpinner size="lg" text="Initializing EMR..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route - Login page (no sidebar) */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/hospital-selection" replace />} />
      
      {/* All authenticated users must select hospital first */}
      <Route path="/" element={user ? <Navigate to="/hospital-selection" replace /> : <Navigate to="/login" replace />} />
      
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
      
      {/* Hospital selection - required for ALL users */}
      <Route 
        path="/hospital-selection" 
        element={user ? (
          <ProtectedRoute>
            <HospitalSelector onSelectHospital={(hospitalId) => navigate('/my-patients')} />
          </ProtectedRoute>
        ) : <Navigate to="/login" replace />}
      />
      
      {/* EMR Dashboard after hospital selection */}
      <Route 
        path="/emr/:hospitalId" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <EMRDashboard />
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      {/* EMR Module Routes */}
      <Route 
        path="/emr/:hospitalId/patients" 
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
      
      <Route 
        path="/emr/:hospitalId/laboratory" 
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
        path="/emr/:hospitalId/radiology" 
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
        path="/emr/:hospitalId/documentation" 
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
        path="/emr/:hospitalId/cpoe" 
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
        path="/emr/:hospitalId/clinical" 
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
        path="/patient-chart/:patientId" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <EpicPatientWorkflowCenter />
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
        path="/cpoe" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <CPOE />
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
        path="/ambient" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <Ambient />
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

      <Route 
        path="/certification" 
        element={
          <ProtectedRoute>
            <AICopilotProvider>
              <AppLayout>
                <Certification />
              </AppLayout>
            </AICopilotProvider>
          </ProtectedRoute>
        } 
      />
      
      
      {/* Tools: one-off account creation (temporary/public) */}
      <Route path="/tools/create-user" element={<ToolsCreateUser />} />
      
      <Route path="/audit-log" element={
        <ProtectedRoute><AICopilotProvider><AppLayout><AuditLog /></AppLayout></AICopilotProvider></ProtectedRoute>
      } />

      {/* Beta Signup Route - Public */}
      <Route path="/beta-signup" element={<BetaOnboarding />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AlisAIProvider>
            <TooltipProvider>
              <AppRoutes />
              <AlisAIFloatingPanel />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AlisAIProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
