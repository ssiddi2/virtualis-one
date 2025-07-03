import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  TestTube, 
  Monitor, 
  Stethoscope,
  Calendar,
  PlusCircle,
  Activity,
  AlertTriangle,
  Clock,
  Hospital,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/contexts/AuthContext';

interface EMRModule {
  id: string;
  name: string;
  icon: any;
  description: string;
  path: string;
  count?: number;
  status?: 'normal' | 'warning' | 'critical';
}

const EMRDashboard = () => {
  const navigate = useNavigate();
  const { hospitalId } = useParams();
  const { profile } = useAuth();
  const { data: patients } = usePatients(hospitalId);
  
  const activePatients = patients?.filter(p => p.status === 'active') || [];
  const criticalAlerts = 3; // Mock data
  const pendingLabs = 12; // Mock data
  const pendingNotes = 8; // Mock data

  const emrModules: EMRModule[] = [
    {
      id: 'patients',
      name: 'Patient List',
      icon: Users,
      description: 'Access patient charts and rounding list',
      path: `/emr/${hospitalId}/patients`,
      count: activePatients.length,
      status: 'normal'
    },
    {
      id: 'documentation',
      name: 'Clinical Notes',
      icon: FileText,
      description: 'Create and review clinical documentation',
      path: `/emr/${hospitalId}/documentation`,
      count: pendingNotes,
      status: pendingNotes > 10 ? 'warning' : 'normal'
    },
    {
      id: 'laboratory',
      name: 'Laboratory',
      icon: TestTube,
      description: 'Lab results and ordering',
      path: `/emr/${hospitalId}/laboratory`,
      count: pendingLabs,
      status: pendingLabs > 15 ? 'critical' : 'normal'
    },
    {
      id: 'imaging',
      name: 'Radiology',
      icon: Monitor,
      description: 'Imaging studies and PACS',
      path: `/emr/${hospitalId}/radiology`,
      count: 5,
      status: 'normal'
    },
    {
      id: 'cpoe',
      name: 'CPOE',
      icon: PlusCircle,
      description: 'Computerized Provider Order Entry',
      path: `/emr/${hospitalId}/cpoe`,
      status: 'normal'
    },
    {
      id: 'clinical',
      name: 'Clinical Tools',
      icon: Stethoscope,
      description: 'Clinical decision support and tools',
      path: `/emr/${hospitalId}/clinical`,
      status: 'normal'
    }
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'critical': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-600 text-white';
      case 'normal': return 'bg-green-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const hospitalName = hospitalId === '1' ? 'St. Mary\'s General Hospital' : 
                      hospitalId === '2' ? 'Regional Medical Center' :
                      hospitalId === '3' ? 'Children\'s Hospital' : 'University Medical';

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/hospital-selection')}
              variant="outline"
              className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hospitals
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{hospitalName}</h1>
              <p className="text-white/70">EMR Clinical Workstation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              <Hospital className="h-5 w-5" />
              <span className="text-sm">Dr. {profile?.first_name} {profile?.last_name}</span>
            </div>
            <Badge className="bg-green-600 text-white">Connected</Badge>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts > 0 && (
          <Card className="clinical-card border-red-400/20 bg-red-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Critical Alerts ({criticalAlerts})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-red-900/20 p-3 rounded border border-red-400/20">
                  <div>
                    <p className="font-medium text-white text-sm">Critical lab value: Potassium 2.8</p>
                    <p className="text-xs text-white/60">Patient: Smith, John - Room 302A</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="clinical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-300" />
                <div>
                  <p className="text-2xl font-bold text-white">{activePatients.length}</p>
                  <p className="text-white/70 text-sm">Active Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clinical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TestTube className="h-8 w-8 text-green-300" />
                <div>
                  <p className="text-2xl font-bold text-white">{pendingLabs}</p>
                  <p className="text-white/70 text-sm">Pending Labs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clinical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-yellow-300" />
                <div>
                  <p className="text-2xl font-bold text-white">{pendingNotes}</p>
                  <p className="text-white/70 text-sm">Pending Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clinical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-300" />
                <div>
                  <p className="text-2xl font-bold text-white">2.4</p>
                  <p className="text-white/70 text-sm">Avg Round Time (hrs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* EMR Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emrModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card key={module.id} className="clinical-card hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => navigate(module.path)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{module.name}</CardTitle>
                        <p className="text-white/60 text-sm">{module.description}</p>
                      </div>
                    </div>
                    {module.count !== undefined && (
                      <Badge className={getStatusColor(module.status)}>
                        {module.count}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate(`/emr/${hospitalId}/patients`)}
                className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex-col"
              >
                <Activity className="h-6 w-6 mb-2" />
                Start Rounds
              </Button>
              
              <Button 
                onClick={() => navigate(`/emr/${hospitalId}/laboratory`)}
                className="h-16 bg-green-600 hover:bg-green-700 text-white flex-col"
              >
                <TestTube className="h-6 w-6 mb-2" />
                Review Labs
              </Button>
              
              <Button 
                onClick={() => navigate(`/emr/${hospitalId}/documentation`)}
                className="h-16 bg-purple-600 hover:bg-purple-700 text-white flex-col"
              >
                <FileText className="h-6 w-6 mb-2" />
                Clinical Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMRDashboard;