import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Heart,
  Brain,
  Stethoscope,
  FlaskConical,
  FileText,
  Database,
  Settings
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import VirtualisChatModal from '@/components/clinical/VirtualisChatModal';
import EMRInitializationStatus from './EMRInitializationStatus';
import PatientTracker from './PatientTracker';
import FuturisticPatientTracker from './FuturisticPatientTracker';

interface DashboardProps {
  hospitalId?: string;
}

const Dashboard = ({ hospitalId }: DashboardProps) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const { data: patients, isLoading: patientsLoading } = usePatients(hospitalId);
  const [activeTab, setActiveTab] = useState('overview');

  // Use the passed hospitalId from routing, or fall back to user profile
  const effectiveHospitalId = hospitalId || profile?.hospital_id || user?.user_metadata?.hospital_id;

  const activePatients = patients?.filter(p => p.status === 'active') || [];
  const criticalPatients = activePatients.filter(p => 
    p.medical_conditions?.some(condition => 
      condition.toLowerCase().includes('cardiac') || 
      condition.toLowerCase().includes('critical')
    )
  );
  const recentAdmissions = activePatients.filter(p => {
    if (!p.admission_date) return false;
    const admissionDate = new Date(p.admission_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  });

  const statistics = [
    { 
      label: 'Active Patients', 
      value: activePatients.length, 
      change: '+3', 
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500/20 text-blue-200 border-blue-400/30'
    },
    { 
      label: 'Critical Cases', 
      value: criticalPatients.length, 
      change: '-1', 
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-red-500/20 text-red-200 border-red-400/30'
    },
    { 
      label: 'New Admissions', 
      value: recentAdmissions.length, 
      change: '+2', 
      trend: 'up',
      icon: Calendar,
      color: 'bg-green-500/20 text-green-200 border-green-400/30'
    },
    { 
      label: 'Avg Length of Stay', 
      value: '3.2 days', 
      change: '-0.5', 
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-purple-500/20 text-purple-200 border-purple-400/30'
    }
  ];

  const quickActions = [
    { 
      label: 'Patient Lookup', 
      icon: Users, 
      action: () => toast({ title: "Patient Lookup", description: "Search functionality coming soon" }),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      label: 'New Lab Order', 
      icon: FlaskConical, 
      action: () => toast({ title: "Lab Orders", description: "Lab ordering system coming soon" }),
      color: 'bg-green-600 hover:bg-green-700'
    },
    { 
      label: 'Radiology', 
      icon: Activity, 
      action: () => toast({ title: "Radiology", description: "Imaging orders coming soon" }),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    { 
      label: 'AI Assistant', 
      icon: Brain, 
      action: () => toast({ title: "AI Assistant", description: "AI clinical support coming soon" }),
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

  if (!effectiveHospitalId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">No Hospital Selected</CardTitle>
            <CardDescription className="text-white/70 text-center">
              Please select a hospital to access the dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clinical Dashboard</h1>
            <p className="text-white/70">Real-time hospital operations and patient management</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* EMR Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {statistics.map((stat, index) => (
                <Card key={index} className="backdrop-blur-xl bg-white/5 border border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-5 w-5 text-white/70" />
                      <Badge className={`${stat.color} text-xs`}>
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <EMRInitializationStatus hospitalId={effectiveHospitalId} />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="patients" className="text-white data-[state=active]:bg-white/20">
              <Users className="h-4 w-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="futuristic" className="text-white data-[state=active]:bg-white/20">
              <Heart className="h-4 w-4 mr-2" />
              Patient Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="backdrop-blur-xl bg-white/5 border border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`w-full justify-start ${action.color} text-white`}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="backdrop-blur-xl bg-white/5 border border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                    <div className="p-1 bg-green-600/30 rounded">
                      <Users className="h-3 w-3 text-green-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">New patient admitted</p>
                      <p className="text-xs text-white/60">Room 302 - 5 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                    <div className="p-1 bg-blue-600/30 rounded">
                      <FlaskConical className="h-3 w-3 text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Lab results available</p>
                      <p className="text-xs text-white/60">Patient Johnson - 12 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                    <div className="p-1 bg-purple-600/30 rounded">
                      <MessageSquare className="h-3 w-3 text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">New consultation request</p>
                      <p className="text-xs text-white/60">Dr. Smith - 18 min ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <PatientTracker hospitalId={effectiveHospitalId} />
          </TabsContent>

          <TabsContent value="futuristic" className="space-y-6">
            <FuturisticPatientTracker hospitalId={effectiveHospitalId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Collapsible Chat Modal */}
      <VirtualisChatModal hospitalId={effectiveHospitalId} />
    </div>
  );
};

export default Dashboard;
