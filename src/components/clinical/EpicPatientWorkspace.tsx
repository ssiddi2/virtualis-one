import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  Phone, 
  AlertTriangle, 
  FileText, 
  TestTube, 
  Pill, 
  Activity,
  Stethoscope,
  Plus,
  ChevronRight,
  Clock,
  BookOpen,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { usePatients, usePatientById } from '@/hooks/usePatients';
import { useLabOrders } from '@/hooks/useLabOrders';
import { useMedications } from '@/hooks/useMedications';
import { useProblemList } from '@/hooks/useProblemList';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useRadiologyOrders } from '@/hooks/useRadiologyOrders';
import { useVitalSigns, useLatestVitals } from '@/hooks/useVitalSigns';
import { useToast } from '@/hooks/use-toast';
import PatientChart from '@/components/patient/PatientChart';
import NewNoteDialog from '@/components/forms/NewNoteDialog';
import NewLabOrderDialog from '@/components/forms/NewLabOrderDialog';
import PatientSummaryCard from '@/components/clinical/PatientSummaryCard';
import EpicLabResultsTable from './EpicLabResultsTable';
import EpicClinicalNotes from './EpicClinicalNotes';

const EpicPatientWorkspace = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialAction = searchParams.get('action') || 'summary';
  const [activeTab, setActiveTab] = useState(initialAction);
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const [showNewLabDialog, setShowNewLabDialog] = useState(false);
  const { toast } = useToast();

  // Data hooks
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { data: labOrders } = useLabOrders(patientId);
  const { data: medications } = useMedications();
  const { data: problemList } = useProblemList(patientId);
  const { data: allergies } = useAllergies(patientId);
  const { data: medicalRecords } = useMedicalRecords(patientId);
  const { data: radiologyOrders } = useRadiologyOrders(patientId);
  const latestVitals = useLatestVitals(patientId);

  // Find patient from list
  const patient = patients?.find(p => p.id === patientId);
  const patientLabOrders = labOrders || [];
  const patientMedications = medications?.filter(med => med.patient_id === patientId) || [];
  const patientRecords = medicalRecords || [];
  const patientImaging = radiologyOrders || [];

  useEffect(() => {
    if (initialAction && initialAction !== activeTab) {
      setActiveTab(initialAction);
    }
  }, [initialAction]);

  // Loading state
  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2 text-white">Loading patient data...</span>
      </div>
    );
  }

  // Patient not found
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-yellow-400" />
        <p className="text-white text-lg">Patient not found</p>
        <p className="text-slate-400 text-sm">Patient ID: {patientId}</p>
        <Button onClick={() => navigate('/patients')} className="mt-4">
          View All Patients
        </Button>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-note':
        setShowNewNoteDialog(true);
        break;
      case 'new-lab':
        setShowNewLabDialog(true);
        break;
      case 'new-order':
        navigate(`/cpoe?patientId=${patientId}`);
        break;
      default:
        setActiveTab(action);
    }
  };

  // Format vitals for display
  const formattedVitals = latestVitals ? {
    blood_pressure: `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic}`,
    heart_rate: latestVitals.heart_rate?.toString() || '--',
    temperature: latestVitals.temperature?.toString() || '--',
    oxygen_saturation: latestVitals.oxygen_saturation?.toString() || '--'
  } : {
    blood_pressure: '--/--',
    heart_rate: '--',
    temperature: '--',
    oxygen_saturation: '--'
  };

  return (
    <div className="space-y-4">
      {/* Epic-Style Patient Banner - Always Visible */}
      <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl sticky top-0 z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{patient.first_name} {patient.last_name}</h1>
                  <p className="text-blue-200 text-sm">
                    MRN: {patient.mrn} • DOB: {new Date(patient.date_of_birth).toLocaleDateString()} • Age: {age} • {patient.gender || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-white">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Room: {patient.room_number || 'Unassigned'}</span>
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                <Badge className={patient.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}>
                  {patient.status || 'Active'}
                </Badge>
              </div>
            </div>
            
            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                onClick={() => handleQuickAction('new-note')}
                className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
              >
                <FileText className="h-4 w-4 mr-1" />
                New Note
              </Button>
              <Button 
                size="sm"
                onClick={() => handleQuickAction('new-lab')}
                className="bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30"
              >
                <TestTube className="h-4 w-4 mr-1" />
                Lab Order
              </Button>
              <Button 
                size="sm"
                onClick={() => handleQuickAction('new-order')}
                className="bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30"
              >
                <Plus className="h-4 w-4 mr-1" />
                CPOE
              </Button>
            </div>
          </div>
          
          {/* Critical Alerts - Allergies */}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-red-200 font-semibold">ALLERGIES:</span>
                <span className="text-red-200">
                  {patient.allergies.join(', ')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Epic-Style Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-blue-600/20 border border-blue-400/30 rounded-lg">
          <TabsTrigger value="summary" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BookOpen className="h-4 w-4 mr-1" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-1" />
            Notes ({patientRecords.length})
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Pill className="h-4 w-4 mr-1" />
            Meds ({patientMedications.length})
          </TabsTrigger>
          <TabsTrigger value="labs" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <TestTube className="h-4 w-4 mr-1" />
            Labs ({patientLabOrders.length})
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <ClipboardList className="h-4 w-4 mr-1" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="imaging" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-1" />
            Imaging ({patientImaging.length})
          </TabsTrigger>
          <TabsTrigger value="chart" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Stethoscope className="h-4 w-4 mr-1" />
            Full Chart
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <PatientSummaryCard 
            patient={patient} 
            allergies={allergies} 
            activeProblems={problemList?.filter(p => p.status === 'active')} 
            vitals={formattedVitals}
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <EpicClinicalNotes patientId={patientId} />
        </TabsContent>

        <TabsContent value="medications" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Current Medications</CardTitle>
              <Button size="sm" onClick={() => navigate(`/cpoe?patientId=${patientId}&tab=medications`)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Medication
              </Button>
            </CardHeader>
            <CardContent>
              {patientMedications.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No active medications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientMedications.map((med) => (
                    <div key={med.id} className="p-3 bg-white/5 rounded-lg">
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="mt-4">
          <EpicLabResultsTable patientId={patientId} />
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Active Orders</CardTitle>
              <Button size="sm" onClick={() => navigate(`/cpoe?patientId=${patientId}`)}>
                <Plus className="h-4 w-4 mr-1" />
                New Order
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientLabOrders.filter(o => o.status === 'ordered' || o.status === 'pending').map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">{order.test_name}</p>
                        <p className="text-white/60 text-sm">
                          Ordered: {new Date(order.ordered_at || '').toLocaleString()} • 
                          Priority: {order.priority} • 
                          Status: {order.status}
                        </p>
                      </div>
                    </div>
                    <Badge className={order.priority === 'stat' ? 'bg-red-600' : order.priority === 'urgent' ? 'bg-yellow-600' : 'bg-blue-600'}>
                      {order.priority}
                    </Badge>
                  </div>
                ))}
                {patientImaging.filter(o => o.status !== 'completed').map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{order.study_type} - {order.body_part}</p>
                        <p className="text-white/60 text-sm">
                          Ordered: {new Date(order.ordered_at || '').toLocaleString()} • 
                          Status: {order.status}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/60" />
                  </div>
                ))}
                {patientLabOrders.filter(o => o.status === 'ordered' || o.status === 'pending').length === 0 && 
                 patientImaging.filter(o => o.status !== 'completed').length === 0 && (
                  <div className="text-center py-8">
                    <ClipboardList className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No pending orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Imaging Studies</CardTitle>
              <Button size="sm" onClick={() => navigate(`/cpoe?patientId=${patientId}&tab=imaging`)}>
                <Plus className="h-4 w-4 mr-1" />
                Order Imaging
              </Button>
            </CardHeader>
            <CardContent>
              {patientImaging.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No imaging studies</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientImaging.map((study) => (
                    <div key={study.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{study.study_type} - {study.body_part}</h4>
                        <Badge className={study.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {study.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-white/80">
                        <p>Modality: {study.modality} • Ordered: {new Date(study.ordered_at || '').toLocaleDateString()}</p>
                        {study.findings && <p className="mt-2"><strong>Findings:</strong> {study.findings}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="mt-4">
          <PatientChart />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NewNoteDialog
        open={showNewNoteDialog}
        onClose={() => setShowNewNoteDialog(false)}
        patientId={patientId || ''}
        patientName={`${patient.first_name} ${patient.last_name}`}
      />
      
      <NewLabOrderDialog
        open={showNewLabDialog}
        onClose={() => setShowNewLabDialog(false)}
        patientId={patientId || ''}
        patientName={`${patient.first_name} ${patient.last_name}`}
      />
    </div>
  );
};

export default EpicPatientWorkspace;
