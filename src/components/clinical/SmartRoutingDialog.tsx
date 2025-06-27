
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Clock, Star, AlertTriangle } from "lucide-react";
import { useSpecialties, useOnCallSchedules, usePhysicians, useCreateConsultationRequest } from "@/hooks/usePhysicians";
import { useToast } from "@/hooks/use-toast";

interface SmartRoutingDialogProps {
  open: boolean;
  onClose: () => void;
  messageContent: string;
  messageId: string;
  urgency: 'routine' | 'urgent' | 'critical';
  patientId?: string;
  aiRecommendedSpecialty?: string;
}

const SmartRoutingDialog = ({
  open,
  onClose,
  messageContent,
  messageId,
  urgency,
  patientId,
  aiRecommendedSpecialty
}: SmartRoutingDialogProps) => {
  const { toast } = useToast();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { data: physicians } = usePhysicians();
  const createConsultationRequest = useCreateConsultationRequest();
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedPhysician, setSelectedPhysician] = useState('');
  const [routingType, setRoutingType] = useState<'consult' | 'page'>('consult');

  // Set AI recommended specialty as default
  useEffect(() => {
    if (aiRecommendedSpecialty && specialties) {
      const recommendedSpec = specialties.find(s => 
        s.name.toLowerCase().includes(aiRecommendedSpecialty.toLowerCase())
      );
      if (recommendedSpec) {
        setSelectedSpecialty(recommendedSpec.id);
      }
    }
  }, [aiRecommendedSpecialty, specialties]);

  const getOnCallPhysicians = (specialtyId: string) => {
    return onCallSchedules?.filter(schedule => 
      schedule.specialty_id === specialtyId
    ) || [];
  };

  const getPhysiciansBySpecialty = (specialtyId: string) => {
    return physicians?.filter(physician => 
      physician.specialty_id === specialtyId
    ) || [];
  };

  const handleSendConsultation = async () => {
    if (!selectedSpecialty) {
      toast({
        title: "Error",
        description: "Please select a specialty",
        variant: "destructive"
      });
      return;
    }

    try {
      await createConsultationRequest.mutateAsync({
        message_id: messageId,
        requested_specialty_id: selectedSpecialty,
        consulted_physician_id: selectedPhysician || undefined,
        patient_id: patientId,
        urgency,
        clinical_question: messageContent,
        ai_recommendation: aiRecommendedSpecialty
      });

      const specialtyName = specialties?.find(s => s.id === selectedSpecialty)?.name;
      const physicianName = physicians?.find(p => p.id === selectedPhysician);
      
      toast({
        title: "Consultation Requested",
        description: `${routingType === 'consult' ? 'Consultation' : 'Page'} sent to ${
          physicianName ? `${physicianName.first_name} ${physicianName.last_name}` : specialtyName
        }`,
      });

      onClose();
    } catch (error) {
      console.error('Error sending consultation:', error);
      toast({
        title: "Error",
        description: "Failed to send consultation request",
        variant: "destructive"
      });
    }
  };

  const selectedSpecialtyName = specialties?.find(s => s.id === selectedSpecialty)?.name;
  const onCallForSpecialty = selectedSpecialty ? getOnCallPhysicians(selectedSpecialty) : [];
  const allPhysiciansForSpecialty = selectedSpecialty ? getPhysiciansBySpecialty(selectedSpecialty) : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1a2332] border-[#2a3441] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Smart Clinical Routing
          </DialogTitle>
          <DialogDescription className="text-white/70">
            AI-powered specialty recommendation and physician routing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Recommendation */}
          {aiRecommendedSpecialty && (
            <Card className="bg-[#0f1922] border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-400" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-purple-600 text-white">
                  {aiRecommendedSpecialty}
                </Badge>
                <p className="text-xs text-white/70 mt-2">
                  Based on message content analysis
                </p>
              </CardContent>
            </Card>
          )}

          {/* Routing Type Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Routing Type</label>
            <div className="flex gap-2">
              <Button
                variant={routingType === 'consult' ? 'default' : 'outline'}
                onClick={() => setRoutingType('consult')}
                className={routingType === 'consult' 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-[#0f1922] border-[#2a3441] text-white hover:bg-[#2a3441]"
                }
              >
                New Consultation
              </Button>
              <Button
                variant={routingType === 'page' ? 'default' : 'outline'}
                onClick={() => setRoutingType('page')}
                className={routingType === 'page' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-[#0f1922] border-[#2a3441] text-white hover:bg-[#2a3441]"
                }
              >
                Page Physician
              </Button>
            </div>
          </div>

          {/* Specialty Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Select Specialty</label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                <SelectValue placeholder="Choose specialty..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                {specialties?.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{specialty.name}</span>
                      {specialty.name === aiRecommendedSpecialty && (
                        <Star className="h-3 w-3 text-purple-400 ml-2" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* On-Call Physicians */}
          {selectedSpecialty && onCallForSpecialty.length > 0 && (
            <Card className="bg-[#0f1922] border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  On-Call Now - {selectedSpecialtyName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {onCallForSpecialty.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPhysician === schedule.physician.id
                        ? 'bg-green-600/20 border-green-500'
                        : 'bg-[#1a2332] border-[#2a3441] hover:border-green-500/50'
                    }`}
                    onClick={() => setSelectedPhysician(schedule.physician.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-400" />
                        <span className="font-medium">
                          {schedule.physician.first_name} {schedule.physician.last_name}
                        </span>
                        {schedule.is_primary && (
                          <Badge className="bg-green-600 text-white text-xs">Primary</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Phone className="h-3 w-3" />
                        {schedule.physician.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* All Physicians in Specialty */}
          {selectedSpecialty && allPhysiciansForSpecialty.length > 0 && (
            <Card className="bg-[#0f1922] border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  All {selectedSpecialtyName} Physicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-32 overflow-y-auto">
                {allPhysiciansForSpecialty.map((physician) => (
                  <div
                    key={physician.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedPhysician === physician.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'bg-[#1a2332] border-[#2a3441] hover:border-blue-500/50'
                    }`}
                    onClick={() => setSelectedPhysician(physician.id)}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>{physician.first_name} {physician.last_name}</span>
                      <span className="text-white/70">{physician.phone}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSendConsultation}
              disabled={!selectedSpecialty || createConsultationRequest.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createConsultationRequest.isPending ? 'Sending...' : `Send ${routingType === 'consult' ? 'Consultation' : 'Page'}`}
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

export default SmartRoutingDialog;
