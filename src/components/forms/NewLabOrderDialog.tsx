
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TestTube, Brain, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LabOrder {
  id: string;
  name: string;
}

interface NewLabOrderDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const labOrders: LabOrder[] = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)' },
  { id: 'cmp', name: 'Comprehensive Metabolic Panel (CMP)' },
  { id: 'lipid', name: 'Lipid Panel' },
  { id: 'a1c', name: 'Hemoglobin A1c' },
  { id: 'ua', name: 'Urinalysis' },
];

const NewLabOrderDialog = ({ open, onClose, patientId, patientName }: NewLabOrderDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedLabOrder, setSelectedLabOrder] = useState<string>('');
  const [priority, setPriority] = useState<string>('routine');
  const [notes, setNotes] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleOrder = () => {
    if (!selectedLabOrder) {
      toast({
        title: 'Missing Information',
        description: 'Please select a lab order to proceed.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate AI suggestions (replace with actual AI integration)
    const suggestions = [
      `Consider patient's history of ${patientName} for lab interpretation.`,
      'Check for any potential drug interactions.',
      'Monitor kidney function closely.',
    ];
    setAiSuggestions(suggestions);

    toast({
      title: 'Lab Order Placed',
      description: `New order for ${
        labOrders.find((order) => order.id === selectedLabOrder)?.name
      } has been placed for ${patientName}.`,
    });
    onClose();
  };

  const handleAISuggestions = () => {
    // Simulate AI analysis and suggestions (replace with actual AI integration)
    const suggestions = [
      'Monitor kidney function closely.',
      'Check for any potential drug interactions.',
      `Consider patient's history of ${patientName} for lab interpretation.`,
    ];
    setAiSuggestions(suggestions);

    toast({
      title: 'AI Analysis Complete',
      description: 'AI has provided suggestions for this lab order.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Lab Order for {patientName}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labOrder">Lab Order</Label>
              <Select onValueChange={setSelectedLabOrder}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select Lab Order" />
                </SelectTrigger>
                <SelectContent>
                  {labOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={setPriority} defaultValue={priority}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select Priority" />
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleAISuggestions} className="bg-blue-500 text-white">
            <Brain className="mr-2 h-4 w-4" />
            Get AI Suggestions
          </Button>

          {aiSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Button type="submit" onClick={handleOrder}>
          Place Order
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewLabOrderDialog;
