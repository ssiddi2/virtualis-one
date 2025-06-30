
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';
import NewRadiologyOrderDialog from './NewRadiologyOrderDialog';

interface NewRadiologyOrderDialogWrapperProps {
  patientId: string;
  patientName?: string;
}

const NewRadiologyOrderDialogWrapper = ({ patientId, patientName }: NewRadiologyOrderDialogWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
      >
        <Scan className="h-4 w-4" />
        Radiology Order
      </Button>
      
      <NewRadiologyOrderDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        patientId={patientId}
        patientName={patientName || 'Unknown Patient'}
      />
    </>
  );
};

export default NewRadiologyOrderDialogWrapper;
