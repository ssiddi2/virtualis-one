
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { TestTube, Brain, Clock, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const commonLabTests: LabTest[] = [
  { code: 'CBC', name: 'Complete Blood Count', category: 'Hematology' },
  { code: 'BMP', name: 'Basic Metabolic Panel', category: 'Chemistry' },
  { code: 'CMP', name: 'Comprehensive Metabolic Panel', category: 'Chemistry' },
  { code: 'LIPID', name: 'Lipid Panel', category: 'Chemistry' },
  { code: 'TSH', name: 'Thyroid Stimulating Hormone', category: 'Endocrine' },
  { code: 'HBA1C', name: 'Hemoglobin A1C', category: 'Chemistry' },
  { code: 'PT/INR', name: 'Prothrombin Time/INR', category: 'Coagulation' },
  { code: 'TROP', name: 'Troponin I', category: 'Cardiac' },
];

const NewLabOrderDialog = ({ open, onClose, patientId, patientName }: NewLabOrderDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<string>('routine');
  const [clinicalIndication, setClinicalIndication] = useState<string>('');
  const [isAIAssistEnabled, setIsAIAssistEnabled] = useState<boolean>(true);

  const handleTestToggle = (testCode: string) => {
    setSelectedTests(prev => 
      prev.includes(testCode) 
        ? prev.filter(code => code !== testCode)
        : [...prev, testCode]
    );
  };

  const handleSubmit = () => {
    if (selectedTests.length === 0) {
      toast({
        title: "Required",
        description: "Please select at least one lab test.",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting lab orders:', {
      patientId,
      tests: selectedTests,
      priority,
      clinicalIndication,
      orderedBy: profile?.id,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Lab Orders Submitted",
      description: `${selectedTests.length} lab test(s) ordered for ${patientName}`,
    });

    // Reset form
    setSelectedTests([]);
    setPriority('routine');
    setClinicalIndication('');
    onClose();
  };

  const handleAIAssistToggle = () => {
    setIsAIAssistEnabled(!isAIAssistEnabled);
    toast({
      title: "AI Assistant",
      description: `AI Lab Ordering Assistant is now ${isAIAssistEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-400" />
              Laboratory Order Entry
            </div>
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  {patientName} (Patient ID: {patientId})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${isAIAssistEnabled ? 'bg-green-600/20 text-green-300 border-green-600 hover:bg-green-600/30' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600/30'}`}
                  onClick={handleAIAssistToggle}
                >
                  <Sparkles className="h-4 w-4" />
                  {isAIAssistEnabled ? 'AI: ON' : 'AI: OFF'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority" className="text-slate-300">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-slate-700 text-white">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border border-slate-600">
                    <SelectItem value="routine" className="text-white">Routine</SelectItem>
                    <SelectItem value="urgent" className="text-white">Urgent</SelectItem>
                    <SelectItem value="stat" className="text-white">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <div className="text-sm text-slate-300">
                  <p>Expected TAT: {priority === 'stat' ? '1 hour' : priority === 'urgent' ? '4 hours' : '24 hours'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-300">Select Lab Tests</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {commonLabTests.map((test) => (
                  <div
                    key={test.code}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTests.includes(test.code)
                        ? 'bg-purple-600/20 border-purple-400/30'
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/50'
                    }`}
                    onClick={() => handleTestToggle(test.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{test.name}</p>
                        <p className="text-slate-400 text-sm">{test.code}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {test.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicalIndication" className="text-slate-300">Clinical Indication</Label>
              <Textarea
                id="clinicalIndication"
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                placeholder="Enter clinical reason for lab orders..."
                className="bg-slate-700 text-white"
                rows={3}
              />
            </div>

            {isAIAssistEnabled && selectedTests.length > 0 && (
              <div className="p-3 bg-green-600/20 rounded border border-green-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 font-medium">AI Recommendations</span>
                </div>
                <div className="text-green-100 text-sm space-y-1">
                  <p>• Consider adding BNP if cardiac symptoms present</p>
                  <p>• Recommend fasting for lipid panel if ordered</p>
                  <p>• Patient's recent hemoglobin trend suggests monitoring CBC</p>
                </div>
              </div>
            )}

            {selectedTests.length > 0 && (
              <div className="p-3 bg-blue-600/20 rounded border border-blue-400/30">
                <h4 className="text-blue-200 font-medium mb-2">Selected Tests ({selectedTests.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTests.map(testCode => {
                    const test = commonLabTests.find(t => t.code === testCode);
                    return (
                      <Badge key={testCode} className="bg-blue-600 text-white">
                        {test?.name || testCode}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedTests.length === 0}>
            <TestTube className="w-4 h-4 mr-2" />
            Submit Lab Orders ({selectedTests.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewLabOrderDialog;
