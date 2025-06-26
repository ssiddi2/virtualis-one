
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  Activity,
  Brain,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isUpdatingCMS, setIsUpdatingCMS] = useState(false);
  const [isProcessingClaims, setIsProcessingClaims] = useState(false);

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated and is ready for download.`,
      });
      setIsGeneratingReport(false);
    }, 2000);
  };

  const handleCMSUpdate = async () => {
    setIsUpdatingCMS(true);
    
    // Simulate CMS quality measure update
    setTimeout(() => {
      toast({
        title: "CMS Quality Measures Updated",
        description: "Successfully submitted quality measures to CMS reporting system.",
      });
      setIsUpdatingCMS(false);
    }, 3000);
  };

  const handleProcessClaims = async () => {
    setIsProcessingClaims(true);
    
    // Simulate claims processing
    setTimeout(() => {
      toast({
        title: "Claims Processed",
        description: "15 claims have been processed and submitted to insurance providers.",
      });
      setIsProcessingClaims(false);
    }, 2500);
  };

  const handleExportData = (dataType: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${dataType} data. Download will begin shortly.`,
    });
    
    // Simulate file download
    setTimeout(() => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Mock ${dataType} data export`));
      element.setAttribute('download', `${dataType.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.csv`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Hospital Dashboard</h1>
            <p className="text-white/70">Real-time hospital operations overview</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleGenerateReport('Daily Operations')}
              disabled={isGeneratingReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Daily Report
            </Button>
            <Button 
              onClick={handleCMSUpdate}
              disabled={isUpdatingCMS}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600/10"
            >
              {isUpdatingCMS ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Update CMS
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">156</div>
              <p className="text-xs text-slate-400">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">89</div>
              <p className="text-xs text-slate-400">
                23 completed, 66 scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Revenue Today</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$45,230</div>
              <p className="text-xs text-slate-400">
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Bed Occupancy</CardTitle>
              <Activity className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">85%</div>
              <p className="text-xs text-slate-400">
                127 of 150 beds occupied
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billing & Claims */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-green-400" />
                Billing & Claims Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Pending Claims</span>
                <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">15</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Outstanding Revenue</span>
                <span className="text-white font-semibold">$127,450</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleProcessClaims}
                  disabled={isProcessingClaims}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessingClaims ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Process Claims
                </Button>
                <Button 
                  onClick={() => handleExportData('Billing')}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quality Reporting */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Quality & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Quality Score</span>
                <Badge className="bg-green-600/20 text-green-300 border-green-600/30">94.2%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">CMS Measures</span>
                <span className="text-white font-semibold">18/20 Met</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handleGenerateReport('Quality Metrics')}
                  disabled={isGeneratingReport}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                  Generate Report
                </Button>
                <Button 
                  onClick={() => handleExportData('Quality')}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CMS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-purple-400" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h4 className="font-medium text-white mb-2">Readmission Risk Alert</h4>
                <p className="text-sm text-slate-300 mb-3">5 patients identified with high readmission risk</p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <AlertCircle className="h-3 w-3 mr-2" />
                  Review Cases
                </Button>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h4 className="font-medium text-white mb-2">Cost Optimization</h4>
                <p className="text-sm text-slate-300 mb-3">Potential savings of $15K identified</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <TrendingUp className="h-3 w-3 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent System Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-slate-300">Daily backup completed successfully</span>
                </div>
                <span className="text-xs text-slate-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                <div className="flex items-center gap-3">
                  <Upload className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-300">CMS quality measures submitted</span>
                </div>
                <span className="text-xs text-slate-500">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-300">Monthly financial report generated</span>
                </div>
                <span className="text-xs text-slate-500">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
