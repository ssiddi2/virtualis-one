
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
  RefreshCw,
  Stethoscope,
  BarChart3,
  PieChart,
  Building2,
  Menu
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

interface MainDashboardProps {
  user?: any;
}

const MainDashboard = ({ user }: MainDashboardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isUpdatingCMS, setIsUpdatingCMS] = useState(false);
  const [isProcessingClaims, setIsProcessingClaims] = useState(false);

  // Get hospital context from navigation state
  const hospitalContext = location.state as { hospitalId?: string; hospitalName?: string } || {};
  const hospitalName = hospitalContext.hospitalName || 'Selected Hospital';

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    
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
    
    setTimeout(() => {
      toast({
        title: "Claims Processed",
        description: "15 claims have been processed and submitted to insurance providers.",
      });
      setIsProcessingClaims(false);
    }, 2500);
  };

  const handleNavigateWithContext = (path: string) => {
    navigate(path, { state: hospitalContext });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with Hospital Context */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">{hospitalName} - EMR Dashboard</h1>
                  <p className="text-white/70">Real-time hospital operations overview</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleGenerateReport('Daily Operations')}
                  disabled={isGeneratingReport}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                >
                  {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Daily Report
                </Button>
                <Button 
                  onClick={() => handleNavigateWithContext('/cfo-dashboard')}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  CFO Dashboard
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Active Patients</CardTitle>
                  <Users className="h-4 w-4 text-sky-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">156</div>
                  <p className="text-xs text-white/60">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Appointments Today</CardTitle>
                  <Calendar className="h-4 w-4 text-green-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">89</div>
                  <p className="text-xs text-white/60">23 completed, 66 scheduled</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Revenue Today</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$45,230</div>
                  <p className="text-xs text-white/60">+8% from yesterday</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Bed Occupancy</CardTitle>
                  <Activity className="h-4 w-4 text-pink-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">85%</div>
                  <p className="text-xs text-white/60">127 of 150 beds occupied</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => handleNavigateWithContext('/patients')}
                className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-col gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Patient Management</span>
              </Button>
              
              <Button 
                onClick={() => handleNavigateWithContext('/clinical')}
                className="h-24 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white flex-col gap-2"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Clinical Workflows</span>
              </Button>
              
              <Button 
                onClick={() => handleNavigateWithContext('/billing')}
                className="h-24 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white flex-col gap-2"
              >
                <DollarSign className="h-6 w-6" />
                <span>Revenue Cycle</span>
              </Button>
              
              <Button 
                onClick={() => handleNavigateWithContext('/ai-dashboard')}
                className="h-24 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white flex-col gap-2"
              >
                <Brain className="h-6 w-6" />
                <span>AI Insights</span>
              </Button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="h-5 w-5 text-green-300" />
                    Revenue Cycle Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Monthly Revenue</span>
                    <span className="text-white font-semibold">$1.2M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Collection Rate</span>
                    <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">94.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Days in A/R</span>
                    <span className="text-white font-semibold">32 days</span>
                  </div>
                  <Button 
                    onClick={() => handleNavigateWithContext('/cfo-dashboard')}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    View Financial Projections
                  </Button>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-sky-300" />
                    Quality & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Quality Score</span>
                    <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">94.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">CMS Measures</span>
                    <span className="text-white font-semibold">18/20 Met</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Risk Score</span>
                    <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">Low</Badge>
                  </div>
                  <Button 
                    onClick={() => handleNavigateWithContext('/quality')}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    View Quality Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-purple-300" />
                  AI-Powered Executive Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Revenue Optimization</h4>
                    <p className="text-sm text-white/70 mb-3">AI identified $45K monthly revenue opportunity through coding optimization</p>
                    <Button size="sm" onClick={() => handleNavigateWithContext('/coding')} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-4 py-1 rounded-lg transition-all duration-300">
                      <BarChart3 className="h-3 w-3 mr-2" />
                      View Details
                    </Button>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Financial Projections</h4>
                    <p className="text-sm text-white/70 mb-3">12-month revenue forecast with 94% accuracy confidence</p>
                    <Button size="sm" onClick={() => handleNavigateWithContext('/cfo-dashboard')} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-4 py-1 rounded-lg transition-all duration-300">
                      <TrendingUp className="h-3 w-3 mr-2" />
                      View Projections
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainDashboard;
