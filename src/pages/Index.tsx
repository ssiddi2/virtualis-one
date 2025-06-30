
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthForm from "@/components/auth/AuthForm";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import PatientChart from "@/components/patient/PatientChart";
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
import Demo from "@/pages/Demo";
import VirtualisChatPage from "@/pages/VirtualisChat";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  const handleSelectHospital = (hospitalId: string) => {
    console.log('Selected hospital:', hospitalId);
    setSelectedHospitalId(hospitalId);
  };

  const handleBackToEMR = () => {
    setSelectedHospitalId(null);
  };

  const requireHospitalSelection = (component: React.ReactElement) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)',
        minHeight: '100vh'
      }}>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <Sidebar selectedHospitalId={selectedHospitalId} />
      <main className="flex-1 overflow-auto" style={{
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
            selectedHospitalId ? (
              <HospitalDashboard 
                hospitalId={selectedHospitalId} 
                user={profile || user} 
                onBack={handleBackToEMR}
              />
            ) : (
              <EMRDashboard user={profile || user} onSelectHospital={handleSelectHospital} />
            )
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
          <Route path="/virtualis-chat" element={
            requireHospitalSelection(<VirtualisChatPage hospitalId={selectedHospitalId!} />)
          } />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<Navigate to="/emr" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
