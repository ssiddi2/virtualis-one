
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Eye,
  Loader2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '@/hooks/usePatients';
import { useLabOrders } from '@/hooks/useLabOrders';
import { useMedications } from '@/hooks/useMedications';
import { useProblemList } from '@/hooks/useProblemList';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';

const PatientChart = () => {
  const { toast } = useToast();
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch real data from backend
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { data: labOrders } = useLabOrders(patientId);
  const { data: medications } = useMedications();
  const { data: problemList } = useProblemList(patientId);
  const { data: allergies } = useAllergies(patientId);
  const { data: medicalRecords } = useMedicalRecords();

  if (patientsLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading patient chart...</p>
        </div>
      </div>
    );
  }

  const patient = patients?.find(p => p.id === patientId);
  const patientLabOrders = labOrders?.filter(lab => lab.patient_id === patientId);
  const patientMedications = medications?.filter(med => med.patient_id === patientId);
  const patientRecords = medicalRecords?.filter(record => record.patient_id === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Patient not found</p>
          <Button onClick={() => navigate('/patients')} className="bg-blue-600 hover:bg-blue-700">
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

  const getLabTrend = (value: any, referenceRange: any) => {
    if (!value || !referenceRange) return <Minus className="h-4 w-4 text-gray-400" />;
    
    try {
      const numValue = parseFloat(value.toString());
      const range = referenceRange.toString();
      const [min, max] = range.split('-').map(v => parseFloat(v.trim()));
      
      if (numValue > max) return <ArrowUp className="h-4 w-4 text-red-500" />;
      if (numValue < min) return <ArrowDown className="h-4 w-4 text-red-500" />;
      return <Minus className="h-4 w-4 text-green-500" />;
    } catch {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLabStatus = (abnormalFlags: string[] | null) => {
    if (!abnormalFlags || abnormalFlags.length === 0) {
      return <Badge className="bg-green-600 text-white text-xs">Normal</Badge>;
    }
    return <Badge className="bg-red-600 text-white text-xs">Abnormal</Badge>;
  };

  const handleActionClick = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} has been started for ${patient.first_name} ${patient.last_name}`,
    });
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
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
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600 text-white">Room: {patient.room_number || 'Unassigned'}</Badge>
                <Badge className={`${patient.status === 'active' ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                  {patient.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            {/* Critical Alerts */}
            {allergies && allergies.length > 0 && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-200 font-semibold">ALLERGIES:</span>
                  <span className="text-red-200">
                    {allergies.filter(a => a.status === 'active').map(a => a.allergen).join(', ')}
                  </span>
                </div>
              </div>
            )}
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
            <TestTube className="h-4 w-4 mr-2" />
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
            onClick={() => handleActionClick('Clinical Notes')}
            className="bg-orange-600/20 border border-orange-400/30 text-white hover:bg-orange-500/30"
          >
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </Button>
        </div>

        {/* Epic-Style Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-blue-600/20 border border-blue-400/30 rounded-lg">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Lab Results
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Medications
            </TabsTrigger>
            <TabsTrigger value="problems" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Problems
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Clinical Notes
            </TabsTrigger>
            <TabsTrigger value="allergies" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Allergies
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
                  <p><span className="font-semibold">Blood Type:</span> {patient.blood_type || 'Unknown'}</p>
                  <p><span className="font-semibold">Insurance:</span> {patient.insurance_provider || 'Not specified'}</p>
                  <p><span className="font-semibold">Emergency Contact:</span> {patient.emergency_contact_name || 'Not provided'}</p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Active Problems</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {problemList?.slice(0, 3).map((problem) => (
                    <div key={problem.id} className="p-2 bg-blue-600/20 rounded border border-blue-400/30">
                      <p className="text-white font-medium">{problem.problem_name}</p>
                      <p className="text-white/60 text-sm">{problem.icd10_code}</p>
                    </div>
                  ))}
                  {(!problemList || problemList.length === 0) && (
                    <p className="text-white/60">No active problems</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Labs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {patientLabOrders?.slice(0, 3).map((lab) => (
                    <div key={lab.id} className="p-2 bg-purple-600/20 rounded border border-purple-400/30">
                      <p className="text-white font-medium">{lab.test_name}</p>
                      <p className="text-white/60 text-sm">
                        {lab.completed_at ? new Date(lab.completed_at).toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                  ))}
                  {(!patientLabOrders || patientLabOrders.length === 0) && (
                    <p className="text-white/60">No recent labs</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="labs" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Laboratory Results - Epic Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-400/30 hover:bg-blue-500/10">
                      <TableHead className="text-white font-semibold">Test Name</TableHead>
                      <TableHead className="text-white font-semibold">Result</TableHead>
                      <TableHead className="text-white font-semibold">Reference Range</TableHead>
                      <TableHead className="text-white font-semibold">Status</TableHead>
                      <TableHead className="text-white font-semibold">Date</TableHead>
                      <TableHead className="text-white font-semibold">Trend</TableHead>
                      <TableHead className="text-white font-semibold">Provider</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientLabOrders?.map((lab) => (
                      <TableRow key={lab.id} className="border-blue-400/20 hover:bg-blue-500/10">
                        <TableCell className="text-white font-medium">{lab.test_name}</TableCell>
                        <TableCell className="text-white">
                          {lab.results ? (
                            typeof lab.results === 'object' ? 
                            Object.entries(lab.results).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{key}:</span> {value as string}
                              </div>
                            )) : 
                            lab.results.toString()
                          ) : (
                            <span className="text-yellow-300">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {lab.reference_ranges ? (
                            typeof lab.reference_ranges === 'object' ?
                            Object.entries(lab.reference_ranges).map(([key, value]) => (
                              <div key={key} className="text-xs">
                                {key}: {value as string}
                              </div>
                            )) :
                            lab.reference_ranges.toString()
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getLabStatus(lab.abnormal_flags)}
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {lab.completed_at ? new Date(lab.completed_at).toLocaleDateString() : 
                           lab.ordered_at ? new Date(lab.ordered_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getLabTrend(lab.results, lab.reference_ranges)}
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {lab.provider ? `${lab.provider.first_name} ${lab.provider.last_name}` : 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!patientLabOrders || patientLabOrders.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-white/60 py-8">
                          No laboratory results available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
                        <TableCell colSpan={6} className="text-center text-white/60 py-8">
                          No active medications
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Problem List</CardTitle>
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
                          <Badge className={problem.status === 'active' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}>
                            {problem.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {problem.onset_date ? new Date(problem.onset_date).toLocaleDateString() : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {problem.severity && (
                            <Badge className="bg-yellow-600 text-white">
                              {problem.severity}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!problemList || problemList.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-white/60 py-8">
                          No problems documented
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Clinical Notes with AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {patientRecords?.map((record) => (
                  <div key={record.id} className="mb-6 p-4 bg-blue-600/20 rounded-lg border border-blue-400/30">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{record.encounter_type}</h3>
                        <p className="text-white/60 text-sm">
                          {new Date(record.visit_date).toLocaleDateString()}
                        </p>
                      </div>
                      {record.ai_coding_suggestions && (
                        <Badge className="bg-purple-600 text-white">
                          AI Coded ({record.coding_confidence_score}% confidence)
                        </Badge>
                      )}
                    </div>
                    
                    {record.chief_complaint && (
                      <div className="mb-3">
                        <h4 className="text-white font-medium">Chief Complaint:</h4>
                        <p className="text-white/80">{record.chief_complaint}</p>
                      </div>
                    )}
                    
                    {record.assessment && (
                      <div className="mb-3">
                        <h4 className="text-white font-medium">Assessment:</h4>
                        <p className="text-white/80">{record.assessment}</p>
                      </div>
                    )}
                    
                    {record.plan && (
                      <div className="mb-3">
                        <h4 className="text-white font-medium">Plan:</h4>
                        <p className="text-white/80">{record.plan}</p>
                      </div>
                    )}

                    {record.ai_coding_suggestions && (
                      <div className="mt-4 p-3 bg-purple-600/20 rounded border border-purple-400/30">
                        <h4 className="text-purple-200 font-medium mb-2">AI Coding Suggestions:</h4>
                        <pre className="text-purple-100 text-sm whitespace-pre-wrap">
                          {JSON.stringify(record.ai_coding_suggestions, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
                {(!patientRecords || patientRecords.length === 0) && (
                  <div className="text-center text-white/60 py-8">
                    No clinical notes available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allergies" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Allergies & Adverse Reactions</CardTitle>
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
                          <Badge className="bg-red-600 text-white">
                            {allergy.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{allergy.symptoms || 'Not specified'}</TableCell>
                        <TableCell>
                          <Badge className={allergy.status === 'active' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'}>
                            {allergy.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!allergies || allergies.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-white/60 py-8">
                          No known allergies
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientChart;
