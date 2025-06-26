import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Activity, FileText, TestTube, Camera, Pill, AlertTriangle } from "lucide-react";
import { useHospital } from "@/hooks/useHospitals";
import { usePatients } from "@/hooks/usePatients";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useLabOrders } from "@/hooks/useLabOrders";
import { useRadiologyOrders } from "@/hooks/useRadiologyOrders";
import { useMedications } from "@/hooks/useMedications";
import NewNoteDialog from "@/components/forms/NewNoteDialog";
import NewLabOrderDialog from "@/components/forms/NewLabOrderDialog";
import NewRadiologyOrderDialog from "@/components/forms/NewRadiologyOrderDialog";
import AIEnhancedNoteDialog from "@/components/forms/AIEnhancedNoteDialog";

interface HospitalDashboardProps {
  hospitalId: string;
  user: any;
  onBack: () => void;
}

const HospitalDashboard = ({ hospitalId, user, onBack }: HospitalDashboardProps) => {
  const { data: hospital, isLoading: hospitalLoading } = useHospital(hospitalId);
  const { data: patients } = usePatients(hospitalId);
  const { data: medicalRecords } = useMedicalRecords();
  const { data: labOrders } = useLabOrders();
  const { data: radiologyOrders } = useRadiologyOrders();
  const { data: medications } = useMedications();

  if (hospitalLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading hospital data...</div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Hospital not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-500',
      'discharged': 'bg-gray-500',
      'transferred': 'bg-blue-500',
      'deceased': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'stat': 'bg-red-500',
      'urgent': 'bg-orange-500',
      'routine': 'bg-blue-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-white hover:bg-[#1a2332] mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hospitals
            </Button>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-white">{hospital.name}</h1>
            <Badge className="bg-blue-600 text-white">{hospital.emr_type}</Badge>
          </div>
          <p className="text-white/70">
            {hospital.address}, {hospital.city}, {hospital.state} {hospital.zip_code}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients?.filter(p => p.status === 'active').length || 0}
              </div>
              <p className="text-xs text-white/60">Currently admitted</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Notes</CardTitle>
              <FileText className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {medicalRecords?.filter(r => new Date(r.created_at || '').toDateString() === new Date().toDateString()).length || 0}
              </div>
              <p className="text-xs text-white/60">Today</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Activity className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(labOrders?.filter(o => o.status === 'ordered').length || 0) + 
                 (radiologyOrders?.filter(o => o.status === 'ordered').length || 0)}
              </div>
              <p className="text-xs text-white/60">Lab & Radiology</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-white/60">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Patients */}
          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {patients?.filter(p => p.status === 'active').map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-[#0f1922] rounded-lg">
                    <div>
                      <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                      <div className="text-sm text-white/60">
                        MRN: {patient.mrn} • Room: {patient.room_number || 'N/A'}
                      </div>
                      <div className="text-xs text-white/50">
                        DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AIEnhancedNoteDialog patientId={patient.id} hospitalId={hospitalId} />
                      <NewNoteDialog patientId={patient.id} hospitalId={hospitalId} />
                      <NewLabOrderDialog patientId={patient.id} />
                      <NewRadiologyOrderDialog patientId={patient.id} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Medical Records */}
          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Medical Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {medicalRecords?.slice(0, 5).map((record) => (
                  <div key={record.id} className="p-3 bg-[#0f1922] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-600 text-white text-xs">
                        {record.encounter_type}
                      </Badge>
                      <span className="text-xs text-white/60">
                        {new Date(record.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium mb-1">Chief Complaint:</div>
                      <div className="text-white/70">{record.chief_complaint || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lab Orders */}
          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Lab Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {labOrders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-3 bg-[#0f1922] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{order.test_name}</div>
                      <Badge className={`${getPriorityColor(order.priority || '')} text-white text-xs`}>
                        {order.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/60">
                      Status: {order.status} • Code: {order.test_code || 'N/A'}
                    </div>
                    <div className="text-xs text-white/50">
                      Ordered: {new Date(order.ordered_at || '').toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Radiology Orders */}
          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Radiology Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {radiologyOrders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-3 bg-[#0f1922] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{order.study_type}</div>
                      <Badge className={`${getPriorityColor(order.priority || '')} text-white text-xs`}>
                        {order.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/60">
                      {order.modality} • {order.body_part}
                    </div>
                    <div className="text-xs text-white/50">
                      Status: {order.status} • Ordered: {new Date(order.ordered_at || '').toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
