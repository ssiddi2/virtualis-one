
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  User, 
  Stethoscope, 
  UserPlus,
  Clock,
  Phone
} from "lucide-react";
import { useSpecialties, useOnCallSchedules, usePhysicians } from "@/hooks/usePhysicians";
import { usePatients } from "@/hooks/usePatients";
import { useToast } from "@/hooks/use-toast";

interface SmartRoutingCardProps {
  currentUser?: any;
  onSendMessage: (messageData: any) => void;
  hospitalId: string;
}

const SmartRoutingCard = ({ currentUser, onSendMessage, hospitalId }: SmartRoutingCardProps) => {
  const { toast } = useToast();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { data: physicians } = usePhysicians();
  const { data: patients } = usePatients(hospitalId);

  const [messageContent, setMessageContent] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedPhysician, setSelectedPhysician] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent' | 'critical'>('routine');

  const getOnCallPhysiciansForSpecialty = (specialtyId: string) => {
    return onCallSchedules?.filter(schedule => 
      schedule.specialty_id === specialtyId
    ) || [];
  };

  const getAllPhysiciansForSpecialty = (specialtyId: string) => {
    return physicians?.filter(physician => 
      physician.specialty_id === specialtyId
    ) || [];
  };

  const handleSend = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a clinical message.",
        variant: "destructive"
      });
      return;
    }

    const selectedPatientData = patients?.find(p => p.id === selectedPatient);
    const selectedSpecialtyData = specialties?.find(s => s.id === selectedSpecialty);
    const selectedPhysicianData = physicians?.find(p => p.id === selectedPhysician);

    const messageData = {
      content: messageContent,
      patientId: selectedPatient !== 'no-patient' ? selectedPatient : undefined,
      patientName: selectedPatientData ? `${selectedPatientData.first_name} ${selectedPatientData.last_name}` : undefined,
      specialtyId: selectedSpecialty,
      specialtyName: selectedSpecialtyData?.name,
      physicianId: selectedPhysician,
      physicianName: selectedPhysicianData ? `${selectedPhysicianData.first_name} ${selectedPhysicianData.last_name}` : undefined,
      urgency,
      sender: currentUser?.name || 'Current User',
      senderRole: currentUser?.role || 'Healthcare Provider'
    };

    onSendMessage(messageData);

    // Reset form
    setMessageContent('');
    setSelectedPatient('');
    setSelectedSpecialty('');
    setSelectedPhysician('');
    setUrgency('routine');

    toast({
      title: "Consultation Sent",
      description: `Message sent to ${selectedPhysicianData ? `Dr. ${selectedPhysicianData.first_name} ${selectedPhysicianData.last_name}` : selectedSpecialtyData?.name || 'selected recipient'}`,
    });
  };

  const onCallForSpecialty = selectedSpecialty ? getOnCallPhysiciansForSpecialty(selectedSpecialty) : [];
  const allPhysiciansForSpecialty = selectedSpecialty ? getAllPhysiciansForSpecialty(selectedSpecialty) : [];

  return (
    <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-300" />
          Smart Clinical Routing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Selection */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">Patient Context (Optional)</label>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="bg-purple-600/20 border border-purple-400/30 text-white">
              <SelectValue placeholder="Select patient..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
              <SelectItem value="no-patient">No specific patient</SelectItem>
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
          <label className="text-sm text-white/70 mb-2 block">Specialty</label>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="bg-purple-600/20 border border-purple-400/30 text-white">
              <SelectValue placeholder="Choose specialty..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
              {specialties?.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-3 w-3" />
                    {specialty.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* On-Call Physicians */}
        {onCallForSpecialty.length > 0 && (
          <div>
            <label className="text-sm text-white/70 mb-2 block flex items-center gap-2">
              <Clock className="h-3 w-3 text-green-400" />
              On-Call Now
            </label>
            <Select value={selectedPhysician} onValueChange={setSelectedPhysician}>
              <SelectTrigger className="bg-purple-600/20 border border-purple-400/30 text-white">
                <SelectValue placeholder="Select physician..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                <SelectItem value="">Any available physician</SelectItem>
                {onCallForSpecialty.map((schedule) => (
                  <SelectItem key={schedule.physician.id} value={schedule.physician.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        Dr. {schedule.physician.first_name} {schedule.physician.last_name}
                      </div>
                      <div className="flex items-center gap-1">
                        {schedule.is_primary && (
                          <Badge className="bg-green-600 text-white text-xs">Primary</Badge>
                        )}
                        <Phone className="h-3 w-3 text-green-400" />
                      </div>
                    </div>
                  </SelectItem>
                ))}
                {allPhysiciansForSpecialty
                  .filter(physician => !onCallForSpecialty.find(schedule => schedule.physician.id === physician.id))
                  .map((physician) => (
                    <SelectItem key={physician.id} value={physician.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        Dr. {physician.first_name} {physician.last_name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Urgency */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">Urgency Level</label>
          <Select value={urgency} onValueChange={(value: 'routine' | 'urgent' | 'critical') => setUrgency(value)}>
            <SelectTrigger className="bg-purple-600/20 border border-purple-400/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">Clinical Message</label>
          <Textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Describe the clinical situation or consultation request..."
            className="bg-purple-600/20 border border-purple-400/30 text-white placeholder:text-white/60 min-h-[100px]"
          />
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSend}
          disabled={!messageContent.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Clinical Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartRoutingCard;
