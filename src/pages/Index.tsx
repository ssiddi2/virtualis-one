
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Login from "@/components/auth/Login";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [user] = useState({
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'dr.johnson@virtualisemr.com',
    role: 'admin'
  });

  const handleSelectHospital = (hospitalId: string) => {
    console.log('Selected hospital:', hospitalId);
    setSelectedHospitalId(hospitalId);
  };

  const handleBackToEMR = () => {
    setSelectedHospitalId(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#0a1628] overflow-hidden">
      <Sidebar selectedHospitalId={selectedHospitalId} />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/emr" element={
            selectedHospitalId ? (
              <HospitalDashboard 
                hospitalId={selectedHospitalId} 
                user={user} 
                onBack={handleBackToEMR}
              />
            ) : (
              <EMRDashboard user={user} onSelectHospital={handleSelectHospital} />
            )
          } />
          <Route path="/patients" element={<PatientChart hospitalId={selectedHospitalId} />} />
          <Route path="/admission" element={<AdmissionForm hospitalId={selectedHospitalId} />} />
          <Route path="/billing" element={<BillingDashboard hospitalId={selectedHospitalId} />} />
          <Route path="/coding" element={<CodingDashboard hospitalId={selectedHospitalId} />} />
          <Route path="/laboratory" element={<EnhancedLISDashboard hospitalId={selectedHospitalId} />} />
          <Route path="/radiology" element={<LiveRadManager hospitalId={selectedHospitalId} />} />
          <Route path="/pacs" element={<LiveRadManager hospitalId={selectedHospitalId} />} />
          <Route path="/liverad" element={<LiveRadManager hospitalId={selectedHospitalId} />} />
          <Route path="/reporting" element={<CMSReporting hospitalId={selectedHospitalId} />} />
          <Route path="/ai-assistant" element={<CopilotComposer hospitalId={selectedHospitalId} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
