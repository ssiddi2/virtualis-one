import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Server, Activity, CheckCircle, Clock, Users, Brain, Stethoscope, Lock, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EMRConnectionModal from "@/components/dashboard/EMRConnectionModal";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface HospitalConnection {
  id: string;
  name: string;
  emrType: string;
  status: "disconnected" | "connecting" | "connected";
  patientCount?: number;
  lastSync?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

const DemoConnect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalConnection | null>(null);
  const [hospitals, setHospitals] = useState<HospitalConnection[]>([
    {
      id: "metro-general",
      name: "Metropolitan General Hospital",
      emrType: "Epic",
      status: "disconnected",
      credentials: {
        username: "demo.physician@metro.epic",
        password: "DemoAccess2024!"
      }
    },
    {
      id: "riverside-medical",
      name: "Riverside Medical Center",
      emrType: "Cerner",
      status: "disconnected",
      credentials: {
        username: "demo_doc_riverside",
        password: "CernerDemo#123"
      }
    }
  ]);

  const handleConnect = (hospital: HospitalConnection) => {
    setSelectedHospital(hospital);
    setShowConnectionModal(true);
    
    // Update status to connecting
    setHospitals(prev => prev.map(h => 
      h.id === hospital.id ? { ...h, status: "connecting" } : h
    ));
  };

  const handleConnectionComplete = () => {
    setShowConnectionModal(false);
    
    // Update hospital status to connected
    if (selectedHospital) {
      setHospitals(prev => prev.map(h => 
        h.id === selectedHospital.id 
          ? { 
              ...h, 
              status: "connected",
              patientCount: selectedHospital.emrType === "Epic" ? 1234 : 987,
              lastSync: new Date().toLocaleTimeString()
            } 
          : h
      ));
      
      toast({
        title: "Connection Established",
        description: `Successfully connected to ${selectedHospital.name}`,
      });
    }
    
    // Check if both hospitals are connected
    const connectedCount = hospitals.filter(h => h.status === "connected").length;
    if (connectedCount === 1) {
      // Both will be connected after this update
      setTimeout(() => {
        toast({
          title: "Demo Ready",
          description: "Both hospitals are now connected. Redirecting to unified dashboard...",
        });
        setTimeout(() => navigate("/demo-dashboard"), 2000);
      }, 1500);
    }
  };

  const connectedHospitals = hospitals.filter(h => h.status === "connected");

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
                <h1 className="text-xl font-bold">Virtualis EMR Integration Demo</h1>
                <p className="text-sm text-muted-foreground">Connect to multiple hospital systems</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Wifi className="w-3 h-3" />
                Live Demo Mode
              </Badge>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Exit Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Connection Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hospitals</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold">{connectedHospitals.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">
                  {connectedHospitals.reduce((acc, h) => acc + (h.patientCount || 0), 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Connection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className={`border-2 transition-all ${
              hospital.status === "connected" ? "border-green-500/50 bg-green-500/5" : "border-border"
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {hospital.name}
                      {hospital.status === "connected" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      EMR System: <span className="font-semibold text-foreground">{hospital.emrType}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={hospital.status === "connected" ? "default" : "outline"}>
                    {hospital.status === "connecting" && <LoadingSpinner size="sm" className="mr-2" />}
                    {hospital.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {hospital.status === "disconnected" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Demo Credentials (Pre-filled)</p>
                      <div className="text-xs space-y-1 font-mono">
                        <p>Username: {hospital.credentials?.username}</p>
                        <p>Password: ••••••••••</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleConnect(hospital)} 
                      className="w-full"
                      size="lg"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Connect to {hospital.emrType}
                    </Button>
                  </div>
                )}
                
                {hospital.status === "connecting" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-sm text-muted-foreground">Establishing secure connection...</p>
                  </div>
                )}
                
                {hospital.status === "connected" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Active Patients</p>
                        <p className="text-xl font-bold">{hospital.patientCount}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Last Sync</p>
                        <p className="text-sm font-medium">{hospital.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        View Patients
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Brain className="w-4 h-4 mr-2" />
                        AI Insights
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connected Systems Overview */}
        {connectedHospitals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Connected Systems Overview</CardTitle>
              <CardDescription>Real-time data from connected EMR systems</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="patients" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="patients">Patients</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="ai">AI Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="patients" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {connectedHospitals.map((hospital) => (
                      <div key={hospital.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{hospital.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Patients:</span>
                            <span className="font-medium">{hospital.patientCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">EMR System:</span>
                            <span className="font-medium">{hospital.emrType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="default" className="text-xs">Live</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">Patient data synchronized from Metropolitan General</p>
                      <span className="text-xs text-muted-foreground ml-auto">Just now</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">Security audit completed for Riverside Medical</p>
                      <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ai" className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Cross-Hospital Insights Available</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI analysis detected 3 patients with similar conditions across both hospitals. 
                          Treatment optimization recommendations are ready.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connection Modal */}
      {showConnectionModal && selectedHospital && (
        <EMRConnectionModal
          isOpen={showConnectionModal}
          onClose={() => setShowConnectionModal(false)}
          hospital={{
            id: selectedHospital.id,
            name: selectedHospital.name,
            location: "Demo Location",
            status: "online",
            emrType: selectedHospital.emrType,
            lastSync: new Date().toISOString(),
            patientCount: 0,
            bedCount: 100,
            occupancyRate: 85,
            departments: [],
            metrics: {
              avgWaitTime: 15,
              avgLOS: 3.5,
              readmissionRate: 12,
              patientSatisfaction: 4.5,
              erVolume: 0,
              surgicalVolume: 0,
              diagnosticVolume: 0
            }
          }}
          onConnectionComplete={handleConnectionComplete}
        />
      )}
    </div>
  );
};

export default DemoConnect;