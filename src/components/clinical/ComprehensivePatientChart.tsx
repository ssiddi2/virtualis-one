import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Calendar, 
  Phone,
  AlertTriangle,
  FileText,
  TestTube,
  Monitor,
  Pill,
  Activity,
  ClipboardList,
  Shield,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMedications } from '@/hooks/useMedications';
import { useProblemList } from '@/hooks/useProblemList';
import { useAllergies } from '@/hooks/useAllergies';
import { useParams, useNavigate } from 'react-router-dom';
import EpicLabResultsTable from './EpicLabResultsTable';
import EpicClinicalNotes from './EpicClinicalNotes';
import EpicImagingResults from './EpicImagingResults';

const ComprehensivePatientChart = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: patients, isLoading, error } = usePatients();
  const { data: medications } = useMedications();
  const { data: problemList } = useProblemList(patientId);
  const { data: allergies } = useAllergies(patientId);

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Error loading patient data</p>
          <Button onClick={() => navigate('/my-patients')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  const patient = patients?.find(p => p.id === patientId);
  const patientMedications = medications?.filter(med => med.patient_id === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Patient not found</p>
          <Button onClick={() => navigate('/my-patients')} className="bg-blue-600 hover:bg-blue-700">
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

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-full mx-auto space-y-4">
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/my-patients')}
            className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <h1 className="text-2xl font-bold text-white">Patient Chart</h1>
        </div>

        {/* Epic-Style Patient Banner */}
        <Card className="clinical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-blue-300" />
                  <div>
                    <h1 className="text-xl font-bold text-white">{patient.first_name} {patient.last_name}</h1>
                    <p className="text-blue-200 text-sm">MRN: {patient.mrn} • DOB: {new Date(patient.date_of_birth).toLocaleDateString()} • Age: {age} • {patient.gender || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Room: {patient.room_number || 'Unassigned'}</span>
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
            </div>
            
            {/* Critical Alerts Bar */}
            {allergies && allergies.length > 0 && (
              <Alert className="bg-red-900/20 border-red-400/30">
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
          <TabsList className="grid w-full grid-cols-6 clinical-card">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TestTube className="h-4 w-4 mr-2" />
              Labs
            </TabsTrigger>
            <TabsTrigger value="imaging" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Monitor className="h-4 w-4 mr-2" />
              Imaging
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="problems" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <ClipboardList className="h-4 w-4 mr-2" />
              Problems
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="clinical-card">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Current Problems</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {problemList?.filter(p => p.status === 'active').slice(0, 5).map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between">
                      <span className="text-white text-sm">{problem.problem_name}</span>
                      <Badge className={getSeverityColor(problem.severity)}>
                        {problem.severity}
                      </Badge>
                    </div>
                  ))}
                  {(!problemList || problemList.filter(p => p.status === 'active').length === 0) && (
                    <p className="text-white/60 text-sm">No active problems</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="clinical-card">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Current Medications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {patientMedications?.filter(m => m.status === 'active').slice(0, 5).map((med) => (
                    <div key={med.id} className="text-white text-sm">
                      <p className="font-medium">{med.medication_name}</p>
                      <p className="text-white/60">{med.dosage} {med.route} {med.frequency}</p>
                    </div>
                  ))}
                  {(!patientMedications || patientMedications.filter(m => m.status === 'active').length === 0) && (
                    <p className="text-white/60 text-sm">No active medications</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="clinical-card">
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
            </div>
          </TabsContent>

          <TabsContent value="labs" className="mt-4">
            <EpicLabResultsTable patientId={patientId} />
          </TabsContent>

          <TabsContent value="imaging" className="mt-4">
            <EpicImagingResults patientId={patientId} />
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <EpicClinicalNotes patientId={patientId} />
          </TabsContent>

          <TabsContent value="medications" className="mt-4">
            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medication List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientMedications?.map((med) => (
                    <div key={med.id} className="p-3 bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{med.medication_name}</h4>
                        <Badge className={med.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                          {med.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <p className="text-white/80"><span className="font-medium">Dose:</span> {med.dosage}</p>
                        <p className="text-white/80"><span className="font-medium">Route:</span> {med.route}</p>
                        <p className="text-white/80"><span className="font-medium">Frequency:</span> {med.frequency}</p>
                        <p className="text-white/80"><span className="font-medium">Started:</span> {new Date(med.start_date).toLocaleDateString()}</p>
                      </div>
                      {med.indication && (
                        <p className="text-white/60 text-sm mt-2">
                          <span className="font-medium">Indication:</span> {med.indication}
                        </p>
                      )}
                    </div>
                  ))}
                  {(!patientMedications || patientMedications.length === 0) && (
                    <div className="text-center text-white/60 py-8">
                      <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No medications documented</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="mt-4">
            <Card className="clinical-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Problem List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {problemList?.map((problem) => (
                    <div key={problem.id} className="p-3 bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{problem.problem_name}</h4>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(problem.status)}>
                            {problem.status}
                          </Badge>
                          {problem.severity && (
                            <Badge className={getSeverityColor(problem.severity)}>
                              {problem.severity}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <p className="text-white/80"><span className="font-medium">ICD-10:</span> {problem.icd10_code || 'N/A'}</p>
                        <p className="text-white/80"><span className="font-medium">Onset:</span> {problem.onset_date ? new Date(problem.onset_date).toLocaleDateString() : 'Unknown'}</p>
                        <p className="text-white/80"><span className="font-medium">Resolved:</span> {problem.resolved_date ? new Date(problem.resolved_date).toLocaleDateString() : 'Ongoing'}</p>
                      </div>
                      {problem.notes && (
                        <p className="text-white/60 text-sm mt-2">
                          <span className="font-medium">Notes:</span> {problem.notes}
                        </p>
                      )}
                    </div>
                  ))}
                  {(!problemList || problemList.length === 0) && (
                    <div className="text-center text-white/60 py-8">
                      <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No problems documented</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensivePatientChart;