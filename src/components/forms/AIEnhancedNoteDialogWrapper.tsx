
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import AIEnhancedNoteDialog from './AIEnhancedNoteDialog';

interface AIEnhancedNoteDialogWrapperProps {
  patientId: string;
  hospitalId: string;
  patientName?: string;
}

const AIEnhancedNoteDialogWrapper = ({ patientId, hospitalId, patientName }: AIEnhancedNoteDialogWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
      >
        <FileText className="h-4 w-4" />
        AI Note
      </Button>
      
      <AIEnhancedNoteDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        patientId={patientId}
        hospitalId={hospitalId}
        patientName={patientName || 'Unknown Patient'}
      />
    </>
  );
};

export default AIEnhancedNoteDialogWrapper;
