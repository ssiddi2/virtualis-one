
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMedicationSafety } from '@/hooks/useMedicationSafety';
import { AlertTriangle, Shield, Search } from 'lucide-react';

interface MedicationOrderFormProps {
  patientId: string;
  hospitalId: string;
  onSubmit: (data: any) => void;
}

const MedicationOrderForm = ({ patientId, hospitalId, onSubmit }: MedicationOrderFormProps) => {
  const { toast } = useToast();
  const { validateMedication } = useMedicationSafety(patientId);
  const [formData, setFormData] = useState({
    medicationName: '',
    genericName: '',
    dosage: '',
    route: '',
    frequency: '',
    duration: '',
    quantity: '',
    refills: '0',
    indication: '',
    instructions: '',
    priority: 'routine'
  });
  const [safetyAlerts, setSafetyAlerts] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const commonMedications = [
    'Acetaminophen', 'Ibuprofen', 'Lisinopril', 'Metformin', 'Omeprazole',
    'Amlodipine', 'Metoprolol', 'Losartan', 'Simvastatin', 'Levothyroxine'
  ];

  const routes = [
    'Oral', 'IV', 'IM', 'SubQ', 'Topical', 'Inhalation', 'Rectal', 'Sublingual'
  ];

  const frequencies = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours',
    'As needed', 'Before meals', 'After meals', 'At bedtime'
  ];

  const handleMedicationChange = (medication: string) => {
    setFormData(prev => ({ ...prev, medicationName: medication }));
    
    // Run safety check
    if (medication) {
      const safety = validateMedication(medication, formData.dosage);
      setSafetyAlerts(safety);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicationName || !formData.dosage || !formData.route || !formData.frequency) {
      toast({
        title: "Incomplete Order",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Final safety check
    const safety = validateMedication(formData.medicationName, formData.dosage);
    if (!safety.isSafe) {
      toast({
        title: "Safety Alert",
        description: "Please review safety warnings before proceeding",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      medicationName: '',
      genericName: '',
      dosage: '',
      route: '',
      frequency: '',
      duration: '',
      quantity: '',
      refills: '0',
      indication: '',
      instructions: '',
      priority: 'routine'
    });
    setSafetyAlerts(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Medication Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Safety Alerts */}
        {safetyAlerts && safetyAlerts.warnings.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-red-700">Safety Alerts</span>
            </div>
            {safetyAlerts.warnings.map((warning: string, index: number) => (
              <Badge key={index} variant="destructive" className="mr-2 mb-2">
                {warning}
              </Badge>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medication Selection */}
            <div className="space-y-2">
              <Label htmlFor="medication">Medication Name *</Label>
              <div className="relative">
                <Input
                  id="medication"
                  value={formData.medicationName}
                  onChange={(e) => handleMedicationChange(e.target.value)}
                  placeholder="Search medications..."
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {/* Quick medication buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {commonMedications.slice(0, 6).map((med) => (
                  <Button
                    key={med}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMedicationChange(med)}
                  >
                    {med}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="generic">Generic Name</Label>
              <Input
                id="generic"
                value={formData.genericName}
                onChange={(e) => setFormData(prev => ({ ...prev, genericName: e.target.value }))}
                placeholder="Generic name (if different)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 500mg, 10mg/ml"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Route *</Label>
              <Select value={formData.route} onValueChange={(value) => setFormData(prev => ({ ...prev, route: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route} value={route}>{route}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
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
                placeholder="e.g., 7 days, 30 days"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="e.g., 30 tablets"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="refills">Refills</Label>
              <Select value={formData.refills} onValueChange={(value) => setFormData(prev => ({ ...prev, refills: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indication">Indication</Label>
            <Input
              id="indication"
              value={formData.indication}
              onChange={(e) => setFormData(prev => ({ ...prev, indication: e.target.value }))}
              placeholder="Reason for medication"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Additional instructions for patient or pharmacy"
              rows={3}
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

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add to Orders
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicationOrderForm;
