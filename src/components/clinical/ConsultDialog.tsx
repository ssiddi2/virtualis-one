
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, User, Phone, Clock, Star } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useSpecialties, useOnCallSchedules } from '@/hooks/usePhysicians';
import { useToast } from '@/hooks/use-toast';

interface ConsultDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

const ConsultDialog = ({ open, onClose, hospitalId }: ConsultDialogProps) => {
  const { toast } = useToast();
  const { data: patients } = usePatients(hospitalId);
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const [clinicalQuestion, setClinicalQuestion] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent' | 'critical'>('routine');

  const handleRequestConsult = () => {
    if (!clinicalQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter a clinical question",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSpecialty) {
      toast({
        title: "Error",
        description: "Please select a specialty",
        variant: "destructive"
      });
      return;
    }

    const specialtyName = specialties?.find(s => s.id === selectedSpecialty)?.name;
    
    toast({
      title: "Consultation Requested",
      description: `${urgency.toUpperCase()} consultation sent to ${specialtyName}`,
    });

    // Reset form
    setClinicalQuestion('');
    setSelectedPatient('');
    setSelectedSpecialty('');
    setUrgency('routine');
    onClose();
  };

  const getOnCallPhysician = (specialtyId: string) => {
    return onCallSchedules?.find(schedule => 
      schedule.specialty_id === specialtyId && schedule.is_primary
    )?.physician;
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'urgent': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'routine': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const onCallPhysician = selectedSpecialty ? getOnCallPhysician(selectedSpecialty) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1a2332] border-[#2a3441] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-purple-400" />
            Request Consultation
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Smart routing will connect you with the appropriate specialist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Select Patient</label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                <SelectValue placeholder="Choose patient..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.mrn}
                    {patient.room_number && ` (Room ${patient.room_number})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specialty Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Requesting Specialty</label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                <SelectValue placeholder="Choose specialty..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                {specialties?.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* On-Call Physician Display */}
          {onCallPhysician && (
            <Card className="bg-[#0f1922] border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  On-Call Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-400" />
                    <span className="font-medium">
                      {onCallPhysician.first_name} {onCallPhysician.last_name}
                    </span>
                    <Badge className="bg-green-600 text-white text-xs">Primary</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Phone className="h-3 w-3" />
                    {onCallPhysician.phone}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Urgency Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Consultation Urgency</label>
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

          {/* Clinical Question */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Clinical Question</label>
            <Textarea
              value={clinicalQuestion}
              onChange={(e) => setClinicalQuestion(e.target.value)}
              placeholder="Describe the clinical situation requiring consultation..."
              className="bg-[#0f1922] border-[#2a3441] text-white placeholder:text-white/60 min-h-[120px]"
            />
          </div>

          {/* Patient Context Preview */}
          {selectedPatient && patients && (
            <div className="p-3 bg-[#0f1922] border border-[#2a3441] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Patient Context</span>
              </div>
              {(() => {
                const patient = patients.find(p => p.id === selectedPatient);
                return patient ? (
                  <div className="text-sm text-white/80 space-y-1">
                    <p><span className="text-purple-300">Name:</span> {patient.first_name} {patient.last_name}</p>
                    <p><span className="text-purple-300">Room:</span> {patient.room_number || 'Not assigned'}</p>
                    <p><span className="text-purple-300">Conditions:</span> {patient.medical_conditions?.join(', ') || 'None listed'}</p>
                    <p><span className="text-purple-300">Allergies:</span> {patient.allergies?.join(', ') || 'None listed'}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleRequestConsult}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Request Consultation
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

export default ConsultDialog;
