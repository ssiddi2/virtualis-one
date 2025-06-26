
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePatients } from "@/hooks/usePatients";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Download,
  Filter,
  Search,
  Brain,
  CreditCard,
  Receipt
} from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { toast } from "sonner";

interface BillingDashboardProps {
  hospitalId?: string | null;
}

const BillingDashboard = ({ hospitalId }: BillingDashboardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: patients } = usePatients(hospitalId || undefined);
  const { callAI, isLoading } = useAIAssistant();
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);

  // Generate hospital-specific billing data
  const generateBillingData = () => {
    if (!patients || !hospitalId) return [];
    
    const billingScenarios = {
      '11111111-1111-1111-1111-111111111111': {
        name: 'Metropolitan General Hospital',
        avgClaimAmount: 2500,
        procedures: ['99214', '99215', '99213', '93000', '36415']
      },
      '22222222-2222-2222-2222-222222222222': {
        name: 'Riverside Medical Center',
        avgClaimAmount: 3200,
        procedures: ['99285', '99284', '99283', '71020', '80053']
      },
      '33333333-3333-3333-3333-333333333333': {
        name: 'Sunset Community Hospital',
        avgClaimAmount: 1800,
        procedures: ['99213', '99214', '99212', '85025', '80061']
      },
      '44444444-4444-4444-4444-444444444444': {
        name: 'Bay Area Medical Complex',
        avgClaimAmount: 4200,
        procedures: ['99215', '99285', '99291', '71250', '80048']
      },
      '55555555-5555-5555-5555-555555555555': {
        name: 'Texas Heart Institute',
        avgClaimAmount: 5500,
        procedures: ['93458', '93454', '93010', '93306', '36247']
      }
    };

    const scenario = billingScenarios[hospitalId as keyof typeof billingScenarios];
    if (!scenario) return [];

    const statuses = ['Pending', 'Approved', 'Denied', 'Under Review'];
    const payers = ['Medicare', 'Medicaid', 'Aetna', 'BCBS', 'UnitedHealth', 'Cigna'];
    
    return patients.map((patient, index) => ({
      id: `CLM-${hospitalId.slice(0, 8)}-${String(index + 1).padStart(3, '0')}`,
      patient: `${patient.first_name} ${patient.last_name}`,
      patientId: patient.id,
      dos: new Date(patient.admission_date || new Date()).toISOString().split('T')[0],
      amount: `$${(scenario.avgClaimAmount + (index * 200)).toLocaleString()}.00`,
      status: statuses[index % statuses.length],
      payer: payers[index % payers.length],
      cpt: scenario.procedures[index % scenario.procedures.length],
      hospital: scenario.name,
      mrn: patient.mrn
    }));
  };

  const billingData = generateBillingData();

  const billingMetrics = {
    totalRevenue: billingData.reduce((sum, claim) => sum + parseInt(claim.amount.replace(/[$,]/g, '')), 0),
    pendingClaims: billingData.filter(c => c.status === 'Pending').length,
    deniedClaims: billingData.filter(c => c.status === 'Denied').length,
    approvedClaims: billingData.filter(c => c.status === 'Approved').length,
    collectionRate: "94.2%",
    avgDaysInAR: 28
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "text-green-400";
      case "Denied": return "text-red-400";
      case "Pending": return "text-yellow-400";
      case "Under Review": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle className="h-4 w-4" />;
      case "Denied": return <AlertCircle className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Under Review": return <FileText className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleAIClaimsReview = async (claim: any) => {
    try {
      const claimData = `
        Claim ID: ${claim.id}
        Patient: ${claim.patient} (MRN: ${claim.mrn})
        Date of Service: ${claim.dos}
        CPT Code: ${claim.cpt}
        Amount: ${claim.amount}
        Payer: ${claim.payer}
        Status: ${claim.status}
        Hospital: ${claim.hospital}
      `;

      const result = await callAI({
        type: 'claims_review',
        data: {
          procedure: claim.cpt,
          diagnosis: 'Based on encounter',
          codes: claim.cpt,
          insurance: claim.payer,
          amount: claim.amount
        },
        context: `Claims review for ${claim.patient} at ${claim.hospital}`
      });

      toast.success(`AI claims review completed for ${claim.patient}`);
      console.log('AI Claims Review Result:', result);
    } catch (error) {
      toast.error('Failed to complete AI claims review');
      console.error('AI claims review error:', error);
    }
  };

  if (!hospitalId) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6 flex items-center justify-center">
        <Card className="bg-[#1a2332] border-[#2a3441] text-white max-w-md">
          <CardContent className="p-8 text-center">
            <Receipt className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hospital Selected</h3>
            <p className="text-white/70 mb-4">
              Please select a hospital from the EMR Dashboard to view billing data.
            </p>
            <Button onClick={() => navigate('/emr')} className="bg-blue-600 hover:bg-blue-700">
              Go to EMR Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentHospital = billingData[0]?.hospital || 'Selected Hospital';

  return (
    <div className="min-h-screen bg-[#0a1628] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white brand-font gradient-text">Revenue Cycle Management</h1>
          <p className="text-white/60 tech-font">{currentHospital} - Comprehensive billing and claims management</p>
        </div>
        <div className="flex gap-3">
          <Button className="glass-button">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="glass-button">
            <Filter className="h-4 w-4" />
            Filter Claims
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${billingMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{billingMetrics.pendingClaims}</div>
            <p className="text-xs text-yellow-400">Requires follow-up</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Denied Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{billingMetrics.deniedClaims}</div>
            <p className="text-xs text-red-400">Action required</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{billingMetrics.approvedClaims}</div>
            <p className="text-xs text-green-400">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{billingMetrics.collectionRate}</div>
            <p className="text-xs text-green-400">Above benchmark</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font">Avg Days in A/R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{billingMetrics.avgDaysInAR}</div>
            <p className="text-xs text-yellow-400">Industry avg: 35</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white tech-font">Claims Management - {currentHospital}</CardTitle>
              <CardDescription className="text-white/60">AI-powered claims processing and review</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search claims..." 
                  className="glass-input pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-virtualis-gold tech-font">Claim ID</TableHead>
                <TableHead className="text-virtualis-gold tech-font">Patient</TableHead>
                <TableHead className="text-virtualis-gold tech-font">MRN</TableHead>
                <TableHead className="text-virtualis-gold tech-font">Date of Service</TableHead>
                <TableHead className="text-virtualis-gold tech-font">Amount</TableHead>
                <TableHead className="text-virtualis-gold tech-font">CPT Code</TableHead>
                <TableHead className="text-virtualis-gold tech-font">Payer</TableHead>
                <TableHead className="text-virtualis-gold tech-font">Status</TableHead>
                <TableHead className="text-virtualis-gold tech-font">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingData.map((claim) => (
                <TableRow key={claim.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white tech-font font-medium">{claim.id}</TableCell>
                  <TableCell className="text-white">
                    <Button 
                      variant="link" 
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                      onClick={() => navigate(`/patient/${claim.patientId}`)}
                    >
                      {claim.patient}
                    </Button>
                  </TableCell>
                  <TableCell className="text-white font-mono text-sm">{claim.mrn}</TableCell>
                  <TableCell className="text-white">{claim.dos}</TableCell>
                  <TableCell className="text-white font-semibold">{claim.amount}</TableCell>
                  <TableCell className="text-white">
                    <Badge className="glass-badge primary">{claim.cpt}</Badge>
                  </TableCell>
                  <TableCell className="text-white">{claim.payer}</TableCell>
                  <TableCell className={getStatusColor(claim.status)}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(claim.status)}
                      <span>{claim.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAIClaimsReview(claim)}
                        disabled={isLoading}
                        className="text-blue-400 hover:bg-blue-600/20"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Review
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDashboard;
