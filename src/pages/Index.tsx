
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Dashboard from "@/components/dashboard/Dashboard";
import HospitalSelector from "@/components/dashboard/HospitalSelector";
import ERPatientTracker from "@/components/dashboard/ERPatientTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Activity, BarChart3 } from "lucide-react";

const Index = () => {
  const { user, profile } = useAuth();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'patient-tracker'>('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <Card className="w-96 bg-[#1a2332] border-[#2a3441] text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Welcome to Virtualis</CardTitle>
            <CardDescription className="text-white/70">
              Advanced Healthcare AI Platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80 text-center">
              Please sign in to access your healthcare dashboard and AI-powered clinical tools.
            </p>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleHospitalSelect = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
  };

  if (!selectedHospitalId) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 gradient-text">
              Welcome to Virtualis
            </h1>
            <p className="text-white/70 text-lg">
              Select a hospital to access your clinical dashboard
            </p>
          </div>
          
          <HospitalSelector onHospitalSelect={handleHospitalSelect} />
          
          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#1a2332] border-[#2a3441] text-white hover:bg-[#1e2936] transition-colors">
              <CardContent className="p-6 text-center">
                <Building className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">EMR Integration</h3>
                <p className="text-white/70 text-sm">
                  Connect to hospital EMR systems for seamless data access
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a2332] border-[#2a3441] text-white hover:bg-[#1e2936] transition-colors">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Patient Management</h3>
                <p className="text-white/70 text-sm">
                  Advanced patient tracking and clinical workflows
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a2332] border-[#2a3441] text-white hover:bg-[#1e2936] transition-colors">
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Analytics</h3>
                <p className="text-white/70 text-sm">
                  Intelligent insights and predictive healthcare analytics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Navigation Bar */}
      <div className="bg-[#1a2332] border-b border-[#2a3441] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setCurrentView('dashboard')}
              className={currentView === 'dashboard' 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-transparent border-[#2a3441] text-white hover:bg-[#2a3441]"
              }
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'patient-tracker' ? 'default' : 'outline'}
              onClick={() => setCurrentView('patient-tracker')}
              className={currentView === 'patient-tracker' 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-transparent border-[#2a3441] text-white hover:bg-[#2a3441]"
              }
            >
              <Activity className="h-4 w-4 mr-2" />
              Patient Tracker
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <Building className="h-4 w-4 text-blue-400" />
            <span className="text-sm">Hospital ID: {selectedHospitalId}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentView === 'dashboard' ? (
        <Dashboard selectedHospitalId={selectedHospitalId} />
      ) : (
        <ERPatientTracker />
      )}
    </div>
  );
};

export default Index;
