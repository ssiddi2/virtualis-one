
import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import PatientChart from "@/components/patient/PatientChart";
import AdmissionForm from "@/components/patient/AdmissionForm";
import CopilotComposer from "@/components/patient/CopilotComposer";
import Login from "@/components/auth/Login";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-virtualis-gold mx-auto mb-4"></div>
          <p className="text-white font-semibold tech-font">Initializing Virtualis One™ Clinical Platform...</p>
        </div>
      </div>
    );
  }

  // Always redirect to login if no user is authenticated
  if (!user) {
    return <Login />;
  }

  // Show EMR Dashboard for hospital selection after login
  if (!selectedHospital) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <EMRDashboard 
          user={user}
          onSelectHospital={(hospitalId) => {
            setSelectedHospital(hospitalId);
            toast({
              title: "EMR Integration Established",
              description: "Connected to healthcare facility network",
            });
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex w-full">
      <Sidebar 
        user={user} 
        onLogout={() => {
          logout();
          setSelectedHospital(null);
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/patient/:id" element={<PatientChart />} />
          <Route path="/admit" element={<AdmissionForm />} />
          <Route path="/copilot" element={<CopilotComposer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
