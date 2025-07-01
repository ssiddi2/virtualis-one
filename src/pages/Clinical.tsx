
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  Activity, 
  FileText, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Stethoscope,
  TestTube,
  Pill,
  Plus,
  Building2
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
    { id: 1, patient: "John Smith", patientId: "1", type: "Critical Lab", message: "Cardiac enzymes elevated", time: "2 min ago", severity: "high" },
    { id: 2, patient: "Sarah Johnson", patientId: "2", type: "Medication", message: "Allergy interaction warning", time: "5 min ago", severity: "medium" },
    { id: 3, patient: "Mike Davis", patientId: "3", type: "Vital Signs", message: "Blood pressure trending up", time: "12 min ago", severity: "low" }
  ];

  const handlePatientAction = (patientId: string, action: string) => {
    navigate(`/patients/${patientId}?action=${action}`);
  };

  const handleTeamCommunication = () => {
    navigate('/virtualis-chat');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Clinical Command Center</h1>
          <p className="text-white/70">Real-time patient monitoring and care coordination</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/er-dashboard')}
            className="bg-red-600/20 border border-red-400/30 text-white hover:bg-red-500/30"
          >
            <Building2 className="h-4 w-4 mr-2" />
            ER Dashboard
          </Button>
          <Button 
            onClick={handleTeamCommunication}
            className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Team Communication
          </Button>
          <Button 
            onClick={() => navigate('/patients')}
            className="bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30"
          >
            <Users className="h-4 w-4 mr-2" />
            Patient List
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
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

        <Card className="backdrop-blur-xl bg-red-500/10 border border-red-300/30 rounded-xl">
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

        <Card className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-300/30 rounded-xl">
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

        <Card className="backdrop-blur-xl bg-green-500/10 border border-green-300/30 rounded-xl">
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
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Alerts & Actions
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
                  <Button 
                    size="sm" 
                    onClick={() => handlePatientAction(alert.patientId, 'chart')}
                    className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30 text-xs"
                  >
                    Open Chart
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Clinical Actions */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Clinical Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="h-20 bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30 flex-col gap-2"
                onClick={() => navigate('/patients')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Patient List</span>
              </Button>
              
              <Button 
                className="h-20 bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30 flex-col gap-2"
                onClick={() => navigate('/laboratory')}
              >
                <TestTube className="h-6 w-6" />
                <span className="text-sm">Lab Results</span>
              </Button>
              
              <Button 
                className="h-20 bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30 flex-col gap-2"
                onClick={handleTeamCommunication}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Team Chat</span>
              </Button>
              
              <Button 
                className="h-20 bg-orange-600/20 border border-orange-400/30 text-white hover:bg-orange-500/30 flex-col gap-2"
                onClick={() => navigate('/radiology')}
              >
                <Activity className="h-6 w-6" />
                <span className="text-sm">Imaging</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Epic-Style Clinical Inbox */}
      <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Clinical Inbox - Pending Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Progress Note - John Smith</p>
                  <p className="text-white/60 text-sm">Due: Today 2:00 PM</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => handlePatientAction("1", "notes")}
                className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
              >
                <Plus className="h-4 w-4 mr-1" />
                Complete
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <TestTube className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Lab Order Review - Sarah Johnson</p>
                  <p className="text-white/60 text-sm">Critical: Elevated Troponin</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => handlePatientAction("2", "labs")}
                className="bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30"
              >
                Review
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Pill className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-white font-medium">Medication Reconciliation - Mike Davis</p>
                  <p className="text-white/60 text-sm">Pre-operative clearance needed</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => handlePatientAction("3", "medications")}
                className="bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30"
              >
                Reconcile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clinical;
