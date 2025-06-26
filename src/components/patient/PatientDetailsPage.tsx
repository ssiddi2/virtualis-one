
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
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The requested patient could not be found.</p>
          <Button onClick={() => navigate('/emr')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to EMR
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      case 'admitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/emr')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to EMR
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.first_name} {patient.last_name}
              </h1>
              <p className="text-gray-600">MRN: {patient.mrn}</p>
            </div>
          </div>
          <Badge className={getStatusColor(patient.status)}>
            {patient.status || 'Active'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Gender: {patient.gender || 'Not specified'}</span>
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{patient.address}</span>
                  </div>
                )}
                {patient.room_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Room: {patient.room_number}</span>
                    {patient.bed_number && <span>Bed: {patient.bed_number}</span>}
                  </div>
                )}

                {/* Allergies & Conditions */}
                <div className="pt-4 border-t space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Allergies</h4>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div className="space-y-1">
                        {patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">No known allergies</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Medical Conditions</h4>
                    {patient.medical_conditions && patient.medical_conditions.length > 0 ? (
                      <div className="space-y-1">
                        {patient.medical_conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">No documented conditions</p>
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
