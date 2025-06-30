
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';
import NewLabOrderDialog from './NewLabOrderDialog';

interface NewLabOrderDialogWrapperProps {
  patientId: string;
  patientName?: string;
}

const NewLabOrderDialogWrapper = ({ patientId, patientName }: NewLabOrderDialogWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <TestTube className="h-4 w-4" />
        Lab Order
      </Button>
      
      <NewLabOrderDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        patientId={patientId}
        patientName={patientName || 'Unknown Patient'}
      />
    </>
  );
};

export default NewLabOrderDialogWrapper;
