import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { Scan, Brain, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewRadiologyOrderDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

interface RadiologyProcedure {
  value: string;
  label: string;
}

const procedureOptions: RadiologyProcedure[] = [
  { value: 'xray', label: 'X-Ray' },
  { value: 'ctscan', label: 'CT Scan' },
  { value: 'mri', label: 'MRI' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'mammogram', label: 'Mammogram' },
  { value: 'fluoroscopy', label: 'Fluoroscopy' },
  { value: 'angiography', label: 'Angiography' },
  { value: 'petscan', label: 'PET Scan' },
  { value: 'boneDensity', label: 'Bone Density Scan' },
  { value: 'echocardiogram', label: 'Echocardiogram' },
];

const NewRadiologyOrderDialog = ({ open, onClose, patientId, patientName }: NewRadiologyOrderDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [procedure, setProcedure] = useState('');
  const [urgency, setUrgency] = useState('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const urgencyOptions = [
    { value: 'routine', label: 'Routine' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'stat', label: 'STAT' },
  ];

  const handleGenerateSuggestions = async () => {
    setLoadingSuggestions(true);
    // Simulate AI suggestion generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAiSuggestions([
      "Evaluate for possible fracture.",
      "Assess soft tissue injury.",
      "Rule out acute pathology."
    ]);
    setLoadingSuggestions(false);
  };

  const handleSubmit = () => {
    if (!procedure) {
      toast({
        title: "Missing Information",
        description: "Please select a radiology procedure.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Radiology Order Placed",
      description: `New ${procedure} order placed for ${patientName}.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Radiology Order</DialogTitle>
        </DialogHeader>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Patient Name:</span> {patientName}
              </p>
              <p>
                <span className="font-semibold">Patient ID:</span> {patientId}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="procedure">Procedure</Label>
            <Select onValueChange={setProcedure}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a procedure" />
              </SelectTrigger>
              <SelectContent>
                {procedureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <Select onValueChange={setUrgency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {urgencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="clinicalNotes">Clinical Notes</Label>
            <Textarea
              id="clinicalNotes"
              placeholder="Enter clinical notes"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>AI Clinical Suggestions</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateSuggestions}
                disabled={loadingSuggestions}
              >
                {loadingSuggestions ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </div>
            <Card className="mt-2">
              <CardContent>
                {aiSuggestions.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No suggestions generated.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" onClick={handleSubmit}>
            Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewRadiologyOrderDialog;
