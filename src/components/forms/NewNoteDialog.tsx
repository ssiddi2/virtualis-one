import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Brain, Clock, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewNoteDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

interface NoteType {
  value: string;
  label: string;
}

const noteTypes: NoteType[] = [
  { value: 'progress', label: 'Progress Note' },
  { value: 'admission', label: 'Admission Note' },
  { value: 'discharge', label: 'Discharge Summary' },
  { value: 'consultation', label: 'Consultation Note' },
  { value: 'operative', label: 'Operative Report' },
  { value: 'procedure', label: 'Procedure Note' },
];

const NewNoteDialog = ({ open, onClose, patientId, patientName }: NewNoteDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [noteType, setNoteType] = useState<string>('progress');
  const [noteText, setNoteText] = useState<string>('');
  const [isAISuggestionsEnabled, setIsAISuggestionsEnabled] = useState<boolean>(true);

  const handleSubmit = () => {
    if (!noteText) {
      toast({
        title: "Required",
        description: "Note text cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting new note:', {
      patientId,
      noteType,
      noteText,
      author: profile?.first_name + ' ' + profile?.last_name,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Note Saved",
      description: "New note has been successfully saved to patient chart.",
    });

    onClose();
  };

  const handleAISuggestionsToggle = () => {
    setIsAISuggestionsEnabled(!isAISuggestionsEnabled);
    toast({
      title: "AI Suggestions",
      description: `AI Note Suggestions are now ${isAISuggestionsEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-virtualis-gold" />
              New Clinical Note
            </div>
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                {patientName} (Patient ID: {patientId})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="noteType" className="text-slate-300">Note Type</Label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="bg-slate-700 text-white">
                    <SelectValue placeholder="Select Note Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border border-slate-600">
                    {noteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  className={`gap-2 ${isAISuggestionsEnabled ? 'bg-green-600/20 text-green-300 border-green-600 hover:bg-green-600/30' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600/30'}`}
                  onClick={handleAISuggestionsToggle}
                >
                  <Sparkles className="h-4 w-4" />
                  {isAISuggestionsEnabled ? 'AI: ON' : 'AI: OFF'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="noteText" className="text-slate-300">Note Text</Label>
              <Textarea
                id="noteText"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter clinical note details here..."
                className="bg-slate-700 text-white"
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <FileText className="w-4 h-4 mr-2" />
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewNoteDialog;
