
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Clock, 
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Stethoscope,
  Heart,
  Thermometer,
  Scale,
  Eye
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMedications } from '@/hooks/useMedications';
import { useNursingAssessments } from '@/hooks/useNursingAssessments';

const NursingWorkstation = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: patients } = usePatients();
  const { data: medications } = useMedications();
  const { data: assessments } = useNursingAssessments();

  // Mock nursing assignment data
  const nursingAssignments = patients?.slice(0, 8).map(patient => {
    const patientMeds = medications?.filter(med => med.patient_id === patient.id) || [];
    const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
    
    return {
      ...patient,
      age,
      acuity: Math.floor(Math.random() * 3) + 1,
      nextMedDue: new Date(Date.now() + Math.random() * 4 * 60 * 60 * 1000),
      lastAssessment: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000),
      activeMeds: patientMeds.filter(med => med.status === 'active').length,
      alerts: Math.floor(Math.random() * 3),
      fallRisk: Math.floor(Math.random() * 10) + 1,
      painScore: Math.floor(Math.random() * 10) + 1
    };
  }) || [];

  // Mock MAR data
  const marSchedule = [];
  for (let hour = 6; hour <= 22; hour += 2) {
    nursingAssignments.forEach(patient => {
      if (Math.random() > 0.7) { // 30% chance of med at each time
        marSchedule.push({
          id: `${patient.id}-${hour}`,
          patient_id: patient.id,
          patient_name: `${patient.first_name} ${patient.last_name}`,
          room: patient.room_number,
          time: `${hour.toString().padStart(2, '0')}:00`,
          medication: ['Metformin', 'Lisinopril', 'Atorvastatin', 'Amlodipine'][Math.floor(Math.random() * 4)],
          dose: ['5mg', '10mg', '20mg', '40mg'][Math.floor(Math.random() * 4)],
          route: 'PO',
          status: Math.random() > 0.3 ? 'scheduled' : Math.random() > 0.5 ? 'given' : 'held'
        });
      }
    });
  }

  const getAcuityColor = (acuity: number) => {
    switch (acuity) {
      case 1: return 'bg-green-600 text-white';
      case 2: return 'bg-yellow-600 text-white';
      case 3: return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getMedStatusColor = (status: string) => {
    switch (status) {
      case 'given': return 'bg-green-600 text-white';
      case 'held': return 'bg-red-600 text-white';
      case 'refused': return 'bg-orange-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const getRiskColor = (score: number, max: number = 10) => {
    const percentage = score / max;
    if (percentage >= 0.7) return 'text-red-400';
    if (percentage >= 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Nursing Workstation</h1>
            <p className="text-white/70">Patient assignments and care management • Shift: Day (7A-7P)</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Critical Alerts (3)
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{nursingAssignments.length}</div>
            <div className="text-xs text-white/70">Assigned Patients</div>
          </div>
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{nursingAssignments.filter(p => p.acuity === 3).length}</div>
            <div className="text-xs text-white/70">High Acuity</div>
          </div>
          <div className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{marSchedule.filter(m => m.status === 'scheduled').length}</div>
            <div className="text-xs text-white/70">Meds Due</div>
          </div>
          <div className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{marSchedule.filter(m => m.status === 'given').length}</div>
            <div className="text-xs text-white/70">Meds Given</div>
          </div>
          <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{nursingAssignments.reduce((sum, p) => sum + p.alerts, 0)}</div>
            <div className="text-xs text-white/70">Active Alerts</div>
          </div>
          <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{nursingAssignments.filter(p => p.fallRisk >= 7).length}</div>
            <div className="text-xs text-white/70">Fall Risk</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
            <TabsTrigger value="assignments" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Patient Assignments
            </TabsTrigger>
            <TabsTrigger value="mar" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Pill className="h-4 w-4 mr-2" />
              Medication (MAR)
            </TabsTrigger>
            <TabsTrigger value="assessments" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Stethoscope className="h-4 w-4 mr-2" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="flowsheet" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Flowsheet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Assignments - Nurse Station 3A
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-400/30">
                      <TableHead className="text-white">Room</TableHead>
                      <TableHead className="text-white">Patient</TableHead>
                      <TableHead className="text-white">Age</TableHead>
                      <TableHead className="text-white">Acuity</TableHead>
                      <TableHead className="text-white">Next Med Due</TableHead>
                      <TableHead className="text-white">Fall Risk</TableHead>
                      <TableHead className="text-white">Pain Score</TableHead>
                      <TableHead className="text-white">Alerts</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nursingAssignments.map((patient) => (
                      <TableRow key={patient.id} className="border-blue-400/20 hover:bg-blue-500/10">
                        <TableCell className="text-white font-medium">{patient.room_number || 'Unassigned'}</TableCell>
                        <TableCell>
                          <div className="text-white font-medium">{patient.first_name} {patient.last_name}</div>
                          <div className="text-white/60 text-xs">{patient.mrn}</div>
                        </TableCell>
                        <TableCell className="text-white">{patient.age}y</TableCell>
                        <TableCell>
                          <Badge className={getAcuityColor(patient.acuity)}>
                            Level {patient.acuity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white text-sm">
                          {patient.nextMedDue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getRiskColor(patient.fallRisk)}`}>
                            {patient.fallRisk}/10
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getRiskColor(patient.painScore)}`}>
                            {patient.painScore}/10
                          </span>
                        </TableCell>
                        <TableCell>
                          {patient.alerts > 0 && (
                            <Badge className="bg-red-600 text-white">
                              {patient.alerts}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white p-1">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white p-1">
                              <Stethoscope className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white p-1">
                              <Pill className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mar" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medication Administration Record (MAR)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-400/30">
                      <TableHead className="text-white">Time</TableHead>
                      <TableHead className="text-white">Patient</TableHead>
                      <TableHead className="text-white">Room</TableHead>
                      <TableHead className="text-white">Medication</TableHead>
                      <TableHead className="text-white">Dose</TableHead>
                      <TableHead className="text-white">Route</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marSchedule.slice(0, 15).map((med) => (
                      <TableRow key={med.id} className="border-blue-400/20 hover:bg-blue-500/10">
                        <TableCell className="text-white font-medium">{med.time}</TableCell>
                        <TableCell className="text-white">{med.patient_name}</TableCell>
                        <TableCell className="text-white">{med.room}</TableCell>
                        <TableCell className="text-white">{med.medication}</TableCell>
                        <TableCell className="text-white">{med.dose}</TableCell>
                        <TableCell className="text-white">{med.route}</TableCell>
                        <TableCell>
                          <Badge className={getMedStatusColor(med.status)}>
                            {med.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {med.status === 'scheduled' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white p-1">
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white p-1">
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Nursing Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nursingAssignments.slice(0, 6).map((patient) => (
                    <Card key={patient.id} className="bg-blue-600/10 border border-blue-400/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="text-white font-medium">{patient.first_name} {patient.last_name}</div>
                          <Badge className={getAcuityColor(patient.acuity)}>
                            Acuity {patient.acuity}
                          </Badge>
                        </div>
                        <div className="text-white/60 text-sm">Room {patient.room_number} • {patient.mrn}</div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-white text-sm">
                          <div className="flex justify-between">
                            <span>Last Assessment:</span>
                            <span>{patient.lastAssessment.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fall Risk:</span>
                            <span className={getRiskColor(patient.fallRisk)}>{patient.fallRisk}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pain Score:</span>
                            <span className={getRiskColor(patient.painScore)}>{patient.painScore}/10</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Stethoscope className="h-3 w-3 mr-2" />
                          New Assessment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flowsheet" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs Flowsheet
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-white/60 py-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <Heart className="h-8 w-8 text-red-400 mb-2" />
                      <span>Blood Pressure</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Activity className="h-8 w-8 text-blue-400 mb-2" />
                      <span>Heart Rate</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Thermometer className="h-8 w-8 text-orange-400 mb-2" />
                      <span>Temperature</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Scale className="h-8 w-8 text-green-400 mb-2" />
                      <span>O2 Saturation</span>
                    </div>
                  </div>
                  <p>Interactive vital signs flowsheet with trending data coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NursingWorkstation;
