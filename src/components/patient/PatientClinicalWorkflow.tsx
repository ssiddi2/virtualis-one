
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
  Plus,
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
      description: "Opening charge capture interface...",
    });
  };

  const handleVitalSigns = () => {
    toast({
      title: "Vital Signs",
      description: "Recording new vital signs...",
    });
  };

  const pendingLabOrders = labOrders?.filter(order => order.status === 'ordered') || [];
  const pendingRadOrders = radiologyOrders?.filter(order => order.status === 'ordered') || [];
  const activeMedications = medications?.filter(med => med.status === 'active') || [];

  return (
    <div className="space-y-6">
      {/* Quick Action Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
              className="flex items-center gap-2"
              onClick={() => {
                toast({
                  title: "Medication Order",
                  description: "Opening medication ordering system...",
                });
              }}
            >
              <Pill className="h-4 w-4" />
              New Medication
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                toast({
                  title: "AI Assistant",
                  description: "Launching clinical AI assistant...",
                });
              }}
            >
              <Brain className="h-4 w-4" />
              AI Assistant
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                toast({
                  title: "Discharge Planning",
                  description: "Opening discharge planning tools...",
                });
              }}
            >
              <FileText className="h-4 w-4" />
              Discharge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Data Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">
            Notes ({medicalRecords?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="orders">
            Orders ({(pendingLabOrders.length + pendingRadOrders.length)})
          </TabsTrigger>
          <TabsTrigger value="medications">
            Meds ({activeMedications.length})
          </TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicalRecords?.length || 0}</div>
                <p className="text-sm text-muted-foreground">Documentation entries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingLabOrders.length + pendingRadOrders.length}</div>
                <p className="text-sm text-muted-foreground">Lab & imaging orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Pill className="h-4 w-4 text-green-500" />
                  Active Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeMedications.length}</div>
                <p className="text-sm text-muted-foreground">Current prescriptions</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Actions */}
          {(pendingLabOrders.length > 0 || pendingRadOrders.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Pending Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingLabOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm">Lab: {order.test_name}</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  ))}
                  {pendingRadOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">Imaging: {order.study_type}</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes & Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              {medicalRecords && medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{record.encounter_type}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {record.chief_complaint && (
                        <p className="text-sm mb-2"><strong>Chief Complaint:</strong> {record.chief_complaint}</p>
                      )}
                      {record.assessment && (
                        <p className="text-sm"><strong>Assessment:</strong> {record.assessment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No clinical notes found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Laboratory Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {labOrders && labOrders.length > 0 ? (
                  <div className="space-y-3">
                    {labOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{order.test_name}</h4>
                          <p className="text-sm text-gray-600">
                            Ordered: {new Date(order.ordered_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No lab orders found</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Radiology Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {radiologyOrders && radiologyOrders.length > 0 ? (
                  <div className="space-y-3">
                    {radiologyOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{order.study_type} - {order.body_part}</h4>
                          <p className="text-sm text-gray-600">
                            {order.modality} • Ordered: {new Date(order.ordered_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No radiology orders found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medications && medications.length > 0 ? (
                <div className="space-y-3">
                  {medications.map((medication) => (
                    <div key={medication.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{medication.medication_name}</h4>
                        <Badge variant={medication.status === 'active' ? 'default' : 'secondary'}>
                          {medication.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {medication.dosage} • {medication.frequency} • {medication.route}
                      </p>
                      {medication.indication && (
                        <p className="text-sm mt-1"><strong>Indication:</strong> {medication.indication}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No medications found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Lab Results & Imaging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">Results interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Charge Capture & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleChargeCapture} className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Open Charge Capture Interface
                </Button>
                <p className="text-gray-500 text-center">Billing information will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientClinicalWorkflow;
