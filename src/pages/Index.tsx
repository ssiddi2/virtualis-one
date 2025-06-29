
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/components/auth/Login";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import PatientDetailsPage from "@/components/patient/PatientDetailsPage";
import PatientChart from "@/components/patient/PatientChart";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import VirtualisChatPage from "./VirtualisChat";
import V1DriftPage from "./V1DriftPage";
import V1DriftAnalytics from "@/components/ai/V1DriftAnalytics";

const Index = () => {
  const { session, profile, isLoading } = useAuth();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    if (selectedHospitalId) {
      setSidebarExpanded(true);
    }
  }, [selectedHospitalId]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!session) {
    return <Login />;
  }

  const requireHospitalSelection = (component: JSX.Element) => {
    if (!selectedHospitalId) {
      return <Navigate to="/" replace />;
    }
    return component;
  };

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <Sidebar 
        selectedHospitalId={selectedHospitalId}
        expanded={sidebarExpanded}
        onExpandedChange={setSidebarExpanded}
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        sidebarExpanded ? 'ml-64' : 'ml-16'
      }`}>
        <Routes>
          <Route 
            path="/" 
            element={
              selectedHospitalId ? (
                <HospitalDashboard hospitalId={selectedHospitalId} />
              ) : (
                <EMRDashboard onHospitalSelect={setSelectedHospitalId} />
              )
            } 
          />
          
          {/* Hospital-specific routes */}
          <Route 
            path="/dashboard" 
            element={requireHospitalSelection(
              <Dashboard hospitalId={selectedHospitalId} />
            )} 
          />
          
          <Route 
            path="/patient/:patientId" 
            element={requireHospitalSelection(
              <PatientDetailsPage hospitalId={selectedHospitalId} />
            )} 
          />
          
          <Route 
            path="/patient-chart" 
            element={requireHospitalSelection(<PatientChart />)} 
          />
          
          <Route 
            path="/virtualis-chat" 
            element={requireHospitalSelection(<VirtualisChatPage />)} 
          />
          
          {/* V1 Drift AI Assistant Routes */}
          <Route 
            path="/v1-drift" 
            element={requireHospitalSelection(<V1DriftPage />)} 
          />
          
          <Route 
            path="/v1-drift/analytics" 
            element={requireHospitalSelection(
              <V1DriftAnalytics hospitalId={selectedHospitalId} />
            )} 
          />
        </Routes>
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
