import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { TestTube, Brain, Clock, User, Sparkles, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateMultipleLabOrders } from '@/hooks/useCreateLabOrder';

interface NewLabOrderDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

interface LabTest {
  code: string;
  name: string;
  category: string;
}

const labTests: LabTest[] = [
  { code: 'CBC', name: 'Complete Blood Count', category: 'Hematology' },
  { code: 'BMP', name: 'Basic Metabolic Panel', category: 'Chemistry' },
  { code: 'CMP', name: 'Comprehensive Metabolic Panel', category: 'Chemistry' },
  { code: 'LIPID', name: 'Lipid Panel', category: 'Chemistry' },
  { code: 'TSH', name: 'Thyroid Stimulating Hormone', category: 'Endocrine' },
  { code: 'HBA1C', name: 'Hemoglobin A1C', category: 'Chemistry' },
  { code: 'PT/INR', name: 'Prothrombin Time/INR', category: 'Coagulation' },
  { code: 'TROP', name: 'Troponin I', category: 'Cardiac' },
  { code: 'BNP', name: 'B-Type Natriuretic Peptide', category: 'Cardiac' },
  { code: 'LACT', name: 'Lactic Acid', category: 'Chemistry' },
  { code: 'ABG', name: 'Arterial Blood Gas', category: 'Blood Gas' },
  { code: 'UA', name: 'Urinalysis', category: 'Urine' },
];

const NewLabOrderDialog = ({ open, onClose, patientId, patientName }: NewLabOrderDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const createLabOrders = useCreateMultipleLabOrders();
  
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState('routine');
  const [clinicalIndication, setClinicalIndication] = useState('');
  const [isAIAssistEnabled, setIsAIAssistEnabled] = useState(true);

  const handleTestToggle = (testCode: string) => {
    setSelectedTests(prev => 
      prev.includes(testCode) 
        ? prev.filter(code => code !== testCode)
        : [...prev, testCode]
    );
  };

  const handleSubmit = async () => {
    if (selectedTests.length === 0) {
      toast({
        title: "Required",
        description: "Please select at least one lab test.",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to place orders.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orders = selectedTests.map(testCode => {
        const test = labTests.find(t => t.code === testCode);
        return {
          patient_id: patientId,
          ordered_by: profile.id,
          test_name: test?.name || testCode,
          test_code: testCode,
          priority: priority,
          status: 'ordered',
          notes: clinicalIndication || null,
        };
      });

      await createLabOrders.mutateAsync(orders);

      toast({
        title: "Lab Orders Submitted",
        description: `${selectedTests.length} lab test(s) ordered for ${patientName}`,
      });

      // Reset form
      setSelectedTests([]);
      setPriority('routine');
      setClinicalIndication('');
      onClose();
    } catch (error) {
      console.error('Error creating lab orders:', error);
      toast({
        title: "Error",
        description: "Failed to submit lab orders. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAIAssistToggle = () => {
    setIsAIAssistEnabled(!isAIAssistEnabled);
  };

  // Quick order panels
  const quickPanels = [
    { name: 'Admission Panel', tests: ['CBC', 'BMP', 'UA'] },
    { name: 'Cardiac Workup', tests: ['TROP', 'BNP', 'CMP'] },
    { name: 'Sepsis Panel', tests: ['CBC', 'LACT', 'BMP', 'ABG'] },
  ];

  const applyQuickPanel = (tests: string[]) => {
    setSelectedTests(prev => {
      const newTests = tests.filter(t => !prev.includes(t));
      return [...prev, ...newTests];
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-400" />
              Laboratory Order Entry
            </div>
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  {patientName}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${isAIAssistEnabled ? 'bg-green-600/20 text-green-300 border-green-600' : 'bg-slate-700 text-slate-300 border-slate-600'}`}
                  onClick={handleAIAssistToggle}
                >
                  <Sparkles className="h-4 w-4" />
                  {isAIAssistEnabled ? 'AI: ON' : 'AI: OFF'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Order Panels */}
            <div>
              <Label className="text-slate-300 mb-2 block">Quick Order Sets</Label>
              <div className="flex gap-2 flex-wrap">
                {quickPanels.map(panel => (
                  <Button
                    key={panel.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-purple-600/20 border-purple-400/30 text-purple-200 hover:bg-purple-500/30"
                    onClick={() => applyQuickPanel(panel.tests)}
                  >
                    {panel.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="routine" className="text-white">Routine</SelectItem>
                    <SelectItem value="urgent" className="text-white">Urgent</SelectItem>
                    <SelectItem value="stat" className="text-white">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-300">
                  Expected TAT: {priority === 'stat' ? '1 hour' : priority === 'urgent' ? '4 hours' : '24 hours'}
                </span>
              </div>
            </div>

            {/* Lab Test Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-300">Select Lab Tests</Label>
                <Badge variant="outline" className="text-slate-300">
                  {selectedTests.length} selected
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {labTests.map((test) => {
                  const isSelected = selectedTests.includes(test.code);
                  return (
                    <div
                      key={test.code}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-400/50'
                          : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/50'
                      }`}
                      onClick={() => handleTestToggle(test.code)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium text-sm">{test.name}</p>
                          <p className="text-slate-400 text-xs">{test.code}</p>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-purple-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Clinical Indication</Label>
              <Textarea
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                placeholder="Enter clinical reason for lab orders..."
                className="bg-slate-700 text-white border-slate-600"
                rows={2}
              />
            </div>

            {isAIAssistEnabled && selectedTests.length > 0 && (
              <div className="p-3 bg-green-600/20 rounded border border-green-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 font-medium">AI Recommendations</span>
                </div>
                <div className="text-green-100 text-sm space-y-1">
                  {selectedTests.includes('TROP') && <p>• Consider serial troponins if ACS suspected</p>}
                  {selectedTests.includes('BMP') && <p>• Monitor for electrolyte abnormalities</p>}
                  {selectedTests.includes('CBC') && <p>• Trending hemoglobin recommended if anemia</p>}
                </div>
              </div>
            )}

            {selectedTests.length > 0 && (
              <div className="p-3 bg-blue-600/20 rounded border border-blue-400/30">
                <h4 className="text-blue-200 font-medium mb-2">Selected Tests ({selectedTests.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTests.map(testCode => {
                    const test = labTests.find(t => t.code === testCode);
                    return (
                      <Badge 
                        key={testCode} 
                        className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                        onClick={() => handleTestToggle(testCode)}
                      >
                        {test?.name || testCode} ×
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={selectedTests.length === 0 || createLabOrders.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {createLabOrders.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Submit Lab Orders ({selectedTests.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewLabOrderDialog;
