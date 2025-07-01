
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Building2,
  Brain,
  Zap,
  ClipboardList,
  TestTube,
  PlusCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MainDashboardProps {
  user: any;
}

const MainDashboard = ({ user }: MainDashboardProps) => {
  const navigate = useNavigate();
  
  const quickActions = [
    {
      title: "Patient Management",
      description: "Access patient records and Epic-style charts",
      icon: Users,
      path: "/patients",
      color: "bg-blue-500"
    },
    {
      title: "Clinical Documentation", 
      description: "Progress notes, SOAP notes, and clinical templates",
      icon: FileText,
      path: "/clinical",
      color: "bg-green-500"
    },
    {
      title: "VirtualisChat",
      description: "AI-powered clinical communication and smart routing",
      icon: Stethoscope,
      path: "/virtualis-chat",
      color: "bg-purple-500"
    },
    {
      title: "Laboratory Review",
      description: "Lab results, pathology, and diagnostic review",
      icon: TestTube,
      path: "/laboratory",
      color: "bg-orange-500"
    }
  ];

  const clinicalShortcuts = [
    {
      title: "New Progress Note",
      description: "Create clinical documentation",
      action: () => navigate("/clinical"),
      icon: ClipboardList,
      color: "bg-emerald-500"
    },
    {
      title: "CPOE Orders",
      description: "Computerized Provider Order Entry",
      action: () => navigate("/clinical"),
      icon: PlusCircle,
      color: "bg-blue-500"
    },
    {
      title: "Lab Review",
      description: "Review pending lab results",
      action: () => navigate("/laboratory"),
      icon: TestTube,
      color: "bg-amber-500"
    },
    {
      title: "AI Insights",
      description: "Clinical decision support",
      action: () => navigate("/ai-dashboard"),
      icon: Brain,
      color: "bg-violet-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img 
            src="/lovable-uploads/96442473-7948-4431-92d6-7697bfb571e2.png" 
            alt="VirtualisOne" 
            className="h-16"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Virtualis Healthcare Platform
          </h1>
          <p className="text-white/80 text-lg">
            Your integrated healthcare command center is ready
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Active Patients</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <Users className="h-8 w-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/20 border border-green-300/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Pending Notes</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
              <FileText className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Lab Reviews</p>
                <p className="text-2xl font-bold text-white">15</p>
              </div>
              <TestTube className="h-8 w-8 text-purple-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">System Status</p>
                <p className="text-2xl font-bold text-white">Online</p>
              </div>
              <Activity className="h-8 w-8 text-orange-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {clinicalShortcuts.map((shortcut, index) => (
          <Card key={index} className="backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
            <CardContent className="p-4">
              <Button 
                onClick={shortcut.action}
                className={`w-full h-auto p-4 ${shortcut.color} hover:opacity-80 text-white flex-col gap-2`}
              >
                <shortcut.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{shortcut.title}</div>
                  <div className="text-xs opacity-80">{shortcut.description}</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">{action.description}</p>
              <Button 
                onClick={() => navigate(action.path)}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                Access Module
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Clinical Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <p className="text-white font-medium">Progress Note Completed</p>
                <p className="text-white/70 text-sm">Dr. Smith completed progress note for Patient #1247</p>
              </div>
              <span className="text-white/50 text-sm">2 min ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <TestTube className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-white font-medium">New Lab Results Available</p>
                <p className="text-white/70 text-sm">15 new lab results require physician review</p>
              </div>
              <span className="text-white/50 text-sm">5 min ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Zap className="h-5 w-5 text-purple-400" />
              <div className="flex-1">
                <p className="text-white font-medium">VirtualisChat Alert</p>
                <p className="text-white/70 text-sm">High-priority consultation request from ICU</p>
              </div>
              <span className="text-white/50 text-sm">10 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainDashboard;
