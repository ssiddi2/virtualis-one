
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowLeft
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import PatientClinicalWorkflow from './PatientClinicalWorkflow';
import { useNavigate } from 'react-router-dom';

const PatientDetailsPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data: patients } = usePatients();

  const patient = patients?.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Patient Not Found</h2>
          <p className="text-white/70 mb-4">The requested patient could not be found.</p>
          <Button onClick={() => navigate('/emr')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to EMR
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'discharged': return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
      case 'admitted': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/emr')}
              className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to EMR
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {patient.first_name} {patient.last_name}
              </h1>
              <p className="text-white/70">MRN: {patient.mrn}</p>
            </div>
          </div>
          <Badge className={getStatusColor(patient.status)}>
            {patient.status || 'Active'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <User className="h-4 w-4 text-slate-500" />
                  <span>Gender: {patient.gender || 'Not specified'}</span>
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>{patient.address}</span>
                  </div>
                )}
                {patient.room_number && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="font-medium">Room: {patient.room_number}</span>
                    {patient.bed_number && <span>Bed: {patient.bed_number}</span>}
                  </div>
                )}

                {/* Allergies & Conditions */}
                <div className="pt-4 border-t border-slate-600 space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-white">Allergies</h4>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div className="space-y-1">
                        {patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs">No known allergies</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 text-white">Medical Conditions</h4>
                    {patient.medical_conditions && patient.medical_conditions.length > 0 ? (
                      <div className="space-y-1">
                        {patient.medical_conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs">No documented conditions</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Clinical Workflow */}
          <div className="lg:col-span-3">
            <PatientClinicalWorkflow 
              patientId={patient.id}
              hospitalId={patient.hospital_id}
              patientName={`${patient.first_name} ${patient.last_name}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
