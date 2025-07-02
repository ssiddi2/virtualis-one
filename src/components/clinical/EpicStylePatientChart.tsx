import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Calendar, 
  Phone,
  AlertTriangle,
  FileText,
  Stethoscope,
  Pill,
  Activity,
  ClipboardList,
  Shield,
  Syringe,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useLabOrders } from '@/hooks/useLabOrders';
import { useMedications } from '@/hooks/useMedications';
import { useProblemList } from '@/hooks/useProblemList';
import { useAllergies } from '@/hooks/useAllergies';
import { useClinicalOrders } from '@/hooks/useClinicalOrders';
import { useParams, useNavigate } from 'react-router-dom';
import EpicLabResultsTable from './EpicLabResultsTable';
import EpicClinicalNotes from './EpicClinicalNotes';

interface EpicStylePatientChartProps {
  patientId: string;
}

const EpicStylePatientChart = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  console.log('EpicStylePatientChart - patientId:', patientId);
  
  const { data: patients, isLoading: patientsLoading, error: patientsError } = usePatients();
  const { data: labOrders } = useLabOrders();
  const { data: medications } = useMedications();
  const { data: problemList } = useProblemList(patientId);
  const { data: allergies } = useAllergies(patientId);
  const { data: clinicalOrders } = useClinicalOrders(patientId);

  console.log('EpicStylePatientChart - patients:', patients);
  console.log('EpicStylePatientChart - patientsLoading:', patientsLoading);
  console.log('EpicStylePatientChart - patientsError:', patientsError);

  if (patientsLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading patient chart...</p>
        </div>
      </div>
    );
  }

  if (patientsError) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Error loading patient data</p>
          <Button onClick={() => navigate('/patients')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  const patient = patients?.find(p => p.id === patientId);
  const patientLabOrders = labOrders?.filter(lab => lab.patient_id === patientId);
  const patientMedications = medications?.filter(med => med.patient_id === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Patient not found</p>
          <Button onClick={() => navigate('/patients')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'life-threatening': return 'bg-red-600 text-white';
      case 'severe': return 'bg-orange-600 text-white';
      case 'moderate': return 'bg-yellow-600 text-white';
      case 'mild': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getResultTrend = (value: number, referenceRange: string) => {
    if (!referenceRange) return <Minus className="h-4 w-4 text-gray-400" />;
    const [min, max] = referenceRange.split('-').map(v => parseFloat(v.trim()));
    if (value > max) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value < min) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-full mx-auto space-y-4">
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/patients')}
            className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <h1 className="text-2xl font-bold text-white">Epic-Style Patient Chart</h1>
        </div>

        {/* Epic-Style Patient Banner */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-blue-300" />
                  <div>
                    <h1 className="text-xl font-bold text-white">{patient.first_name} {patient.last_name}</h1>
                    <p className="text-blue-200 text-sm">MRN: {patient.mrn} • DOB: {new Date(patient.date_of_birth).toLocaleDateString()} • Age: {age}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Admitted: {patient.admission_date ? new Date(patient.admission_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone || 'No phone'}</span>
                  </div>
                  <Badge className={`${patient.status === 'active' ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                    {patient.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600 text-white">Room: {patient.room_number || 'Unassigned'}</Badge>
                <Badge className="bg-blue-600 text-white">Bed: {patient.bed_number || 'N/A'}</Badge>
              </div>
            </div>
            
            {/* Critical Alerts Bar */}
            {allergies && allergies.length > 0 && (
              <Alert className="mt-3 bg-red-900/20 border-red-400/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  <strong>ALLERGIES:</strong> {allergies.filter(a => a.status === 'active').map(a => a.allergen).join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Epic-Style Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-blue-600/20 border border-blue-400/30 rounded-lg">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="problems" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <ClipboardList className="h-4 w-4 mr-2" />
              Problems
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="allergies" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Allergies
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Labs
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Stethoscope className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="vitals" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Heart className="h-4 w-4 mr-2" />
              Vitals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-white">
                  <p><span className="font-semibold">Gender:</span> {patient.gender || 'Unknown'}</p>
                  <p><span className="font-semibold">SSN:</span> {patient.ssn || 'Not provided'}</p>
                  <p><span className="font-semibold">Blood Type:</span> {patient.blood_type || 'Unknown'}</p>
                  <p><span className="font-semibold">Insurance:</span> {patient.insurance_provider || 'Not specified'}</p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-white">
                  <p><span className="font-semibold">Name:</span> {patient.emergency_contact_name || 'Not provided'}</p>
                  <p><span className="font-semibold">Phone:</span> {patient.emergency_contact_phone || 'Not provided'}</p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Current Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-white">
                  <p><span className="font-semibold">Room:</span> {patient.room_number || 'Unassigned'}</p>
                  <p><span className="font-semibold">Bed:</span> {patient.bed_number || 'Unassigned'}</p>
                  <p><span className="font-semibold">Unit:</span> Medical/Surgical</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Problem List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-400/30">
                      <TableHead className="text-white">Problem</TableHead>
                      <TableHead className="text-white">ICD-10</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Onset</TableHead>
                      <TableHead className="text-white">Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problemList?.map((problem) => (
                      <TableRow key={problem.id} className="border-blue-400/20 hover:bg-blue-500/10">
                        <TableCell className="text-white font-medium">{problem.problem_name}</TableCell>
                        <TableCell className="text-white">{problem.icd10_code || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(problem.status)}>
                            {problem.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {problem.onset_date ? new Date(problem.onset_date).toLocaleDateString() : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {problem.severity && (
                            <Badge className={getSeverityColor(problem.severity)}>
                              {problem.severity}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!problemList || problemList.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-white/60">
                          No problems documented
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allergies" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Allergies & Adverse Reactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-400/30">
                      <TableHead className="text-white">Allergen</TableHead>
                      <TableHead className="text-white">Reaction Type</TableHead>
                      <TableHead className="text-white">Severity</TableHead>
                      <TableHead className="text-white">Symptoms</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allergies?.map((allergy) => (
                      <TableRow key={allergy.id} className="border-blue-400/20 hover:bg-blue-500/10">
                        <TableCell className="text-white font-medium">{allergy.allergen}</TableCell>
                        <TableCell className="text-white">{allergy.reaction_type}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(allergy.severity)}>
                            {allergy.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{allergy.symptoms || 'Not specified'}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(allergy.status)}>
                            {allergy.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!allergies || allergies.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-white/60">
                          No known allergies
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs" className="space-y-4">
            <EpicLabResultsTable patientId={patientId} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <EpicClinicalNotes patientId={patientId} />
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-400/30">
                      <TableHead className="text-white">Medication</TableHead>
                      <TableHead className="text-white">Dosage</TableHead>
                      <TableHead className="text-white">Frequency</TableHead>
                      <TableHead className="text-white">Route</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Started</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientMedications?.map((med) => (
                      <TableRow key={med.id} className="border-blue-400/20 hover:bg-blue-500/10">
                        <TableCell className="text-white font-medium">{med.medication_name}</TableCell>
                        <TableCell className="text-white">{med.dosage}</TableCell>
                        <TableCell className="text-white">{med.frequency}</TableCell>
                        <TableCell className="text-white">{med.route}</TableCell>
                        <TableCell>
                          <Badge className={med.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                            {med.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(med.start_date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!patientMedications || patientMedications.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-white/60">
                          No active medications
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Clinical Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-400/30">
                      <TableHead className="text-white">Order Type</TableHead>
                      <TableHead className="text-white">Details</TableHead>
                      <TableHead className="text-white">Priority</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Ordered</TableHead>
                      <TableHead className="text-white">Provider</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clinicalOrders?.map((order) => (
                      <TableRow key={order.id} className="border-blue-400/20 hover:bg-blue-500/10">
                        <TableCell className="text-white font-medium capitalize">{order.order_type}</TableCell>
                        <TableCell className="text-white">{JSON.stringify(order.order_details)}</TableCell>
                        <TableCell>
                          <Badge className={
                            order.priority === 'stat' ? 'bg-red-600 text-white' :
                            order.priority === 'urgent' ? 'bg-orange-600 text-white' :
                            'bg-blue-600 text-white'
                          }>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            order.status === 'active' ? 'bg-green-600 text-white' :
                            order.status === 'completed' ? 'bg-blue-600 text-white' :
                            'bg-gray-600 text-white'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-white">
                          {order.ordering_provider ? 
                            `${order.ordering_provider.first_name} ${order.ordering_provider.last_name}` : 
                            'Unknown'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!clinicalOrders || clinicalOrders.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-white/60">
                          No clinical orders
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Vital Signs Flowsheet
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-white/60 py-8">
                Vital signs flowsheet coming soon - will display trending vital signs data
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EpicStylePatientChart;
