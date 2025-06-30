
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BillingReportGeneratorProps {
  hospitalId?: string | null;
}

const BillingReportGenerator = ({ hospitalId }: BillingReportGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Comprehensive mock billing data
  const mockBillingData = {
    charges: [
      { id: '1', description: 'Emergency Room Visit - Level 4', code: '99284', amount: 450, status: 'paid', patientName: 'John Smith', serviceDate: '2024-01-15', paymentAmount: 450, balanceDue: 0 },
      { id: '2', description: 'CT Chest w/contrast', code: '74170', amount: 1200, status: 'pending', patientName: 'Jane Doe', serviceDate: '2024-01-14', paymentAmount: 0, balanceDue: 1200 },
      { id: '3', description: 'Laboratory - CBC with Differential', code: '85025', amount: 35, status: 'paid', patientName: 'Bob Johnson', serviceDate: '2024-01-13', paymentAmount: 35, balanceDue: 0 },
      { id: '4', description: 'Echocardiogram Complete', code: '93307', amount: 350, status: 'denied', patientName: 'Alice Brown', serviceDate: '2024-01-12', paymentAmount: 0, balanceDue: 350 },
      { id: '5', description: 'Chest X-Ray 2 Views', code: '71020', amount: 85, status: 'paid', patientName: 'Charlie Wilson', serviceDate: '2024-01-11', paymentAmount: 85, balanceDue: 0 },
      { id: '6', description: 'Consultation - Cardiology', code: '99243', amount: 250, status: 'pending', patientName: 'Diana Davis', serviceDate: '2024-01-10', paymentAmount: 0, balanceDue: 250 },
      { id: '7', description: 'MRI Brain w/contrast', code: '70553', amount: 2500, status: 'paid', patientName: 'Edward Miller', serviceDate: '2024-01-09', paymentAmount: 2200, balanceDue: 300 },
      { id: '8', description: 'Physical Therapy Evaluation', code: '97161', amount: 120, status: 'paid', patientName: 'Fiona Garcia', serviceDate: '2024-01-08', paymentAmount: 120, balanceDue: 0 },
      { id: '9', description: 'Blood Chemistry Panel', code: '80053', amount: 65, status: 'pending', patientName: 'George Martinez', serviceDate: '2024-01-07', paymentAmount: 0, balanceDue: 65 },
      { id: '10', description: 'Ultrasound Abdomen Complete', code: '76700', amount: 180, status: 'paid', patientName: 'Helen Anderson', serviceDate: '2024-01-06', paymentAmount: 180, balanceDue: 0 }
    ],
    summary: {
      totalCharges: 5235,
      totalPaid: 3070,
      totalOutstanding: 2165,
      collectionRate: 58.6,
      totalClaims: 10
    }
  };

  const generateRevenueReport = () => {
    setIsGenerating(true);

    const reportData = {
      reportDate: new Date().toLocaleDateString(),
      hospitalName: 'General Hospital',
      reportPeriod: 'January 2024',
      summary: mockBillingData.summary,
      charges: mockBillingData.charges,
      agingAnalysis: {
        '0-30': { count: 3, amount: 1515 },
        '31-60': { count: 2, amount: 415 },
        '61-90': { count: 1, amount: 350 },
        '90+': { count: 0, amount: 0 }
      },
      payerMix: {
        'Medicare': { count: 4, amount: 1285 },
        'Commercial': { count: 3, amount: 2800 },
        'Medicaid': { count: 2, amount: 380 },
        'Self-Pay': { count: 1, amount: 450 }
      }
    };

    const reportContent = `
COMPREHENSIVE REVENUE CYCLE REPORT
Generated: ${reportData.reportDate}
Hospital: ${reportData.hospitalName}
Period: ${reportData.reportPeriod}

EXECUTIVE SUMMARY
==============================
Total Charges: $${reportData.summary.totalCharges.toLocaleString()}
Total Collected: $${reportData.summary.totalPaid.toLocaleString()}
Outstanding Balance: $${reportData.summary.totalOutstanding.toLocaleString()}
Collection Rate: ${reportData.summary.collectionRate}%
Total Claims: ${reportData.summary.totalClaims}

AGING ANALYSIS
==============================
0-30 Days: ${reportData.agingAnalysis['0-30'].count} claims - $${reportData.agingAnalysis['0-30'].amount.toLocaleString()}
31-60 Days: ${reportData.agingAnalysis['31-60'].count} claims - $${reportData.agingAnalysis['31-60'].amount.toLocaleString()}
61-90 Days: ${reportData.agingAnalysis['61-90'].count} claims - $${reportData.agingAnalysis['61-90'].amount.toLocaleString()}
90+ Days: ${reportData.agingAnalysis['90+'].count} claims - $${reportData.agingAnalysis['90+'].amount.toLocaleString()}

PAYER MIX ANALYSIS
==============================
Medicare: ${reportData.payerMix.Medicare.count} claims - $${reportData.payerMix.Medicare.amount.toLocaleString()}
Commercial: ${reportData.payerMix.Commercial.count} claims - $${reportData.payerMix.Commercial.amount.toLocaleString()}
Medicaid: ${reportData.payerMix.Medicaid.count} claims - $${reportData.payerMix.Medicaid.amount.toLocaleString()}
Self-Pay: ${reportData.payerMix['Self-Pay'].count} claims - $${reportData.payerMix['Self-Pay'].amount.toLocaleString()}

DETAILED CHARGE LISTING
==============================
${reportData.charges.map((charge, i) => 
  `${i + 1}. ${charge.description} (${charge.code})
   Patient: ${charge.patientName}
   Service Date: ${charge.serviceDate}
   Amount: $${charge.amount}
   Paid: $${charge.paymentAmount}
   Balance: $${charge.balanceDue}
   Status: ${charge.status.toUpperCase()}
   
`).join('')}

KEY PERFORMANCE INDICATORS
==============================
Average Days in A/R: 42.5 days
First Pass Resolution Rate: 78%
Clean Claim Rate: 85%
Denial Rate: 12%
Gross Collection Rate: 92%
Net Collection Rate: 96%

RECOMMENDATIONS
==============================
1. Focus on reducing days in A/R below 40 days
2. Improve prior authorization processes to reduce denials
3. Enhance patient financial counseling for self-pay accounts
4. Implement automated charge capture to improve accuracy
5. Strengthen payer contract negotiations for better reimbursement rates
    `;

    setTimeout(() => {
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprehensive-revenue-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
      toast({
        title: "Revenue Report Generated",
        description: `Comprehensive report with ${mockBillingData.charges.length} charges totaling $${mockBillingData.summary.totalCharges.toLocaleString()}`,
      });
    }, 2000);
  };

  const generateAgingReport = () => {
    setIsGenerating(true);

    const agingData = {
      '0-30': mockBillingData.charges.filter(c => c.status === 'pending' && new Date().getTime() - new Date(c.serviceDate).getTime() <= 30 * 24 * 60 * 60 * 1000),
      '31-60': mockBillingData.charges.filter(c => c.status === 'pending' && new Date().getTime() - new Date(c.serviceDate).getTime() > 30 * 24 * 60 * 60 * 1000 && new Date().getTime() - new Date(c.serviceDate).getTime() <= 60 * 24 * 60 * 60 * 1000),
      '61-90': mockBillingData.charges.filter(c => c.status === 'denied'),
      '90+': []
    };

    const reportContent = `
ACCOUNTS RECEIVABLE AGING REPORT
Generated: ${new Date().toLocaleDateString()}
Hospital: General Hospital

AGING SUMMARY
==============================
0-30 Days: ${agingData['0-30'].length} claims - $${agingData['0-30'].reduce((sum, c) => sum + c.balanceDue, 0).toLocaleString()}
31-60 Days: ${agingData['31-60'].length} claims - $${agingData['31-60'].reduce((sum, c) => sum + c.balanceDue, 0).toLocaleString()}
61-90 Days: ${agingData['61-90'].length} claims - $${agingData['61-90'].reduce((sum, c) => sum + c.balanceDue, 0).toLocaleString()}
90+ Days: ${agingData['90+'].length} claims - $${agingData['90+'].reduce((sum, c) => sum + c.balanceDue, 0).toLocaleString()}

Total Outstanding: $${mockBillingData.summary.totalOutstanding.toLocaleString()}

DETAILED AGING BREAKDOWN
==============================
${Object.entries(agingData).map(([bucket, claims]) => 
  claims.length > 0 ? `
${bucket} DAYS:
${claims.map(claim => 
  `- ${claim.patientName}: ${claim.description} - $${claim.balanceDue} (${claim.status})`
).join('\n')}
` : ''
).join('')}
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
      URL.revokeObjectURL(url);

      setIsGenerating(false);
      toast({
        title: "Aging Report Generated",
        description: "Detailed accounts receivable aging analysis has been downloaded.",
      });
    }, 1500);
  };

  const generateDenialReport = () => {
    setIsGenerating(true);

    const denialData = mockBillingData.charges.filter(c => c.status === 'denied');
    
    const reportContent = `
DENIAL MANAGEMENT REPORT
Generated: ${new Date().toLocaleDateString()}
Hospital: General Hospital

DENIAL SUMMARY
==============================
Total Denials: ${denialData.length}
Total Denied Amount: $${denialData.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
Denial Rate: ${((denialData.length / mockBillingData.charges.length) * 100).toFixed(1)}%

DENIAL DETAILS
==============================
${denialData.map((claim, i) => 
  `${i + 1}. Patient: ${claim.patientName}
   Service: ${claim.description} (${claim.code})
   Amount: $${claim.amount}
   Service Date: ${claim.serviceDate}
   Reason: Medical necessity not established
   
`).join('')}

DENIAL PATTERN ANALYSIS
==============================
Top Denial Reasons:
1. Medical necessity (40%)
2. Prior authorization required (25%)
3. Coding errors (20%)
4. Timely filing (10%)
5. Other (5%)

RECOMMENDED ACTIONS
==============================
1. Implement prior authorization tracking system
2. Enhance clinical documentation for medical necessity
3. Provide coding education to reduce errors
4. Establish denial prevention workflow
5. Set up automated appeal process for qualifying denials
    `;

    setTimeout(() => {
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `denial-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
      toast({
        title: "Denial Report Generated",
        description: "Comprehensive denial analysis report has been downloaded.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="virtualis-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${mockBillingData.summary.totalCharges.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="virtualis-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Collections</p>
                <p className="text-2xl font-bold text-white">${mockBillingData.summary.totalPaid.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="virtualis-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Outstanding</p>
                <p className="text-2xl font-bold text-white">${mockBillingData.summary.totalOutstanding.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="virtualis-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Collection Rate</p>
                <p className="text-2xl font-bold text-white">{mockBillingData.summary.collectionRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card className="virtualis-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-300" />
            Revenue Cycle Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={generateRevenueReport}
              disabled={isGenerating}
              className="virtualis-button h-20 flex-col"
            >
              <Download className="h-6 w-6 mb-2" />
              <div className="text-center">
                <div className="font-semibold">Revenue Report</div>
                <div className="text-xs opacity-80">Comprehensive financial analysis</div>
              </div>
            </Button>

            <Button 
              onClick={generateAgingReport}
              disabled={isGenerating}
              className="virtualis-button h-20 flex-col"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <div className="text-center">
                <div className="font-semibold">Aging Report</div>
                <div className="text-xs opacity-80">A/R aging analysis</div>
              </div>
            </Button>

            <Button 
              onClick={generateDenialReport}
              disabled={isGenerating}
              className="virtualis-button h-20 flex-col"
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              <div className="text-center">
                <div className="font-semibold">Denial Report</div>
                <div className="text-xs opacity-80">Denial trend analysis</div>
              </div>
            </Button>
          </div>

          {isGenerating && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-white/70">Generating report...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Claims */}
      <Card className="virtualis-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockBillingData.charges.slice(0, 5).map((charge) => (
              <div key={charge.id} className="flex justify-between items-center p-3 virtualis-card">
                <div>
                  <div className="font-medium text-white">{charge.description}</div>
                  <div className="text-sm text-white/60">{charge.patientName} • {charge.serviceDate}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-mono">${charge.amount}</span>
                  <Badge className={`${
                    charge.status === 'paid' ? 'virtualis-badge success' :
                    charge.status === 'pending' ? 'virtualis-badge warning' :
                    'virtualis-badge error'
                  }`}>
                    {charge.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingReportGenerator;
