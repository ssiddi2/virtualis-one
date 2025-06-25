
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Heart, 
  Activity, 
  FileText, 
  Calendar, 
  Pill, 
  AlertTriangle,
  Edit,
  ArrowLeft,
  Brain,
  Stethoscope,
  TestTube,
  Camera
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  status: 'stable' | 'critical' | 'observation';
  admissionDate: string;
  diagnosis: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  allergies: string[];
  recentNotes: Array<{
    date: string;
    type: string;
    content: string;
    author: string;
  }>;
}

const mockPatient: Patient = {
  id: "1",
  name: "Sarah Johnson",
  age: 45,
  gender: "Female",
  room: "ICU-204",
  status: "stable",
  admissionDate: "2024-01-15",
  diagnosis: "Acute Myocardial Infarction",
  vitals: {
    heartRate: 78,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygenSat: 98
  },
  medications: [
    { name: "Metoprolol", dosage: "50mg", frequency: "Twice daily" },
    { name: "Atorvastatin", dosage: "40mg", frequency: "Once daily" },
    { name: "Aspirin", dosage: "81mg", frequency: "Once daily" }
  ],
  allergies: ["Penicillin", "Shellfish"],
  recentNotes: [
    {
      date: "2024-01-20 14:30",
      type: "Progress Note",
      content: "Patient shows significant improvement. Vital signs stable. Considering discharge planning.",
      author: "Dr. Smith"
    },
    {
      date: "2024-01-20 08:15",
      type: "Nursing Note",
      content: "Patient ambulated 200ft in hallway without assistance. No complaints of chest pain.",
      author: "RN Johnson"
    }
  ]
};

const PatientChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading patient data
    setTimeout(() => {
      setPatient(mockPatient);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { color: "glass-badge success", icon: Heart },
      critical: { color: "glass-badge error pulse-glow", icon: AlertTriangle },
      observation: { color: "glass-badge primary", icon: Activity }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} tech-font`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-virtualis-gold mx-auto mb-4"></div>
          <p className="text-white font-semibold tech-font">Loading Patient Chart...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-virtualis-gold/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2 tech-font">PATIENT NOT FOUND</h3>
          <p className="text-white/60 tech-font">Unable to locate patient record</p>
          <Button onClick={() => navigate("/")} className="mt-4 glass-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="glass-nav-item border-white/20 hover:border-virtualis-gold/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white tech-font">{patient.name}</h1>
              <p className="text-white/70 tech-font">Patient ID: {patient.id} • Room: {patient.room}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(patient.status)}
            <Button className="glass-button">
              <Edit className="h-4 w-4 mr-2" />
              Edit Chart
            </Button>
          </div>
        </div>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <User className="h-5 w-5 text-virtualis-gold" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Age:</span>
                <span className="text-white">{patient.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Gender:</span>
                <span className="text-white">{patient.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Admitted:</span>
                <span className="text-white">{new Date(patient.admissionDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{patient.vitals.heartRate}</div>
              <p className="text-white/60 text-sm">bpm</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{patient.vitals.bloodPressure}</div>
              <p className="text-white/60 text-sm">mmHg</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <TestTube className="h-5 w-5 text-green-400" />
                O2 Saturation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{patient.vitals.oxygenSat}%</div>
              <p className="text-white/60 text-sm">SpO2</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-nav-item">
            <TabsTrigger value="overview" className="tech-font">Overview</TabsTrigger>
            <TabsTrigger value="medications" className="tech-font">Medications</TabsTrigger>
            <TabsTrigger value="notes" className="tech-font">Clinical Notes</TabsTrigger>
            <TabsTrigger value="vitals" className="tech-font">Vital Signs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white tech-font flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-virtualis-gold" />
                    Primary Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-lg">{patient.diagnosis}</p>
                  <div className="mt-4 p-3 glass-nav-item">
                    <h4 className="text-white font-semibold mb-2">Treatment Plan</h4>
                    <ul className="text-white/70 space-y-1">
                      <li>• Cardiac monitoring</li>
                      <li>• Daily ECG</li>
                      <li>• Gradual activity increase</li>
                      <li>• Medication compliance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white tech-font flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Allergies & Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patient.allergies.map((allergy, index) => (
                    <div key={index} className="glass-badge error">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {allergy}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medications">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Pill className="h-5 w-5 text-virtualis-gold" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-4 glass-nav-item">
                      <div>
                        <h4 className="text-white font-semibold">{med.name}</h4>
                        <p className="text-white/70">{med.dosage} - {med.frequency}</p>
                      </div>
                      <Badge className="glass-badge success">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <FileText className="h-5 w-5 text-virtualis-gold" />
                  Clinical Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.recentNotes.map((note, index) => (
                    <div key={index} className="p-4 glass-nav-item">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="glass-badge primary">{note.type}</Badge>
                        <span className="text-white/60 text-sm">{note.date}</span>
                      </div>
                      <p className="text-white mb-2">{note.content}</p>
                      <p className="text-virtualis-gold text-sm">— {note.author}</p>
                    </div>
                  ))}
                  <Button className="w-full glass-button">
                    <Brain className="h-4 w-4 mr-2" />
                    Generate AI Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Activity className="h-5 w-5 text-virtualis-gold" />
                  Vital Signs Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 glass-nav-item">
                      <h4 className="text-white font-semibold mb-2">Temperature</h4>
                      <div className="text-2xl text-white">{patient.vitals.temperature}°F</div>
                    </div>
                    <div className="p-4 glass-nav-item">
                      <h4 className="text-white font-semibold mb-2">Heart Rate Trend</h4>
                      <div className="text-green-400">↗ Improving</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Button className="w-full glass-button">
                      <Camera className="h-4 w-4 mr-2" />
                      Record Vitals
                    </Button>
                    <Button className="w-full glass-nav-item border-white/20 hover:border-virtualis-gold/50 text-white">
                      View Trends
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientChart;
