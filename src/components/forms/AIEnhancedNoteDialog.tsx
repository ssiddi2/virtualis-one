import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant } from '@/hooks/useAIAssistant';

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
  const { toast } = useToast();
  const { callAI, isLoading } = useAIAssistant();
  const [noteText, setNoteText] = useState('');
  const [selectedNoteType, setSelectedNoteType] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);

  const noteTypes = [
    'Progress Note',
    'SOAP Note',
    'Discharge Summary',
    'Consultation Note',
    'Admission Note',
  ];

  const handleGenerateAISuggestions = async () => {
    try {
      const result = await callAI({
        type: 'note_suggestions',
        data: {
          noteType: selectedNoteType || 'Progress Note',
          patientName,
          currentContent: noteText,
        },
        context: `Patient ID: ${patientId}, Hospital ID: ${hospitalId}`,
      });

      // Parse AI response into suggestions
      const lines = result.split('\n').filter((line: string) => line.trim());
      const suggestions: AISuggestion[] = lines.slice(0, 3).map((text: string, index: number) => ({
        id: `suggestion-${index}`,
        text: text.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim(),
        source: 'AI Clinical Analysis',
      }));

      setAiSuggestions(suggestions);
      toast({
        title: 'AI Suggestions Generated',
        description: 'AI-powered suggestions are ready for your note.',
      });
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast({
        title: 'AI Error',
        description: error instanceof Error ? error.message : 'Failed to generate suggestions',
        variant: 'destructive',
      });
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    setNoteText((prevText) => prevText + (prevText ? ' ' : '') + suggestion.text);
    toast({
      title: 'Suggestion Applied',
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

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Suggestions
                  </div>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {aiSuggestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Click "Generate Suggestions" to get AI-powered recommendations for your note.
                </p>
              ) : (
                aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 rounded-md border border-primary/20 bg-background"
                  >
                    <p className="text-sm">{suggestion.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.source}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmitNote}>
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIEnhancedNoteDialog;
