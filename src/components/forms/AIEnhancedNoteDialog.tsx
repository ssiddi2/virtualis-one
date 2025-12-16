import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { Brain, Sparkles, FileText, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIEnhancedNoteDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  hospitalId: string;
}

interface AISuggestion {
  id: string;
  text: string;
  source: string;
}

const AIEnhancedNoteDialog = ({ open, onClose, patientId, patientName, hospitalId }: AIEnhancedNoteDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [noteText, setNoteText] = useState('');
  const [selectedNoteType, setSelectedNoteType] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const noteTypes = [
    'Progress Note',
    'SOAP Note',
    'Discharge Summary',
    'Consultation Note',
    'Admission Note',
  ];

  const mockAISuggestions: AISuggestion[] = [
    {
      id: '1',
      text: 'Patient reports improved sleep quality and reduced anxiety levels.',
      source: 'AI Analysis of Patient History',
    },
    {
      id: '2',
      text: 'Recommend continuing current medication regimen with a follow-up in 2 weeks.',
      source: 'AI Clinical Guidelines',
    },
    {
      id: '3',
      text: 'Consider referral to physical therapy for ongoing lower back pain.',
      source: 'AI Predictive Analysis',
    },
  ];

  const handleGenerateAISuggestions = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAiSuggestions(mockAISuggestions);
    toast({
      title: 'AI Suggestions Generated',
      description: 'AI-powered suggestions have been generated for your note.',
    });
    setIsLoading(false);
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    setNoteText((prevText) => prevText + ' ' + suggestion.text);
    toast({
      title: 'AI Suggestion Applied',
      description: 'The AI suggestion has been added to your note.',
    });
  };

  const handleSubmitNote = () => {
    if (!noteText || !selectedNoteType) {
      toast({
        title: 'Missing Information',
        description: 'Please select a note type and enter your note.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate API call
    toast({
      title: 'Note Saved',
      description: 'Your note has been saved successfully.',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 mr-2" />
            AI-Enhanced Clinical Note for {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Note Type Selection */}
          <div>
            <Label htmlFor="noteType">Note Type</Label>
            <Select onValueChange={setSelectedNoteType}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select a note type" />
              </SelectTrigger>
              <SelectContent>
                {noteTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-sm">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note Text Area */}
          <div>
            <Label htmlFor="noteText">Clinical Note</Label>
            <Textarea
              id="noteText"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your clinical note here"
              className="resize-none h-48 text-sm"
            />
          </div>

          {/* AI Suggestions */}
          <Card className="border-blue-400/50 bg-blue-500/10">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-300" />
                AI-Powered Suggestions
              </CardTitle>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateAISuggestions}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate AI Suggestions
                  </div>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {aiSuggestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Click "Generate AI Suggestions" to get AI-powered suggestions for your note.
                </p>
              ) : (
                aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 rounded-md border border-blue-300/30 bg-blue-400/10"
                  >
                    <p className="text-sm">{suggestion.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Source: {suggestion.source}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" onClick={handleSubmitNote}>
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIEnhancedNoteDialog;
