
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  MessageSquare, 
  User, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Stethoscope,
  Users,
  Phone,
  Moon
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { usePhysicians, useOnCallSchedules } from '@/hooks/usePhysicians';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMessageDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

const EnhancedMessageDialog = ({ open, onClose, hospitalId }: EnhancedMessageDialogProps) => {
  const { toast } = useToast();
  const { data: patients } = usePatients(hospitalId);
  const { data: physicians } = usePhysicians();
  const { data: onCallSchedules } = useOnCallSchedules();
  
  const [message, setMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [acuity, setAcuity] = useState<'low' | 'moderate' | 'critical'>('moderate');
  const [recipientType, setRecipientType] = useState('team');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  // Mock data for on-call specialties and nocturnists
  const onCallSpecialties = [
    { id: '1', name: 'Cardiology', physician: 'Dr. Sarah Chen', status: 'available', phone: '(555) 101-1001' },
    { id: '2', name: 'Neurology', physician: 'Dr. Michael Rodriguez', status: 'busy', phone: '(555) 102-1002' },
    { id: '3', name: 'Orthopedics', physician: 'Dr. Emily Johnson', status: 'available', phone: '(555) 103-1003' },
    { id: '4', name: 'General Surgery', physician: 'Dr. David Kim', status: 'in_surgery', phone: '(555) 104-1004' }
  ];

  const nocturnists = [
    { id: '1', name: 'Dr. James Wilson', type: 'Primary Attending', status: 'available', phone: '(555) 201-2001' },
    { id: '2', name: 'Dr. Lisa Thompson', type: 'Nocturnist', status: 'available', phone: '(555) 202-2002' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'busy': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'in_surgery': return 'bg-red-500/20 text-red-200 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getAcuityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
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

    if (!selectedRecipient && recipientType !== 'team') {
      toast({
        title: "Recipient Required",
        description: "Please select a recipient",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `${acuity.toUpperCase()} priority message sent successfully`,
    });

    // Reset form
    setMessage('');
    setSelectedPatient('');
    setAcuity('moderate');
    setRecipientType('team');
    setSelectedRecipient('');
    onClose();
  };

  const renderRecipientList = () => {
    switch (recipientType) {
      case 'specialty':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              On-Call Specialties
            </h4>
            <RadioGroup value={selectedRecipient} onValueChange={setSelectedRecipient}>
              {onCallSpecialties.map((specialty) => (
                <Card key={specialty.id} className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={specialty.id} id={specialty.id} />
                      <Label htmlFor={specialty.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{specialty.name}</p>
                            <p className="text-white/70 text-sm">{specialty.physician}</p>
                            <p className="text-white/60 text-xs">{specialty.phone}</p>
                          </div>
                          <Badge className={getStatusColor(specialty.status)}>
                            {specialty.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 'attending':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Primary Attending & Nocturnists
            </h4>
            <RadioGroup value={selectedRecipient} onValueChange={setSelectedRecipient}>
              {nocturnists.map((doctor) => (
                <Card key={doctor.id} className="backdrop-blur-xl bg-indigo-500/20 border border-indigo-300/30">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={doctor.id} id={doctor.id} />
                      <Label htmlFor={doctor.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{doctor.name}</p>
                            <p className="text-white/70 text-sm">{doctor.type}</p>
                            <p className="text-white/60 text-xs">{doctor.phone}</p>
                          </div>
                          <Badge className={getStatusColor(doctor.status)}>
                            {doctor.status.toUpperCase()}
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 'team':
      default:
        return (
          <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
            <div className="flex items-center gap-2 text-white/80">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm">Message will be sent to the entire care team</span>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            Send Clinical Message
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Send priority messages to care team members and specialists
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient Type Selection */}
          <div className="space-y-3">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <Users className="h-3 w-3" />
              Send To
            </label>
            <Select value={recipientType} onValueChange={setRecipientType}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-blue-800/95 to-indigo-800/95 border border-blue-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="team">Care Team</SelectItem>
                <SelectItem value="specialty">On-Call Specialties</SelectItem>
                <SelectItem value="attending">Primary Attending / Nocturnist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recipient List */}
          {renderRecipientList()}

          {/* Patient Context */}
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
              {acuity === 'critical' && <AlertTriangle className="h-3 w-3" />}
              {acuity === 'moderate' && <Clock className="h-3 w-3" />}
              {acuity === 'low' && <CheckCircle className="h-3 w-3" />}
              <span>{acuity.toUpperCase()} PRIORITY</span>
            </Badge>
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

export default EnhancedMessageDialog;
