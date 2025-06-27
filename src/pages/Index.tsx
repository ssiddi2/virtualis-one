
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
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleSelectHospital = (hospitalId: string) => {
    console.log('Selected hospital:', hospitalId);
    setSelectedHospitalId(hospitalId);
  };

  const handleBackToEMR = () => {
    setSelectedHospitalId(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-[#0a1628]' : 'bg-sky-50'
      }`}>
        <div className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1628]' : 'bg-sky-50'
    }`}>
      <Sidebar selectedHospitalId={selectedHospitalId} />
      <main className={`flex-1 overflow-auto ${
        theme === 'dark' ? '' : 'bg-sky-50'
      }`}>
        <Routes>
          <Route path="/" element={<Navigate to="/emr" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-dashboard" element={
            selectedHospitalId ? (
              <AIDashboard 
                user={profile || user} 
                hospitalId={selectedHospitalId}
              />
            ) : (
              <div className={`min-h-screen flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#0a1628]' : 'bg-sky-50'
              }`}>
                <div className="text-center">
                  <h2 className={`text-2xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>Select a Hospital</h2>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-white/70' : 'text-slate-600'
                  }`}>Please select a hospital from the EMR dashboard to view AI insights.</p>
                  <Button onClick={() => navigate('/emr')} className="bg-blue-600 hover:bg-blue-700">
                    Go to EMR Dashboard
                  </Button>
                </div>
              </div>
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
          <Route path="/patient/:patientId" element={<PatientDetailsPage />} />
          <Route path="/patient-tracker" element={
            <ERPatientTracker hospitalId={selectedHospitalId} />
          } />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/billing" element={<BillingDashboard hospitalId={selectedHospitalId} />} />
          <Route path="/coding" element={<CodingDashboard hospitalId={selectedHospitalId} />} />
          <Route path="/laboratory" element={<EnhancedLISDashboard />} />
          <Route path="/radiology" element={<LiveRadManager />} />
          <Route path="/pacs" element={<LiveRadManager />} />
          <Route path="/liverad" element={<LiveRadManager />} />
          <Route path="/reporting" element={<CMSReporting />} />
          <Route path="/ai-assistant" element={<CopilotComposer hospitalId={selectedHospitalId} />} />
          <Route path="/virtualis-chat" element={<VirtualisChatPage />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<Navigate to="/emr" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
