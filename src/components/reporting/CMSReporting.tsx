
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Download,
  Send,
  BarChart3,
  Shield,
  DollarSign,
  Users
} from "lucide-react";

const CMSReporting = () => {
  const [selectedReports, setSelectedReports] = useState([]);

  const reportingMetrics = {
    q4Submissions: 12,
    pendingReports: 3,
    complianceScore: "98.5%",
    totalMeasures: 284,
    qualityScores: "4.8/5",
    penaltyAvoidance: "$2.4M"
  };

  const quarterlyReports = [
    {
      id: "CMS-Q4-2024-001",
      reportType: "Hospital VBP",
      quarter: "Q4 2024",
      measures: 23,
      dueDate: "2024-02-15",
      status: "In Progress",
      completionRate: "87%",
      responsible: "Quality Team",
      estimatedPenalty: "$145K",
      lastUpdated: "2024-01-14"
    },
    {
      id: "CMS-Q4-2024-002",
      reportType: "Hospital Readmissions",
      quarter: "Q4 2024",
      measures: 15,
      dueDate: "2024-02-28",
      status: "Ready for Review",
      completionRate: "100%",
      responsible: "Clinical Analytics",
      estimatedPenalty: "$0",
      lastUpdated: "2024-01-15"
    },
    {
      id: "CMS-Q4-2024-003",
      reportType: "HAC Reduction",
      quarter: "Q4 2024",
      measures: 12,
      dueDate: "2024-03-15",
      status: "Pending Submission",
      completionRate: "95%",
      responsible: "Infection Control",
      estimatedPenalty: "$67K",
      lastUpdated: "2024-01-13"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready for Review": return "text-green-400";
      case "Pending Submission": return "text-yellow-400";
      case "In Progress": return "text-blue-400";
      case "Submitted": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready for Review": return <CheckCircle className="h-4 w-4" />;
      case "Submitted": return <CheckCircle className="h-4 w-4" />;
      case "Pending Submission": return <Clock className="h-4 w-4" />;
      case "In Progress": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCompletionColor = (rate: string) => {
    const percentage = parseInt(rate);
    if (percentage >= 95) return "text-green-400";
    if (percentage >= 80) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">CMS Quality Reporting</h1>
          <p className="text-white/60">Centers for Medicare & Medicaid Services - Quarterly State Reporting</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
            <Download className="h-4 w-4" />
            Export All Reports
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
            <Send className="h-4 w-4" />
            Submit to CMS
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Q4 Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{reportingMetrics.q4Submissions}</div>
            <p className="text-xs text-blue-400">Total reports</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{reportingMetrics.pendingReports}</div>
            <p className="text-xs text-yellow-400">Action required</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{reportingMetrics.complianceScore}</div>
            <p className="text-xs text-green-400">Above benchmark</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{reportingMetrics.totalMeasures}</div>
            <p className="text-xs text-blue-400">Quality indicators</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Quality Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{reportingMetrics.qualityScores}</div>
            <p className="text-xs text-green-400">CMS star rating</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Penalty Avoidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{reportingMetrics.penaltyAvoidance}</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Annual savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="quarterly" className="space-y-4">
        <TabsList className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl">
          <TabsTrigger value="quarterly" className="text-white data-[state=active]:bg-blue-600/30">Quarterly Reports</TabsTrigger>
          <TabsTrigger value="measures" className="text-white data-[state=active]:bg-blue-600/30">Quality Measures</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-600/30">Performance Analytics</TabsTrigger>
          <TabsTrigger value="compliance" className="text-white data-[state=active]:bg-blue-600/30">Compliance Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="quarterly" className="space-y-4">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">CMS Quarterly Reporting Status</CardTitle>
                  <CardDescription className="text-white/60">Track submission deadlines and compliance requirements</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                    <Calendar className="h-4 w-4" />
                    View Calendar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white">Report ID</TableHead>
                    <TableHead className="text-white">Report Type</TableHead>
                    <TableHead className="text-white">Quarter</TableHead>
                    <TableHead className="text-white">Measures</TableHead>
                    <TableHead className="text-white">Due Date</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Completion</TableHead>
                    <TableHead className="text-white">Responsible</TableHead>
                    <TableHead className="text-white">Est. Penalty</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarterlyReports.map((report) => (
                    <TableRow key={report.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium text-sm">{report.id}</TableCell>
                      <TableCell className="text-white font-medium">{report.reportType}</TableCell>
                      <TableCell className="text-white">{report.quarter}</TableCell>
                      <TableCell className="text-white text-center">{report.measures}</TableCell>
                      <TableCell className="text-white">{report.dueDate}</TableCell>
                      <TableCell className={getStatusColor(report.status)}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <span className="text-sm">{report.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className={getCompletionColor(report.completionRate)}>
                        <span className="font-semibold">{report.completionRate}</span>
                      </TableCell>
                      <TableCell className="text-white text-sm">{report.responsible}</TableCell>
                      <TableCell className="text-white font-mono">{report.estimatedPenalty}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 text-xs">
                            View
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

        <TabsContent value="measures" className="space-y-4">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Quality Measures Management</CardTitle>
              <CardDescription className="text-white/60">Configure and monitor CMS quality measures and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Quality Measures Dashboard</h3>
                <p className="text-white/60 mb-4">Track performance across all CMS quality domains and measures</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">Configure Measures</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Performance Analytics & Benchmarking</CardTitle>
              <CardDescription className="text-white/60">Advanced analytics for quality improvement and benchmarking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics Suite</h3>
                <p className="text-white/60 mb-4">Predictive modeling, trend analysis, and peer benchmarking</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">View Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Compliance Management Dashboard</CardTitle>
              <CardDescription className="text-white/60">Monitor regulatory compliance and audit readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Regulatory Compliance Center</h3>
                <p className="text-white/60 mb-4">Automated compliance monitoring and audit trail management</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">Check Compliance</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSReporting;
