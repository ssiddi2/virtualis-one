
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Zap, Target, Cpu } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';

interface ConsultDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

const ConsultDialog = ({ open, onClose, hospitalId }: ConsultDialogProps) => {
  const { toast } = useToast();
  const { data: patients } = usePatients(hospitalId);
  const [consultation, setConsultation] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'critical'>('routine');
  const [specialty, setSpecialty] = useState('');

  const specialties = [
    'Cardiology',
    'Pulmonology', 
    'Neurology',
    'Emergency Medicine',
    'Surgery',
    'Internal Medicine',
    'Orthopedics',
    'Radiology',
    'Pathology',
    'Anesthesiology'
  ];

  const handleNeuraConsult = () => {
    if (!consultation.trim()) {
      toast({
        title: "Neural Input Required",
        description: "Please describe the clinical scenario for AI analysis",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Neural Consult Initiated",
      description: `AI analyzing case with ${priority} priority${selectedPatient ? ' for selected patient' : ''}`,
    });

    // Reset form
    setConsultation('');
    setSelectedPatient('');
    setPriority('routine');
    setSpecialty('');
    onClose();
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'urgent': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'routine': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getPriorityIcon = (level: string) => {
    switch (level) {
      case 'critical': return <Zap className="h-3 w-3" />;
      case 'urgent': return <Target className="h-3 w-3" />;
      case 'routine': return <Cpu className="h-3 w-3" />;
      default: return <Cpu className="h-3 w-3" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1a2332]/95 backdrop-blur-xl border-[#2a3441]/50 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Neural Consultation System
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Advanced AI-powered clinical consultation and specialty routing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Neural Link */}
          <div>
            <label className="text-sm text-white/70 mb-2 block flex items-center gap-2">
              <User className="h-3 w-3" />
              Patient Neural Link (Optional)
            </label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="bg-[#0f1922]/80 border-[#2a3441]/50 text-white backdrop-blur-sm">
                <SelectValue placeholder="Select patient for contextual analysis..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332]/95 border-[#2a3441]/50 text-white backdrop-blur-xl">
                <SelectItem value="">No patient link</SelectItem>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.mrn}
                    {patient.room_number && ` (Room ${patient.room_number})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Neural Classification */}
          <div>
            <label className="text-sm text-white/70 mb-2 block flex items-center gap-2">
              <Target className="h-3 w-3" />
              Neural Priority Classification
            </label>
            <Select value={priority} onValueChange={(value: 'routine' | 'urgent' | 'critical') => setPriority(value)}>
              <SelectTrigger className="bg-[#0f1922]/80 border-[#2a3441]/50 text-white backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332]/95 border-[#2a3441]/50 text-white backdrop-blur-xl">
                <SelectItem value="routine">Routine Analysis</SelectItem>
                <SelectItem value="urgent">Urgent Processing</SelectItem>
                <SelectItem value="critical">Critical Override</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={`mt-2 ${getPriorityColor(priority)} flex items-center gap-1 w-fit`}>
              {getPriorityIcon(priority)}
              <span>{priority.toUpperCase()} NEURAL MODE</span>
            </Badge>
          </div>

          {/* Specialty Targeting */}
          <div>
            <label className="text-sm text-white/70 mb-2 block flex items-center gap-2">
              <Brain className="h-3 w-3" />
              Specialty Neural Target (Optional)
            </label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="bg-[#0f1922]/80 border-[#2a3441]/50 text-white backdrop-blur-sm">
                <SelectValue placeholder="AI will auto-determine optimal specialty..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332]/95 border-[#2a3441]/50 text-white backdrop-blur-xl">
                <SelectItem value="">Auto-Neural Detection</SelectItem>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clinical Neural Input */}
          <div>
            <label className="text-sm text-white/70 mb-2 block flex items-center gap-2">
              <Cpu className="h-3 w-3" />
              Clinical Neural Input
            </label>
            <Textarea
              value={consultation}
              onChange={(e) => setConsultation(e.target.value)}
              placeholder="Describe clinical scenario... Neural AI will analyze symptoms, suggest differential diagnosis, and route to optimal specialist..."
              className="bg-[#0f1922]/80 border-[#2a3441]/50 text-white placeholder:text-white/60 min-h-[120px] backdrop-blur-sm"
            />
            <div className="flex items-center gap-2 mt-2">
              <Brain className="h-3 w-3 text-purple-300" />
              <p className="text-xs text-white/60">
                Neural processing: Symptom Analysis → Differential Diagnosis → Specialty Routing → Expert Connection
              </p>
            </div>
          </div>

          {/* Patient Neural Context Preview */}
          {selectedPatient && patients && (
            <div className="p-3 bg-[#0f1922]/60 backdrop-blur-sm border border-[#2a3441]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Neural Patient Context</span>
              </div>
              {(() => {
                const patient = patients.find(p => p.id === selectedPatient);
                return patient ? (
                  <div className="text-sm text-white/80 space-y-1">
                    <p><span className="text-blue-300">Neural ID:</span> {patient.first_name} {patient.last_name}</p>
                    <p><span className="text-blue-300">Location:</span> {patient.room_number || 'Unassigned'}</p>
                    <p><span className="text-blue-300">Medical Matrix:</span> {patient.medical_conditions?.join(', ') || 'Clean profile'}</p>
                    <p><span className="text-blue-300">Allergy Flags:</span> {patient.allergies?.join(', ') || 'None detected'}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Neural Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-[#2a3441]/50">
            <Button
              onClick={handleNeuraConsult}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Initiate Neural Consult
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-[#0f1922]/60 border-[#2a3441]/50 text-white hover:bg-[#2a3441]/30 backdrop-blur-sm"
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
