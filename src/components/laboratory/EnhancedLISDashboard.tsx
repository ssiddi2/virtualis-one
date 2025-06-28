import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Activity,
  Wifi,
  Monitor,
  Database,
  Settings,
  Bot,
  Zap,
  Shield,
  Server,
  Thermometer,
  BarChart3,
  Timer,
  Eye,
  Play
} from "lucide-react";

const EnhancedLISDashboard = () => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [autoAnalysisEnabled, setAutoAnalysisEnabled] = useState(true);

  const labMetrics = {
    totalTests: 2847,
    pendingResults: 127,
    criticalValues: 8,
    completedToday: 891,
    avgTurnaroundTime: "2.4 hrs",
    qualityScore: "98.7%",
    connectedDevices: 24,
    automatedTests: "85%",
    qcCompliance: "99.2%"
  };

  const connectedDevices = [
    { 
      name: "Abbott Architect c4000", 
      type: "Chemistry Analyzer", 
      status: "Online", 
      throughput: "400 tests/hr",
      currentLoad: 87,
      lastMaintenance: "2024-01-10",
      tests: ["CMP", "Lipid Panel", "Liver Panel", "Cardiac Markers"]
    },
    { 
      name: "Sysmex XN-1000", 
      type: "Hematology Analyzer", 
      status: "Online", 
      throughput: "100 samples/hr",
      currentLoad: 65,
      lastMaintenance: "2024-01-12",
      tests: ["CBC", "CBC w/Diff", "Reticulocyte Count", "ESR"]
    },
    { 
      name: "BD Phoenix M50", 
      type: "Microbiology System", 
      status: "Running", 
      throughput: "50 panels/hr",
      currentLoad: 42,
      lastMaintenance: "2024-01-08",
      tests: ["Blood Culture", "Urine Culture", "Sensitivity Testing", "MRSA Screen"]
    },
    { 
      name: "Roche cobas 6000", 
      type: "Immunoassay System", 
      status: "Online", 
      throughput: "170 tests/hr",
      currentLoad: 78,
      lastMaintenance: "2024-01-14",
      tests: ["TSH", "Troponin", "PSA", "HbA1c", "Vitamin D"]
    },
    { 
      name: "Beckman AU680", 
      type: "Chemistry Analyzer", 
      status: "Maintenance", 
      throughput: "800 tests/hr",
      currentLoad: 0,
      lastMaintenance: "2024-01-15",
      tests: ["Glucose", "Creatinine", "BUN", "Electrolytes"]
    },
    { 
      name: "Siemens Atellica", 
      type: "Integrated System", 
      status: "Online", 
      throughput: "440 tests/hr",
      currentLoad: 92,
      lastMaintenance: "2024-01-11",
      tests: ["Chemistry Panel", "Immunoassay", "Coagulation"]
    }
  ];

  const pendingTests = [
    { 
      id: "LAB-2024-001", 
      patient: "John Smith", 
      mrn: "MRN123456",
      orderDate: "2024-01-15 08:30", 
      testType: "Complete Blood Count w/Differential",
      specimen: "Whole Blood", 
      priority: "STAT", 
      status: "Analyzing",
      expectedTAT: "45 min",
      technologist: "Sarah Lab",
      device: "Sysmex XN-1000",
      sampleId: "202401150830001",
      qcStatus: "Passed",
      autoVerification: true,
      criticalValues: null
    },
    { 
      id: "LAB-2024-002", 
      patient: "Mary Johnson", 
      mrn: "MRN789012",
      orderDate: "2024-01-15 07:45", 
      testType: "Comprehensive Metabolic Panel",
      specimen: "Serum", 
      priority: "Routine", 
      status: "Pending Review",
      expectedTAT: "2 hrs",
      technologist: "Mike Chen",
      device: "Abbott Architect c4000",
      sampleId: "202401150745002",
      qcStatus: "Passed",
      autoVerification: false,
      criticalValues: "Glucose: 180 mg/dL"
    },
    { 
      id: "LAB-2024-003", 
      patient: "Robert Brown", 
      mrn: "MRN345678",
      orderDate: "2024-01-15 06:15", 
      testType: "Lipid Panel",
      specimen: "Plasma", 
      priority: "ASAP", 
      status: "Critical Value Alert",
      expectedTAT: "1.5 hrs",
      technologist: "Lisa Wong",
      device: "Abbott Architect c4000",
      sampleId: "202401150615003",
      qcStatus: "Passed",
      autoVerification: false,
      criticalValues: "Total Cholesterol: 320 mg/dL"
    },
    { 
      id: "LAB-2024-004", 
      patient: "Jennifer Davis", 
      mrn: "MRN901234",
      orderDate: "2024-01-15 09:00", 
      testType: "Thyroid Function Panel",
      specimen: "Serum", 
      priority: "Routine", 
      status: "Device Processing",
      expectedTAT: "3 hrs",
      technologist: "David Kim",
      device: "Roche cobas 6000",
      sampleId: "202401150900004",
      qcStatus: "In Progress",
      autoVerification: true,
      criticalValues: null
    },
    { 
      id: "LAB-2024-005", 
      patient: "Michael Wilson", 
      mrn: "MRN567890",
      orderDate: "2024-01-15 05:30", 
      testType: "Blood Culture",
      specimen: "Blood", 
      priority: "STAT", 
      status: "Incubating",
      expectedTAT: "24-48 hrs",
      technologist: "Emma Rodriguez",
      device: "BD Phoenix M50",
      sampleId: "202401150530005",
      qcStatus: "Monitoring",
      autoVerification: false,
      criticalValues: null
    }
  ];

  const qcResults = [
    { device: "Abbott Architect c4000", test: "Glucose QC", level: "Level 1", result: "98.2", target: "100.0", status: "Pass" },
    { device: "Abbott Architect c4000", test: "Glucose QC", level: "Level 2", result: "295.8", target: "300.0", status: "Pass" },
    { device: "Sysmex XN-1000", test: "WBC QC", level: "Normal", result: "6.8", target: "7.0", status: "Pass" },
    { device: "Sysmex XN-1000", test: "Hemoglobin QC", level: "Low", result: "8.9", target: "9.0", status: "Warning" },
    { device: "Roche cobas 6000", test: "TSH QC", level: "Level 1", result: "2.15", target: "2.20", status: "Pass" },
    { device: "BD Phoenix M50", test: "E.coli Control", level: "Positive", result: "Growth", target: "Growth", status: "Pass" }
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
      case "Critical Value Alert": return "text-red-400";
      case "Pending Review": return "text-yellow-400";
      case "Analyzing": return "text-blue-400";
      case "Device Processing": return "text-purple-400";
      case "Incubating": return "text-orange-400";
      case "Completed": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Critical Value Alert": return <AlertTriangle className="h-4 w-4" />;
      case "Completed": return <CheckCircle className="h-4 w-4" />;
      case "Analyzing": return <Activity className="h-4 w-4" />;
      case "Device Processing": return <Bot className="h-4 w-4" />;
      case "Incubating": return <Thermometer className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "bg-green-500/20 text-green-300";
      case "Running": return "bg-blue-500/20 text-blue-300";
      case "Maintenance": return "bg-yellow-500/20 text-yellow-300";
      case "Offline": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getQCStatusColor = (status: string) => {
    switch (status) {
      case "Pass": return "text-green-400";
      case "Warning": return "text-yellow-400";
      case "Fail": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white brand-font gradient-text flex items-center gap-3">
            <Microscope className="h-8 w-8 text-blue-400" />
            Enhanced Laboratory Information System
          </h1>
          <p className="text-white/60 tech-font">AI-Powered Lab Management with Device Integration & Smart Analytics</p>
        </div>
        <div className="flex gap-3">
          <Button className="glass-button">
            <Download className="h-4 w-4" />
            Export Results
          </Button>
          <Button className="glass-button">
            <Bot className="h-4 w-4" />
            Auto QC
          </Button>
          <Button className="glass-button">
            <TestTube className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-sm font-medium tech-font flex items-center gap-2">
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
            <CardTitle className="text-blue-400 text-sm font-medium tech-font flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Connected Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.connectedDevices}</div>
            <p className="text-xs text-green-400">Real-time integration</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-sm font-medium tech-font flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Automated Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.automatedTests}</div>
            <p className="text-xs text-blue-400">AI-powered workflow</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-sm font-medium tech-font flex items-center gap-2">
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
            <CardTitle className="text-blue-400 text-sm font-medium tech-font">Avg Turnaround</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.avgTurnaroundTime}</div>
            <p className="text-xs text-green-400">Below target</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-sm font-medium tech-font flex items-center gap-2">
              <Shield className="h-4 w-4" />
              QC Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{labMetrics.qcCompliance}</div>
            <p className="text-xs text-green-400">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="worklist" className="space-y-4">
        <TabsList className="glass-nav-item bg-black/20">
          <TabsTrigger value="worklist" className="text-white data-[state=active]:text-blue-400">Smart Worklist</TabsTrigger>
          <TabsTrigger value="devices" className="text-white data-[state=active]:text-blue-400">Device Management</TabsTrigger>
          <TabsTrigger value="results" className="text-white data-[state=active]:text-blue-400">Results Review</TabsTrigger>
          <TabsTrigger value="quality" className="text-white data-[state=active]:text-blue-400">Quality Control</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:text-blue-400">Lab Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="worklist" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white tech-font">AI-Enhanced Laboratory Worklist</CardTitle>
                  <CardDescription className="text-white/60">Real-time device integration with automated processing</CardDescription>
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
                    Smart Filter
                  </Button>
                  <Button size="sm" className="glass-button">
                    <Bot className="h-4 w-4" />
                    Auto Route
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-blue-400 tech-font">Lab ID</TableHead>
                    <TableHead className="text-blue-400 tech-font">Patient</TableHead>
                    <TableHead className="text-blue-400 tech-font">Test Type</TableHead>
                    <TableHead className="text-blue-400 tech-font">Specimen</TableHead>
                    <TableHead className="text-blue-400 tech-font">Priority</TableHead>
                    <TableHead className="text-blue-400 tech-font">Status</TableHead>
                    <TableHead className="text-blue-400 tech-font">Device</TableHead>
                    <TableHead className="text-blue-400 tech-font">TAT</TableHead>
                    <TableHead className="text-blue-400 tech-font">Critical Values</TableHead>
                    <TableHead className="text-blue-400 tech-font">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTests.map((test) => (
                    <TableRow key={test.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white tech-font font-medium">{test.id}</TableCell>
                      <TableCell className="text-white">{test.patient}</TableCell>
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
                      <TableCell className="text-white text-sm">{test.device}</TableCell>
                      <TableCell className="text-white text-sm">{test.expectedTAT}</TableCell>
                      <TableCell className="text-white text-sm">
                        {test.criticalValues ? (
                          <span className="text-red-400 font-medium">{test.criticalValues}</span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="glass-button text-xs">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" className="glass-button text-xs">
                            <Play className="h-3 w-3" />
                            Process
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

        <TabsContent value="devices" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Connected Laboratory Devices
              </CardTitle>
              <CardDescription className="text-white/60">Real-time monitoring and management of lab analyzers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {connectedDevices.map((device, index) => (
                  <Card key={index} className="glass-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-sm">{device.name}</CardTitle>
                        <Badge className={getDeviceStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-white/60">{device.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Throughput:</span>
                        <span className="text-white text-sm">{device.throughput}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">Current Load:</span>
                          <span className="text-white text-sm">{device.currentLoad}%</span>
                        </div>
                        <Progress value={device.currentLoad} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Last Maintenance:</span>
                        <span className="text-white text-sm">{device.lastMaintenance}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {device.tests.slice(0, 3).map((test, testIndex) => (
                          <Badge key={testIndex} variant="outline" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                        {device.tests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{device.tests.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="glass-button text-xs flex-1">
                          <Settings className="h-3 w-3" />
                          Configure
                        </Button>
                        <Button size="sm" className="glass-button text-xs flex-1">
                          <Activity className="h-3 w-3" />
                          Monitor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Results Review & Validation</CardTitle>
              <CardDescription className="text-white/60">AI-assisted result verification and critical value management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Microscope className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Smart Results Management</h3>
                <p className="text-white/60 mb-4">AI-powered result validation with automated critical value detection</p>
                <Button className="glass-button">Review Critical Values</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Real-Time Quality Control
              </CardTitle>
              <CardDescription className="text-white/60">Automated QC monitoring with device integration</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-blue-400 tech-font">Device</TableHead>
                    <TableHead className="text-blue-400 tech-font">Test</TableHead>
                    <TableHead className="text-blue-400 tech-font">Level</TableHead>
                    <TableHead className="text-blue-400 tech-font">Result</TableHead>
                    <TableHead className="text-blue-400 tech-font">Target</TableHead>
                    <TableHead className="text-blue-400 tech-font">Status</TableHead>
                    <TableHead className="text-blue-400 tech-font">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qcResults.map((qc, index) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">{qc.device}</TableCell>
                      <TableCell className="text-white">{qc.test}</TableCell>
                      <TableCell className="text-white">{qc.level}</TableCell>
                      <TableCell className="text-white font-mono">{qc.result}</TableCell>
                      <TableCell className="text-white font-mono">{qc.target}</TableCell>
                      <TableCell className={getQCStatusColor(qc.status)}>
                        <Badge className={qc.status === 'Pass' ? 'bg-green-500/20 text-green-300' : 
                                       qc.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-300' : 
                                       'bg-red-500/20 text-red-300'}>
                          {qc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" className="glass-button text-xs">
                          <BarChart3 className="h-3 w-3" />
                          Trend
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Laboratory Analytics Dashboard</CardTitle>
              <CardDescription className="text-white/60">Performance metrics and predictive analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Beaker className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Lab Analytics</h3>
                <p className="text-white/60 mb-4">Device performance, turnaround optimization, and predictive maintenance</p>
                <Button className="glass-button">Launch Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedLISDashboard;
