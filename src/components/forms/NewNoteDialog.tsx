
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateMedicalRecord } from '@/hooks/useMedicalRecords';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface NewNoteDialogProps {
  patientId: string;
  hospitalId: string;
}

const NewNoteDialog = ({ patientId, hospitalId }: NewNoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    encounter_type: 'inpatient' as const,
    chief_complaint: '',
    history_present_illness: '',
    physical_examination: '',
    assessment: '',
    plan: '',
  });

  const { user } = useAuth();
  const createMedicalRecord = useCreateMedicalRecord();

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
      
      toast.success('Medical note created successfully');
      setOpen(false);
      setFormData({
        encounter_type: 'inpatient',
        chief_complaint: '',
        history_present_illness: '',
        physical_examination: '',
        assessment: '',
        plan: '',
      });
    } catch (error) {
      console.error('Error creating medical note:', error);
      toast.error('Failed to create medical note');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Medical Note</DialogTitle>
        </DialogHeader>
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
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="physical_examination">Physical Examination</Label>
            <Textarea
              id="physical_examination"
              value={formData.physical_examination}
              onChange={(e) => setFormData({ ...formData, physical_examination: e.target.value })}
              placeholder="Enter physical examination findings"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="assessment">Assessment</Label>
            <Textarea
              id="assessment"
              value={formData.assessment}
              onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
              placeholder="Enter assessment"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="plan">Plan</Label>
            <Textarea
              id="plan"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              placeholder="Enter treatment plan"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMedicalRecord.isPending}>
              {createMedicalRecord.isPending ? 'Creating...' : 'Create Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewNoteDialog;
