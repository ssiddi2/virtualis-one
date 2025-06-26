
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthForm from "@/components/auth/AuthForm";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import PatientChart from "@/components/patient/PatientChart";
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
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  const handleSelectHospital = (hospitalId: string) => {
    console.log('Selected hospital:', hospitalId);
    setSelectedHospitalId(hospitalId);
  };

  const handleBackToEMR = () => {
    setSelectedHospitalId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="flex h-screen bg-[#0a1628] overflow-hidden">
      <Sidebar selectedHospitalId={selectedHospitalId} />
      <main className="flex-1 overflow-auto">
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
              <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold mb-4">Select a Hospital</h2>
                  <p className="text-white/70 mb-4">Please select a hospital from the EMR dashboard to view AI insights.</p>
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
          <Route path="/patient/:patientId" element={<PatientChart />} />
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
