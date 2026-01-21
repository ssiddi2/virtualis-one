import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  DollarSign, 
  Brain, 
  Stethoscope,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { useCreateMedicalRecord } from '@/hooks/useMedicalRecords';
import SNFTemplates, { SNFTemplate } from '@/components/clinical/SNFTemplates';
import AIBillingGenerator from './AIBillingGenerator';

interface NoteToBillingWorkflowProps {
  patientId: string;
  patientName: string;
  hospitalId: string;
}

const noteTypes = [
  { value: 'snf_daily', label: 'SNF Daily Skilled Nursing' },
  { value: 'snf_admission', label: 'SNF Admission Assessment' },
  { value: 'pt_progress', label: 'Physical Therapy Progress' },
  { value: 'ot_progress', label: 'Occupational Therapy Progress' },
  { value: 'st_progress', label: 'Speech Therapy Progress' },
  { value: 'progress', label: 'General Progress Note' },
  { value: 'discharge', label: 'Discharge Summary' },
];

const NoteToBillingWorkflow = ({ patientId, patientName, hospitalId }: NoteToBillingWorkflowProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const createMedicalRecord = useCreateMedicalRecord();

  // Workflow state
  const [activeStep, setActiveStep] = useState<'template' | 'document' | 'billing'>('template');
  const [noteType, setNoteType] = useState('snf_daily');
  const [noteContent, setNoteContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SNFTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const handleTemplateSelect = (template: SNFTemplate) => {
    setSelectedTemplate(template);
  };

  const handleTemplateContentChange = (content: string) => {
    setNoteContent(content);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Empty Note",
        description: "Please add content to your note before saving.",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.id) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to save notes.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await createMedicalRecord.mutateAsync({
        patient_id: patientId,
        hospital_id: hospitalId,
        provider_id: profile.id,
        encounter_type: noteType,
        chief_complaint: selectedTemplate?.name || noteType,
        history_present_illness: noteContent,
        assessment: 'See detailed note',
        plan: 'Continue current plan of care',
        visit_date: new Date().toISOString(),
      });

      setNoteSaved(true);
      toast({
        title: "Note Saved",
        description: "Clinical documentation saved successfully. Ready for billing.",
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBillingSubmit = (charges: any[]) => {
    toast({
      title: "Charges Submitted",
      description: `${charges.length} charges submitted for billing review.`,
    });
  };

  const steps = [
    { id: 'template', label: 'Select Template', icon: ClipboardList },
    { id: 'document', label: 'Document', icon: FileText },
    { id: 'billing', label: 'Generate Billing', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Note to Billing Workflow</h2>
          <p className="text-slate-400">Document clinical care and automatically generate billing codes</p>
        </div>
        <Badge className="bg-blue-600/30 text-blue-200 border-blue-400/30">
          <Stethoscope className="h-4 w-4 mr-1" />
          {patientName}
        </Badge>
      </div>

      {/* Workflow Steps */}
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setActiveStep(step.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeStep === step.id
                  ? 'bg-blue-600 text-white'
                  : step.id === 'billing' && !noteSaved
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              disabled={step.id === 'billing' && !noteSaved}
            >
              <step.icon className="h-4 w-4" />
              <span>{step.label}</span>
              {step.id === 'document' && noteSaved && (
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              )}
            </button>
            {index < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-slate-600 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {activeStep === 'template' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
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
            <Button 
              onClick={() => setActiveStep('document')}
              className="mt-6 bg-blue-600 hover:bg-blue-700"
              disabled={!selectedTemplate}
            >
              Continue to Document
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <SNFTemplates 
            onSelectTemplate={handleTemplateSelect}
            onContentChange={handleTemplateContentChange}
          />
        </div>
      )}

      {activeStep === 'document' && (
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  {selectedTemplate?.name || 'Clinical Documentation'}
                </div>
                <div className="flex items-center gap-2">
                  {noteSaved && (
                    <Badge className="bg-green-600/30 text-green-300 border-green-400/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Saved
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="bg-slate-700 text-white border-slate-600 font-mono text-sm min-h-[400px]"
                placeholder="Enter clinical documentation..."
              />

              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep('template')}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Back to Templates
                </Button>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleSaveNote}
                    disabled={isSaving || !noteContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Note
                  </Button>
                  <Button 
                    onClick={() => setActiveStep('billing')}
                    disabled={!noteSaved}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Generate Billing
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeStep === 'billing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => setActiveStep('document')}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Back to Document
            </Button>
          </div>

          <AIBillingGenerator
            noteContent={noteContent}
            noteType={noteType}
            patientId={patientId}
            patientName={patientName}
            onSubmitCharges={handleBillingSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default NoteToBillingWorkflow;
