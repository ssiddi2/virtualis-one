import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Activity, 
  Calendar, 
  TestTube, 
  Pill, 
  FileText,
  Heart,
  Brain,
  Stethoscope,
  Building2
} from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { useHospitals } from "@/hooks/useHospitals";
import AIEnhancedNoteDialogWrapper from '@/components/forms/AIEnhancedNoteDialogWrapper';

interface HospitalDashboardProps {
  hospitalId: string;
  user: any;
  onBack: () => void;
}

const HospitalDashboard = ({ hospitalId, user, onBack }: HospitalDashboardProps) => {
  const navigate = useNavigate();
  const { data: patients } = usePatients(hospitalId);
  const { data: hospitals } = useHospitals();
  
  const hospital = hospitals?.find(h => h.id === hospitalId);
  const activePatients = patients?.filter(p => p.status === 'active') || [];
  const recentAdmissions = patients?.filter(p => {
    if (!p.admission_date) return false;
    const admissionDate = new Date(p.admission_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }) || [];

  if (!hospital) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Card className="virtualis-card">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2 text-white">Hospital Not Found</h3>
            <Button onClick={onBack} className="virtualis-button">
              Back to EMR Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="virtualis-button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to EMR
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="h-8 w-8 text-sky-300" />
              {hospital.name}
            </h1>
            <p className="text-white/70">
              {hospital.address}, {hospital.city}, {hospital.state} • EMR: {hospital.emr_type}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/patient-tracker')}
              className="virtualis-button"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              ER Tracker
            </Button>
            <Button 
              onClick={() => navigate('/ai-assistant')}
              className="virtualis-button"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="virtualis-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-sky-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{patients?.length || 0}</div>
              <p className="text-xs text-white/60">All patients</p>
            </CardContent>
          </Card>

          <Card className="virtualis-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Patients</CardTitle>
              <Activity className="h-4 w-4 text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-300">{activePatients.length}</div>
              <p className="text-xs text-white/60">Currently admitted</p>
            </CardContent>
          </Card>

          <Card className="virtualis-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Recent Admissions</CardTitle>
              <Calendar className="h-4 w-4 text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-300">{recentAdmissions.length}</div>
              <p className="text-xs text-white/60">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="virtualis-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">EMR Integration</CardTitle>
              <Heart className="h-4 w-4 text-pink-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-300">Online</div>
              <p className="text-xs text-white/60">{hospital.emr_type} connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="virtualis-card">
            <TabsTrigger value="patients" className="text-white data-[state=active]:bg-white/20">
              Patient List
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              Hospital Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <Card className="virtualis-card">
              <CardHeader>
                <CardTitle className="text-white">Patient List - {hospital.name}</CardTitle>
                <CardDescription className="text-white/70">
                  All patients currently in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients && patients.length > 0 ? (
                    patients.map((patient) => (
                      <Card 
                        key={patient.id}
                        className="p-4 virtualis-card hover:scale-[1.02] transition-all cursor-pointer"
                        onClick={() => navigate(`/patient/${patient.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {patient.first_name} {patient.last_name}
                            </h4>
                            <p className="text-sm text-white/60">
                              MRN: {patient.mrn} • Age: {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}
                            </p>
                            <p className="text-sm text-white/60">
                              Room: {patient.room_number || 'Unassigned'} • 
                              Admitted: {patient.admission_date ? new Date(patient.admission_date).toLocaleDateString() : 'N/A'}
                            </p>
                            {patient.medical_conditions && patient.medical_conditions.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {patient.medical_conditions.slice(0, 2).map((condition, index) => (
                                  <Badge key={index} className="virtualis-badge primary text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                                {patient.medical_conditions.length > 2 && (
                                  <Badge className="virtualis-badge text-xs">
                                    +{patient.medical_conditions.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${patient.status === 'active' ? 'virtualis-badge success' : 'virtualis-badge'}`}>
                              {patient.status?.toUpperCase() || 'ACTIVE'}
                            </Badge>
                            <AIEnhancedNoteDialogWrapper 
                              patientId={patient.id} 
                              hospitalId={hospitalId}
                              patientName={`${patient.first_name} ${patient.last_name}`}
                            />
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No patients found for this hospital.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">Hospital Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Name:</span>
                      <p className="font-medium text-white">{hospital.name}</p>
                    </div>
                    <div>
                      <span className="text-white/60">EMR Type:</span>
                      <p className="font-medium text-white">{hospital.emr_type}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Phone:</span>
                      <p className="font-medium text-white">{hospital.phone}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Email:</span>
                      <p className="font-medium text-white">{hospital.email || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white/60">Address:</span>
                      <p className="font-medium text-white">
                        {hospital.address}, {hospital.city}, {hospital.state} {hospital.zip_code}
                      </p>
                    </div>
                    <div>
                      <span className="text-white/60">License:</span>
                      <p className="font-medium text-white">{hospital.license_number || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/patient-tracker')}
                    className="w-full virtualis-button justify-start"
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Emergency Department Tracker
                  </Button>
                  <Button 
                    onClick={() => navigate('/laboratory')}
                    className="w-full virtualis-button justify-start"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Laboratory Information System
                  </Button>
                  <Button 
                    onClick={() => navigate('/radiology')}
                    className="w-full virtualis-button justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Radiology & PACS
                  </Button>
                  <Button 
                    onClick={() => navigate('/billing')}
                    className="w-full virtualis-button justify-start"
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    Billing & Coding
                  </Button>
                  <Button 
                    onClick={() => navigate('/ai-assistant')}
                    className="w-full virtualis-button justify-start"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI Clinical Assistant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">Patient Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Total Patients:</span>
                      <span className="font-semibold text-white">{patients?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Active Patients:</span>
                      <span className="font-semibold text-green-300">{activePatients.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Recent Admissions:</span>
                      <span className="font-semibold text-blue-300">{recentAdmissions.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Average Length of Stay:</span>
                      <span className="font-semibold text-white">3.2 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">EMR Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Connection Status:</span>
                      <Badge className="virtualis-badge success">Connected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">EMR System:</span>
                      <span className="font-semibold text-white">{hospital.emr_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Last Sync:</span>
                      <span className="font-semibold text-white">2 minutes ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Data Quality:</span>
                      <span className="font-semibold text-green-300">Excellent</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HospitalDashboard;
