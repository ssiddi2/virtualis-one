
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Activity, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { useHospitals } from "@/hooks/useHospitals";
import { usePatients } from "@/hooks/usePatients";

interface EMRDashboardProps {
  user: any;
  onSelectHospital: (hospitalId: string) => void;
}

const EMRDashboard = ({ user, onSelectHospital }: EMRDashboardProps) => {
  const { data: hospitals, isLoading: hospitalsLoading, error: hospitalsError } = useHospitals();
  const { data: allPatients, isLoading: patientsLoading, error: patientsError } = usePatients();

  console.log('EMR Dashboard Data:', { hospitals, allPatients, hospitalsLoading, patientsLoading });

  if (hospitalsLoading || patientsLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white">Loading data...</div>
      </div>
    );
  }

  if (hospitalsError || patientsError) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
            <p className="text-white/70 mb-4">
              {hospitalsError?.message || patientsError?.message || 'Failed to load data'}
            </p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPatientCount = (hospitalId: string) => {
    return allPatients?.filter(p => p.hospital_id === hospitalId).length || 0;
  };

  const getEmrTypeColor = (emrType: string) => {
    const colors = {
      'Epic': 'bg-blue-500',
      'Cerner': 'bg-green-500',
      'Meditech': 'bg-purple-500',
      'Allscripts': 'bg-orange-500',
      'VistA': 'bg-red-500',
      'FHIR API': 'bg-teal-500'
    };
    return colors[emrType as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            EMR Integration Hub
          </h1>
          <p className="text-white/70">
            Connect to hospital systems and access patient data across multiple EMR platforms
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Hospitals</CardTitle>
              <Building2 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hospitals?.length || 0}</div>
              <p className="text-xs text-white/60">Active integrations</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allPatients?.length || 0}</div>
              <p className="text-xs text-white/60">Across all systems</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Activity className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allPatients?.filter(p => p.status === 'active').length || 0}
              </div>
              <p className="text-xs text-white/60">Currently admitted</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Clock className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Online</div>
              <p className="text-xs text-white/60">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Hospital List */}
        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Connected Hospital Systems
            </CardTitle>
            <CardDescription className="text-white/70">
              Select a hospital to access its EMR system and patient data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hospitals && hospitals.length > 0 ? (
              <div className="grid gap-4">
                {hospitals.map((hospital) => (
                  <Card 
                    key={hospital.id} 
                    className="bg-[#0f1922] border-[#2a3441] hover:border-[#3a4451] transition-all cursor-pointer"
                    onClick={() => onSelectHospital(hospital.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{hospital.name}</h3>
                            <Badge 
                              className={`${getEmrTypeColor(hospital.emr_type)} text-white border-0`}
                            >
                              {hospital.emr_type}
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            {hospital.address}, {hospital.city}, {hospital.state} {hospital.zip_code}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {getPatientCount(hospital.id)} patients
                            </span>
                            <span>{hospital.phone}</span>
                            {hospital.email && <span>{hospital.email}</span>}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHospital(hospital.id);
                          }}
                        >
                          Access EMR
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No hospitals found. Check your database connection.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMRDashboard;
