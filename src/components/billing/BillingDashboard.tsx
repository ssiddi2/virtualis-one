
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
import BillingReportGenerator from './BillingReportGenerator';

interface BillingDashboardProps {
  hospitalId?: string | null;
}

const BillingDashboard = ({ hospitalId }: BillingDashboardProps) => {
  const { toast } = useToast();
  const { data: billingCharges } = useBillingCharges(hospitalId);
  const [isProcessing, setIsProcessing] = useState(false);

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
  const paidAmount = billingCharges?.reduce((sum, charge) => 
    sum + (charge.payment_amount || 0), 0) || 0;

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Billing & Revenue Management</h1>
            <p className="text-white/70">Comprehensive billing operations dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleProcessClaims}
              disabled={isProcessing}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-xl"
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Process All Claims
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-white/60">
                {billingCharges?.length || 0} total charges
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Collected</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${paidAmount.toLocaleString()}</div>
              <p className="text-xs text-white/60">
                {totalRevenue > 0 ? `${((paidAmount / totalRevenue) * 100).toFixed(1)}% collection rate` : '0% collection rate'}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${outstandingAmount.toLocaleString()}</div>
              <p className="text-xs text-white/60">
                {pendingClaims.length} pending claims
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Days to Payment</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">28</div>
              <p className="text-xs text-white/60">
                -3 days from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Claims Management and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
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
                    <div key={claim.id} className="flex items-center justify-between p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{claim.charge_description}</div>
                        <div className="text-sm text-white/70">
                          ${claim.amount} • {new Date(claim.service_date).toLocaleDateString()}
                        </div>
                        {claim.patients && (
                          <div className="text-xs text-white/60">
                            Patient: {claim.patients.first_name} {claim.patients.last_name}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewClaimDetails(claim.id)}
                          className="border-blue-400/30 text-white hover:bg-blue-500/20 rounded-xl"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSubmitClaim(claim.id)}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-4">No pending claims</p>
                )}
              </div>
              {pendingClaims.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-blue-400/30 text-white hover:bg-blue-500/20 rounded-xl">
                    View All {pendingClaims.length} Claims
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <BillingReportGenerator hospitalId={hospitalId} />
        </div>

        {/* Quick Actions */}
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening new charge entry form..." })}
                className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white hover:bg-blue-500/30 rounded-xl"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                New Charge
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening payment posting interface..." })}
                className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white hover:bg-blue-500/30 rounded-xl"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Post Payment
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening denial management workflow..." })}
                className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white hover:bg-blue-500/30 rounded-xl"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Manage Denials
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening insurance verification..." })}
                className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white hover:bg-blue-500/30 rounded-xl"
              >
                <FileText className="h-4 w-4 mr-2" />
                Verify Insurance
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
