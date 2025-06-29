import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Activity,
  Heart,
  Thermometer,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
  TestTube,
  Camera,
  Stethoscope,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PatientChart = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient data with enhanced lab and imaging data
  const patientData = {
    id: 'PAT-001',
    name: 'John Smith',
    mrn: 'MRN-001234',
    dob: '1985-03-15',
    age: 38,
    gender: 'Male',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    address: '123 Main St, City, State 12345',
    room: 'ER-101',
    admissionDate: '2024-01-15',
    status: 'Active',
    vitals: {
      temperature: 98.6,
      heartRate: 72,
      bloodPressure: '120/80',
      oxygenSaturation: 98,
      respiratoryRate: 16
    },
    allergies: ['Penicillin', 'Shellfish'],
    medications: [
      { name: 'Lisinopril 10mg', frequency: 'Once daily', status: 'Active' },
      { name: 'Metformin 500mg', frequency: 'Twice daily', status: 'Active' }
    ],
    diagnoses: [
      { condition: 'Hypertension', status: 'Chronic', date: '2022-01-15' },
      { condition: 'Type 2 Diabetes', status: 'Chronic', date: '2021-05-20' }
    ],
    labs: [
      { name: 'Complete Blood Count', date: '2024-01-15', status: 'completed', critical: false, results: { wbc: '7.2', rbc: '4.8', hgb: '14.2', hct: '42.1' } },
      { name: 'Basic Metabolic Panel', date: '2024-01-15', status: 'completed', critical: true, results: { glucose: '180', bun: '18', creatinine: '1.2', sodium: '142' } },
      { name: 'Lipid Panel', date: '2024-01-10', status: 'completed', critical: false, results: { cholesterol: '220', hdl: '45', ldl: '140', triglycerides: '175' } },
      { name: 'Troponin I', date: '2024-01-15', status: 'pending', critical: false, results: null }
    ],
    imaging: [
      { type: 'Chest X-Ray', date: '2024-01-15', status: 'completed', findings: 'No acute cardiopulmonary abnormalities', critical: false },
      { type: 'CT Chest w/contrast', date: '2024-01-14', status: 'completed', findings: 'Small pulmonary nodule, follow-up recommended', critical: true },
      { type: 'Echocardiogram', date: '2024-01-12', status: 'completed', findings: 'Normal left ventricular function, EF 60%', critical: false }
    ],
    recentNotes: [
      { date: '2024-01-15 10:30', provider: 'Dr. Johnson', note: 'Patient stable, responding well to treatment' },
      { date: '2024-01-15 08:00', provider: 'Nurse Wilson', note: 'Vitals taken, patient comfortable' }
    ]
  };

  const handleActionClick = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} has been started for ${patientData.name}`,
    });
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Patient Chart</h1>
            <p className="text-white/70">Complete patient medical record and care overview</p>
          </div>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Patient Header Card */}
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/30 rounded-full">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{patientData.name}</CardTitle>
                  <div className="flex items-center gap-4 text-white/70">
                    <span>MRN: {patientData.mrn}</span>
                    <span>•</span>
                    <span>Age: {patientData.age}</span>
                    <span>•</span>
                    <span>{patientData.gender}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                {patientData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="h-4 w-4 text-blue-300" />
                <span>Room: {patientData.room}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-4 w-4 text-blue-300" />
                <span>Admitted: {patientData.admissionDate}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="h-4 w-4 text-blue-300" />
                <span>{patientData.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => handleActionClick('New Order')}
            className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
          >
            <FileText className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <Button 
            onClick={() => handleActionClick('Lab Results')}
            className="bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30"
          >
            <Activity className="h-4 w-4 mr-2" />
            Lab Results
          </Button>
          <Button 
            onClick={() => handleActionClick('Medications')}
            className="bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30"
          >
            <Pill className="h-4 w-4 mr-2" />
            Medications
          </Button>
          <Button 
            onClick={() => handleActionClick('Discharge Planning')}
            className="bg-orange-600/20 border border-orange-400/30 text-white hover:bg-orange-500/30"
          >
            <User className="h-4 w-4 mr-2" />
            Discharge
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="vitals" className="text-white data-[state=active]:bg-white/20">
              Vitals
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-white data-[state=active]:bg-white/20">
              Labs
            </TabsTrigger>
            <TabsTrigger value="imaging" className="text-white data-[state=active]:bg-white/20">
              Imaging
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-white data-[state=active]:bg-white/20">
              Medications
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-white data-[state=active]:bg-white/20">
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Current Diagnoses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patientData.diagnoses.map((diagnosis, index) => (
                    <div key={index} className="p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{diagnosis.condition}</span>
                        <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
                          {diagnosis.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/60">Diagnosed: {diagnosis.date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Allergies & Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patientData.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-300" />
                        <span className="text-red-200 font-medium">{allergy}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Temperature</p>
                      <p className="text-2xl font-bold text-white">{patientData.vitals.temperature}°F</p>
                    </div>
                    <Thermometer className="h-8 w-8 text-red-300" />
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Heart Rate</p>
                      <p className="text-2xl font-bold text-white">{patientData.vitals.heartRate} BPM</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-300" />
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Blood Pressure</p>
                      <p className="text-2xl font-bold text-white">{patientData.vitals.bloodPressure}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-300" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="labs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {patientData.labs.map((lab, index) => (
                <Card key={index} className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-300/30 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${lab.critical ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                          <TestTube className={`h-5 w-5 ${lab.critical ? 'text-red-300' : 'text-blue-300'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{lab.name}</CardTitle>
                          <p className="text-sm text-white/60">{lab.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lab.critical && (
                          <Badge className="bg-red-500/20 text-red-200 border border-red-400/30 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            CRITICAL
                          </Badge>
                        )}
                        <Badge className={`text-xs ${
                          lab.status === 'completed' 
                            ? 'bg-green-500/20 text-green-200 border-green-400/30' 
                            : 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
                        }`}>
                          {lab.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {lab.results ? (
                      <div className="space-y-2">
                        {Object.entries(lab.results).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-2 backdrop-blur-sm bg-white/5 rounded-lg border border-white/10">
                            <span className="text-white/80 capitalize">{key}:</span>
                            <span className="text-white font-medium">{value}</span>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" className="bg-green-600/30 hover:bg-green-600/50 border border-green-400/30">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-300 mx-auto mb-2" />
                        <p className="text-white/60">Processing results...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="imaging" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {patientData.imaging.map((study, index) => (
                <Card key={index} className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-300/30 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${study.critical ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                          {study.type.includes('Echo') ? (
                            <Stethoscope className={`h-5 w-5 ${study.critical ? 'text-red-300' : 'text-purple-300'}`} />
                          ) : (
                            <Camera className={`h-5 w-5 ${study.critical ? 'text-red-300' : 'text-purple-300'}`} />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{study.type}</CardTitle>
                          <p className="text-sm text-white/60">{study.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {study.critical && (
                          <Badge className="bg-red-500/20 text-red-200 border border-red-400/30 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            CRITICAL
                          </Badge>
                        )}
                        <Badge className="bg-green-500/20 text-green-200 border border-green-400/30 text-xs">
                          {study.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 backdrop-blur-sm bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-2">Findings:</h4>
                        <p className="text-white/80 text-sm">{study.findings}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30">
                          <Eye className="h-3 w-3 mr-1" />
                          View Images
                        </Button>
                        <Button size="sm" className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientData.medications.map((medication, index) => (
                    <div key={index} className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{medication.name}</div>
                          <div className="text-sm text-white/70">{medication.frequency}</div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
                          {medication.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Recent Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.recentNotes.map((note, index) => (
                    <div key={index} className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-300" />
                          <span className="font-medium text-white">{note.provider}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <Clock className="h-3 w-3" />
                          {note.date}
                        </div>
                      </div>
                      <p className="text-white/80">{note.note}</p>
                    </div>
                  ))}
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
