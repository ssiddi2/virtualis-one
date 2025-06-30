
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, User, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';

interface StreamlinedMessageDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

const StreamlinedMessageDialog = ({ open, onClose, hospitalId }: StreamlinedMessageDialogProps) => {
  const { toast } = useToast();
  const { data: patients } = usePatients(hospitalId);
  const [message, setMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [acuity, setAcuity] = useState<'low' | 'moderate' | 'critical'>('moderate');
  const [recipient, setRecipient] = useState('team');

  const getAcuityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getAcuityIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `${acuity.toUpperCase()} priority message sent to ${recipient}`,
    });

    setMessage('');
    setSelectedPatient('');
    setAcuity('moderate');
    setRecipient('team');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            Send Clinical Message
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Send messages to team members with priority classification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <User className="h-3 w-3" />
              Patient Context (Optional)
            </label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue placeholder="Select patient for context..." />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-blue-800/95 to-indigo-800/95 border border-blue-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="">No patient context</SelectItem>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.mrn}
                    {patient.room_number && ` (Room ${patient.room_number})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" />
              Priority Level
            </label>
            <Select value={acuity} onValueChange={(value: 'low' | 'moderate' | 'critical') => setAcuity(value)}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-blue-800/95 to-indigo-800/95 border border-blue-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="low">Low - Routine Information</SelectItem>
                <SelectItem value="moderate">Moderate - Needs Attention</SelectItem>
                <SelectItem value="critical">Critical - Immediate Response Required</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={`mt-2 ${getAcuityColor(acuity)} flex items-center gap-1 w-fit border font-semibold`}>
              {getAcuityIcon(acuity)}
              <span>{acuity.toUpperCase()} PRIORITY</span>
            </Badge>
          </div>

          {/* Recipient Selection */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              Send To
            </label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-blue-800/95 to-indigo-800/95 border border-blue-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="team">Care Team</SelectItem>
                <SelectItem value="nursing">Nursing Staff</SelectItem>
                <SelectItem value="physicians">Physicians</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="radiology">Radiology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              Message Content
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your clinical message..."
              className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[120px] backdrop-blur-sm rounded-lg"
            />
          </div>

          {/* Patient Context Preview */}
          {selectedPatient && patients && (
            <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Patient Context</span>
              </div>
              {(() => {
                const patient = patients.find(p => p.id === selectedPatient);
                return patient ? (
                  <div className="text-sm text-white/80 space-y-1">
                    <p><span className="text-blue-300">Patient:</span> {patient.first_name} {patient.last_name}</p>
                    <p><span className="text-blue-300">Location:</span> {patient.room_number || 'Unassigned'}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-white/20">
            <Button
              onClick={handleSendMessage}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 rounded-lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StreamlinedMessageDialog;
