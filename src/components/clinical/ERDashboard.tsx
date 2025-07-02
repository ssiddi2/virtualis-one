import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Stethoscope,
  UserCheck,
  Timer,
  TrendingUp,
  Heart,
  ThermometerSun,
  Zap,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';
import CopilotTriggerButton from '@/components/clinical/CopilotTriggerButton';

const ERDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: patients } = usePatients();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock ER data - in production this would come from real-time feeds
  const erMetrics = {
    totalPatients: 28,
    waitingTriage: 5,
    inTreatment: 15,
    awaitingDisposition: 8,
    avgWaitTime: 42,
    criticalAlerts: 3
  };

  const erPatients = [
    {
      id: '1',
      name: 'John Martinez',
      age: 45,
      chiefComplaint: 'Chest Pain',
      triage: 'ESI-2',
      arrivalTime: '14:30',
      waitTime: '1h 25m',
      location: 'Triage Bay 3',
      provider: 'Dr. Chen',
      status: 'In Treatment',
      vitals: { bp: '145/92', hr: '88', temp: '98.6', o2: '98%' }
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      age: 34,
      chiefComplaint: 'Abdominal Pain',
      triage: 'ESI-3',
      arrivalTime: '15:15',
      waitTime: '42m',
      location: 'Room 12',
      provider: 'Dr. Patel',
      status: 'Awaiting Labs',
      vitals: { bp: '125/78', hr: '72', temp: '99.1', o2: '99%' }
    },
    {
      id: '3',
      name: 'Robert Johnson',
      age: 67,
      chiefComplaint: 'SOB',
      triage: 'ESI-2',
      arrivalTime: '13:45',
      waitTime: '2h 10m',
      location: 'Room 8',
      provider: 'Dr. Smith',
      status: 'Disposition Pending',
      vitals: { bp: '160/95', hr: '102', temp: '98.2', o2: '94%' }
    }
  ];

  const getTriageColor = (triage: string) => {
    switch (triage) {
      case 'ESI-1': return 'bg-red-600 text-white';
      case 'ESI-2': return 'bg-orange-600 text-white';
      case 'ESI-3': return 'bg-yellow-600 text-white';
      case 'ESI-4': return 'bg-green-600 text-white';
      case 'ESI-5': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'in treatment': return 'bg-blue-600 text-white';
      case 'awaiting labs': return 'bg-purple-600 text-white';
      case 'disposition pending': return 'bg-orange-600 text-white';
      case 'ready for discharge': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="space-y-6">
      {/* ER Header - Epic Style */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Emergency Department</h1>
          <p className="text-white/70">Real-time patient tracking and clinical oversight</p>
        </div>
        <div className="text-right text-white">
          <p className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</p>
          <p className="text-sm text-white/70">{currentTime.toLocaleDateString()}</p>
        </div>
      </div>

      {/* Epic-Style Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{erMetrics.totalPatients}</p>
            <p className="text-xs text-white/70">Total Patients</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-300/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{erMetrics.waitingTriage}</p>
            <p className="text-xs text-white/70">Waiting Triage</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/10 border border-green-300/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{erMetrics.inTreatment}</p>
            <p className="text-xs text-white/70">In Treatment</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-orange-500/10 border border-orange-300/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <UserCheck className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{erMetrics.awaitingDisposition}</p>
            <p className="text-xs text-white/70">Awaiting Disposition</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-purple-500/10 border border-purple-300/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <Timer className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{erMetrics.avgWaitTime}m</p>
            <p className="text-xs text-white/70">Avg Wait Time</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-red-500/10 border border-red-300/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{erMetrics.criticalAlerts}</p>
            <p className="text-xs text-white/70">Critical Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Epic-Style Patient Tracking Board */}
      <Tabs defaultValue="all-patients" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
          <TabsTrigger value="all-patients" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            All Patients
          </TabsTrigger>
          <TabsTrigger value="triage" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Triage Queue
          </TabsTrigger>
          <TabsTrigger value="critical" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Critical
          </TabsTrigger>
          <TabsTrigger value="disposition" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Disposition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-patients" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Emergency Department Patient Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-400/30">
                    <TableHead className="text-white font-semibold">Patient</TableHead>
                    <TableHead className="text-white font-semibold">Chief Complaint</TableHead>
                    <TableHead className="text-white font-semibold">Triage</TableHead>
                    <TableHead className="text-white font-semibold">Wait Time</TableHead>
                    <TableHead className="text-white font-semibold">Location</TableHead>
                    <TableHead className="text-white font-semibold">Provider</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                    <TableHead className="text-white font-semibold">Vitals</TableHead>
                    <TableHead className="text-white font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {erPatients.map((patient) => (
                    <TableRow key={patient.id} className="border-blue-400/20 hover:bg-blue-500/10 cursor-pointer">
                      <TableCell className="text-white">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-white/60">Age: {patient.age}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">{patient.chiefComplaint}</TableCell>
                      <TableCell>
                        <Badge className={getTriageColor(patient.triage)}>
                          {patient.triage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        <div>
                          <p>{patient.waitTime}</p>
                          <p className="text-xs text-white/60">Arrived: {patient.arrivalTime}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{patient.location}</TableCell>
                      <TableCell className="text-white">{patient.provider}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-400" />
                            <span>BP: {patient.vitals.bp}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-blue-400" />
                            <span>HR: {patient.vitals.hr}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThermometerSun className="h-3 w-3 text-orange-400" />
                            <span>T: {patient.vitals.temp}°F</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-green-400" />
                            <span>O2: {patient.vitals.o2}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          onClick={() => handlePatientClick(patient.id)}
                          className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chart
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triage" className="mt-4">
          <Card className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Patients Waiting for Triage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 text-center py-8">
                Triage queue view - patients waiting to be triaged
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="mt-4">
          <Card className="backdrop-blur-xl bg-red-500/10 border border-red-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Critical Patients (ESI 1-2)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 text-center py-8">
                Critical patient monitoring - ESI Level 1 and 2 patients
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disposition" className="mt-4">
          <Card className="backdrop-blur-xl bg-orange-500/10 border border-orange-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Awaiting Disposition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 text-center py-8">
                Patients ready for admission, discharge, or transfer decisions
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating AI Co-pilot Trigger */}
      <CopilotTriggerButton 
        variant="floating"
        context={{
          location: 'Emergency Department',
          unit: 'ER',
          role: 'Emergency Physician'
        }}
      />
    </div>
  );
};

export default ERDashboard;
