
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBillingCharges } from '@/hooks/useBillingCharges';

interface BillingReportGeneratorProps {
  hospitalId?: string | null;
}

const BillingReportGenerator = ({ hospitalId }: BillingReportGeneratorProps) => {
  const { toast } = useToast();
  const { data: billingCharges } = useBillingCharges(hospitalId);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRevenueReport = () => {
    if (!billingCharges || billingCharges.length === 0) {
      toast({
        title: "No Data Available",
        description: "No billing data found to generate report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Generate actual report content from mock data
    const totalRevenue = billingCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
    const totalPaid = billingCharges.reduce((sum, charge) => sum + (charge.payment_amount || 0), 0);
    const totalOutstanding = billingCharges.reduce((sum, charge) => sum + (charge.balance_due || 0), 0);
    const claimsByStatus = billingCharges.reduce((acc, charge) => {
      acc[charge.status || 'unknown'] = (acc[charge.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const reportData = {
      reportDate: new Date().toLocaleDateString(),
      summary: {
        totalCharges: billingCharges.length,
        totalRevenue: totalRevenue.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        totalOutstanding: totalOutstanding.toFixed(2),
        collectionRate: ((totalPaid / totalRevenue) * 100).toFixed(1)
      },
      claimsByStatus,
      topCharges: billingCharges
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 10)
        .map(charge => ({
          description: charge.charge_description,
          code: charge.charge_code,
          amount: charge.amount,
          status: charge.status,
          patientName: charge.patients ? `${charge.patients.first_name} ${charge.patients.last_name}` : 'Unknown'
        }))
    };

    // Create downloadable report
    const reportContent = `
REVENUE CYCLE MANAGEMENT REPORT
Generated: ${reportData.reportDate}

SUMMARY METRICS
Total Charges: ${reportData.summary.totalCharges}
Total Revenue: $${reportData.summary.totalRevenue}
Total Collected: $${reportData.summary.totalPaid}
Outstanding Balance: $${reportData.summary.totalOutstanding}
Collection Rate: ${reportData.summary.collectionRate}%

CLAIMS BY STATUS
${Object.entries(claimsByStatus).map(([status, count]) => `${status}: ${count}`).join('\n')}

TOP CHARGES
${reportData.topCharges.map((charge, i) => 
  `${i + 1}. ${charge.description} (${charge.code}) - $${charge.amount} - ${charge.status} - Patient: ${charge.patientName}`
).join('\n')}
    `;

    setTimeout(() => {
      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: `Revenue report generated with ${billingCharges.length} charges totaling $${totalRevenue.toFixed(2)}`,
      });
    }, 2000);
  };

  const generateAgingReport = () => {
    if (!billingCharges || billingCharges.length === 0) {
      toast({
        title: "No Data Available",
        description: "No billing data found to generate aging report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    const today = new Date();
    const agingBuckets = {
      '0-30': { count: 0, amount: 0 },
      '31-60': { count: 0, amount: 0 },
      '61-90': { count: 0, amount: 0 },
      '90+': { count: 0, amount: 0 }
    };

    billingCharges.forEach(charge => {
      if (charge.balance_due && charge.balance_due > 0) {
        const serviceDate = new Date(charge.service_date);
        const daysDiff = Math.floor((today.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 30) {
          agingBuckets['0-30'].count++;
          agingBuckets['0-30'].amount += charge.balance_due;
        } else if (daysDiff <= 60) {
          agingBuckets['31-60'].count++;
          agingBuckets['31-60'].amount += charge.balance_due;
        } else if (daysDiff <= 90) {
          agingBuckets['61-90'].count++;
          agingBuckets['61-90'].amount += charge.balance_due;
        } else {
          agingBuckets['90+'].count++;
          agingBuckets['90+'].amount += charge.balance_due;
        }
      }
    });

    const reportContent = `
ACCOUNTS RECEIVABLE AGING REPORT
Generated: ${new Date().toLocaleDateString()}

AGING SUMMARY
0-30 Days: ${agingBuckets['0-30'].count} claims, $${agingBuckets['0-30'].amount.toFixed(2)}
31-60 Days: ${agingBuckets['31-60'].count} claims, $${agingBuckets['31-60'].amount.toFixed(2)}
61-90 Days: ${agingBuckets['61-90'].count} claims, $${agingBuckets['61-90'].amount.toFixed(2)}
90+ Days: ${agingBuckets['90+'].count} claims, $${agingBuckets['90+'].amount.toFixed(2)}

Total Outstanding: $${Object.values(agingBuckets).reduce((sum, bucket) => sum + bucket.amount, 0).toFixed(2)}
    `;

    setTimeout(() => {
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aging-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a);

      setIsGenerating(false);
      toast({
        title: "Aging Report Generated",
        description: "Accounts receivable aging report has been downloaded.",
      });
    }, 1500);
  };

  if (!billingCharges || billingCharges.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-blue-400" />
            Billing Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">
            No billing data available to generate reports
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = billingCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  const pendingClaims = billingCharges.filter(charge => charge.status === 'pending').length;
  const paidClaims = billingCharges.filter(charge => charge.status === 'paid').length;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-blue-400" />
          Billing Reports ({billingCharges.length} claims)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-700/30 rounded">
            <div className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Revenue</div>
          </div>
          <div className="p-3 bg-slate-700/30 rounded">
            <div className="text-2xl font-bold text-yellow-400">{pendingClaims}</div>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
          <div className="p-3 bg-slate-700/30 rounded">
            <div className="text-2xl font-bold text-blue-400">{paidClaims}</div>
            <div className="text-sm text-slate-400">Paid</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={generateRevenueReport}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Revenue Report
          </Button>
          <Button 
            onClick={generateAgingReport}
            disabled={isGenerating}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Aging Report
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-white font-medium mb-2">Recent Claims</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {billingCharges.slice(0, 3).map((charge) => (
              <div key={charge.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-300">{charge.charge_description}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">${charge.amount}</span>
                  <Badge 
                    className={`text-xs ${
                      charge.status === 'paid' ? 'bg-green-600/20 text-green-300' :
                      charge.status === 'pending' ? 'bg-yellow-600/20 text-yellow-300' :
                      'bg-red-600/20 text-red-300'
                    }`}
                  >
                    {charge.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingReportGenerator;
