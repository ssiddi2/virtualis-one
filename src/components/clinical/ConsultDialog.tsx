
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Zap, Target, Cpu, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
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
  const [selectedPatient, setSelectedPatient] = useState('none');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'critical'>('routine');
  const [acuity, setAcuity] = useState<'low' | 'moderate' | 'critical'>('low');
  const [specialty, setSpecialty] = useState('auto');

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

  const handleConsult = () => {
    console.log('Consult initiated');
    if (!consultation.trim()) {
      toast({
        title: "Clinical Input Required",
        description: "Please describe the clinical scenario for consultation",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Consultation Initiated",
      description: `Consultation request submitted with ${priority} priority and ${acuity} acuity${selectedPatient !== 'none' ? ' for selected patient' : ''}`,
    });

    // Reset form
    setConsultation('');
    setSelectedPatient('none');
    setPriority('routine');
    setAcuity('low');
    setSpecialty('auto');
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

  const getAcuityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600/30 text-red-100 border-red-500/50';
      case 'moderate': return 'bg-yellow-600/30 text-yellow-100 border-yellow-500/50';
      case 'low': return 'bg-green-600/30 text-green-100 border-green-500/50';
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
            <Brain className="h-5 w-5 text-purple-400" />
            Clinical Consultation System
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Advanced clinical consultation and specialty routing with acuity assessment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Patient Selection */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <User className="h-3 w-3" />
              Patient Selection (Optional)
            </label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue placeholder="Select patient for consultation..." />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="none">No patient selected</SelectItem>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.mrn}
                    {patient.room_number && ` (Room ${patient.room_number})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Acuity Assessment */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" />
              Clinical Acuity Level
            </label>
            <Select value={acuity} onValueChange={(value: 'low' | 'moderate' | 'critical') => setAcuity(value)}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="low">Low Acuity - Stable Condition</SelectItem>
                <SelectItem value="moderate">Moderate Acuity - Requires Monitoring</SelectItem>
                <SelectItem value="critical">Critical Acuity - Immediate Attention</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={`mt-2 ${getAcuityColor(acuity)} flex items-center gap-1 w-fit border font-semibold`}>
              {getAcuityIcon(acuity)}
              <span>{acuity.toUpperCase()} ACUITY</span>
            </Badge>
          </div>

          {/* Priority Classification */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <Target className="h-3 w-3" />
              Priority Classification
            </label>
            <Select value={priority} onValueChange={(value: 'routine' | 'urgent' | 'critical') => setPriority(value)}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="routine">Routine Consultation</SelectItem>
                <SelectItem value="urgent">Urgent Consultation</SelectItem>
                <SelectItem value="critical">Critical Consultation</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={`mt-2 ${getPriorityColor(priority)} flex items-center gap-1 w-fit border`}>
              {getPriorityIcon(priority)}
              <span>{priority.toUpperCase()} PRIORITY</span>
            </Badge>
          </div>

          {/* Specialty Selection */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <Brain className="h-3 w-3" />
              Specialty Target (Optional)
            </label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue placeholder="Auto-determine optimal specialty..." />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="auto">Auto-Detection</SelectItem>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clinical Input */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <Cpu className="h-3 w-3" />
              Clinical Consultation Request
            </label>
            <Textarea
              value={consultation}
              onChange={(e) => setConsultation(e.target.value)}
              placeholder="Describe clinical scenario for consultation... Include symptoms, current treatment, and specific questions for specialist..."
              className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[120px] backdrop-blur-sm rounded-lg"
            />
            <div className="flex items-center gap-2 mt-2">
              <Brain className="h-3 w-3 text-purple-300" />
              <p className="text-xs text-white/60">
                Processing: Clinical Analysis → Acuity Assessment → Differential Diagnosis → Specialty Routing → Expert Connection
              </p>
            </div>
          </div>

          {/* Patient Context Preview */}
          {selectedPatient !== 'none' && patients && (
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
                    <p><span className="text-blue-300">Conditions:</span> {patient.medical_conditions?.join(', ') || 'None documented'}</p>
                    <p><span className="text-blue-300">Allergies:</span> {patient.allergies?.join(', ') || 'None documented'}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Acuity Summary */}
          <div className="p-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium text-white">Consultation Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${getAcuityColor(acuity)} text-xs border font-semibold`}>
                  {acuity.toUpperCase()}
                </Badge>
                <Badge className={`${getPriorityColor(priority)} text-xs border`}>
                  {priority.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-white/20">
            <Button
              onClick={handleConsult}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Initiate Consultation
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

export default ConsultDialog;
