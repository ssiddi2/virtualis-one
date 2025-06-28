
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Send, 
  User, 
  Stethoscope, 
  Clock,
  Phone,
  Zap,
  FileText,
  UserPlus
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
  const [messageType, setMessageType] = useState<'page' | 'consult'>('consult');
  const [consultType, setConsultType] = useState<'new' | 'established'>('new');

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

    // For direct pages, physician selection is required
    if (messageType === 'page' && !selectedPhysician) {
      toast({
        title: "Physician Required",
        description: "Please select a physician to page.",
        variant: "destructive"
      });
      return;
    }

    // For consults, either specialty or specific physician is required
    if (messageType === 'consult' && !selectedSpecialty && !selectedPhysician) {
      toast({
        title: "Recipient Required",
        description: "Please select a specialty or specific physician for consultation.",
        variant: "destructive"
      });
      return;
    }

    const selectedPatientData = patients?.find(p => p.id === selectedPatient);
    const selectedSpecialtyData = specialties?.find(s => s.id === selectedSpecialty);
    const selectedPhysicianData = physicians?.find(p => p.id === selectedPhysician);

    const messageData = {
      content: messageContent,
      patientId: messageType === 'consult' && selectedPatient !== 'no-patient' ? selectedPatient : undefined,
      patientName: selectedPatientData ? `${selectedPatientData.first_name} ${selectedPatientData.last_name}` : undefined,
      specialtyId: selectedSpecialty,
      specialtyName: selectedSpecialtyData?.name,
      physicianId: selectedPhysician,
      physicianName: selectedPhysicianData ? `${selectedPhysicianData.first_name} ${selectedPhysicianData.last_name}` : undefined,
      urgency: messageType === 'page' ? 'urgent' : urgency, // Pages are always urgent
      sender: currentUser?.name || 'Current User',
      senderRole: currentUser?.role || 'Healthcare Provider',
      messageType: messageType,
      consultType: messageType === 'consult' ? consultType : undefined,
      isPriorityPage: messageType === 'page'
    };

    onSendMessage(messageData);

    // Reset form
    setMessageContent('');
    setSelectedPatient('');
    setSelectedSpecialty('');
    setSelectedPhysician('');
    setUrgency('routine');

    const recipientName = selectedPhysicianData 
      ? `Dr. ${selectedPhysicianData.first_name} ${selectedPhysicianData.last_name}` 
      : selectedSpecialtyData?.name || 'selected recipient';

    toast({
      title: messageType === 'page' ? "Page Sent" : "Consultation Sent",
      description: `${messageType === 'page' ? 'Page' : 'Consultation'} sent to ${recipientName}`,
    });
  };

  const onCallForSpecialty = selectedSpecialty ? getOnCallPhysiciansForSpecialty(selectedSpecialty) : [];
  const allPhysiciansForSpecialty = selectedSpecialty ? getAllPhysiciansForSpecialty(selectedSpecialty) : [];

  return (
    <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-300" />
          Clinical Communication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Message Type Selection */}
        <Tabs value={messageType} onValueChange={(value: 'page' | 'consult') => setMessageType(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-purple-600/20 border border-purple-400/30">
            <TabsTrigger value="page" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Zap className="h-4 w-4 mr-2" />
              Direct Page
            </TabsTrigger>
            <TabsTrigger value="consult" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Consult
            </TabsTrigger>
          </TabsList>

          <TabsContent value="page" className="space-y-4">
            <div className="p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-orange-300" />
                <span className="text-sm text-orange-200 font-medium">Priority Page</span>
              </div>
              <p className="text-xs text-orange-200/80">
                Direct page to another provider. These messages are prioritized and don't require patient context.
              </p>
            </div>

            {/* Specialty for Page */}
            <div>
              <label className="text-sm text-white/70 mb-2 block">Specialty (Optional)</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="bg-purple-600/20 border border-purple-400/30 text-white">
                  <SelectValue placeholder="Choose specialty..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                  <SelectItem value="">Any specialty</SelectItem>
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

            {/* Physician Selection for Page */}
            <div>
              <label className="text-sm text-white/70 mb-2 block">Select Physician *</label>
              <Select value={selectedPhysician} onValueChange={setSelectedPhysician}>
                <SelectTrigger className="bg-purple-600/20 border border-purple-400/30 text-white">
                  <SelectValue placeholder="Select physician to page..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                  {selectedSpecialty ? (
                    <>
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
                              <Clock className="h-3 w-3 text-green-400" />
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
                    </>
                  ) : (
                    physicians?.map((physician) => (
                      <SelectItem key={physician.id} value={physician.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          Dr. {physician.first_name} {physician.last_name}
                          {physician.specialty && (
                            <Badge className="bg-blue-600/20 text-blue-200 text-xs ml-2">
                              {physician.specialty.name}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="consult" className="space-y-4">
            {/* Consult Type */}
            <div>
              <label className="text-sm text-white/70 mb-2 block">Consultation Type</label>
              <Select value={consultType} onValueChange={(value: 'new' | 'established') => setConsultType(value)}>
                <SelectTrigger className="bg-purple-600/20 border border-purple-400/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-3 w-3" />
                      New Consult
                    </div>
                  </SelectItem>
                  <SelectItem value="established">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      Established Patient
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Patient Selection for Consult */}
            <div>
              <label className="text-sm text-white/70 mb-2 block">Patient Context</label>
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

            {/* Specialty Selection for Consult */}
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

            {/* On-Call Physicians for Consult */}
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

            {/* Urgency for Consult */}
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
          </TabsContent>
        </Tabs>

        {/* Message Content */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">
            {messageType === 'page' ? 'Page Message' : 'Clinical Message'}
          </label>
          <Textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder={messageType === 'page' 
              ? "Brief page message..." 
              : "Describe the clinical situation or consultation request..."
            }
            className="bg-purple-600/20 border border-purple-400/30 text-white placeholder:text-white/60 min-h-[100px]"
          />
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSend}
          disabled={!messageContent.trim()}
          className={`w-full ${messageType === 'page' 
            ? 'bg-orange-600 hover:bg-orange-700' 
            : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {messageType === 'page' ? (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Send Priority Page
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Clinical Message
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartRoutingCard;
