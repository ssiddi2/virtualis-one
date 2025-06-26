
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateMedicalRecord } from '@/hooks/useMedicalRecords';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Brain, Plus, Loader2, Sparkles } from 'lucide-react';

interface AIEnhancedNoteDialogProps {
  patientId: string;
  hospitalId: string;
}

const AIEnhancedNoteDialog = ({ patientId, hospitalId }: AIEnhancedNoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    encounter_type: 'inpatient' as const,
    chief_complaint: '',
    history_present_illness: '',
    physical_examination: '',
    assessment: '',
    plan: '',
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);

  const { user } = useAuth();
  const createMedicalRecord = useCreateMedicalRecord();
  const { callAI, isLoading: aiLoading } = useAIAssistant();

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a clinical summary for AI generation');
      return;
    }

    try {
      const result = await callAI({
        type: 'clinical_note',
        data: { summary: aiPrompt },
        context: `${formData.encounter_type} encounter`
      });

      // Parse AI response and populate form fields
      const sections = result.split('\n\n');
      let newFormData = { ...formData };

      sections.forEach((section: string) => {
        if (section.includes('Chief Complaint:') || section.includes('CC:')) {
          const cc = section.replace(/.*(?:Chief Complaint:|CC:)\s*/i, '').trim();
          if (cc) newFormData.chief_complaint = cc;
        }
        if (section.includes('History of Present Illness:') || section.includes('HPI:')) {
          const hpi = section.replace(/.*(?:History of Present Illness:|HPI:)\s*/i, '').trim();
          if (hpi) newFormData.history_present_illness = hpi;
        }
        if (section.includes('Physical Examination:') || section.includes('PE:')) {
          const pe = section.replace(/.*(?:Physical Examination:|PE:)\s*/i, '').trim();
          if (pe) newFormData.physical_examination = pe;
        }
        if (section.includes('Assessment:') || section.includes('A:')) {
          const assessment = section.replace(/.*(?:Assessment:|A:)\s*/i, '').trim();
          if (assessment) newFormData.assessment = assessment;
        }
        if (section.includes('Plan:') || section.includes('P:')) {
          const plan = section.replace(/.*(?:Plan:|P:)\s*/i, '').trim();
          if (plan) newFormData.plan = plan;
        }
      });

      setFormData(newFormData);
      toast.success('AI-generated clinical note created! Please review and edit as needed.');
      setIsAIMode(false);
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate AI note. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      await createMedicalRecord.mutateAsync({
        patient_id: patientId,
        hospital_id: hospitalId,
        provider_id: user.id,
        ...formData,
      });
      
      toast.success('Medical note saved successfully');
      setOpen(false);
      setFormData({
        encounter_type: 'inpatient',
        chief_complaint: '',
        history_present_illness: '',
        physical_examination: '',
        assessment: '',
        plan: '',
      });
      setAiPrompt('');
    } catch (error) {
      console.error('Error saving medical note:', error);
      toast.error('Failed to save medical note');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Brain className="h-4 w-4 mr-2" />
          AI Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Enhanced Clinical Documentation
          </DialogTitle>
        </DialogHeader>

        {!isAIMode ? (
          <div className="space-y-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Quick AI Generation</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAIMode(true)}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Brain className="h-4 w-4 mr-2" />
                Use AI Assistant
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              Let AI help you create comprehensive clinical documentation based on your clinical summary.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <Label>Clinical Summary for AI Generation</Label>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Enter a brief clinical summary (e.g., 'Patient presents with chest pain, started 2 hours ago, sharp, radiating to left arm, associated with shortness of breath...')"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={generateWithAI}
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAIMode(false)}
              >
                Manual Entry
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="encounter_type">Encounter Type</Label>
            <Select
              value={formData.encounter_type}
              onValueChange={(value: any) => setFormData({ ...formData, encounter_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inpatient">Inpatient</SelectItem>
                <SelectItem value="outpatient">Outpatient</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chief_complaint">Chief Complaint</Label>
            <Input
              id="chief_complaint"
              value={formData.chief_complaint}
              onChange={(e) => setFormData({ ...formData, chief_complaint: e.target.value })}
              placeholder="Enter chief complaint"
            />
          </div>

          <div>
            <Label htmlFor="history_present_illness">History of Present Illness</Label>
            <Textarea
              id="history_present_illness"
              value={formData.history_present_illness}
              onChange={(e) => setFormData({ ...formData, history_present_illness: e.target.value })}
              placeholder="Enter history of present illness"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="physical_examination">Physical Examination</Label>
            <Textarea
              id="physical_examination"
              value={formData.physical_examination}
              onChange={(e) => setFormData({ ...formData, physical_examination: e.target.value })}
              placeholder="Enter physical examination findings"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              value={formData.assessment}
              onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
              placeholder="Enter assessment"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="plan">Plan</Label>
            <Textarea
              id="plan"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              placeholder="Enter treatment plan"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMedicalRecord.isPending}>
              {createMedicalRecord.isPending ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIEnhancedNoteDialog;
