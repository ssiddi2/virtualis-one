
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import PatientChart from "@/components/patient/PatientChart";
import AdmissionForm from "@/components/patient/AdmissionForm";
import BillingDashboard from "@/components/billing/BillingDashboard";
import CodingDashboard from "@/components/coding/CodingDashboard";
import EnhancedLISDashboard from "@/components/laboratory/EnhancedLISDashboard";
import LiveRadManager from "@/components/radiology/LiveRadManager";
import CMSReporting from "@/components/reporting/CMSReporting";
import Login from "@/components/auth/Login";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#0a1628] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/emr" element={<EMRDashboard />} />
          <Route path="/patients" element={<PatientChart />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/billing" element={<BillingDashboard />} />
          <Route path="/coding" element={<CodingDashboard />} />
          <Route path="/laboratory" element={<EnhancedLISDashboard />} />
          <Route path="/radiology" element={<LiveRadManager />} />
          <Route path="/pacs" element={<LiveRadManager />} />
          <Route path="/liverad" element={<LiveRadManager />} />
          <Route path="/reporting" element={<CMSReporting />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
