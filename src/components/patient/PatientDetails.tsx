
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Heart, Activity, FileText, Pill, TestTube } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import AIEnhancedNoteDialog from "@/components/forms/AIEnhancedNoteDialog";

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { data: patients } = usePatients();
  
  const patient = patients?.find(p => p.id === patientId);
  
  if (!patient) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6 flex items-center justify-center">
        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Patient Not Found</h3>
            <p className="text-white/70 mb-4">The requested patient could not be found.</p>
            <Button onClick={() => navigate('/emr')} className="bg-blue-600 hover:bg-blue-700">
              Back to EMR Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="bg-[#1a2332] border-[#2a3441] text-white hover:bg-[#2a3441]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-white/70">
              MRN: {patient.mrn} • Age: {age} • Room: {patient.room_number || 'Unassigned'}
            </p>
          </div>
          <AIEnhancedNoteDialog 
            patientId={patient.id} 
            hospitalId={patient.hospital_id}
          />
        </div>

        {/* Patient Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <User className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <Badge className={`${patient.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}`}>
                {patient.status?.toUpperCase() || 'ACTIVE'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Type</CardTitle>
              <Heart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.blood_type || 'Unknown'}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Allergies</CardTitle>
              <Activity className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {patient.allergies && patient.allergies.length > 0 
                  ? patient.allergies.join(', ') 
                  : 'None reported'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admission Date</CardTitle>
              <FileText className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {patient.admission_date 
                  ? new Date(patient.admission_date).toLocaleDateString()
                  : 'Not admitted'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-[#1a2332] border-[#2a3441]">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#2a3441]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="vitals" className="text-white data-[state=active]:bg-[#2a3441]">
              Vitals
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-white data-[state=active]:bg-[#2a3441]">
              Medications
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-white data-[state=active]:bg-[#2a3441]">
              Lab Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#1a2332] border-[#2a3441] text-white">
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Name:</span>
                      <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Date of Birth:</span>
                      <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Gender:</span>
                      <p className="font-medium">{patient.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Phone:</span>
                      <p className="font-medium">{patient.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Email:</span>
                      <p className="font-medium">{patient.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Insurance:</span>
                      <p className="font-medium">{patient.insurance_provider || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a2332] border-[#2a3441] text-white">
                <CardHeader>
                  <CardTitle>Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medical_conditions && patient.medical_conditions.length > 0 ? (
                    <div className="space-y-2">
                      {patient.medical_conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="border-blue-400 text-blue-400">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/60">No medical conditions reported</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardHeader>
                <CardTitle>Latest Vital Signs</CardTitle>
                <CardDescription className="text-white/70">
                  Most recent measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-[#0f1922] rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">120/80</div>
                    <div className="text-sm text-white/60">Blood Pressure</div>
                  </div>
                  <div className="text-center p-4 bg-[#0f1922] rounded-lg">
                    <div className="text-2xl font-bold text-green-400">72</div>
                    <div className="text-sm text-white/60">Heart Rate</div>
                  </div>
                  <div className="text-center p-4 bg-[#0f1922] rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">98.6°F</div>
                    <div className="text-sm text-white/60">Temperature</div>
                  </div>
                  <div className="text-center p-4 bg-[#0f1922] rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">98%</div>
                    <div className="text-sm text-white/60">O2 Saturation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.current_medications && patient.current_medications.length > 0 ? (
                  <div className="space-y-3">
                    {patient.current_medications.map((medication, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#0f1922] rounded-lg">
                        <div className="flex items-center gap-3">
                          <Pill className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="font-medium">{medication}</p>
                            <p className="text-sm text-white/60">Active prescription</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60">No current medications</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs" className="space-y-4">
            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardHeader>
                <CardTitle>Recent Lab Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#0f1922] rounded-lg">
                    <div className="flex items-center gap-3">
                      <TestTube className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium">Complete Blood Count</p>
                        <p className="text-sm text-white/60">WBC: 7.2, RBC: 4.5, Hemoglobin: 14.2</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0f1922] rounded-lg">
                    <div className="flex items-center gap-3">
                      <TestTube className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium">Basic Metabolic Panel</p>
                        <p className="text-sm text-white/60">Glucose: 95, Sodium: 140, Potassium: 4.0</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Normal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDetails;
