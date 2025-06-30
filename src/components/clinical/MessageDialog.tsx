
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

const MessageDialog = ({ open, onClose, hospitalId }: MessageDialogProps) => {
  const { toast } = useToast();
  const { data: patients } = usePatients(hospitalId);
  const [message, setMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent' | 'critical'>('routine');

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    // Here you would integrate with your message sending logic
    toast({
      title: "Message Sent",
      description: `AI-analyzed message sent with ${urgency} priority${selectedPatient ? ' for selected patient' : ''}`,
    });

    // Reset form
    setMessage('');
    setSelectedPatient('');
    setUrgency('routine');
    onClose();
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'urgent': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'routine': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1a2332] border-[#2a3441] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            Send Clinical Message
          </DialogTitle>
          <DialogDescription className="text-white/70">
            AI will analyze your message for priority and suggest appropriate routing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Select Patient (Optional)</label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                <SelectValue placeholder="Choose patient for context..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                <SelectItem value="">No specific patient</SelectItem>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.mrn}
                    {patient.room_number && ` (Room ${patient.room_number})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Message Urgency</label>
            <Select value={urgency} onValueChange={(value: 'routine' | 'urgent' | 'critical') => setUrgency(value)}>
              <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={`mt-2 ${getUrgencyColor(urgency)}`}>
              {urgency.toUpperCase()} Priority
            </Badge>
          </div>

          {/* Message Content */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Clinical Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the clinical situation... AI will analyze and route appropriately."
              className="bg-[#0f1922] border-[#2a3441] text-white placeholder:text-white/60 min-h-[120px]"
            />
          </div>

          {/* Patient Context Preview */}
          {selectedPatient && patients && (
            <div className="p-3 bg-[#0f1922] border border-[#2a3441] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Patient Context</span>
              </div>
              {(() => {
                const patient = patients.find(p => p.id === selectedPatient);
                return patient ? (
                  <div className="text-sm text-white/80 space-y-1">
                    <p><span className="text-blue-300">Name:</span> {patient.first_name} {patient.last_name}</p>
                    <p><span className="text-blue-300">Room:</span> {patient.room_number || 'Not assigned'}</p>
                    <p><span className="text-blue-300">Conditions:</span> {patient.medical_conditions?.join(', ') || 'None listed'}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSendMessage}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-[#0f1922] border-[#2a3441] text-white hover:bg-[#2a3441]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
