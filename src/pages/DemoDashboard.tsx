import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Users, 
  Brain, 
  Stethoscope, 
  Building2, 
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Clock,
  Heart,
  FileText,
  Pill,
  Microscope,
  BrainCircuit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HospitalData {
  id: string;
  name: string;
  emrType: string;
  patientCount: number;
  activeAlerts: number;
  pendingOrders: number;
  criticalPatients: number;
}

const DemoDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patients } = usePatients();
  
  const [selectedHospital, setSelectedHospital] = useState<string>("metro-general");
  const [hospitals] = useState<HospitalData[]>([
    {
      id: "metro-general",
      name: "Metropolitan General Hospital",
      emrType: "Epic",
      patientCount: 1234,
      activeAlerts: 5,
      pendingOrders: 23,
      criticalPatients: 8
    },
    {
      id: "riverside-medical",
      name: "Riverside Medical Center",
      emrType: "Cerner",
      patientCount: 987,
      activeAlerts: 3,
      pendingOrders: 15,
      criticalPatients: 6
    }
  ]);

  // Sample patient data for demo
  const demoPatients = [
    {
      id: "1",
      name: "John Smith",
      mrn: "MRN-001234",
      age: 45,
      condition: "Hypertension",
      hospital: "metro-general",
      status: "stable",
      lastVisit: "2 hours ago"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      mrn: "MRN-002345",
      age: 62,
      condition: "Diabetes Type 2",
      hospital: "metro-general",
      status: "critical",
      lastVisit: "30 minutes ago"
    },
    {
      id: "3",
      name: "Michael Chen",
      mrn: "RMC-003456",
      age: 38,
      condition: "Post-surgical",
      hospital: "riverside-medical",
      status: "recovering",
      lastVisit: "1 hour ago"
    },
    {
      id: "4",
      name: "Emily Davis",
      mrn: "RMC-004567",
      age: 29,
      condition: "Pneumonia",
      hospital: "riverside-medical",
      status: "improving",
      lastVisit: "4 hours ago"
    }
  ];

  const currentHospital = hospitals.find(h => h.id === selectedHospital);
  const hospitalPatients = demoPatients.filter(p => p.hospital === selectedHospital);

  const handlePatientClick = (patientId: string) => {
    toast({
      title: "Opening Patient Chart",
      description: "Loading comprehensive patient data...",
    });
    navigate(`/patients/${patientId}`);
  };

  const handleAIAssist = () => {
    toast({
      title: "AI Clinical Assistant",
      description: "Analyzing cross-hospital patient data and generating insights...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-foreground rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Unified Hospital Dashboard</h1>
                <p className="text-sm text-muted-foreground">Cross-EMR Patient Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="default" className="gap-1">
                <Building2 className="w-3 h-3" />
                2 Hospitals Connected
              </Badge>
              <Button variant="outline" onClick={() => navigate("/demo-connect")}>
                Connection Status
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Exit Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hospital Selector Tabs */}
        <Tabs value={selectedHospital} onValueChange={setSelectedHospital} className="mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-2">
            {hospitals.map((hospital) => (
              <TabsTrigger key={hospital.id} value={hospital.id} className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {hospital.name} ({hospital.emrType})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Hospital Overview Cards */}
        {currentHospital && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">{currentHospital.patientCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{currentHospital.activeAlerts}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold">{currentHospital.pendingOrders}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Heart className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical Patients</p>
                  <p className="text-2xl font-bold">{currentHospital.criticalPatients}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Patients</CardTitle>
              <CardDescription>
                Showing patients from {currentHospital?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {hospitalPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{patient.name}</p>
                            <Badge 
                              variant={
                                patient.status === "critical" ? "destructive" : 
                                patient.status === "stable" ? "default" : 
                                "secondary"
                              }
                              className="text-xs"
                            >
                              {patient.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {patient.mrn} • Age {patient.age} • {patient.condition}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last visit: {patient.lastVisit}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI Insights Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Virtualis AI Insights
              </CardTitle>
              <CardDescription>
                Cross-hospital analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <BrainCircuit className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Similar Cases Detected</p>
                    <p className="text-xs text-muted-foreground">
                      3 patients across both hospitals show similar symptom patterns. 
                      AI suggests unified treatment protocol.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Pill className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Medication Alert</p>
                    <p className="text-xs text-muted-foreground">
                      Potential drug interaction detected for patient transfer 
                      from Metropolitan to Riverside.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Efficiency Opportunity</p>
                    <p className="text-xs text-muted-foreground">
                      Lab test consolidation could reduce redundancy by 23% 
                      across facilities.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleAIAssist}
              >
                <Brain className="w-4 h-4 mr-2" />
                Launch AI Clinical Assistant
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks across both EMR systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Stethoscope className="w-5 h-5" />
                <span className="text-xs">New Consultation</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Microscope className="w-5 h-5" />
                <span className="text-xs">Order Labs</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Pill className="w-5 h-5" />
                <span className="text-xs">Medications</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Documentation</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoDashboard;