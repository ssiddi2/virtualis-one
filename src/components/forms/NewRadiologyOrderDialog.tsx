
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateRadiologyOrder } from '@/hooks/useRadiologyOrders';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface NewRadiologyOrderDialogProps {
  patientId: string;
}

const NewRadiologyOrderDialog = ({ patientId }: NewRadiologyOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    study_type: '',
    body_part: '',
    modality: 'X-Ray' as const,
    priority: 'routine' as const,
    clinical_indication: '',
  });

  const { user } = useAuth();
  const createRadiologyOrder = useCreateRadiologyOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    if (!formData.study_type || !formData.body_part) {
      toast.error('Study type and body part are required');
      return;
    }

    try {
      await createRadiologyOrder.mutateAsync({
        patient_id: patientId,
        ordered_by: user.id,
        ...formData,
      });
      
      toast.success('Radiology order created successfully');
      setOpen(false);
      setFormData({
        study_type: '',
        body_part: '',
        modality: 'X-Ray',
        priority: 'routine',
        clinical_indication: '',
      });
    } catch (error) {
      console.error('Error creating radiology order:', error);
      toast.error('Failed to create radiology order');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Radiology Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Radiology Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="study_type">Study Type *</Label>
            <Input
              id="study_type"
              value={formData.study_type}
              onChange={(e) => setFormData({ ...formData, study_type: e.target.value })}
              placeholder="e.g., Chest X-Ray"
              required
            />
          </div>

          <div>
            <Label htmlFor="body_part">Body Part *</Label>
            <Input
              id="body_part"
              value={formData.body_part}
              onChange={(e) => setFormData({ ...formData, body_part: e.target.value })}
              placeholder="e.g., Chest"
              required
            />
          </div>

          <div>
            <Label htmlFor="modality">Modality</Label>
            <Select
              value={formData.modality}
              onValueChange={(value: any) => setFormData({ ...formData, modality: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CT">CT</SelectItem>
                <SelectItem value="MRI">MRI</SelectItem>
                <SelectItem value="X-Ray">X-Ray</SelectItem>
                <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                <SelectItem value="Nuclear Medicine">Nuclear Medicine</SelectItem>
                <SelectItem value="PET">PET</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stat">STAT</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="clinical_indication">Clinical Indication</Label>
            <Textarea
              id="clinical_indication"
              value={formData.clinical_indication}
              onChange={(e) => setFormData({ ...formData, clinical_indication: e.target.value })}
              placeholder="Enter clinical indication for the study"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRadiologyOrder.isPending}>
              {createRadiologyOrder.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRadiologyOrderDialog;
