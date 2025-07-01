
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardList, Search, Heart, Stethoscope, Brain } from 'lucide-react';

interface OrderSetsLibraryProps {
  patientId: string;
  hospitalId: string;
  onOrderSetSelect: (orders: any[]) => void;
}

const OrderSetsLibrary = ({ patientId, hospitalId, onOrderSetSelect }: OrderSetsLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderSet, setSelectedOrderSet] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const orderSets = [
    {
      id: 'chest-pain',
      name: 'Chest Pain Evaluation',
      specialty: 'Cardiology',
      description: 'Standard workup for chest pain patients',
      icon: Heart,
      orders: [
        { id: '1', type: 'lab', name: 'Troponin I', category: 'Cardiac Markers' },
        { id: '2', type: 'lab', name: 'CK-MB', category: 'Cardiac Markers' },
        { id: '3', type: 'lab', name: 'BNP', category: 'Cardiac Markers' },
        { id: '4', type: 'imaging', name: 'Chest X-Ray', category: 'Imaging' },
        { id: '5', type: 'imaging', name: 'EKG', category: 'Cardiac Testing' },
        { id: '6', type: 'medication', name: 'Aspirin 81mg PO daily', category: 'Medications' },
        { id: '7', type: 'nursing', name: 'Cardiac monitoring', category: 'Nursing' },
        { id: '8', type: 'nursing', name: 'Vital signs every 4 hours', category: 'Nursing' }
      ]
    },
    {
      id: 'pneumonia',
      name: 'Community Acquired Pneumonia',
      specialty: 'Pulmonology',
      description: 'Standard treatment for CAP patients',
      icon: Stethoscope,
      orders: [
        { id: '9', type: 'lab', name: 'CBC with differential', category: 'Laboratory' },
        { id: '10', type: 'lab', name: 'CRP', category: 'Inflammatory Markers' },
        { id: '11', type: 'lab', name: 'Blood Culture x2', category: 'Cultures' },
        { id: '12', type: 'imaging', name: 'Chest X-Ray', category: 'Imaging' },
        { id: '13', type: 'medication', name: 'Azithromycin 500mg PO daily', category: 'Antibiotics' },
        { id: '14', type: 'medication', name: 'Ceftriaxone 1g IV daily', category: 'Antibiotics' },
        { id: '15', type: 'nursing', name: 'Oxygen saturation monitoring', category: 'Nursing' },
        { id: '16', type: 'nursing', name: 'Incentive spirometry', category: 'Nursing' }
      ]
    },
    {
      id: 'stroke',
      name: 'Acute Stroke Protocol',
      specialty: 'Neurology',
      description: 'Rapid evaluation and treatment for stroke',
      icon: Brain,
      orders: [
        { id: '17', type: 'imaging', name: 'CT Head without contrast STAT', category: 'Imaging' },
        { id: '18', type: 'lab', name: 'PT/INR', category: 'Coagulation' },
        { id: '19', type: 'lab', name: 'PTT', category: 'Coagulation' },
        { id: '20', type: 'lab', name: 'Glucose', category: 'Basic Labs' },
        { id: '21', type: 'nursing', name: 'Neurological checks every 15 minutes', category: 'Nursing' },
        { id: '22', type: 'nursing', name: 'NPO status', category: 'Diet' },
        { id: '23', type: 'nursing', name: 'Blood pressure monitoring', category: 'Nursing' }
      ]
    }
  ];

  const filteredOrderSets = orderSets.filter(set =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderSetSelect = (orderSetId: string) => {
    setSelectedOrderSet(orderSetId);
    const orderSet = orderSets.find(set => set.id === orderSetId);
    if (orderSet) {
      setSelectedOrders(orderSet.orders.map(order => order.id));
    }
  };

  const handleOrderToggle = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleApplyOrderSet = () => {
    if (!selectedOrderSet) return;

    const orderSet = orderSets.find(set => set.id === selectedOrderSet);
    if (!orderSet) return;

    const ordersToApply = orderSet.orders.filter(order => 
      selectedOrders.includes(order.id)
    );

    onOrderSetSelect(ordersToApply);
    
    // Reset selections
    setSelectedOrderSet(null);
    setSelectedOrders([]);
  };

  const selectedOrderSetData = orderSets.find(set => set.id === selectedOrderSet);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search order sets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Sets List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available Order Sets</h3>
          
          {filteredOrderSets.map((orderSet) => (
            <Card 
              key={orderSet.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedOrderSet === orderSet.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleOrderSetSelect(orderSet.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <orderSet.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{orderSet.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{orderSet.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{orderSet.specialty}</Badge>
                      <Badge variant="secondary">{orderSet.orders.length} orders</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Set Details */}
        <div>
          {selectedOrderSetData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-orange-500" />
                  {selectedOrderSetData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{selectedOrderSetData.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Select Orders to Include</h4>
                    <Badge variant="outline">
                      {selectedOrders.length} of {selectedOrderSetData.orders.length} selected
                    </Badge>
                  </div>

                  {/* Group orders by category */}
                  {Object.entries(
                    selectedOrderSetData.orders.reduce((acc, order) => {
                      if (!acc[order.category]) acc[order.category] = [];
                      acc[order.category].push(order);
                      return acc;
                    }, {} as Record<string, any[]>)
                  ).map(([category, orders]) => (
                    <div key={category} className="space-y-2">
                      <h5 className="font-medium text-sm text-gray-700 border-b pb-1">
                        {category}
                      </h5>
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center space-x-2 pl-4">
                          <Checkbox
                            id={order.id}
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => handleOrderToggle(order.id)}
                          />
                          <label htmlFor={order.id} className="text-sm cursor-pointer flex-1">
                            {order.name}
                          </label>
                          <Badge variant="outline" className="text-xs">
                            {order.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedOrderSet(null);
                      setSelectedOrders([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyOrderSet}
                    disabled={selectedOrders.length === 0}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Apply Selected Orders ({selectedOrders.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select an order set to view and customize its orders</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSetsLibrary;
