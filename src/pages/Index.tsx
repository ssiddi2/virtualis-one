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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={profile || user} />} />
          <Route path="/ai-dashboard" element={<AIDashboard user={profile || user} />} />
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
          <Route path="/patients" element={<PatientChart />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/billing" element={<BillingDashboard />} />
          <Route path="/coding" element={<CodingDashboard />} />
          <Route path="/laboratory" element={<EnhancedLISDashboard />} />
          <Route path="/radiology" element={<LiveRadManager />} />
          <Route path="/pacs" element={<LiveRadManager />} />
          <Route path="/liverad" element={<LiveRadManager />} />
          <Route path="/reporting" element={<CMSReporting />} />
          <Route path="/ai-assistant" element={<CopilotComposer hospitalId={selectedHospitalId} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
