
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  TestTube, 
  Scan, 
  Pill, 
  Activity,
  DollarSign,
  Brain,
  Clock,
  AlertCircle
} from 'lucide-react';
import AIEnhancedNoteDialog from '@/components/forms/AIEnhancedNoteDialog';
import NewLabOrderDialog from '@/components/forms/NewLabOrderDialog';
import NewRadiologyOrderDialog from '@/components/forms/NewRadiologyOrderDialog';
import { useToast } from '@/hooks/use-toast';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useLabOrders } from '@/hooks/useLabOrders';
import { useRadiologyOrders } from '@/hooks/useRadiologyOrders';
import { useMedications } from '@/hooks/useMedications';

interface PatientClinicalWorkflowProps {
  patientId: string;
  hospitalId: string;
  patientName: string;
}

const PatientClinicalWorkflow = ({ patientId, hospitalId, patientName }: PatientClinicalWorkflowProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: medicalRecords } = useMedicalRecords(patientId);
  const { data: labOrders } = useLabOrders(patientId);
  const { data: radiologyOrders } = useRadiologyOrders(patientId);
  const { data: medications } = useMedications(patientId);

  const handleChargeCapture = () => {
    toast({
      title: "Charge Capture",
      description: "This would open the charge capture interface for billing codes and procedures.",
    });
  };

  const handleVitalSigns = () => {
    toast({
      title: "Vital Signs",
      description: "This would open a form to record new vital signs (BP, HR, temp, etc.).",
    });
  };

  const handleAIAssistant = () => {
    toast({
      title: "AI Clinical Assistant",
      description: "This would launch an AI-powered clinical decision support tool to help with diagnosis, treatment recommendations, and care planning.",
    });
  };

  const handleDischarge = () => {
    toast({
      title: "Discharge Planning",
      description: "This would open the discharge planning workflow including discharge summary, medications, follow-up appointments, and patient instructions.",
    });
  };

  const pendingLabOrders = labOrders?.filter(order => order.status === 'ordered') || [];
  const pendingRadOrders = radiologyOrders?.filter(order => order.status === 'ordered') || [];
  const activeMedications = medications?.filter(med => med.status === 'active') || [];

  return (
    <div className="space-y-6">
      {/* Quick Action Bar */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5" />
            Clinical Workflow - {patientName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <AIEnhancedNoteDialog 
              patientId={patientId} 
              hospitalId={hospitalId}
            />
            
            <NewLabOrderDialog patientId={patientId} />
            
            <NewRadiologyOrderDialog patientId={patientId} />
            
            <Button
              onClick={handleVitalSigns}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Activity className="h-4 w-4" />
              Vital Signs
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <Button
              onClick={handleChargeCapture}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <DollarSign className="h-4 w-4" />
              Charge Capture
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-700"
              onClick={() => {
                toast({
                  title: "Medication Order",
                  description: "This would open the medication ordering system with drug interaction checks and dosing guidance.",
                });
              }}
            >
              <Pill className="h-4 w-4" />
              New Medication
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-700"
              onClick={handleAIAssistant}
            >
              <Brain className="h-4 w-4" />
              AI Assistant
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-700"
              onClick={handleDischarge}
            >
              <FileText className="h-4 w-4" />
              Discharge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Data Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Overview</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
            Notes ({medicalRecords?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
            Orders ({(pendingLabOrders.length + pendingRadOrders.length)})
          </TabsTrigger>
          <TabsTrigger value="medications" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
            Meds ({activeMedications.length})
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Results</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <FileText className="h-4 w-4 text-blue-400" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{medicalRecords?.length || 0}</div>
                <p className="text-sm text-slate-400">Documentation entries</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4 text-orange-400" />
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{pendingLabOrders.length + pendingRadOrders.length}</div>
                <p className="text-sm text-slate-400">Lab & imaging orders</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Pill className="h-4 w-4 text-green-400" />
                  Active Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{activeMedications.length}</div>
                <p className="text-sm text-slate-400">Current prescriptions</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Actions */}
          {(pendingLabOrders.length > 0 || pendingRadOrders.length > 0) && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <AlertCircle className="h-5 w-5" />
                  Pending Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingLabOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-orange-600/20 rounded border border-orange-600/30">
                      <span className="text-sm text-slate-300">Lab: {order.test_name}</span>
                      <Badge variant="outline" className="border-orange-600/30 text-orange-300">Pending</Badge>
                    </div>
                  ))}
                  {pendingRadOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-blue-600/20 rounded border border-blue-600/30">
                      <span className="text-sm text-slate-300">Imaging: {order.study_type}</span>
                      <Badge variant="outline" className="border-blue-600/30 text-blue-300">Pending</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Clinical Notes & Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              {medicalRecords && medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-white">{record.encounter_type}</h3>
                        <span className="text-sm text-slate-400">
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {record.chief_complaint && (
                        <p className="text-sm mb-2 text-slate-300"><strong>Chief Complaint:</strong> {record.chief_complaint}</p>
                      )}
                      {record.assessment && (
                        <p className="text-sm text-slate-300"><strong>Assessment:</strong> {record.assessment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No clinical notes found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TestTube className="h-5 w-5" />
                  Laboratory Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {labOrders && labOrders.length > 0 ? (
                  <div className="space-y-3">
                    {labOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border border-slate-600 rounded bg-slate-700/30">
                        <div>
                          <h4 className="font-medium text-white">{order.test_name}</h4>
                          <p className="text-sm text-slate-400">
                            Ordered: {new Date(order.ordered_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} 
                               className={order.status === 'completed' ? 'bg-green-600/20 text-green-300 border-green-600/30' : 'bg-slate-600/20 text-slate-300 border-slate-600/30'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-4">No lab orders found</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Scan className="h-5 w-5" />
                  Radiology Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {radiologyOrders && radiologyOrders.length > 0 ? (
                  <div className="space-y-3">
                    {radiologyOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border border-slate-600 rounded bg-slate-700/30">
                        <div>
                          <h4 className="font-medium text-white">{order.study_type} - {order.body_part}</h4>
                          <p className="text-sm text-slate-400">
                            {order.modality} • Ordered: {new Date(order.ordered_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}
                               className={order.status === 'completed' ? 'bg-green-600/20 text-green-300 border-green-600/30' : 'bg-slate-600/20 text-slate-300 border-slate-600/30'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-4">No radiology orders found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Pill className="h-5 w-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medications && medications.length > 0 ? (
                <div className="space-y-3">
                  {medications.map((medication) => (
                    <div key={medication.id} className="border border-slate-600 rounded-lg p-3 bg-slate-700/30">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{medication.medication_name}</h4>
                        <Badge variant={medication.status === 'active' ? 'default' : 'secondary'}
                               className={medication.status === 'active' ? 'bg-green-600/20 text-green-300 border-green-600/30' : 'bg-slate-600/20 text-slate-300 border-slate-600/30'}>
                          {medication.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">
                        {medication.dosage} • {medication.frequency} • {medication.route}
                      </p>
                      {medication.indication && (
                        <p className="text-sm mt-1 text-slate-300"><strong>Indication:</strong> {medication.indication}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No medications found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Lab Results & Imaging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-center py-8">Results interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5" />
                Charge Capture & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleChargeCapture} className="w-full bg-purple-600 hover:bg-purple-700">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Open Charge Capture Interface
                </Button>
                <p className="text-slate-400 text-center">Billing information will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientClinicalWorkflow;
