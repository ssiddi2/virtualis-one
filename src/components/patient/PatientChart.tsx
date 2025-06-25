
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, FileText, Pill, TestTube, ImageIcon, Plus, Brain, Clock, AlertTriangle } from "lucide-react";

const PatientChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock patient data fetch
    setTimeout(() => {
      setPatient({
        id,
        name: "Sarah Johnson",
        age: 45,
        gender: "Female",
        room: "302A",
        complaint: "Acute MI",
        status: "in-progress",
        provider: "Dr. Michael Chen",
        admitTime: "09:30 AM",
        acuity: "high",
        risk: "60%",
        allergies: ["Penicillin", "Shellfish"],
        vitals: {
          temperature: "98.6°F",
          bloodPressure: "140/90",
          heartRate: "88 bpm",
          oxygenSat: "98%"
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-virtualis-navy p-6 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-virtualis-gold mx-auto pulse-glow"></div>
          <p className="text-white mt-4 tech-font">Loading Patient Chart...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-virtualis-navy p-6 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 tech-font">Patient not found</h2>
          <Button onClick={() => navigate("/")} className="glass-button">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'high':
        return 'glass-badge error';
      case 'medium':
        return 'glass-badge warning';
      case 'low':
        return 'glass-badge success';
      default:
        return 'glass-badge';
    }
  };

  return (
    <div className="min-h-screen bg-virtualis-navy">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="glass-nav-item text-white hover:text-virtualis-gold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-white brand-font gradient-text">{patient.name}</h1>
              <Badge className={getAcuityColor(patient.acuity)}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {patient.acuity.toUpperCase()} ACUITY
              </Badge>
              <div className="glass-badge primary">
                Risk: {patient.risk}
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/70 tech-font">
              <span>Age: {patient.age}</span>
              <span>Gender: {patient.gender}</span>
              <span>Room: {patient.room}</span>
              <span>Provider: {patient.provider}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Admitted: {patient.admitTime}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Alert */}
        <div className="glass-card bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-400/30 p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 pulse-glow" />
            <div>
              <h3 className="text-red-300 font-semibold tech-font">Priority #1: Highest acuity with escalating risk factors</h3>
              <p className="text-red-200/80 text-sm">D/C: 1-2 days • Requires immediate attention</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Patient Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Chief Complaint</div>
            <p className="text-lg font-semibold text-white">{patient.complaint}</p>
          </div>

          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Temperature</div>
            <p className="text-lg font-semibold text-white">{patient.vitals.temperature}</p>
          </div>

          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Blood Pressure</div>
            <p className="text-lg font-semibold text-white">{patient.vitals.bloodPressure}</p>
          </div>

          <div className="glass-card p-4 hover:scale-105 transition-all duration-300">
            <div className="text-xs text-virtualis-gold font-medium mb-1 tech-font">Heart Rate</div>
            <p className="text-lg font-semibold text-white">{patient.vitals.heartRate}</p>
          </div>
        </div>

        {/* Chart Tabs */}
        <Tabs defaultValue="notes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 glass-card p-1">
            <TabsTrigger value="notes" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="orders" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <Calendar className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="results" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <TestTube className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="mar" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <Pill className="h-4 w-4" />
              MAR
            </TabsTrigger>
            <TabsTrigger value="imaging" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <ImageIcon className="h-4 w-4" />
              Imaging
            </TabsTrigger>
            <TabsTrigger value="charges" className="glass-nav-item flex items-center gap-2 text-white data-[state=active]:bg-virtualis-gold/20 data-[state=active]:text-virtualis-gold">
              <FileText className="h-4 w-4" />
              Charges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="h-5 w-5 text-virtualis-gold pulse-glow" />
                  <h3 className="text-xl font-semibold text-white tech-font">Clinical Notes</h3>
                </div>
                <p className="text-white/70 tech-font">AI-Enhanced Documentation and Progress Notes</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="glass-card border-l-4 border-virtualis-gold p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white tech-font">Initial Assessment</h4>
                      <span className="text-sm text-virtualis-gold">Today, 09:45 AM</span>
                    </div>
                    <p className="text-sm text-white/80 mb-3">
                      45-year-old female presents with acute onset chest pain, described as sharp and radiating to left arm. 
                      No shortness of breath. Pain started 2 hours ago while at rest. No previous cardiac history.
                    </p>
                    <p className="text-xs text-virtualis-gold tech-font">Dr. Michael Chen - Attending Physician</p>
                  </div>
                  
                  <Button className="glass-button w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Note with AI Assistance
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Active Orders</h3>
                <p className="text-white/70 tech-font">Laboratory, imaging, and medication orders</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="glass-card p-4 border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white tech-font">ECG - 12 Lead</h4>
                        <p className="text-sm text-white/60">STAT</p>
                      </div>
                      <div className="glass-badge warning">Pending</div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white tech-font">Troponin I</h4>
                        <p className="text-sm text-white/60">Lab - STAT</p>
                      </div>
                      <div className="glass-badge warning">Pending</div>
                    </div>
                  </div>
                  
                  <Button className="glass-button w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Laboratory Results</h3>
                <p className="text-white/70 tech-font">Recent lab values and reports</p>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-center py-8">No results available yet. Orders are pending.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mar" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Medication Administration Record</h3>
                <p className="text-white/70 tech-font">Scheduled and PRN medications</p>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-center py-8">No medications ordered at this time.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="imaging" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Imaging Studies</h3>
                <p className="text-white/70 tech-font">Radiology reports and images</p>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-center py-8">No imaging studies available.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charges" className="space-y-4">
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white tech-font">Charge Capture</h3>
                <p className="text-white/70 tech-font">CPT codes and billing information</p>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-center py-8">No charges captured yet for this encounter.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientChart;
