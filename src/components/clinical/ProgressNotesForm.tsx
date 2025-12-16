
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { useCreateMedicalRecord } from '@/hooks/useMedicalRecords';
import { useToast } from '@/hooks/use-toast';
import { FileText, Save, Mic, Eye } from 'lucide-react';

interface ProgressNotesFormProps {
  patientId: string;
  hospitalId: string;
}

const ProgressNotesForm = ({ patientId, hospitalId }: ProgressNotesFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const createRecord = useCreateMedicalRecord();
  
  const [formData, setFormData] = useState({
    encounterType: 'progress_note',
    chiefComplaint: '',
    historyPresentIllness: '',
    physicalExamination: '',
    assessment: '',
    plan: '',
    followUpInstructions: ''
  });

  const encounterTypes = [
    'progress_note',
    'admission_note',
    'discharge_summary',
    'consultation_note',
    'procedure_note',
    'daily_note'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assessment || !formData.plan) {
      toast({
        title: "Incomplete Note",
        description: "Assessment and Plan are required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createRecord.mutateAsync({
        patient_id: patientId,
        hospital_id: hospitalId,
        provider_id: profile?.id || '',
        encounter_type: formData.encounterType,
        chief_complaint: formData.chiefComplaint,
        history_present_illness: formData.historyPresentIllness,
        physical_examination: formData.physicalExamination,
        assessment: formData.assessment,
        plan: formData.plan,
        follow_up_instructions: formData.followUpInstructions,
        visit_date: new Date().toISOString()
      });

      toast({
        title: "Progress Note Saved",
        description: "Clinical documentation has been successfully recorded"
      });

      // Reset form
      setFormData({
        encounterType: 'progress_note',
        chiefComplaint: '',
        historyPresentIllness: '',
        physicalExamination: '',
        assessment: '',
        plan: '',
        followUpInstructions: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress note",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" />
          Progress Note Documentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="encounterType">Note Type</Label>
              <Select 
                value={formData.encounterType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, encounterType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {encounterTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                value={`${profile?.first_name} ${profile?.last_name} (${profile?.role})`}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint</Label>
            <Input
              id="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
              placeholder="Patient's primary concern or reason for visit"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hpi">History of Present Illness</Label>
              <Button type="button" variant="outline" size="sm">
                <Mic className="h-4 w-4 mr-1" />
                Dictate
              </Button>
            </div>
            <Textarea
              id="hpi"
              value={formData.historyPresentIllness}
              onChange={(e) => setFormData(prev => ({ ...prev, historyPresentIllness: e.target.value }))}
              placeholder="Detailed description of the patient's current illness..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="physicalExam">Physical Examination</Label>
              <Button type="button" variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Templates
              </Button>
            </div>
            <Textarea
              id="physicalExam"
              value={formData.physicalExamination}
              onChange={(e) => setFormData(prev => ({ ...prev, physicalExamination: e.target.value }))}
              placeholder="Physical examination findings..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assessment">Assessment *</Label>
            <Textarea
              id="assessment"
              value={formData.assessment}
              onChange={(e) => setFormData(prev => ({ ...prev, assessment: e.target.value }))}
              placeholder="Clinical assessment and diagnoses..."
              rows={4}
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plan *</Label>
            <Textarea
              id="plan"
              value={formData.plan}
              onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
              placeholder="Treatment plan and next steps..."
              rows={4}
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUp">Follow-up Instructions</Label>
            <Textarea
              id="followUp"
              value={formData.followUpInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, followUpInstructions: e.target.value }))}
              placeholder="Instructions for patient follow-up care..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save & Sign Note
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProgressNotesForm;
