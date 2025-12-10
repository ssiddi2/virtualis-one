import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  AlertTriangle,
  Activity,
  Heart,
  Thermometer,
  Wind
} from 'lucide-react';

interface PatientSummaryCardProps {
  patient: any;
  allergies?: any[];
  activeProblems?: any[];
  vitals?: {
    blood_pressure?: string;
    heart_rate?: string;
    temperature?: string;
    oxygen_saturation?: string;
  };
}

const PatientSummaryCard = ({ patient, allergies, activeProblems, vitals }: PatientSummaryCardProps) => {
  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
  const admissionDays = patient.admission_date ? 
    Math.floor((new Date().getTime() - new Date(patient.admission_date).getTime()) / (1000 * 3600 * 24)) : 0;

  return (
    <div className="space-y-4">
      <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient Demographics & Vitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Demographics</h4>
              <div className="text-white/80 text-sm space-y-1">
                <p><span className="font-medium">Age:</span> {age} years</p>
                <p><span className="font-medium">Gender:</span> {patient.gender || 'Unknown'}</p>
                <p><span className="font-medium">Blood Type:</span> {patient.blood_type || 'Unknown'}</p>
                <p><span className="font-medium">MRN:</span> {patient.mrn}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Admission Info</h4>
              <div className="text-white/80 text-sm space-y-1">
                <p><span className="font-medium">Room:</span> {patient.room_number || 'Unassigned'}</p>
                <p><span className="font-medium">Bed:</span> {patient.bed_number || 'N/A'}</p>
                <p><span className="font-medium">Admitted:</span> {patient.admission_date ? new Date(patient.admission_date).toLocaleDateString() : 'N/A'}</p>
                <p><span className="font-medium">LOS:</span> {admissionDays} days</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Latest Vitals</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <Activity className="h-4 w-4 text-red-400 mx-auto mb-1" />
                  <p className="text-white font-bold text-lg">{vitals?.blood_pressure || '--/--'}</p>
                  <p className="text-white/60 text-xs">BP</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <Heart className="h-4 w-4 text-pink-400 mx-auto mb-1" />
                  <p className="text-white font-bold text-lg">{vitals?.heart_rate || '--'}</p>
                  <p className="text-white/60 text-xs">HR</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <Thermometer className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                  <p className="text-white font-bold text-lg">{vitals?.temperature || '--'}°</p>
                  <p className="text-white/60 text-xs">Temp</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <Wind className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-white font-bold text-lg">{vitals?.oxygen_saturation || '--'}%</p>
                  <p className="text-white/60 text-xs">O2 Sat</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-semibold">Contact</h4>
              <div className="text-white/80 text-sm space-y-1">
                <p><span className="font-medium">Phone:</span> {patient.phone || 'N/A'}</p>
                <p><span className="font-medium">Emergency:</span> {patient.emergency_contact_name || 'N/A'}</p>
                <p><span className="font-medium">Insurance:</span> {patient.insurance_provider || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Critical Alerts - Allergies */}
          {allergies && allergies.length > 0 && (
            <div className="p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-red-200 font-semibold">ALLERGIES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.filter(a => a.status === 'active').map((allergy, index) => (
                  <Badge key={index} className="bg-red-600 text-white text-xs">
                    {allergy.allergen} ({allergy.severity})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Also show allergies from patient record if no allergies table data */}
          {(!allergies || allergies.length === 0) && patient.allergies && patient.allergies.length > 0 && (
            <div className="p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-red-200 font-semibold">ALLERGIES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy: string, index: number) => (
                  <Badge key={index} className="bg-red-600 text-white text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Active Problems */}
          {activeProblems && activeProblems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Active Problems</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeProblems.slice(0, 6).map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-2 bg-blue-600/20 rounded border border-blue-400/30">
                    <div>
                      <p className="text-white font-medium text-sm">{problem.problem_name}</p>
                      {problem.icd10_code && <p className="text-white/60 text-xs">{problem.icd10_code}</p>}
                    </div>
                    <Badge className={
                      problem.severity === 'high' ? 'bg-red-600' : 
                      problem.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                    }>
                      {problem.severity || 'Low'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Conditions from Patient Record */}
          {(!activeProblems || activeProblems.length === 0) && patient.medical_conditions && patient.medical_conditions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Medical Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {patient.medical_conditions.map((condition: string, index: number) => (
                  <Badge key={index} className="bg-blue-600 text-white">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Current Medications from Patient Record */}
          {patient.current_medications && patient.current_medications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Current Medications</h4>
              <div className="flex flex-wrap gap-2">
                {patient.current_medications.map((med: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-white border-white/30">
                    {med}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientSummaryCard;
