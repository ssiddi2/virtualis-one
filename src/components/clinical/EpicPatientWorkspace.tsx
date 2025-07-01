import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  ClipboardList
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useLabOrders } from '@/hooks/useLabOrders';
import { useMedications } from '@/hooks/useMedications';
import { useProblemList } from '@/hooks/useProblemList';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useToast } from '@/hooks/use-toast';
import PatientChart from '@/components/patient/PatientChart';
import NewNoteDialog from '@/components/forms/NewNoteDialog';
import NewLabOrderDialog from '@/components/forms/NewLabOrderDialog';
import PatientSummaryCard from '@/components/clinical/PatientSummaryCard';

const EpicPatientWorkspace = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [searchParams] = useSearchParams();
  const initialAction = searchParams.get('action') || 'summary';
  const [activeTab, setActiveTab] = useState(initialAction);
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const [showNewLabDialog, setShowNewLabDialog] = useState(false);
  const { toast } = useToast();

  const { data: patients } = usePatients();
  const { data: labOrders } = useLabOrders(patientId);
  const { data: medications } = useMedications();
  const { data: problemList } = useProblemList(patientId);
  const { data: allergies } = useAllergies(patientId);
  const { data: medicalRecords } = useMedicalRecords();

  const patient = patients?.find(p => p.id === patientId);
  const patientLabOrders = labOrders?.filter(lab => lab.patient_id === patientId);
  const patientMedications = medications?.filter(med => med.patient_id === patientId);
  const patientRecords = medicalRecords?.filter(record => record.patient_id === patientId);

  useEffect(() => {
    if (initialAction && initialAction !== activeTab) {
      setActiveTab(initialAction);
    }
  }, [initialAction]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white">Patient not found</p>
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
        toast({
          title: "Order Entry",
          description: "Opening computerized provider order entry...",
        });
        break;
      default:
        setActiveTab(action);
    }
  };

  return (
    <div className="space-y-4">
      {/* Epic-Style Patient Banner - Always Visible */}
      <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl sticky top-0 z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-300" />
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
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{patient.phone || 'No phone'}</span>
                </div>
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
                New Order
              </Button>
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

      {/* Epic-Style Tabbed Interface - Updated for Inpatient Rounding */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-blue-600/20 border border-blue-400/30 rounded-lg">
          <TabsTrigger value="summary" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BookOpen className="h-4 w-4 mr-1" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-1" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Pill className="h-4 w-4 mr-1" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="labs" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <TestTube className="h-4 w-4 mr-1" />
            Labs
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <ClipboardList className="h-4 w-4 mr-1" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="imaging" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-1" />
            Imaging
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
            vitals={{
              blood_pressure: '128/82',
              heart_rate: '72',
              temperature: '98.6',
              oxygen_saturation: '98'
            }}
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Previous Clinical Notes - Inpatient Rounding
                <Button 
                  onClick={() => setShowNewNoteDialog(true)}
                  className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Progress Note
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientRecords?.sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()).map((record) => (
                <div key={record.id} className="p-4 bg-white/5 rounded-lg border border-blue-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{record.encounter_type}</h3>
                      <p className="text-white/60 text-sm">
                        {new Date(record.visit_date).toLocaleDateString()} at {new Date(record.visit_date).toLocaleTimeString()}
                      </p>
                    </div>
                    {record.ai_coding_suggestions && (
                      <Badge className="bg-purple-600 text-white">
                        AI Enhanced ({record.coding_confidence_score}% confidence)
                      </Badge>
                    )}
                  </div>
                  
                  {/* Structured Note Display for Rounding */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.chief_complaint && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-sm border-b border-blue-400/30 pb-1">Chief Complaint</h4>
                        <p className="text-white/80 text-sm">{record.chief_complaint}</p>
                      </div>
                    )}
                    
                    {record.assessment && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-sm border-b border-blue-400/30 pb-1">Assessment</h4>
                        <p className="text-white/80 text-sm">{record.assessment}</p>
                      </div>
                    )}
                    
                    {record.plan && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-sm border-b border-blue-400/30 pb-1">Plan</h4>
                        <p className="text-white/80 text-sm">{record.plan}</p>
                      </div>
                    )}
                    
                    {record.physical_examination && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-sm border-b border-blue-400/30 pb-1">Physical Exam</h4>
                        <p className="text-white/80 text-sm">{record.physical_examination}</p>
                      </div>
                    )}
                  </div>

                  {record.ai_coding_suggestions && (
                    <div className="mt-4 p-3 bg-purple-600/20 rounded border border-purple-400/30">
                      <h4 className="text-purple-200 font-medium mb-2 text-sm">AI Clinical Insights:</h4>
                      <div className="text-purple-100 text-xs">
                        <pre className="whitespace-pre-wrap font-mono">
                          {JSON.stringify(record.ai_coding_suggestions, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(!patientRecords || patientRecords.length === 0) && (
                <div className="text-center text-white/60 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No clinical notes available</p>
                  <Button 
                    onClick={() => setShowNewNoteDialog(true)}
                    className="mt-4 bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
                  >
                    Create First Progress Note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Current Medications - Inpatient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientMedications?.map((med) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Laboratory Results
                <Button 
                  onClick={() => setShowNewLabDialog(true)}
                  className="bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30"
                >
                  <TestTube className="h-4 w-4 mr-1" />
                  Order Lab
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientLabOrders?.map((lab) => (
                  <div key={lab.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{lab.test_name}</h4>
                      <Badge className={lab.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                        {lab.status}
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm">
                      Ordered: {lab.ordered_at ? new Date(lab.ordered_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">CBC with Differential</p>
                      <p className="text-white/60 text-sm">Ordered: Today 8:00 AM • Status: Pending</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/60" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Chest X-Ray</p>
                      <p className="text-white/60 text-sm">Ordered: Today 10:30 AM • Status: Scheduled</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/60" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging" className="mt-4">
          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Imaging Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No imaging studies available</p>
                <Button 
                  className="mt-4 bg-orange-600/20 border border-orange-400/30 text-white hover:bg-orange-500/30"
                  onClick={() => handleQuickAction('new-order')}
                >
                  Order Imaging Study
                </Button>
              </div>
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
