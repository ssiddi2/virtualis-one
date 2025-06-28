
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Activity, 
  Users, 
  FileText, 
  TrendingUp, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Server,
  Zap,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHospitals } from '@/hooks/useHospitals';

interface EMRDashboardProps {
  hospitalId?: string;
}

const EMRDashboard = ({ hospitalId }: EMRDashboardProps) => {
  const { toast } = useToast();
  const { data: hospitals } = useHospitals();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const selectedHospital = hospitalId ? hospitals?.find(h => h.id === hospitalId) : null;

  const handleConnect = async (system: string) => {
    setIsConnecting(true);
    
    setTimeout(() => {
      toast({
        title: "EMR Integration",
        description: `Connected to ${system} successfully!`,
      });
      setIsConnecting(false);
    }, 2000);
  };

  const emrSystems = [
    { name: 'Epic', status: 'connected', version: '2023.1', patients: 15420 },
    { name: 'Cerner', status: 'disconnected', version: '2023.2', patients: 0 },
    { name: 'Allscripts', status: 'connecting', version: '2023.1', patients: 8930 },
    { name: 'athenahealth', status: 'connected', version: '2023.3', patients: 12100 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'disconnected': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'connecting': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4" />;
      case 'connecting': return <Clock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Database className="h-12 w-12 text-sky-300 animate-pulse" />
            <div>
              <h1 className="text-4xl font-bold text-white">
                EMR Integration Hub
              </h1>
              <p className="text-white/80 text-lg">
                {selectedHospital ? `${selectedHospital.name} - Electronic Medical Records` : 'Centralized EMR Management'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <Server className="h-3 w-3 mr-1" />
              FHIR R4 Compatible
            </Badge>
            <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
              <Shield className="h-3 w-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30">
              <Zap className="h-3 w-3 mr-1" />
              Real-time Sync
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Patients</p>
                  <p className="text-2xl font-bold text-white">
                    {emrSystems.reduce((sum, sys) => sum + sys.patients, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Connected Systems</p>
                  <p className="text-2xl font-bold text-white">
                    {emrSystems.filter(sys => sys.status === 'connected').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Sync Status</p>
                  <p className="text-2xl font-bold text-white">Active</p>
                </div>
                <Activity className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Data Quality</p>
                  <p className="text-2xl font-bold text-white">97.8%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-sky-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* EMR Systems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {emrSystems.map((system) => (
            <Card key={system.name} className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Database className="h-6 w-6 text-sky-300" />
                    {system.name}
                  </div>
                  <Badge className={`${getStatusColor(system.status)} text-xs`}>
                    {getStatusIcon(system.status)}
                    <span className="ml-1">{system.status.toUpperCase()}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">{system.patients.toLocaleString()}</div>
                    <div className="text-xs text-white/70">Patients</div>
                  </div>
                  <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">{system.version}</div>
                    <div className="text-xs text-white/70">Version</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleConnect(system.name)}
                    disabled={isConnecting || system.status === 'connected'}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    {system.status === 'connected' ? 'Connected' : 'Connect'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Features */}
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Integration Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <FileText className="h-8 w-8 text-sky-300 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">FHIR Compliance</h3>
                <p className="text-sm text-white/70">Full FHIR R4 standard support for seamless data exchange</p>
              </div>
              <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <Shield className="h-8 w-8 text-green-300 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Security</h3>
                <p className="text-sm text-white/70">End-to-end encryption and HIPAA compliance</p>
              </div>
              <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <Zap className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Real-time Sync</h3>
                <p className="text-sm text-white/70">Instant synchronization across all connected systems</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMRDashboard;
