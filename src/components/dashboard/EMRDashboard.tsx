
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
  Settings,
  Building2,
  MapPin,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHospitals } from '@/hooks/useHospitals';
import { useNavigate } from 'react-router-dom';

interface EMRDashboardProps {
  hospitalId?: string;
  user?: any;
  onSelectHospital?: (hospitalId: string) => void;
}

const EMRDashboard = ({ hospitalId, user, onSelectHospital }: EMRDashboardProps) => {
  const { toast } = useToast();
  const { data: hospitals } = useHospitals();
  const navigate = useNavigate();
  
  const selectedHospital = hospitalId ? hospitals?.find(h => h.id === hospitalId) : null;

  // Mock hospitals data if database is empty
  const mockHospitals = [
    {
      id: '1',
      name: 'St. Mary\'s General Hospital',
      city: 'Downtown',
      state: 'CA',
      address: '123 Medical Center Drive',
      phone: '(555) 123-4567',
      email: 'info@stmarys.com',
      emr_type: 'Epic',
      license_number: 'CA-12345',
      zip_code: '90210',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Regional Medical Center',
      city: 'North Campus',
      state: 'CA',
      address: '456 Healthcare Way',
      phone: '(555) 987-6543',
      email: 'contact@regional.com',
      emr_type: 'Cerner',
      license_number: 'CA-67890',
      zip_code: '90211',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Children\'s Hospital',
      city: 'Pediatric District',
      state: 'CA',
      address: '789 Kids Boulevard',
      phone: '(555) 456-7890',
      email: 'info@childrens.com',
      emr_type: 'Allscripts',
      license_number: 'CA-11111',
      zip_code: '90212',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'University Medical',
      city: 'Campus District',
      state: 'CA',
      address: '321 University Ave',
      phone: '(555) 234-5678',
      email: 'contact@unimedical.com',
      emr_type: 'Epic',
      license_number: 'CA-22222',
      zip_code: '90213',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const displayHospitals = hospitals && hospitals.length > 0 ? hospitals : mockHospitals;

  const handleConnectToHospital = async (hospital: any) => {
    // Show success toast
    toast({
      title: "Hospital Selected",
      description: `Connecting to ${hospital.name}. Initializing EMR System...`,
    });
    
    // Call the onSelectHospital callback if provided
    if (onSelectHospital) {
      onSelectHospital(hospital.id);
    }
    
    // Navigate to HospitalDashboard (EMR Initializing screen) with hospital context
    navigate(`/hospital/${hospital.id}`, { 
      state: { 
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        emrType: hospital.emr_type
      } 
    });
  };

  const getEmrStatusColor = (emrType: string) => {
    switch (emrType.toLowerCase()) {
      case 'epic': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'cerner': return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      case 'allscripts': return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getTotalPatients = () => {
    return displayHospitals.length * 1250;
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/lovable-uploads/96442473-7948-4431-92d6-7697bfb571e2.png" 
              alt="VirtualisOne" 
              className="h-20"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Healthcare Network Command Center
            </h1>
            <p className="text-white/80 text-lg">
              Select a hospital to access its EMR system and begin clinical workflows
            </p>
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
                  <p className="text-sm text-white/70">Network Hospitals</p>
                  <p className="text-2xl font-bold text-white">
                    {displayHospitals.length}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Patients</p>
                  <p className="text-2xl font-bold text-white">
                    {getTotalPatients().toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Systems Online</p>
                  <p className="text-2xl font-bold text-white">{displayHospitals.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Network Status</p>
                  <p className="text-2xl font-bold text-white">Active</p>
                </div>
                <Activity className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayHospitals.map((hospital) => (
            <Card key={hospital.id} className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg hover:scale-[1.02] transition-all">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-sky-300" />
                    {hospital.name}
                  </div>
                  <Badge className={`${getEmrStatusColor(hospital.emr_type)} text-xs`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    ONLINE
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hospital.city}, {hospital.state}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">{hospital.emr_type}</div>
                    <div className="text-xs text-white/70">EMR System</div>
                  </div>
                  <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">FHIR R4</div>
                    <div className="text-xs text-white/70">Protocol</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="text-white">{hospital.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License:</span>
                    <span className="text-white">{hospital.license_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patients:</span>
                    <span className="text-white">~1,250</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => handleConnectToHospital(hospital)}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    Initialize EMR System
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
            <CardTitle className="text-white">Virtualis Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <FileText className="h-8 w-8 text-sky-300 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Multi-EMR Integration</h3>
                <p className="text-sm text-white/70">Seamlessly connect to Epic, Cerner, Allscripts, and other major EMR systems</p>
              </div>
              <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <Brain className="h-8 w-8 text-green-300 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">AI-Powered Clinical Workflows</h3>
                <p className="text-sm text-white/70">Intelligent clinical decision support and automated documentation</p>
              </div>
              <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <Zap className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Real-time Analytics</h3>
                <p className="text-sm text-white/70">Live dashboards, quality metrics, and instant data synchronization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMRDashboard;
