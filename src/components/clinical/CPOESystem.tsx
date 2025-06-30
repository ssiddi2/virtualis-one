import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Pill, 
  Activity, 
  Camera,
  Stethoscope,
  Utensils,
  Play,
  AlertTriangle,
  Plus,
  Search,
  Clock,
  User
} from 'lucide-react';
import { useCreateClinicalOrder } from '@/hooks/useClinicalOrders';
import { useToast } from '@/hooks/use-toast';

interface CPOESystemProps {
  patientId: string;
  providerId: string;
}

const CPOESystem = ({ patientId, providerId }: CPOESystemProps) => {
  const [activeTab, setActiveTab] = useState('medication');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const createOrder = useCreateClinicalOrder();

  // Mock order sets
  const orderSets = [
    {
      id: 1,
      name: 'Chest Pain Protocol',
      orders: ['ECG', 'Troponin I', 'CBC', 'BMP', 'PT/PTT', 'Chest X-ray']
    },
    {
      id: 2,
      name: 'Post-Op Hip Replacement',
      orders: ['DVT Prophylaxis', 'Pain Management', 'PT/OT', 'CBC daily']
    },
    {
      id: 3,
      name: 'Diabetes Management',
      orders: ['Blood glucose monitoring', 'Insulin sliding scale', 'HbA1c', 'Diabetic diet']
    }
  ];

  // Mock medication database
  const medications = [
    { name: 'Metformin', strength: '500mg', form: 'Tablet' },
    { name: 'Lisinopril', strength: '10mg', form: 'Tablet' },
    { name: 'Atorvastatin', strength: '20mg', form: 'Tablet' },
    { name: 'Amlodipine', strength: '5mg', form: 'Tablet' },
    { name: 'Insulin Glargine', strength: '100 units/mL', form: 'Injection' }
  ];

  // Mock lab tests
  const labTests = [
    'CBC with Differential',
    'Basic Metabolic Panel',
    'Comprehensive Metabolic Panel',
    'Lipid Panel',
    'Thyroid Function Tests',
    'HbA1c',
    'Troponin I',
    'PT/PTT/INR',
    'Urinalysis'
  ];

  // Mock imaging studies
  const imagingStudies = [
    'Chest X-ray',
    'CT Head without contrast',
    'CT Chest with contrast',
    'MRI Brain',
    'Echocardiogram',
    'Ultrasound Abdomen',
    'Mammography'
  ];

  const handleSubmitOrder = async (orderData: any) => {
    try {
      await createOrder.mutateAsync({
        patient_id: patientId,
        ordering_provider_id: providerId,
        ...orderData
      });
      
      toast({
        title: "Order Submitted",
        description: `${orderData.order_type} order has been successfully submitted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Computerized Provider Order Entry (CPOE)</h1>
            <p className="text-white/70">Create and manage clinical orders • Patient ID: {patientId}</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Search className="h-4 w-4 mr-2" />
              Order Sets
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Drug Interactions
            </Button>
          </div>
        </div>

        {/* Quick Order Sets */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Order Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {orderSets.map((orderSet) => (
                <Card key={orderSet.id} className="bg-blue-600/10 border border-blue-400/30 hover:bg-blue-600/20 cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold mb-2">{orderSet.name}</h3>
                    <div className="space-y-1">
                      {orderSet.orders.slice(0, 3).map((order, index) => (
                        <div key={index} className="text-white/70 text-sm">• {order}</div>
                      ))}
                      {orderSet.orders.length > 3 && (
                        <div className="text-white/50 text-sm">... and {orderSet.orders.length - 3} more</div>
                      )}
                    </div>
                    <Button size="sm" className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-3 w-3 mr-2" />
                      Add Order Set
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Entry Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-blue-600/20 border border-blue-400/30 rounded-lg">
            <TabsTrigger value="medication" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="lab" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Lab Orders
            </TabsTrigger>
            <TabsTrigger value="imaging" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Camera className="h-4 w-4 mr-2" />
              Imaging
            </TabsTrigger>
            <TabsTrigger value="nursing" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Stethoscope className="h-4 w-4 mr-2" />
              Nursing
            </TabsTrigger>
            <TabsTrigger value="diet" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Utensils className="h-4 w-4 mr-2" />
              Diet
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Play className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medication" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Medication Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Search Medication</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                      <Input
                        placeholder="Search medications..."
                        className="pl-10 bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {medications.map((med, index) => (
                        <div key={index} className="p-2 bg-blue-600/10 border border-blue-400/30 rounded cursor-pointer hover:bg-blue-600/20">
                          <div className="text-white font-medium">{med.name}</div>
                          <div className="text-white/60 text-sm">{med.strength} {med.form}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-white">Dosage</Label>
                        <Input className="bg-blue-600/20 border-blue-400/30 text-white" placeholder="e.g., 500mg" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Route</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="po">PO (By mouth)</SelectItem>
                            <SelectItem value="iv">IV (Intravenous)</SelectItem>
                            <SelectItem value="im">IM (Intramuscular)</SelectItem>
                            <SelectItem value="sc">SC (Subcutaneous)</SelectItem>
                            <SelectItem value="topical">Topical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-white">Frequency</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="qd">Once daily</SelectItem>
                            <SelectItem value="bid">Twice daily</SelectItem>
                            <SelectItem value="tid">Three times daily</SelectItem>
                            <SelectItem value="qid">Four times daily</SelectItem>
                            <SelectItem value="prn">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Priority</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="stat">STAT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Special Instructions</Label>
                      <Textarea 
                        className="bg-blue-600/20 border-blue-400/30 text-white"
                        placeholder="Enter any special instructions..."
                      />
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleSubmitOrder({
                        order_type: 'medication',
                        order_details: { medication: 'Sample medication order' },
                        priority: 'routine'
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Medication Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Laboratory Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Available Lab Tests</Label>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {labTests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-600/10 border border-blue-400/30 rounded">
                          <span className="text-white">{test}</span>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Priority</Label>
                      <Select>
                        <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="stat">STAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Collection Date/Time</Label>
                      <Input 
                        type="datetime-local"
                        className="bg-blue-600/20 border-blue-400/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Clinical Indication</Label>
                      <Textarea 
                        className="bg-blue-600/20 border-blue-400/30 text-white"
                        placeholder="Enter clinical indication for tests..."
                      />
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleSubmitOrder({
                        order_type: 'lab',
                        order_details: { tests: 'Sample lab orders' },
                        priority: 'routine'
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Lab Orders
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imaging" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Imaging Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Available Imaging Studies</Label>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {imagingStudies.map((study, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-600/10 border border-blue-400/30 rounded">
                          <span className="text-white">{study}</span>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Priority</Label>
                      <Select>
                        <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="stat">STAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Contrast</Label>
                      <Select>
                        <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                          <SelectValue placeholder="Contrast required?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No contrast</SelectItem>
                          <SelectItem value="with">With contrast</SelectItem>
                          <SelectItem value="without">Without contrast</SelectItem>
                          <SelectItem value="both">With and without contrast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Clinical Indication</Label>
                      <Textarea 
                        className="bg-blue-600/20 border-blue-400/30 text-white"
                        placeholder="Enter clinical indication for imaging..."
                      />
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleSubmitOrder({
                        order_type: 'imaging',
                        order_details: { study: 'Sample imaging order' },
                        priority: 'routine'
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Imaging Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would follow similar patterns */}
          <TabsContent value="nursing" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardContent className="text-center text-white/60 py-8">
                Nursing orders interface coming soon
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardContent className="text-center text-white/60 py-8">
                Diet orders interface coming soon
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardContent className="text-center text-white/60 py-8">
                Activity orders interface coming soon
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CPOESystem;
