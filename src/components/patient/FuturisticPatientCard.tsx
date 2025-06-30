
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  MapPin, 
  Phone, 
  Calendar,
  Heart,
  Activity,
  AlertTriangle,
  Clock,
  Stethoscope,
  FlaskConical,
  FileText
} from 'lucide-react';

interface PatientCardProps {
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string;
    room_number?: string;
    bed_number?: string;
    date_of_birth: string;
    gender?: string;
    phone?: string;
    status: string;
    admission_date?: string;
    allergies?: string[];
    medical_conditions?: string[];
  };
  onViewChart: (patientId: string) => void;
  onViewLabs: (patientId: string) => void;
}

const FuturisticPatientCard = ({ patient, onViewChart, onViewLabs }: PatientCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'discharged': return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getDaysAdmitted = (admissionDate?: string) => {
    if (!admissionDate) return null;
    const today = new Date();
    const admission = new Date(admissionDate);
    const diffTime = Math.abs(today.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-300/30 hover:bg-blue-500/30 transition-all shadow-2xl rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/30 rounded-full">
              <User className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <CardTitle className="text-white text-lg font-bold">
                {patient.first_name} {patient.last_name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>MRN: {patient.mrn}</span>
                <span>•</span>
                <span>{calculateAge(patient.date_of_birth)}y {patient.gender}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(patient.status)}>
            {patient.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location & Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {patient.room_number && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-3 w-3 text-purple-400" />
                <span>Room {patient.room_number}{patient.bed_number && `-${patient.bed_number}`}</span>
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Phone className="h-3 w-3 text-purple-400" />
                <span>{patient.phone}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {patient.admission_date && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Calendar className="h-3 w-3 text-purple-400" />
                <span>Day {getDaysAdmitted(patient.admission_date)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Medical Info */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="font-medium">Allergies:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.allergies.map((allergy, index) => (
                <Badge key={index} className="bg-red-500/20 text-red-200 border-red-400/30 text-xs">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {patient.medical_conditions && patient.medical_conditions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Heart className="h-3 w-3 text-pink-400" />
              <span className="font-medium">Conditions:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.medical_conditions.slice(0, 3).map((condition, index) => (
                <Badge key={index} className="bg-pink-500/20 text-pink-200 border-pink-400/30 text-xs">
                  {condition}
                </Badge>
              ))}
              {patient.medical_conditions.length > 3 && (
                <Badge className="bg-gray-500/20 text-gray-200 border-gray-400/30 text-xs">
                  +{patient.medical_conditions.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 mt-4 border-t border-white/20">
          <Button 
            size="sm" 
            onClick={() => onViewChart(patient.id)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <FileText className="h-3 w-3 mr-1" />
            Chart
          </Button>
          <Button 
            size="sm" 
            onClick={() => onViewLabs(patient.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            <FlaskConical className="h-3 w-3 mr-1" />
            Labs
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Activity className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FuturisticPatientCard;
