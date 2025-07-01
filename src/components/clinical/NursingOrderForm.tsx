
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Activity, Shield } from 'lucide-react';

interface NursingOrderFormProps {
  patientId: string;
  hospitalId: string;
  onSubmit: (data: any) => void;
}

const NursingOrderForm = ({ patientId, hospitalId, onSubmit }: NursingOrderFormProps) => {
  const [formData, setFormData] = useState({
    orderType: '',
    frequency: '',
    duration: '',
    specialInstructions: '',
    priority: 'routine'
  });

  const nursingOrderTypes = {
    'Vital Signs': [
      'Vital signs every 4 hours',
      'Vital signs every 2 hours',
      'Vital signs every hour',
      'Neurological checks every 2 hours',
      'Orthostatic vital signs',
      'Daily weights'
    ],
    'Activity': [
      'Bed rest',
      'Chair for meals',
      'Ambulate with assistance',
      'Physical therapy consult',
      'Fall precautions',
      'Turn and position every 2 hours'
    ],
    'Diet': [
      'NPO (nothing by mouth)',
      'Clear liquids only',
      'Full liquid diet',
      'Soft diet',
      'Regular diet',
      'Diabetic diet',
      'Low sodium diet',
      'Pureed diet'
    ],
    'Monitoring': [
      'Intake and output monitoring',
      'Blood glucose monitoring',
      'Oxygen saturation monitoring',
      'Cardiac monitoring',
      'Seizure precautions',
      'Suicide precautions'
    ],
    'Wound Care': [
      'Dressing change daily',
      'Wound assessment',
      'Wound culture',
      'Pressure ulcer prevention',
      'Skin integrity assessment'
    ],
    'Comfort': [
      'Pain assessment every 4 hours',
      'Comfort measures',
      'Heat/cold therapy',
      'Position for comfort',
      'Massage therapy'
    ]
  };

  const frequencies = [
    'Once', 'Every hour', 'Every 2 hours', 'Every 4 hours', 'Every 6 hours',
    'Every 8 hours', 'Every 12 hours', 'Daily', 'Twice daily', 'Three times daily',
    'As needed', 'With meals', 'At bedtime', 'Continuous'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderType) {
      alert('Please select an order type');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      orderType: '',
      frequency: '',
      duration: '',
      specialInstructions: '',
      priority: 'routine'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Nursing Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Order Category & Type</Label>
            
            <div className="space-y-4">
              {Object.entries(nursingOrderTypes).map(([category, orders]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {category}
                  </h4>
                  
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={order}
                          name="orderType"
                          value={order}
                          checked={formData.orderType === order}
                          onChange={(e) => setFormData(prev => ({ ...prev, orderType: e.target.value }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Label htmlFor={order} className="text-sm cursor-pointer">
                          {order}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Order Input */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="radio"
                  id="custom"
                  name="orderType"
                  value="custom"
                  checked={formData.orderType === 'custom'}
                  onChange={(e) => setFormData(prev => ({ ...prev, orderType: e.target.value }))}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="custom" className="font-medium cursor-pointer">
                  Custom Nursing Order
                </Label>
              </div>
              
              {formData.orderType === 'custom' && (
                <Input
                  placeholder="Enter custom nursing order..."
                  onChange={(e) => setFormData(prev => ({ ...prev, customOrder: e.target.value }))}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 24 hours, Until discontinued"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
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
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Additional instructions for nursing staff..."
              rows={3}
            />
          </div>

          {/* Safety Notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Nursing Communication</p>
              <p>All nursing orders will be communicated to the nursing staff and documented in the patient's care plan.</p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Submit Nursing Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NursingOrderForm;
