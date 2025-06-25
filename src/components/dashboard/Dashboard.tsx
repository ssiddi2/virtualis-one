
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Calendar, FileText, Activity, Stethoscope, Database, Zap, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  user: any;
  onLogout?: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { toast } = useToast();
  const [activePatients] = useState(127);
  const [todayAppointments] = useState(23);
  const [pendingReports] = useState(8);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      toast({
        title: "Session Ended",
        description: "You have been successfully logged out",
      });
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#0a1628] min-h-screen">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold gradient-text tech-font">
              Universal EMR AI Powered
            </h1>
            <p className="text-white/80 text-lg tech-font">
              Intelligent Clinical Platform for Healthcare Excellence
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tech-font">
              Welcome back, Dr. {user?.name || user?.email?.split('@')[0]}
            </h2>
            <p className="text-white/70 tech-font">
              Clinical Dashboard - {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="glass-badge primary">
              <Brain className="h-3 w-3 mr-1" />
              AI Assistant Active
            </Badge>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="glass-button text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-virtualis-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activePatients}</div>
            <p className="text-xs text-white/60">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-virtualis-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{todayAppointments}</div>
            <p className="text-xs text-white/60">Next at 2:30 PM</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-virtualis-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingReports}</div>
            <p className="text-xs text-white/60">3 urgent reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-virtualis-gold" />
              <div>
                <CardTitle className="text-white">Patient Management</CardTitle>
                <CardDescription className="text-white/70">
                  Comprehensive patient records and care coordination
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Critical Cases</span>
                <span className="text-red-400">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Stable Patients</span>
                <span className="text-green-400">118</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Under Observation</span>
                <span className="text-yellow-400">4</span>
              </div>
            </div>
            <Button className="w-full glass-button">
              <Activity className="h-4 w-4 mr-2" />
              View All Patients
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-virtualis-gold pulse-glow" />
              <div>
                <CardTitle className="text-white">AI Clinical Assistant</CardTitle>
                <CardDescription className="text-white/70">
                  Intelligent diagnostic support and treatment recommendations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">AI Insights Generated</span>
                <span className="text-virtualis-gold">47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Treatment Plans Optimized</span>
                <span className="text-green-400">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Risk Assessments</span>
                <span className="text-blue-400">15</span>
              </div>
            </div>
            <Button className="w-full glass-button">
              <Zap className="h-4 w-4 mr-2" />
              Launch AI Assistant
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* EMR Integration Status */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-virtualis-gold" />
            <div>
              <CardTitle className="text-white">EMR Integration Status</CardTitle>
              <CardDescription className="text-white/70">
                Real-time connectivity with healthcare systems
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 glass-nav-item">
              <div className="text-green-400 text-2xl font-bold">99.8%</div>
              <div className="text-white/70 text-sm">System Uptime</div>
            </div>
            <div className="text-center p-4 glass-nav-item">
              <div className="text-virtualis-gold text-2xl font-bold">2.3s</div>
              <div className="text-white/70 text-sm">Avg Response Time</div>
            </div>
            <div className="text-center p-4 glass-nav-item">
              <div className="text-blue-400 text-2xl font-bold">847</div>
              <div className="text-white/70 text-sm">Records Synced Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
