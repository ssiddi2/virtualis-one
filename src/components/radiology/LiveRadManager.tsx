
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  FileImage, 
  Eye, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Zap,
  Image as ImageIcon,
  Play,
  Pause,
  Brain,
  Wifi,
  Database,
  Settings,
  Bot,
  Activity,
  TrendingUp,
  Shield,
  Server,
  CloudUpload,
  Mic,
  Volume2,
  Camera,
  Target,
  Layers
} from "lucide-react";

const LiveRadManager = () => {
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [autoWorkflowEnabled, setAutoWorkflowEnabled] = useState(true);

  const liveRadMetrics = {
    totalStudies: 4582,
    pendingReads: 89,
    criticalFindings: 12,
    completedToday: 234,
    avgReadTime: "12.3 min",
    storageUsed: "847 TB",
    aiAccuracy: "97.8%",
    connectedPACS: 8,
    activeWorkstations: 24,
    dicomNodes: 15
  };

  const aiInsights = [
    { type: "Critical", message: "Potential pulmonary embolism detected - STU-2024-001", confidence: 94, time: "2 min ago" },
    { type: "Suggestion", message: "Consider CT angiography for STU-2024-003", confidence: 87, time: "5 min ago" },
    { type: "Quality", message: "Motion artifact detected in MRI sequence", confidence: 92, time: "8 min ago" },
    { type: "Efficiency", message: "Workflow optimization available for chest CTs", confidence: 89, time: "12 min ago" }
  ];

  const connectedSystems = [
    { name: "Philips IntelliSpace PACS", status: "Connected", version: "4.4.5", studies: 1247 },
    { name: "GE Centricity PACS", status: "Connected", version: "5.0.2", studies: 892 },
    { name: "Siemens syngo.via", status: "Connected", version: "6.1", studies: 1156 },
    { name: "Canon Vitrea", status: "Syncing", version: "7.2", studies: 431 },
    { name: "Hologic PACS", status: "Connected", version: "3.8", studies: 287 },
    { name: "Carestream Vue PACS", status: "Connected", version: "12.2", studies: 569 }
  ];

  const pendingStudies = [
    {
      id: "STU-2024-001",
      patient: "John Smith",
      mrn: "MRN123456",
      studyDate: "2024-01-15 14:30",
      modality: "CT",
      studyType: "CT Chest w/contrast",
      priority: "STAT",
      status: "AI Analysis Complete",
      radiologist: "Dr. Wilson",
      bodyPart: "Chest",
      images: 247,
      aiFindings: "Suspicious nodule detected (94% confidence)",
      dicomSource: "Philips IntelliSpace",
      qcScore: 98,
      reconstructions: ["Axial", "Coronal", "Sagittal", "3D"]
    },
    {
      id: "STU-2024-002",
      patient: "Mary Johnson",
      mrn: "MRN789012",
      studyDate: "2024-01-15 13:15",
      modality: "MRI",
      studyType: "MRI Brain w/o contrast",
      priority: "Routine",
      status: "Smart Preprocessing",
      radiologist: "Dr. Chen",
      bodyPart: "Brain",
      images: 128,
      aiFindings: "Normal variant - no acute findings",
      dicomSource: "GE Centricity",
      qcScore: 96,
      reconstructions: ["T1", "T2", "FLAIR", "DWI"]
    },
    {
      id: "STU-2024-003",
      patient: "Robert Brown",
      mrn: "MRN345678",
      studyDate: "2024-01-15 12:45",
      modality: "XR",
      studyType: "Chest X-Ray 2 Views",
      priority: "ASAP",
      status: "Critical Finding Alert",
      radiologist: "Dr. Singh",
      bodyPart: "Chest",
      images: 2,
      aiFindings: "Possible pneumothorax - immediate review needed",
      dicomSource: "Siemens syngo.via",
      qcScore: 94,
      reconstructions: ["PA", "Lateral"]
    },
    {
      id: "STU-2024-004",
      patient: "Lisa Davis",
      mrn: "MRN456789",
      studyDate: "2024-01-15 11:20",
      modality: "US",
      studyType: "Abdominal Ultrasound",
      priority: "Routine",
      status: "Voice Recognition Active",
      radiologist: "Dr. Martinez",
      bodyPart: "Abdomen",
      images: 45,
      aiFindings: "Gallbladder wall thickening noted",
      dicomSource: "Canon Vitrea",
      qcScore: 91,
      reconstructions: ["Real-time", "Doppler"]
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
      case "Critical Finding Alert": return "text-red-400";
      case "AI Analysis Complete": return "text-green-400";
      case "Smart Preprocessing": return "text-blue-400";
      case "Voice Recognition Active": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Critical Finding Alert": return <AlertTriangle className="h-4 w-4" />;
      case "AI Analysis Complete": return <Brain className="h-4 w-4" />;
      case "Smart Preprocessing": return <Bot className="h-4 w-4" />;
      case "Voice Recognition Active": return <Mic className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case "CT": return "bg-blue-500/20 text-blue-300";
      case "MRI": return "bg-purple-500/20 text-purple-300";
      case "XR": return "bg-green-500/20 text-green-300";
      case "US": return "bg-yellow-500/20 text-yellow-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case "Connected": return "bg-green-500/20 text-green-300";
      case "Syncing": return "bg-yellow-500/20 text-yellow-300";
      case "Offline": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getAiInsightColor = (type: string) => {
    switch (type) {
      case "Critical": return "border-red-500/50 bg-red-500/10";
      case "Suggestion": return "border-blue-500/50 bg-blue-500/10";
      case "Quality": return "border-yellow-500/50 bg-yellow-500/10";
      case "Efficiency": return "border-green-500/50 bg-green-500/10";
      default: return "border-gray-500/50 bg-gray-500/10";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white brand-font gradient-text flex items-center gap-3">
            <Brain className="h-8 w-8 text-virtualis-gold" />
            LiveRad AI Platform
          </h1>
          <p className="text-white/60 tech-font">Next-Generation Radiology with Artificial Intelligence & Smart Workflows</p>
        </div>
        <div className="flex gap-3">
          <Button className="glass-button">
            <CloudUpload className="h-4 w-4" />
            DICOM Upload
          </Button>
          <Button className="glass-button">
            <Monitor className="h-4 w-4" />
            Launch Viewer
          </Button>
          <Button className="glass-button">
            <Bot className="h-4 w-4" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Total Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveRadMetrics.totalStudies}</div>
            <p className="text-xs text-blue-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveRadMetrics.aiAccuracy}</div>
            <p className="text-xs text-green-400">Diagnostic confidence</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <Server className="h-4 w-4" />
              Connected PACS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveRadMetrics.connectedPACS}</div>
            <p className="text-xs text-green-400">Multi-vendor integration</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Active Workstations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveRadMetrics.activeWorkstations}</div>
            <p className="text-xs text-blue-400">Live connections</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font">Avg Read Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveRadMetrics.avgReadTime}</div>
            <p className="text-xs text-green-400">AI-accelerated</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white tech-font flex items-center gap-2">
            <Bot className="h-5 w-5 text-virtualis-gold" />
            Live AI Insights & Alerts
          </CardTitle>
          <CardDescription className="text-white/60">Real-time AI analysis and clinical decision support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getAiInsightColor(insight.type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={`${insight.type === 'Critical' ? 'border-red-400 text-red-400' : 'border-blue-400 text-blue-400'}`}>
                    {insight.type}
                  </Badge>
                  <span className="text-xs text-white/60">{insight.time}</span>
                </div>
                <p className="text-white text-sm mb-2">{insight.message}</p>
                <div className="flex items-center gap-2">
                  <Progress value={insight.confidence} className="flex-1 h-2" />
                  <span className="text-xs text-white/60">{insight.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="worklist" className="space-y-4">
        <TabsList className="glass-nav-item bg-black/20">
          <TabsTrigger value="worklist" className="text-white data-[state=active]:text-virtualis-gold">Smart Worklist</TabsTrigger>
          <TabsTrigger value="viewer" className="text-white data-[state=active]:text-virtualis-gold">AI Viewer</TabsTrigger>
          <TabsTrigger value="integration" className="text-white data-[state=active]:text-virtualis-gold">PACS Integration</TabsTrigger>
          <TabsTrigger value="dicom" className="text-white data-[state=active]:text-virtualis-gold">DICOM Manager</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:text-virtualis-gold">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="worklist" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white tech-font">AI-Powered Radiology Worklist</CardTitle>
                  <CardDescription className="text-white/60">Intelligent prioritization with automated pre-analysis</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="Search studies..." 
                      className="glass-input pl-10 w-64"
                    />
                  </div>
                  <Button size="sm" className="glass-button">
                    <Filter className="h-4 w-4" />
                    AI Filter
                  </Button>
                  <Button size="sm" className="glass-button">
                    <Bot className="h-4 w-4" />
                    Auto-Route
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-virtualis-gold tech-font">Study ID</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Patient</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Modality</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Study Type</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Priority</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Status</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">AI Findings</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">DICOM Source</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">QC Score</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingStudies.map((study) => (
                    <TableRow key={study.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white tech-font font-medium">{study.id}</TableCell>
                      <TableCell className="text-white">{study.patient}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModalityColor(study.modality)}`}>
                          {study.modality}
                        </span>
                      </TableCell>
                      <TableCell className="text-white text-sm">{study.studyType}</TableCell>
                      <TableCell className={getPriorityColor(study.priority)}>
                        <span className="font-semibold">{study.priority}</span>
                      </TableCell>
                      <TableCell className={getStatusColor(study.status)}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(study.status)}
                          <span className="text-sm">{study.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white text-sm max-w-48 truncate" title={study.aiFindings}>
                        {study.aiFindings}
                      </TableCell>
                      <TableCell className="text-white text-sm">{study.dicomSource}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={study.qcScore} className="w-12 h-2" />
                          <span className="text-xs text-white">{study.qcScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="glass-button text-xs">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" className="glass-button text-xs">
                            <Mic className="h-3 w-3" />
                            Dictate
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

        <TabsContent value="viewer" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                LiveRad AI Viewer
              </CardTitle>
              <CardDescription className="text-white/60">Advanced DICOM viewer with AI-powered analysis tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-black/40 border border-white/10 rounded-lg p-6 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="h-16 w-16 text-virtualis-gold mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">DICOM Viewer Canvas</h3>
                      <p className="text-white/60 mb-4">Multi-planar reconstruction with AI overlay</p>
                      <div className="flex gap-2 justify-center">
                        <Button className="glass-button">
                          <Layers className="h-4 w-4" />
                          MPR
                        </Button>
                        <Button className="glass-button">
                          <Target className="h-4 w-4" />
                          Measure
                        </Button>
                        <Button className="glass-button">
                          <Brain className="h-4 w-4" />
                          AI Analyze
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm">AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-white text-sm">Suspicious nodule (R upper lobe)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-white text-sm">Ground glass opacity noted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white text-sm">No pleural effusion</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm">Voice Recognition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-3">
                        <Mic className="h-4 w-4 text-red-400" />
                        <span className="text-white text-sm">Recording...</span>
                      </div>
                      <Button size="sm" className="glass-button w-full">
                        <Volume2 className="h-4 w-4" />
                        Start Dictation
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Server className="h-5 w-5" />
                Third-Party PACS Integration
              </CardTitle>
              <CardDescription className="text-white/60">Multi-vendor PACS connectivity and data synchronization</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-virtualis-gold tech-font">PACS System</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Status</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Version</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Studies</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Last Sync</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectedSystems.map((system, index) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">{system.name}</TableCell>
                      <TableCell>
                        <Badge className={getSystemStatusColor(system.status)}>
                          {system.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{system.version}</TableCell>
                      <TableCell className="text-white">{system.studies}</TableCell>
                      <TableCell className="text-white text-sm">2 min ago</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="glass-button text-xs">
                            <Settings className="h-3 w-3" />
                            Config
                          </Button>
                          <Button size="sm" className="glass-button text-xs">
                            <Activity className="h-3 w-3" />
                            Monitor
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

        <TabsContent value="dicom" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Database className="h-5 w-5" />
                DICOM Management Center
              </CardTitle>
              <CardDescription className="text-white/60">Advanced DICOM processing, routing, and compliance tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">DICOM Nodes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">{liveRadMetrics.dicomNodes}</div>
                    <p className="text-xs text-green-400">Active connections</p>
                    <Button size="sm" className="glass-button w-full mt-3">
                      <Wifi className="h-4 w-4" />
                      Node Status
                    </Button>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">{liveRadMetrics.storageUsed}</div>
                    <Progress value={73} className="mb-2" />
                    <p className="text-xs text-blue-400">73% utilized</p>
                    <Button size="sm" className="glass-button w-full mt-3">
                      <CloudUpload className="h-4 w-4" />
                      Manage Storage
                    </Button>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">100%</div>
                    <p className="text-xs text-green-400">DICOM conformance</p>
                    <Button size="sm" className="glass-button w-full mt-3">
                      <Shield className="h-4 w-4" />
                      Audit Trail
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                LiveRad Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-white/60">Performance metrics and AI insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics Suite</h3>
                <p className="text-white/60 mb-4">AI performance tracking, workflow optimization, and predictive analytics</p>
                <Button className="glass-button">Launch Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveRadManager;
