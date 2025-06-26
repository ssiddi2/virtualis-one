
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Download,
  Filter,
  Search
} from "lucide-react";

const BillingDashboard = () => {
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);

  const billingMetrics = {
    totalRevenue: "$2,847,392",
    pendingClaims: 127,
    deniedClaims: 23,
    approvedClaims: 1248,
    collectionRate: "94.2%",
    avgDaysInAR: 28
  };

  const recentClaims = [
    { id: "CLM-2024-001", patient: "John Smith", dos: "2024-01-15", amount: "$1,250.00", status: "Pending", payer: "Medicare", cpt: "99214" },
    { id: "CLM-2024-002", patient: "Mary Johnson", dos: "2024-01-14", amount: "$890.00", status: "Approved", payer: "Aetna", cpt: "99213" },
    { id: "CLM-2024-003", patient: "Robert Brown", dos: "2024-01-13", amount: "$2,100.00", status: "Denied", payer: "BCBS", cpt: "99215" },
    { id: "CLM-2024-004", patient: "Sarah Davis", dos: "2024-01-12", amount: "$675.00", status: "Pending", payer: "UnitedHealth", cpt: "99212" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "text-green-400";
      case "Denied": return "text-red-400";
      case "Pending": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle className="h-4 w-4" />;
      case "Denied": return <AlertCircle className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white brand-font gradient-text">Revenue Cycle Management</h1>
          <p className="text-white/60 tech-font">Comprehensive billing and claims management platform</p>
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
            <div className="text-2xl font-bold text-white">{billingMetrics.totalRevenue}</div>
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="claims" className="space-y-4">
        <TabsList className="glass-nav-item bg-black/20">
          <TabsTrigger value="claims" className="text-white data-[state=active]:text-virtualis-gold">Claims Management</TabsTrigger>
          <TabsTrigger value="denials" className="text-white data-[state=active]:text-virtualis-gold">Denial Management</TabsTrigger>
          <TabsTrigger value="payments" className="text-white data-[state=active]:text-virtualis-gold">Payment Posting</TabsTrigger>
          <TabsTrigger value="reports" className="text-white data-[state=active]:text-virtualis-gold">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white tech-font">Recent Claims</CardTitle>
                  <CardDescription className="text-white/60">Monitor claim status and workflow</CardDescription>
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
                    <TableHead className="text-virtualis-gold tech-font">Date of Service</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Amount</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">CPT Code</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Payer</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Status</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClaims.map((claim) => (
                    <TableRow key={claim.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white tech-font font-medium">{claim.id}</TableCell>
                      <TableCell className="text-white">{claim.patient}</TableCell>
                      <TableCell className="text-white">{claim.dos}</TableCell>
                      <TableCell className="text-white font-semibold">{claim.amount}</TableCell>
                      <TableCell className="text-white">
                        <span className="glass-badge primary">{claim.cpt}</span>
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
                          <Button size="sm" variant="ghost" className="text-virtualis-gold hover:bg-virtualis-gold/20">
                            View
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
        </TabsContent>

        <TabsContent value="denials" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Denial Management Workflow</CardTitle>
              <CardDescription className="text-white/60">Track and resolve claim denials efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Denial Management Center</h3>
                <p className="text-white/60 mb-4">Advanced denial tracking and resolution workflows</p>
                <Button className="glass-button">Configure Denial Rules</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Payment Posting</CardTitle>
              <CardDescription className="text-white/60">ERA processing and payment reconciliation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Automated Payment Processing</h3>
                <p className="text-white/60 mb-4">Electronic remittance advice and payment posting</p>
                <Button className="glass-button">Process ERAs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Financial Analytics</CardTitle>
              <CardDescription className="text-white/60">Comprehensive revenue cycle reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Reporting Suite</h3>
                <p className="text-white/60 mb-4">KPI dashboards and financial analytics</p>
                <Button className="glass-button">Generate Reports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboard;
