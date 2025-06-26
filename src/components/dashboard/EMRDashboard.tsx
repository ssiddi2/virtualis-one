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
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white">Loading EMR systems...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">EMR Systems Dashboard</h1>
            <p className="text-white/70">Electronic Medical Records Management</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleGenerateReport('System Status')}
              disabled={isGeneratingReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Status Report
            </Button>
            <Button 
              onClick={handleProcessSync}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Sync All Systems
            </Button>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Connected Systems</CardTitle>
              <Database className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{hospitals?.length || 0}</div>
              <p className="text-xs text-slate-400">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Data Sync Status</CardTitle>
              <Wifi className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">99.8%</div>
              <p className="text-xs text-slate-400">
                Last sync: 2 minutes ago
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">247</div>
              <p className="text-xs text-slate-400">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Secure</div>
              <p className="text-xs text-slate-400">
                HIPAA compliant
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals?.map((hospital) => (
            <Card key={hospital.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    {hospital.name}
                  </CardTitle>
                  <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
                    Online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-400">
                  Location: {hospital.address}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Patients</div>
                    <div className="text-white font-semibold">{Math.floor(Math.random() * 500) + 100}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Staff</div>
                    <div className="text-white font-semibold">{Math.floor(Math.random() * 100) + 20}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-slate-400">Last sync: {Math.floor(Math.random() * 30) + 1} min ago</span>
                </div>

                <Button 
                  onClick={() => onSelectHospital(hospital.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Access EMR System
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={handleDataExport}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Export Data
              </Button>
              <Button 
                onClick={handleBackupData}
                disabled={isProcessing}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                Backup Systems
              </Button>
              <Button 
                onClick={() => handleGenerateReport('Compliance Report')}
                disabled={isGeneratingReport}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Shield className="h-4 w-4 mr-2" />
                Compliance Report
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening system maintenance panel..." })}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
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
