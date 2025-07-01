
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MedicationOrderForm from './MedicationOrderForm';
import LabOrderForm from './LabOrderForm';
import ImagingOrderForm from './ImagingOrderForm';
import NursingOrderForm from './NursingOrderForm';
import OrderSetsLibrary from './OrderSetsLibrary';
import { 
  Pill, 
  TestTube, 
  Scan, 
  Heart, 
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

interface EnhancedCPOESystemProps {
  patientId: string;
  patientName: string;
  hospitalId: string;
}

const EnhancedCPOESystem = ({ patientId, patientName, hospitalId }: EnhancedCPOESystemProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('medications');
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  const orderTypes = [
    { id: 'medications', label: 'Medications', icon: Pill, color: 'bg-blue-500' },
    { id: 'laboratory', label: 'Laboratory', icon: TestTube, color: 'bg-green-500' },
    { id: 'imaging', label: 'Imaging', icon: Scan, color: 'bg-purple-500' },
    { id: 'nursing', label: 'Nursing', icon: Heart, color: 'bg-red-500' },
    { id: 'ordersets', label: 'Order Sets', icon: ClipboardList, color: 'bg-orange-500' }
  ];

  const handleOrderSubmit = (orderData: any, orderType: string) => {
    const newOrder = {
      id: Date.now().toString(),
      type: orderType,
      data: orderData,
      status: 'pending',
      timestamp: new Date(),
      providerId: profile?.id,
      providerName: `${profile?.first_name} ${profile?.last_name}`
    };
    
    setPendingOrders(prev => [...prev, newOrder]);
    
    toast({
      title: "Order Created",
      description: `${orderType} order has been added to pending orders`,
    });
  };

  const handleBatchSign = () => {
    setPendingOrders(prev => 
      prev.map(order => ({ ...order, status: 'active', signedAt: new Date() }))
    );
    
    toast({
      title: "Orders Signed",
      description: `${pendingOrders.length} orders have been electronically signed and activated`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clinical Orders (CPOE)</h1>
              <p className="text-gray-600 mt-1">Patient: {patientName}</p>
            </div>
            {pendingOrders.length > 0 && (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-orange-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {pendingOrders.length} Pending Orders
                </Badge>
                <Button onClick={handleBatchSign} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Sign All Orders
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Order Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Types</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {orderTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                        activeTab === type.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${type.color} text-white`}>
                        <type.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Orders Summary */}
            {pendingOrders.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Pending Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="p-2 bg-orange-50 rounded border">
                        <div className="text-sm font-medium">{order.type}</div>
                        <div className="text-xs text-gray-600">
                          {order.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Forms */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="medications">
                <MedicationOrderForm
                  patientId={patientId}
                  hospitalId={hospitalId}
                  onSubmit={(data) => handleOrderSubmit(data, 'Medication')}
                />
              </TabsContent>
              
              <TabsContent value="laboratory">
                <LabOrderForm
                  patientId={patientId}
                  hospitalId={hospitalId}
                  onSubmit={(data) => handleOrderSubmit(data, 'Laboratory')}
                />
              </TabsContent>
              
              <TabsContent value="imaging">
                <ImagingOrderForm
                  patientId={patientId}
                  hospitalId={hospitalId}
                  onSubmit={(data) => handleOrderSubmit(data, 'Imaging')}
                />
              </TabsContent>
              
              <TabsContent value="nursing">
                <NursingOrderForm
                  patientId={patientId}
                  hospitalId={hospitalId}
                  onSubmit={(data) => handleOrderSubmit(data, 'Nursing')}
                />
              </TabsContent>
              
              <TabsContent value="ordersets">
                <OrderSetsLibrary
                  patientId={patientId}
                  hospitalId={hospitalId}
                  onOrderSetSelect={(orders) => {
                    orders.forEach(order => handleOrderSubmit(order, 'Order Set'));
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCPOESystem;
