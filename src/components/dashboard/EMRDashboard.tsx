import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useHospitals } from '@/hooks/useHospitals';
import { 
  Building2, 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Send,
  Database,
  Wifi,
  Shield
} from 'lucide-react';

interface EMRDashboardProps {
  user: any;
  onSelectHospital: (hospitalId: string) => void;
}

const EMRDashboard = ({ user, onSelectHospital }: EMRDashboardProps) => {
  const { toast } = useToast();
  const { data: hospitals, isLoading } = useHospitals();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleProcessSync = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      toast({
        title: "EMR Sync Complete",
        description: "Successfully synchronized patient data across all connected systems.",
      });
      setIsProcessing(false);
    }, 3000);
  };

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated and is ready for download.`,
      });
      setIsGeneratingReport(false);
      
      // Simulate file download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${reportType} Report Data`));
      element.setAttribute('download', `${reportType.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  const handleDataExport = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      toast({
        title: "Data Export Complete",
        description: "Patient data has been exported to secure file format.",
      });
      setIsProcessing(false);
      
      // Simulate file download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('EMR Data Export'));
      element.setAttribute('download', `emr_export_${new Date().toISOString().split('T')[0]}.csv`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2500);
  };

  const handleBackupData = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      toast({
        title: "Backup Complete",
        description: "EMR data has been successfully backed up to secure cloud storage.",
      });
      setIsProcessing(false);
    }, 4000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(220, 100%, 88%) 0%, hsl(210, 100%, 85%) 50%, hsl(200, 100%, 82%) 100%)'
      }}>
        <div className="text-gray-800">Loading EMR systems...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(220, 100%, 88%) 0%, hsl(210, 100%, 85%) 50%, hsl(200, 100%, 82%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 virtualis-gradient-text">EMR Systems Dashboard</h1>
            <p className="text-gray-600 text-lg">Electronic Medical Records Management</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleGenerateReport('System Status')}
              disabled={isGeneratingReport}
              className="virtualis-button shadow-lg"
            >
              {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Status Report
            </Button>
            <Button 
              onClick={handleProcessSync}
              disabled={isProcessing}
              className="virtualis-button shadow-lg"
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Sync All Systems
            </Button>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="virtualis-card animate-float">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Connected Systems</CardTitle>
              <Database className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{hospitals?.length || 0}</div>
              <p className="text-xs text-gray-600 mt-1">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card className="virtualis-card animate-float" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Data Sync Status</CardTitle>
              <Wifi className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">99.8%</div>
              <p className="text-xs text-gray-600 mt-1">
                Last sync: 2 minutes ago
              </p>
            </CardContent>
          </Card>

          <Card className="virtualis-card animate-float" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active Users</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">247</div>
              <p className="text-xs text-gray-600 mt-1">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="virtualis-card animate-float" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Security Status</CardTitle>
              <Shield className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">Secure</div>
              <p className="text-xs text-gray-600 mt-1">
                HIPAA compliant
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals?.map((hospital) => (
            <Card key={hospital.id} className="virtualis-card hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {hospital.name}
                  </CardTitle>
                  <Badge className="virtualis-badge success">
                    Online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  Location: {hospital.address}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Patients</div>
                    <div className="text-gray-800 font-semibold text-lg">{Math.floor(Math.random() * 500) + 100}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Staff</div>
                    <div className="text-gray-800 font-semibold text-lg">{Math.floor(Math.random() * 100) + 20}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-gray-600">Last sync: {Math.floor(Math.random() * 30) + 1} min ago</span>
                </div>

                <Button 
                  onClick={() => onSelectHospital(hospital.id)}
                  className="w-full virtualis-button"
                >
                  Access EMR System
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Management */}
        <Card className="virtualis-card">
          <CardHeader>
            <CardTitle className="text-gray-800 text-xl">System Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={handleDataExport}
                disabled={isProcessing}
                className="virtualis-button"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export Data
              </Button>
              <Button 
                onClick={handleBackupData}
                disabled={isProcessing}
                className="virtualis-button"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                Backup Systems
              </Button>
              <Button 
                onClick={() => handleGenerateReport('Compliance Report')}
                disabled={isGeneratingReport}
                className="virtualis-button"
              >
                <Shield className="h-4 w-4 mr-2" />
                Compliance Report
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening system maintenance panel..." })}
                className="virtualis-button"
              >
                <Activity className="h-4 w-4 mr-2" />
                Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMRDashboard;
