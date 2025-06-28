
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Pause
} from "lucide-react";

const PACSManager = () => {
  const [selectedStudies, setSelectedStudies] = useState([]);

  const pacsMetrics = {
    totalStudies: 4582,
    pendingReads: 89,
    criticalFindings: 12,
    completedToday: 234,
    avgReadTime: "18.5 min",
    storageUsed: "847 TB"
  };

  const pendingStudies = [
    {
      id: "STU-2024-001",
      patient: "John Smith",
      mrn: "MRN123456",
      studyDate: "2024-01-15 14:30",
      modality: "CT",
      studyType: "CT Chest w/contrast",
      priority: "STAT",
      status: "Pending Read",
      radiologist: "Dr. Wilson",
      bodyPart: "Chest",
      images: 247
    },
    {
      id: "STU-2024-002",
      patient: "Mary Johnson",
      mrn: "MRN789012",
      studyDate: "2024-01-15 13:15",
      modality: "MRI",
      studyType: "MRI Brain w/o contrast",
      priority: "Routine",
      status: "In Progress",
      radiologist: "Dr. Chen",
      bodyPart: "Brain",
      images: 128
    },
    {
      id: "STU-2024-003",
      patient: "Robert Brown",
      mrn: "MRN345678",
      studyDate: "2024-01-15 12:45",
      modality: "XR",
      studyType: "Chest X-Ray 2 Views",
      priority: "ASAP",
      status: "Critical Finding",
      radiologist: "Dr. Singh",
      bodyPart: "Chest",
      images: 2
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "STAT": return "text-red-400";
      case "ASAP": return "text-orange-400";
      case "Routine": return "text-green-400";
      default: return "text-white/70";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical Finding": return "text-red-400";
      case "Pending Read": return "text-yellow-400";
      case "In Progress": return "text-blue-400";
      case "Completed": return "text-green-400";
      default: return "text-white/70";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Critical Finding": return <AlertTriangle className="h-4 w-4" />;
      case "Completed": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Play className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case "CT": return "bg-blue-500/20 text-blue-300 border border-blue-400/30";
      case "MRI": return "bg-purple-500/20 text-purple-300 border border-purple-400/30";
      case "XR": return "bg-green-500/20 text-green-300 border border-green-400/30";
      case "US": return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30";
      default: return "bg-gray-500/20 text-gray-300 border border-gray-400/30";
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">PACS & Radiology Workflow</h1>
            <p className="text-white/70">Picture Archiving and Communication System - Smart Radiology Platform</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Studies
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Monitor className="h-4 w-4 mr-2" />
              DICOM Viewer
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Total Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pacsMetrics.totalStudies}</div>
              <p className="text-xs text-blue-400">This month</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Reads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pacsMetrics.pendingReads}</div>
              <p className="text-xs text-yellow-400">Awaiting interpretation</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Critical Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pacsMetrics.criticalFindings}</div>
              <p className="text-xs text-red-400">Urgent review needed</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pacsMetrics.completedToday}</div>
              <p className="text-xs text-green-400">Daily throughput</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Avg Read Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pacsMetrics.avgReadTime}</div>
              <p className="text-xs text-green-400">Efficient workflow</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pacsMetrics.storageUsed}</div>
              <p className="text-xs text-blue-400">Archive capacity</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="worklist" className="space-y-4">
          <TabsList className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl">
            <TabsTrigger value="worklist" className="text-white data-[state=active]:bg-white/20">Radiology Worklist</TabsTrigger>
            <TabsTrigger value="viewer" className="text-white data-[state=active]:bg-white/20">DICOM Viewer</TabsTrigger>
            <TabsTrigger value="reporting" className="text-white data-[state=active]:bg-white/20">Reporting Suite</TabsTrigger>
            <TabsTrigger value="archive" className="text-white data-[state=active]:bg-white/20">Archive Management</TabsTrigger>
          </TabsList>

          <TabsContent value="worklist" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Radiology Worklist</CardTitle>
                    <CardDescription className="text-white/70">Priority-based imaging study interpretation queue</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <input 
                        type="text" 
                        placeholder="Search studies..." 
                        className="bg-white/10 border border-blue-400/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/60 w-64"
                      />
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
                      <TableHead className="text-white">Study ID</TableHead>
                      <TableHead className="text-white">Patient</TableHead>
                      <TableHead className="text-white">MRN</TableHead>
                      <TableHead className="text-white">Study Date</TableHead>
                      <TableHead className="text-white">Modality</TableHead>
                      <TableHead className="text-white">Study Type</TableHead>
                      <TableHead className="text-white">Body Part</TableHead>
                      <TableHead className="text-white">Images</TableHead>
                      <TableHead className="text-white">Priority</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Radiologist</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStudies.map((study) => (
                      <TableRow key={study.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{study.id}</TableCell>
                        <TableCell className="text-white">{study.patient}</TableCell>
                        <TableCell className="text-white font-mono text-sm">{study.mrn}</TableCell>
                        <TableCell className="text-white text-sm">{study.studyDate}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModalityColor(study.modality)}`}>
                            {study.modality}
                          </span>
                        </TableCell>
                        <TableCell className="text-white text-sm">{study.studyType}</TableCell>
                        <TableCell className="text-white">{study.bodyPart}</TableCell>
                        <TableCell className="text-white text-center font-mono">{study.images}</TableCell>
                        <TableCell className={getPriorityColor(study.priority)}>
                          <span className="font-semibold">{study.priority}</span>
                        </TableCell>
                        <TableCell className={getStatusColor(study.status)}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(study.status)}
                            <span className="text-sm">{study.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{study.radiologist}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 text-xs">
                              Report
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
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Advanced DICOM Viewer</CardTitle>
                <CardDescription className="text-white/70">Multi-planar reconstruction and advanced visualization tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Monitor className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Smart Radiology Viewer</h3>
                  <p className="text-white/70 mb-4">AI-enhanced imaging with advanced post-processing capabilities</p>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">Launch Viewer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reporting" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Radiology Reporting Suite</CardTitle>
                <CardDescription className="text-white/70">Structured reporting with voice recognition and templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileImage className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Intelligent Reporting Platform</h3>
                  <p className="text-white/70 mb-4">Voice-to-text, structured templates, and AI-assisted reporting</p>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">Open Report Builder</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archive" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Archive & Storage Management</CardTitle>
                <CardDescription className="text-white/70">DICOM storage, lifecycle management, and data migration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Enterprise Archive System</h3>
                  <p className="text-white/70 mb-4">Scalable storage with automated lifecycle policies and cloud integration</p>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">Manage Archive</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PACSManager;
