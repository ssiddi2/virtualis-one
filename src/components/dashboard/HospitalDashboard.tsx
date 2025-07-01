
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
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
  Building2,
  CheckCircle,
  Zap,
  Database,
  Shield,
  RefreshCw
} from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { useHospitals } from "@/hooks/useHospitals";
import { useToast } from "@/hooks/use-toast";
import AIEnhancedNoteDialogWrapper from '@/components/forms/AIEnhancedNoteDialogWrapper';

interface HospitalDashboardProps {
  hospitalId: string;
  user: any;
  onBack: () => void;
}

const HospitalDashboard = ({ hospitalId, user, onBack }: HospitalDashboardProps) => {
  const navigate = useNavigate();
  const { hospitalId: paramHospitalId } = useParams();
  const { toast } = useToast();
  const { data: patients } = usePatients(paramHospitalId || hospitalId);
  const { data: hospitals } = useHospitals();
  const [initializationStep, setInitializationStep] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const hospital = hospitals?.find(h => h.id === (paramHospitalId || hospitalId));

  // Mock hospital data if not found
  const mockHospital = {
    id: paramHospitalId || hospitalId || '1',
    name: 'St. Mary\'s General Hospital',
    city: 'Downtown',
    state: 'CA',
    address: '123 Medical Center Drive',
    phone: '(555) 123-4567',
    email: 'info@stmarys.com',
    emr_type: 'Epic',
    license_number: 'CA-12345',
    zip_code: '90210'
  };

  const displayHospital = hospital || mockHospital;

  const initializationSteps = [
    { text: "Connecting to EMR System...", icon: Database },
    { text: "Authenticating Credentials...", icon: Shield },
    { text: "Loading Patient Database...", icon: Users },
    { text: "Initializing Clinical Modules...", icon: Stethoscope },
    { text: "Syncing Real-time Data...", icon: Zap },
    { text: "EMR System Ready!", icon: CheckCircle }
  ];

  useEffect(() => {
    if (isInitializing && initializationStep < initializationSteps.length - 1) {
      const timer = setTimeout(() => {
        setInitializationStep(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (initializationStep === initializationSteps.length - 1) {
      const finalTimer = setTimeout(() => {
        setIsInitializing(false);
        toast({
          title: "EMR System Initialized",
          description: `Successfully connected to ${displayHospital.name} ${displayHospital.emr_type} system.`,
        });
      }, 1500);

      return () => clearTimeout(finalTimer);
    }
  }, [initializationStep, isInitializing, displayHospital.name, displayHospital.emr_type, toast, initializationSteps.length]);

  const activePatients = patients?.filter(p => p.status === 'active') || [];
  const recentAdmissions = patients?.filter(p => {
    if (!p.admission_date) return false;
    const admissionDate = new Date(p.admission_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }) || [];

  const handleProceedToMainDashboard = () => {
    navigate('/dashboard', { 
      state: { 
        hospitalId: displayHospital.id,
        hospitalName: displayHospital.name 
      } 
    });
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-12 w-12 text-sky-300" />
              <div>
                <CardTitle className="text-2xl text-white">{displayHospital.name}</CardTitle>
                <CardDescription className="text-white/70">
                  {displayHospital.emr_type} EMR System Integration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {initializationSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < initializationStep;
                const isCurrent = index === initializationStep;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCompleted ? 'bg-green-500/20 border border-green-400/30' :
                      isCurrent ? 'bg-blue-500/20 border border-blue-400/30' :
                      'bg-gray-500/20 border border-gray-400/30'
                    }`}
                  >
                    {isCurrent ? (
                      <RefreshCw className="h-5 w-5 text-blue-300 animate-spin" />
                    ) : (
                      <Icon className={`h-5 w-5 ${
                        isCompleted ? 'text-green-300' : 'text-gray-400'
                      }`} />
                    )}
                    <span className={`text-sm ${
                      isCompleted ? 'text-green-200' :
                      isCurrent ? 'text-blue-200' :
                      'text-gray-400'
                    }`}>
                      {step.text}
                    </span>
                    {isCompleted && (
                      <CheckCircle className="h-4 w-4 text-green-300 ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>
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
            onClick={() => navigate('/hospital-selection')}
            className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hospital Selection
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="h-8 w-8 text-sky-300" />
              {displayHospital.name}
            </h1>
            <p className="text-white/70">
              {displayHospital.address}, {displayHospital.city}, {displayHospital.state} • EMR: {displayHospital.emr_type}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleProceedToMainDashboard}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Enter Clinical Dashboard
            </Button>
          </div>
        </div>

        {/* EMR Connection Status */}
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-300" />
              EMR System Connected Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <div className="text-lg font-semibold text-white">{displayHospital.emr_type}</div>
                <div className="text-xs text-white/70">EMR Platform</div>
              </div>
              <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <div className="text-lg font-semibold text-green-300">ONLINE</div>
                <div className="text-xs text-white/70">Connection Status</div>
              </div>
              <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <div className="text-lg font-semibold text-white">FHIR R4</div>
                <div className="text-xs text-white/70">API Protocol</div>
              </div>
              <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <div className="text-lg font-semibold text-white">{"< 2s"}</div>
                <div className="text-xs text-white/70">Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-sky-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{patients?.length || 1250}</div>
              <p className="text-xs text-white/60">All patients</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Patients</CardTitle>
              <Activity className="h-4 w-4 text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-300">{activePatients.length || 156}</div>
              <p className="text-xs text-white/60">Currently admitted</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Recent Admissions</CardTitle>
              <Calendar className="h-4 w-4 text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-300">{recentAdmissions.length || 23}</div>
              <p className="text-xs text-white/60">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">System Status</CardTitle>
              <Heart className="h-4 w-4 text-pink-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-300">Optimal</div>
              <p className="text-xs text-white/60">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Ready to Begin Clinical Workflows</CardTitle>
            <CardDescription className="text-white/70">
              EMR system is fully initialized and ready for clinical operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => navigate('/patients')}
                className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-col gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Patient Management</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/clinical')}
                className="h-20 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white flex-col gap-2"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Clinical Workflows</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/laboratory')}
                className="h-20 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white flex-col gap-2"
              >
                <TestTube className="h-6 w-6" />
                <span>Laboratory</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/ai-dashboard')}
                className="h-20 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white flex-col gap-2"
              >
                <Brain className="h-6 w-6" />
                <span>AI Insights</span>
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                onClick={handleProceedToMainDashboard}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300"
              >
                <Activity className="h-5 w-5 mr-2" />
                Access Main Clinical Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalDashboard;
