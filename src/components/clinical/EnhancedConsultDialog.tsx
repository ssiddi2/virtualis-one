
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { useSpecialties, useOnCallSchedules } from '@/hooks/usePhysicians';
import { 
  User, 
  Stethoscope, 
  AlertTriangle, 
  Clock, 
  MessageSquare,
  Phone,
  Moon,
  UserCheck
} from 'lucide-react';

interface EnhancedConsultDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (consultRequest: any) => void;
}

const EnhancedConsultDialog = ({ open, onClose, onSubmit }: EnhancedConsultDialogProps) => {
  const [selectedUrgency, setSelectedUrgency] = useState<'critical' | 'urgent' | 'routine'>('urgent');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [consultationType, setConsultationType] = useState<'new' | 'established'>('new');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [consultOption, setConsultOption] = useState<'specialty' | 'nocturnist'>('specialty');
  const [clinicalQuestion, setClinicalQuestion] = useState('');

  const { data: patients } = usePatients();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();

  const urgencyOptions = [
    { value: 'critical', label: 'High', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'urgent', label: 'Moderate', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { value: 'routine', label: 'Low', color: 'bg-green-500 hover:bg-green-600' }
  ];

  const recommendedSpecialties = [
    'Cardiologist',
    'Infectious Disease',
    'Nephrologist',
    'Neurologist',
    'Nocturnist',
    'Pulmonologist'
  ];

  const availableProviders = [
    'Dr. Sam Benning',
    'Dr. Andrew Peacock',
    'Abbas NP',
    'Dr. Fayez H.',
    'Frank Jones',
    'Dr. Sohail D.O.C',
    'Dr. Hana Khan'
  ];

  const getOnCallPhysician = (specialtyName: string) => {
    if (!specialties || !onCallSchedules) return null;
    
    const specialty = specialties.find(s => s.name.toLowerCase().includes(specialtyName.toLowerCase()));
    if (!specialty) return null;
    
    const onCallSchedule = onCallSchedules.find(schedule => 
      schedule.specialty_id === specialty.id && schedule.is_primary
    );
    
    return onCallSchedule?.physician || null;
  };

  const handleSubmit = () => {
    const consultRequest = {
      urgency: selectedUrgency,
      patientId: selectedPatient,
      consultationType,
      specialty: selectedSpecialty,
      provider: selectedProvider,
      consultOption,
      clinicalQuestion,
      timestamp: new Date()
    };
    
    onSubmit(consultRequest);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-white text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            REQUEST CONSULT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Urgency Selection */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Priority Level</label>
              <div className="flex gap-2">
                {urgencyOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setSelectedUrgency(option.value as any)}
                    className={`
                      ${selectedUrgency === option.value ? option.color : 'bg-white/10 hover:bg-white/20'}
                      text-white font-medium px-6 py-2 rounded-full backdrop-blur-sm border border-white/30
                    `}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Selection */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Attach Patient</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-slate-600 text-white rounded-lg">
                  <SelectItem value="none">No patient selected</SelectItem>
                  {patients?.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {patient.first_name} {patient.last_name} - {patient.mrn}
                        {patient.room_number && ` (Room ${patient.room_number})`}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Consultation Type */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Consultation Type</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setConsultationType('new')}
                  className={`${consultationType === 'new' 
                    ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  New Consult
                </Button>
                <Button
                  onClick={() => setConsultationType('established')}
                  className={`${consultationType === 'established' 
                    ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Established Patient
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Options */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Consultation Option</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setConsultOption('specialty')}
                  className={`${consultOption === 'specialty' 
                    ? 'bg-purple-600/50 hover:bg-purple-600/70 border-purple-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Specialty Consult
                </Button>
                <Button
                  onClick={() => setConsultOption('nocturnist')}
                  className={`${consultOption === 'nocturnist' 
                    ? 'bg-indigo-600/50 hover:bg-indigo-600/70 border-indigo-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Nocturnist
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Specialists */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Recommended Specialist</h3>
              <div className="grid grid-cols-2 gap-2">
                {recommendedSpecialties.map((specialty) => {
                  const onCallDoc = getOnCallPhysician(specialty);
                  return (
                    <Button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`
                        p-3 h-auto flex flex-col items-start backdrop-blur-sm border rounded-lg
                        ${selectedSpecialty === specialty && specialty === 'Cardiologist'
                          ? 'bg-orange-600/50 hover:bg-orange-600/70 border-orange-400/50' 
                          : selectedSpecialty === specialty
                          ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                          : 'bg-white/10 hover:bg-white/20 border-white/30'
                        }
                      `}
                    >
                      <span className="font-medium">{specialty}</span>
                      {onCallDoc && (
                        <span className="text-xs text-white/70 mt-1">
                          On Call: {onCallDoc.first_name} {onCallDoc.last_name}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Manual Provider Selection */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Choose a Provider</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableProviders.map((provider) => (
                  <Button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`${selectedProvider === provider 
                      ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/30'
                    } backdrop-blur-sm border rounded-lg`}
                  >
                    {provider}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clinical Question */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Clinical Question</label>
              <Textarea
                value={clinicalQuestion}
                onChange={(e) => setClinicalQuestion(e.target.value)}
                placeholder="Describe the clinical situation and specific question..."
                className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[100px] backdrop-blur-sm rounded-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/20">
          <Button
            onClick={handleSubmit}
            disabled={!clinicalQuestion.trim()}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white backdrop-blur-sm border border-green-400/30 rounded-lg"
          >
            <Phone className="h-4 w-4 mr-2" />
            Send Consult Request
          </Button>
          <Button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedConsultDialog;
