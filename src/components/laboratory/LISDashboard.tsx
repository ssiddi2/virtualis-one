
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TestTube, 
  Microscope, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  Download,
  FlaskConical,
  Beaker,
  Activity
} from "lucide-react";

const LISDashboard = () => {
  const [selectedTests, setSelectedTests] = useState([]);

  const labMetrics = {
    totalTests: 2847,
    pendingResults: 127,
    criticalValues: 8,
    completedToday: 891,
    avgTurnaroundTime: "2.4 hrs",
    qualityScore: "98.7%"
  };

  const pendingTests = [
    { 
      id: "LAB-2024-001", 
      patient: "John Smith", 
      mrn: "MRN123456",
      orderDate: "2024-01-15 08:30", 
      testType: "Complete Blood Count",
      specimen: "Blood", 
      priority: "STAT", 
      status: "In Progress",
      expectedTAT: "1 hr",
      technologist: "Sarah Lab"
    },
    { 
      id: "LAB-2024-002", 
      patient: "Mary Johnson", 
      mrn: "MRN789012",
      orderDate: "2024-01-15 07:45", 
      testType: "Basic Metabolic Panel",
      specimen: "Serum", 
      priority: "Routine", 
      status: "Pending Review",
      expectedTAT: "4 hrs",
      technologist: "Mike Chen"
    },
    { 
      id: "LAB-2024-003", 
      patient: "Robert Brown", 
      mrn: "MRN345678",
      orderDate: "2024-01-15 06:15", 
      testType: "Lipid Panel",
      specimen: "Plasma", 
      priority: "ASAP", 
      status: "Critical Value",
      expectedTAT: "2 hrs",
      technologist: "Lisa Wong"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "STAT": return "text-red-400";
      case "ASAP": return "text-orange-400";
      case "Routine": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical Value": return "text-red-400";
      case "Pending Review": return "text-yellow-400";
      case "In Progress": return "text-blue-400";
      case "Completed": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Critical Value": return <AlertTriangle className="h-4 w-4" />;
      case "Completed": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white brand-font gradient-text">Laboratory Information System</h1>
          <p className="text-white/60 tech-font">Comprehensive laboratory workflow and result management</p>
        </div>
        <div className="flex gap-3">
          <Button className="glass-button">
            <Download className="h-4 w-4" />
            Export Lab Report
          </Button>
          <Button className="glass-button">
            <TestTube className="h-4 w-4" />
            New Lab Order
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Total Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.totalTests}</div>
            <p className="text-xs text-blue-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.pendingResults}</div>
            <p className="text-xs text-yellow-400">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.criticalValues}</div>
            <p className="text-xs text-red-400">Immediate attention</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.completedToday}</div>
            <p className="text-xs text-green-400">Daily performance</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font">Avg Turnaround</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.avgTurnaroundTime}</div>
            <p className="text-xs text-green-400">Below target</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.qualityScore}</div>
            <p className="text-xs text-green-400">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="worklist" className="space-y-4">
        <TabsList className="glass-nav-item bg-black/20">
          <TabsTrigger value="worklist" className="text-white data-[state=active]:text-virtualis-gold">Lab Worklist</TabsTrigger>
          <TabsTrigger value="results" className="text-white data-[state=active]:text-virtualis-gold">Results Review</TabsTrigger>
          <TabsTrigger value="quality" className="text-white data-[state=active]:text-virtualis-gold">Quality Control</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:text-virtualis-gold">Lab Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="worklist" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white tech-font">Laboratory Worklist</CardTitle>
                  <CardDescription className="text-white/60">Priority-based test processing queue</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="Search lab orders..." 
                      className="glass-input pl-10 w-64"
                    />
                  </div>
                  <Button size="sm" className="glass-button">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-virtualis-gold tech-font">Lab ID</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Patient</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">MRN</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Order Date</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Test Type</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Specimen</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Priority</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Status</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">TAT</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Technologist</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTests.map((test) => (
                    <TableRow key={test.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white tech-font font-medium">{test.id}</TableCell>
                      <TableCell className="text-white">{test.patient}</TableCell>
                      <TableCell className="text-white font-mono text-sm">{test.mrn}</TableCell>
                      <TableCell className="text-white text-sm">{test.orderDate}</TableCell>
                      <TableCell className="text-white">{test.testType}</TableCell>
                      <TableCell className="text-white">
                        <span className="glass-badge primary">{test.specimen}</span>
                      </TableCell>
                      <TableCell className={getPriorityColor(test.priority)}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{test.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell className={getStatusColor(test.status)}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span>{test.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white text-sm">{test.expectedTAT}</TableCell>
                      <TableCell className="text-white">{test.technologist}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="glass-button text-xs">
                            Process
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

        <TabsContent value="results" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Results Review & Validation</CardTitle>
              <CardDescription className="text-white/60">Critical value management and result verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Microscope className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Results Management Center</h3>
                <p className="text-white/60 mb-4">Advanced result validation and critical value alerting</p>
                <Button className="glass-button">Review Critical Values</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Quality Control Management</CardTitle>
              <CardDescription className="text-white/60">QC monitoring and instrument calibration tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FlaskConical className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Quality Assurance Dashboard</h3>
                <p className="text-white/60 mb-4">Comprehensive QC monitoring and compliance tracking</p>
                <Button className="glass-button">View QC Status</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Laboratory Analytics</CardTitle>
              <CardDescription className="text-white/60">Performance metrics and utilization analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Beaker className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Lab Performance Dashboard</h3>
                <p className="text-white/60 mb-4">Turnaround times, utilization patterns, and efficiency metrics</p>
                <Button className="glass-button">View Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LISDashboard;
