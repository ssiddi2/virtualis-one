
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  AlertTriangle,
  Clock,
  Activity,
  Thermometer
} from 'lucide-react';

interface PatientSummaryCardProps {
  patient: any;
  allergies?: any[];
  activeProblems?: any[];
  vitals?: any;
}

const PatientSummaryCard = ({ patient, allergies, activeProblems, vitals }: PatientSummaryCardProps) => {
  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
  const admissionDays = patient.admission_date ? 
    Math.floor((new Date().getTime() - new Date(patient.admission_date).getTime()) / (1000 * 3600 * 24)) : 0;

  return (
    <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Summary - Inpatient Rounding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="text-white/80 text-sm space-y-1">
              <p><span className="font-medium">BP:</span> {vitals?.blood_pressure || '--/--'}</p>
              <p><span className="font-medium">HR:</span> {vitals?.heart_rate || '--'} bpm</p>
              <p><span className="font-medium">Temp:</span> {vitals?.temperature || '--'}°F</p>
              <p><span className="font-medium">O2 Sat:</span> {vitals?.oxygen_saturation || '--%'}</p>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {allergies && allergies.length > 0 && (
          <div className="p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
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

        {/* Active Problems */}
        {activeProblems && activeProblems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Active Problems</h4>
            <div className="space-y-2">
              {activeProblems.slice(0, 5).map((problem) => (
                <div key={problem.id} className="flex items-center justify-between p-2 bg-blue-600/20 rounded border border-blue-400/30">
                  <div>
                    <p className="text-white font-medium text-sm">{problem.problem_name}</p>
                    <p className="text-white/60 text-xs">{problem.icd10_code}</p>
                  </div>
                  <Badge className={problem.severity === 'high' ? 'bg-red-600' : problem.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'}>
                    {problem.severity || 'Low'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientSummaryCard;
