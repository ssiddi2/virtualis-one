import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { FileText, Brain, User, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateMedicalRecord } from '@/hooks/useMedicalRecords';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import RealTimeBillingPreview from '@/components/billing/RealTimeBillingPreview';

interface NewNoteDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const noteTypes = [
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
  const createMedicalRecord = useCreateMedicalRecord();
  const { callAI, isLoading: isAILoading } = useAIAssistant();
  
  const [noteType, setNoteType] = useState('progress');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [hpi, setHpi] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [isAISuggestionsEnabled, setIsAISuggestionsEnabled] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Combine all documentation for real-time billing preview
  const combinedDocumentation = useMemo(() => {
    return [
      chiefComplaint && `Chief Complaint: ${chiefComplaint}`,
      hpi && `History: ${hpi}`,
      physicalExam && `Exam: ${physicalExam}`,
      assessment && `Assessment: ${assessment}`,
      plan && `Plan: ${plan}`,
    ].filter(Boolean).join('\n');
  }, [chiefComplaint, hpi, physicalExam, assessment, plan]);

  // Fetch AI suggestions when assessment changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isAISuggestionsEnabled || !assessment || assessment.length < 10) {
        setAiSuggestions([]);
        return;
      }

      try {
        const result = await callAI({
          type: 'note_suggestions',
          data: {
            noteType: noteTypes.find(t => t.value === noteType)?.label || 'Progress Note',
            patientName,
            currentContent: `Chief Complaint: ${chiefComplaint}\nHPI: ${hpi}\nExam: ${physicalExam}\nAssessment: ${assessment}\nPlan: ${plan}`,
          },
        });

        // Parse suggestions from AI response
        const lines = result.split('\n').filter((line: string) => line.trim());
        const suggestions = lines.slice(0, 3).map((text: string) => 
          text.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim()
        );
        setAiSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
        // Silent fail - don't show error for background suggestions
      }
    };

    const debounce = setTimeout(fetchSuggestions, 1500);
    return () => clearTimeout(debounce);
  }, [assessment, isAISuggestionsEnabled, callAI, noteType, patientName, chiefComplaint, hpi, physicalExam, plan]);

  const handleSubmit = async () => {
    console.log('[NewNoteDialog] Submit initiated');
    console.log('[NewNoteDialog] Auth state:', { profileId: profile?.id, hospitalId: profile?.hospital_id, role: profile?.role });
    
    if (!assessment && !plan) {
      toast({
        title: "Required",
        description: "Please provide at least an assessment or plan.",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.id) {
      console.error('[NewNoteDialog] No profile ID - user not authenticated');
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create notes. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.hospital_id) {
      console.error('[NewNoteDialog] No hospital ID assigned to user');
      toast({
        title: "Hospital Not Selected",
        description: "Your account is not assigned to a hospital. Please contact an administrator.",
        variant: "destructive",
      });
      return;
    }

    const recordData = {
      patient_id: patientId,
      hospital_id: profile.hospital_id,
      provider_id: profile.id,
      encounter_type: noteType,
      chief_complaint: chiefComplaint || null,
      history_present_illness: hpi || null,
      physical_examination: physicalExam || null,
      assessment: assessment || null,
      plan: plan || null,
      visit_date: new Date().toISOString(),
    };

    console.log('[NewNoteDialog] Saving record:', recordData);

    try {
      await createMedicalRecord.mutateAsync(recordData);

      toast({
        title: "Note Saved",
        description: "Clinical note has been saved to the patient chart.",
      });

      // Reset form
      setChiefComplaint('');
      setHpi('');
      setPhysicalExam('');
      setAssessment('');
      setPlan('');
      setNoteType('progress');
      setAiSuggestions([]);
      onClose();
    } catch (error: any) {
      console.error('[NewNoteDialog] Error saving note:', error);
      
      // Provide more specific error messages based on error type
      let errorMessage = "Failed to save note. Please try again.";
      if (error?.message?.includes('row-level security')) {
        errorMessage = "Permission denied. Your account may not have the required role to create clinical notes.";
      } else if (error?.message?.includes('violates foreign key')) {
        errorMessage = "Invalid patient or hospital reference. Please refresh and try again.";
      } else if (error?.code === '42501') {
        errorMessage = "Access denied. Please ensure you have a healthcare provider role.";
      }
      
      toast({
        title: "Error Saving Note",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAISuggestionsToggle = () => {
    setIsAISuggestionsEnabled(!isAISuggestionsEnabled);
    if (isAISuggestionsEnabled) {
      setAiSuggestions([]);
    }
    toast({
      title: "AI Suggestions",
      description: `AI suggestions are now ${isAISuggestionsEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const applySmartPhrase = (phrase: string) => {
    const smartPhrases: Record<string, string> = {
      '.vitals': 'Vitals stable. T 98.6°F, BP 120/80, HR 72, RR 16, O2 98% on RA.',
      '.neuro': 'Neurologically intact. Alert and oriented x3. Cranial nerves II-XII intact. Motor strength 5/5 in all extremities. Sensation intact.',
      '.cardiac': 'Cardiovascular: Regular rate and rhythm. No murmurs, rubs, or gallops. JVP not elevated. Peripheral pulses 2+ bilaterally.',
      '.resp': 'Respiratory: Lungs clear to auscultation bilaterally. No wheezes, rales, or rhonchi. Normal work of breathing.',
      '.abd': 'Abdomen: Soft, non-tender, non-distended. Bowel sounds present in all quadrants. No hepatosplenomegaly.',
    };
    
    if (smartPhrases[phrase]) {
      setPhysicalExam(prev => prev + (prev ? '\n' : '') + smartPhrases[phrase]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              New Clinical Note
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
                  className={`gap-2 ${isAISuggestionsEnabled ? 'bg-green-600/20 text-green-300 border-green-600' : 'bg-slate-700 text-slate-300 border-slate-600'}`}
                  onClick={handleAISuggestionsToggle}
                >
                  <Sparkles className="h-4 w-4" />
                  {isAISuggestionsEnabled ? 'AI: ON' : 'AI: OFF'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Note Type</Label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {noteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Smart Phrases</Label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {['.vitals', '.neuro', '.cardiac', '.resp', '.abd'].map(phrase => (
                    <Button
                      key={phrase}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      onClick={() => applySmartPhrase(phrase)}
                    >
                      {phrase}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Chief Complaint</Label>
              <Input
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Patient's primary concern..."
                className="bg-slate-700 text-white border-slate-600"
              />
            </div>

            <div>
              <Label className="text-slate-300">History of Present Illness (HPI)</Label>
              <Textarea
                value={hpi}
                onChange={(e) => setHpi(e.target.value)}
                placeholder="Detailed history of the current illness..."
                className="bg-slate-700 text-white border-slate-600"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-slate-300">Physical Examination</Label>
              <Textarea
                value={physicalExam}
                onChange={(e) => setPhysicalExam(e.target.value)}
                placeholder="Physical exam findings... (use smart phrases above)"
                className="bg-slate-700 text-white border-slate-600"
                rows={4}
              />
            </div>

            <div>
              <Label className="text-slate-300">Assessment *</Label>
              <Textarea
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Clinical assessment and diagnoses..."
                className="bg-slate-700 text-white border-slate-600"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-slate-300">Plan *</Label>
              <Textarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Treatment plan, orders, and follow-up..."
                className="bg-slate-700 text-white border-slate-600"
                rows={3}
              />
            </div>

            {/* Real-Time Billing Preview */}
            <RealTimeBillingPreview
              documentationText={combinedDocumentation}
              noteType={noteTypes.find(t => t.value === noteType)?.label || 'Progress Note'}
              facilityType="Hospital"
              minCharacters={50}
              debounceMs={1500}
            />

            {isAISuggestionsEnabled && (aiSuggestions.length > 0 || isAILoading) && (
              <div className="p-3 bg-green-600/20 rounded border border-green-400/30">
                <div className="flex items-center gap-2 mb-2">
                  {isAILoading ? (
                    <Loader2 className="h-4 w-4 text-green-400 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 text-green-400" />
                  )}
                  <span className="text-green-300 font-medium">
                    {isAILoading ? 'Generating AI Suggestions...' : 'AI Suggestions'}
                  </span>
                </div>
                {aiSuggestions.length > 0 && (
                  <div className="text-green-100 text-sm space-y-1">
                    {aiSuggestions.map((suggestion, index) => (
                      <p key={index}>• {suggestion}</p>
                    ))}
                  </div>
                )}
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
            disabled={createMedicalRecord.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createMedicalRecord.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewNoteDialog;
