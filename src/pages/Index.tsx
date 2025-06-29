import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAIAssistantContext } from "@/components/ai/AIAssistantProvider";
import AuthForm from "@/components/auth/AuthForm";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import PatientDetailsPage from "@/components/patient/PatientDetailsPage";
import AdmissionForm from "@/components/patient/AdmissionForm";
import BillingDashboard from "@/components/billing/BillingDashboard";
import CodingDashboard from "@/components/coding/CodingDashboard";
import EnhancedLISDashboard from "@/components/laboratory/EnhancedLISDashboard";
import LiveRadManager from "@/components/radiology/LiveRadManager";
import CMSReporting from "@/components/reporting/CMSReporting";
import CopilotComposer from "@/components/patient/CopilotComposer";
import AIDashboard from "@/components/dashboard/AIDashboard";
import ERPatientTracker from "@/components/dashboard/ERPatientTracker";
import VirtualisChatPage from "./VirtualisChat";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const { setSelectedHospitalId: setAISelectedHospitalId } = useAIAssistantContext();

  console.log('Index render state:', { selectedHospitalId, user: !!user, loading, currentPath: window.location.pathname });

  const handleSelectHospital = (hospitalId: string) => {
    console.log('Hospital selected in Index:', hospitalId);
    setSelectedHospitalId(hospitalId);
    setAISelectedHospitalId(hospitalId);
    console.log('State immediately after setting:', { selectedHospitalId: hospitalId });
  };

  const handleBackToEMR = () => {
    console.log('Back to EMR called - clearing hospital selection');
    setSelectedHospitalId(null);
    setAISelectedHospitalId(null);
  };

  const requireHospitalSelection = (component: React.ReactElement) => {
    console.log('requireHospitalSelection check:', { selectedHospitalId });
    
    if (!selectedHospitalId) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{
          background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
        }}>
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Hospital Selection Required</h2>
            <p className="text-white/70 mb-4">Please select a hospital from the network dashboard first.</p>
            <Button onClick={() => navigate('/emr')} className="virtualis-button">
              Go to Hospital Network Dashboard
            </Button>
          </div>
        </div>
      );
    }
    return component;
  };

  // Loading state
  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Authentication check
  if (!user) {
    console.log('Showing auth form - no user');
    return (
      <div style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)',
        minHeight: '100vh'
      }}>
        <AuthForm />
      </div>
    );
  }

  console.log('Rendering main app layout with selectedHospitalId:', selectedHospitalId);

  return (
    <div className="flex h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      {selectedHospitalId && (
        <Sidebar selectedHospitalId={selectedHospitalId} />
      )}
      <main className={`${selectedHospitalId ? 'flex-1' : 'w-full'} overflow-auto`} style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/emr" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-dashboard" element={
            requireHospitalSelection(
              <AIDashboard 
                user={profile || user} 
                hospitalId={selectedHospitalId!}
              />
            )
          } />
          <Route path="/emr" element={
            (() => {
              console.log('EMR route rendering with selectedHospitalId:', selectedHospitalId);
              
              if (selectedHospitalId) {
                console.log('Rendering HospitalDashboard for hospital:', selectedHospitalId);
                return (
                  <HospitalDashboard 
                    hospitalId={selectedHospitalId} 
                    user={profile || user} 
                    onBack={handleBackToEMR}
                  />
                );
              } else {
                console.log('Rendering EMRDashboard (no hospital selected)');
                return (
                  <EMRDashboard 
                    user={profile || user} 
                    onSelectHospital={handleSelectHospital} 
                  />
                );
              }
            })()
          } />
          <Route path="/virtualis-chat" element={
            requireHospitalSelection(<VirtualisChatPage hospitalId={selectedHospitalId!} />)
          } />
          <Route path="/chat" element={
            requireHospitalSelection(<VirtualisChatPage hospitalId={selectedHospitalId!} />)
          } />
          <Route path="/patient/:patientId" element={
            requireHospitalSelection(<PatientDetailsPage />)
          } />
          <Route path="/patient-tracker" element={
            requireHospitalSelection(<ERPatientTracker />)
          } />
          <Route path="/admission" element={
            requireHospitalSelection(<AdmissionForm />)
          } />
          <Route path="/billing" element={
            requireHospitalSelection(<BillingDashboard hospitalId={selectedHospitalId!} />)
          } />
          <Route path="/coding" element={
            requireHospitalSelection(<CodingDashboard hospitalId={selectedHospitalId!} />)
          } />
          <Route path="/laboratory" element={
            requireHospitalSelection(<EnhancedLISDashboard />)
          } />
          <Route path="/radiology" element={
            requireHospitalSelection(<LiveRadManager />)
          } />
          <Route path="/pacs" element={
            requireHospitalSelection(<LiveRadManager />)
          } />
          <Route path="/liverad" element={
            requireHospitalSelection(<LiveRadManager />)
          } />
          <Route path="/reporting" element={
            requireHospitalSelection(<CMSReporting />)
          } />
          <Route path="/ai-assistant" element={
            requireHospitalSelection(<CopilotComposer hospitalId={selectedHospitalId!} />)
          } />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
