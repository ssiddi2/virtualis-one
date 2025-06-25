
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import EMRDashboard from "@/components/dashboard/EMRDashboard";
import PatientChart from "@/components/patient/PatientChart";
import AdmissionForm from "@/components/patient/AdmissionForm";
import CopilotComposer from "@/components/patient/CopilotComposer";
import Login from "@/components/auth/Login";
import { useToast } from "@/hooks/use-toast";

// Mock authentication state
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false to show login immediately

  useEffect(() => {
    // Check for existing user in localStorage immediately
    const checkAuth = () => {
      try {
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          const userData = JSON.parse(mockUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('mockUser'); // Clear invalid data
      }
    };

    checkAuth(); // Run immediately, no delay
  }, []);

  const login = (email: string, password: string, role: string) => {
    const userData = { id: '1', email, role, name: email.split('@')[0] };
    localStorage.setItem('mockUser', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  return { user, loading, login, logout };
};

const Index = () => {
  const { user, loading, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  // Don't show loading screen, go straight to login if no user
  if (!user) {
    return <Login onLogin={login} />;
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
