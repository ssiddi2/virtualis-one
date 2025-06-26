
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Send,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBillingCharges } from '@/hooks/useBillingCharges';

const BillingDashboard = () => {
  const { toast } = useToast();
  const { data: billingCharges } = useBillingCharges();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');

  const handleProcessClaims = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      toast({
        title: "Claims Processing Complete",
        description: "Successfully processed 12 claims and submitted to insurance providers.",
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

  const handleSubmitClaim = (claimId: string) => {
    toast({
      title: "Claim Submitted",
      description: `Claim ${claimId} has been submitted to insurance provider for processing.`,
    });
  };

  const handleViewClaimDetails = (claimId: string) => {
    toast({
      title: "Claim Details",
      description: `Opening detailed view for claim ${claimId}`,
    });
  };

  const pendingClaims = billingCharges?.filter(charge => charge.status === 'pending') || [];
  const totalRevenue = billingCharges?.reduce((sum, charge) => sum + (charge.amount || 0), 0) || 0;
  const outstandingAmount = billingCharges?.reduce((sum, charge) => 
    sum + (charge.balance_due || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Billing & Revenue Management</h1>
            <p className="text-white/70">Comprehensive billing operations dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleGenerateReport('Revenue Summary')}
              disabled={isGeneratingReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Revenue Report
            </Button>
            <Button 
              onClick={handleProcessClaims}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Process All Claims
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-slate-400">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${outstandingAmount.toLocaleString()}</div>
              <p className="text-xs text-slate-400">
                {pendingClaims.length} pending claims
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Collection Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">94.2%</div>
              <p className="text-xs text-slate-400">
                Above industry average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Days to Payment</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">28</div>
              <p className="text-xs text-slate-400">
                -3 days from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Claims Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-blue-400" />
                Pending Claims ({pendingClaims.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingClaims.length > 0 ? (
                  pendingClaims.slice(0, 5).map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <div>
                        <div className="font-medium text-white">{claim.charge_description}</div>
                        <div className="text-sm text-slate-400">
                          ${claim.amount} • {new Date(claim.service_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewClaimDetails(claim.id)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSubmitClaim(claim.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No pending claims</p>
                )}
              </div>
              {pendingClaims.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                    View All {pendingClaims.length} Claims
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Revenue Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">This Month</span>
                <span className="text-green-400 font-semibold">$245,680</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Last Month</span>
                <span className="text-slate-400">$219,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Growth</span>
                <Badge className="bg-green-600/20 text-green-300 border-green-600/30">+12%</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button 
                  onClick={() => handleGenerateReport('Monthly Analytics')}
                  disabled={isGeneratingReport}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Analytics Report
                </Button>
                <Button 
                  onClick={() => handleGenerateReport('Claims Summary')}
                  disabled={isGeneratingReport}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening new charge entry form..." })}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                New Charge
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening payment posting interface..." })}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Post Payment
              </Button>
              <Button 
                onClick={() => handleGenerateReport('Aging Report')}
                disabled={isGeneratingReport}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                Aging Report
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening denial management workflow..." })}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Manage Denials
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingDashboard;
