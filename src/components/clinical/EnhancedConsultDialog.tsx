
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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">REQUEST CONSULT</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Urgency Selection */}
          <div>
            <div className="flex gap-2 mb-4">
              {urgencyOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => setSelectedUrgency(option.value as any)}
                  className={`
                    ${selectedUrgency === option.value ? option.color : 'bg-gray-600 hover:bg-gray-700'}
                    text-white font-medium px-6 py-2 rounded-full
                  `}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Patient Selection */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Attach Patient</label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="bg-blue-600/20 border border-blue-400/30 text-white">
                <SelectValue placeholder="Select patient..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                <SelectItem value="">No patient selected</SelectItem>
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
          </div>

          {/* Consultation Type */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Consultation Type</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setConsultationType('new')}
                variant={consultationType === 'new' ? 'default' : 'outline'}
                className={consultationType === 'new' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20'
                }
              >
                <UserCheck className="h-4 w-4 mr-2" />
                New Consult
              </Button>
              <Button
                onClick={() => setConsultationType('established')}
                variant={consultationType === 'established' ? 'default' : 'outline'}
                className={consultationType === 'established' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20'
                }
              >
                <User className="h-4 w-4 mr-2" />
                Established Patient
              </Button>
            </div>
          </div>

          {/* Consultation Options */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Consultation Option</label>
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setConsultOption('specialty')}
                variant={consultOption === 'specialty' ? 'default' : 'outline'}
                className={consultOption === 'specialty' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-transparent border-purple-400/30 text-white hover:bg-purple-500/20'
                }
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Specialty Consult
              </Button>
              <Button
                onClick={() => setConsultOption('nocturnist')}
                variant={consultOption === 'nocturnist' ? 'default' : 'outline'}
                className={consultOption === 'nocturnist' 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-transparent border-indigo-400/30 text-white hover:bg-indigo-500/20'
                }
              >
                <Moon className="h-4 w-4 mr-2" />
                Nocturnist
              </Button>
            </div>
          </div>

          {/* Recommended Specialists */}
          <div>
            <h3 className="text-white font-medium mb-3">Recommended Specialist</h3>
            <div className="grid grid-cols-2 gap-2">
              {recommendedSpecialties.map((specialty) => {
                const onCallDoc = getOnCallPhysician(specialty);
                return (
                  <Button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                    className={`
                      p-3 h-auto flex flex-col items-start
                      ${selectedSpecialty === specialty && specialty === 'Cardiologist'
                        ? 'bg-orange-600 hover:bg-orange-700 border-orange-500' 
                        : selectedSpecialty === specialty
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600/20 border-gray-400/30 text-white hover:bg-gray-500/30'
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
          </div>

          {/* Manual Provider Selection */}
          <div>
            <h3 className="text-white font-medium mb-3">Choose a Provider</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableProviders.map((provider) => (
                <Button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  variant={selectedProvider === provider ? 'default' : 'outline'}
                  className={selectedProvider === provider 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600/20 border-gray-400/30 text-white hover:bg-gray-500/30'
                  }
                >
                  {provider}
                </Button>
              ))}
            </div>
          </div>

          {/* Clinical Question */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">Clinical Question</label>
            <Textarea
              value={clinicalQuestion}
              onChange={(e) => setClinicalQuestion(e.target.value)}
              placeholder="Describe the clinical situation and specific question..."
              className="bg-blue-600/20 border border-blue-400/30 text-white placeholder:text-white/60 min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!clinicalQuestion.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Send Consult Request
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-400/30 text-white hover:bg-gray-500/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedConsultDialog;
