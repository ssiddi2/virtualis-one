
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  Activity, 
  FileText, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react";

const Clinical = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState("ICU");

  const clinicalData = {
    activePatients: 24,
    criticalAlerts: 3,
    pendingOrders: 12,
    completedTasks: 18
  };

  const recentAlerts = [
    { id: 1, patient: "John Smith", type: "Critical Lab", message: "Cardiac enzymes elevated", time: "2 min ago", severity: "high" },
    { id: 2, patient: "Sarah Johnson", type: "Medication", message: "Allergy interaction warning", time: "5 min ago", severity: "medium" },
    { id: 3, patient: "Mike Davis", type: "Vital Signs", message: "Blood pressure trending up", time: "12 min ago", severity: "low" }
  ];

  const handleTeamCommunication = () => {
    navigate('/virtualis-chat');
  };

  return (
    <div className="flex h-screen" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <Sidebar className="w-64 glass-card border-r border-white/20" />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Clinical Dashboard</h1>
              <p className="text-white/70">Real-time patient monitoring and care coordination</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleTeamCommunication}
                className="glass-button"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Team Communication
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card border-blue-300/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Active Patients</p>
                    <p className="text-2xl font-bold text-white">{clinicalData.activePatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-red-300/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Critical Alerts</p>
                    <p className="text-2xl font-bold text-white">{clinicalData.criticalAlerts}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-yellow-300/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Pending Orders</p>
                    <p className="text-2xl font-bold text-white">{clinicalData.pendingOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-green-300/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Completed Tasks</p>
                    <p className="text-2xl font-bold text-white">{clinicalData.completedTasks}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Clinical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {alert.type}
                          </Badge>
                          <span className="text-white font-medium">{alert.patient}</span>
                        </div>
                        <p className="text-white/70 text-sm">{alert.message}</p>
                        <p className="text-white/50 text-xs mt-1">{alert.time}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/30 text-white text-xs">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="h-20 glass-button flex-col gap-2"
                    onClick={() => navigate('/patients')}
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Patient List</span>
                  </Button>
                  
                  <Button 
                    className="h-20 glass-button flex-col gap-2"
                    onClick={handleTeamCommunication}
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">Team Chat</span>
                  </Button>
                  
                  <Button 
                    className="h-20 glass-button flex-col gap-2"
                    onClick={() => navigate('/laboratory')}
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Lab Results</span>
                  </Button>
                  
                  <Button 
                    className="h-20 glass-button flex-col gap-2"
                    onClick={() => navigate('/radiology')}
                  >
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Imaging</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clinical;
