
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateLabOrder } from '@/hooks/useLabOrders';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface NewLabOrderDialogProps {
  patientId: string;
}

const NewLabOrderDialog = ({ patientId }: NewLabOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    test_name: '',
    test_code: '',
    priority: 'routine' as const,
  });

  const { user } = useAuth();
  const createLabOrder = useCreateLabOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    if (!formData.test_name) {
      toast.error('Test name is required');
      return;
    }

    try {
      await createLabOrder.mutateAsync({
        patient_id: patientId,
        ordered_by: user.id,
        ...formData,
      });
      
      toast.success('Lab order created successfully');
      setOpen(false);
      setFormData({
        test_name: '',
        test_code: '',
        priority: 'routine',
      });
    } catch (error) {
      console.error('Error creating lab order:', error);
      toast.error('Failed to create lab order');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Lab Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lab Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="test_name">Test Name *</Label>
            <Input
              id="test_name"
              value={formData.test_name}
              onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
              placeholder="e.g., Complete Blood Count"
              required
            />
          </div>

          <div>
            <Label htmlFor="test_code">Test Code</Label>
            <Input
              id="test_code"
              value={formData.test_code}
              onChange={(e) => setFormData({ ...formData, test_code: e.target.value })}
              placeholder="e.g., CBC"
            />
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLabOrder.isPending}>
              {createLabOrder.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLabOrderDialog;
