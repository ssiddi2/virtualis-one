
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Activity,
  FileText,
  TestTube,
  Scan,
  ArrowLeft
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useLabOrders } from '@/hooks/useLabOrders';
import { useRadiologyOrders } from '@/hooks/useRadiologyOrders';
import { useMedications } from '@/hooks/useMedications';
import PatientActionsPanel from './PatientActionsPanel';
import { useNavigate } from 'react-router-dom';

const PatientDetailsPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data: patients } = usePatients();
  const { data: medicalRecords } = useMedicalRecords(patientId);
  const { data: labOrders } = useLabOrders(patientId);
  const { data: radiologyOrders } = useRadiologyOrders(patientId);
  const { data: medications } = useMedications(patientId);

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
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
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
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <PatientActionsPanel 
              patientId={patient.id}
              hospitalId={patient.hospital_id}
              patientName={`${patient.first_name} ${patient.last_name}`}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">
                  <FileText className="h-4 w-4 mr-2" />
                  Notes ({medicalRecords?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="labs">
                  <TestTube className="h-4 w-4 mr-2" />
                  Labs ({labOrders?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="imaging">
                  <Scan className="h-4 w-4 mr-2" />
                  Imaging ({radiologyOrders?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="medications">
                  <Heart className="h-4 w-4 mr-2" />
                  Meds ({medications?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Recent Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {medicalRecords?.length || 0}
                      </div>
                      <p className="text-sm text-gray-600">Medical records</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Active Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {(labOrders?.length || 0) + (radiologyOrders?.length || 0)}
                      </div>
                      <p className="text-sm text-gray-600">Lab & imaging orders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Medications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {medications?.length || 0}
                      </div>
                      <p className="text-sm text-gray-600">Active prescriptions</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Allergies & Conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Allergies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {patient.allergies && patient.allergies.length > 0 ? (
                        <div className="space-y-2">
                          {patient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No known allergies</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {patient.medical_conditions && patient.medical_conditions.length > 0 ? (
                        <div className="space-y-2">
                          {patient.medical_conditions.map((condition, index) => (
                            <Badge key={index} variant="secondary">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No documented conditions</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {medicalRecords && medicalRecords.length > 0 ? (
                      <div className="space-y-4">
                        {medicalRecords.map((record) => (
                          <div key={record.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{record.encounter_type}</h3>
                              <span className="text-sm text-gray-500">
                                {new Date(record.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {record.chief_complaint && (
                              <p><strong>Chief Complaint:</strong> {record.chief_complaint}</p>
                            )}
                            {record.assessment && (
                              <p><strong>Assessment:</strong> {record.assessment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No medical records found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="labs">
                <Card>
                  <CardHeader>
                    <CardTitle>Laboratory Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {labOrders && labOrders.length > 0 ? (
                      <div className="space-y-4">
                        {labOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{order.test_name}</h3>
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Ordered: {new Date(order.ordered_at).toLocaleDateString()}
                            </p>
                            {order.notes && <p className="text-sm mt-2">{order.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No lab orders found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="imaging">
                <Card>
                  <CardHeader>
                    <CardTitle>Radiology Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {radiologyOrders && radiologyOrders.length > 0 ? (
                      <div className="space-y-4">
                        {radiologyOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{order.study_type} - {order.body_part}</h3>
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {order.modality} • Ordered: {new Date(order.ordered_at).toLocaleDateString()}
                            </p>
                            {order.clinical_indication && (
                              <p className="text-sm mt-2"><strong>Indication:</strong> {order.clinical_indication}</p>
                            )}
                            {order.findings && (
                              <p className="text-sm mt-2"><strong>Findings:</strong> {order.findings}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No radiology orders found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications">
                <Card>
                  <CardHeader>
                    <CardTitle>Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {medications && medications.length > 0 ? (
                      <div className="space-y-4">
                        {medications.map((medication) => (
                          <div key={medication.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{medication.medication_name}</h3>
                              <Badge variant={medication.status === 'active' ? 'default' : 'secondary'}>
                                {medication.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {medication.dosage} • {medication.frequency} • {medication.route}
                            </p>
                            {medication.indication && (
                              <p className="text-sm mt-2"><strong>Indication:</strong> {medication.indication}</p>
                            )}
                            {medication.instructions && (
                              <p className="text-sm mt-2"><strong>Instructions:</strong> {medication.instructions}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No medications found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
