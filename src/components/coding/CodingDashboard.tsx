
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileSearch, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Search,
  Filter,
  Download,
  Zap
} from "lucide-react";

const CodingDashboard = () => {
  const [selectedEncounters, setSelectedEncounters] = useState([]);

  const codingMetrics = {
    totalEncounters: 1847,
    pendingCoding: 234,
    completedToday: 87,
    cdiOpportunities: 45,
    codingAccuracy: "97.8%",
    avgCodingTime: "8.2 min"
  };

  const pendingEncounters = [
    { 
      id: "ENC-2024-001", 
      patient: "John Smith", 
      admitDate: "2024-01-15", 
      discharge: "2024-01-17",
      service: "Internal Medicine", 
      priority: "High", 
      coder: "Unassigned",
      complexity: "High",
      msdrg: "TBD"
    },
    { 
      id: "ENC-2024-002", 
      patient: "Mary Johnson", 
      admitDate: "2024-01-14", 
      discharge: "2024-01-16",
      service: "Cardiology", 
      priority: "Medium", 
      coder: "Sarah Wilson",
      complexity: "Medium",
      msdrg: "247"
    },
    { 
      id: "ENC-2024-003", 
      patient: "Robert Brown", 
      admitDate: "2024-01-13", 
      discharge: "2024-01-18",
      service: "Surgery", 
      priority: "High", 
      coder: "Mike Chen",
      complexity: "High",
      msdrg: "469"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-400";
      case "Medium": return "text-yellow-400";
      case "Low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case "High": return "glass-badge error";
      case "Medium": return "glass-badge warning";
      case "Low": return "glass-badge success";
      default: return "glass-badge";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white brand-font gradient-text">3M Coding & CDI Platform</h1>
          <p className="text-white/60 tech-font">AI-powered clinical documentation improvement and coding</p>
        </div>
        <div className="flex gap-3">
          <Button className="glass-button">
            <Download className="h-4 w-4" />
            Export Coding Report
          </Button>
          <Button className="glass-button">
            <Zap className="h-4 w-4" />
            Run 3M Encoder
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Total Encounters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.totalEncounters}</div>
            <p className="text-xs text-blue-400">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Coding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.pendingCoding}</div>
            <p className="text-xs text-yellow-400">Requires attention</p>
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
            <div className="text-2xl font-bold text-white">{codingMetrics.completedToday}</div>
            <p className="text-xs text-green-400">On track</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font flex items-center gap-2">
              <Brain className="h-4 w-4" />
              CDI Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.cdiOpportunities}</div>
            <p className="text-xs text-blue-400">Revenue potential</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font">Coding Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.codingAccuracy}</div>
            <p className="text-xs text-green-400">Above benchmark</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-virtualis-gold text-sm font-medium tech-font">Avg Coding Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.avgCodingTime}</div>
            <p className="text-xs text-green-400">Efficient workflow</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="worklist" className="space-y-4">
        <TabsList className="glass-nav-item bg-black/20">
          <TabsTrigger value="worklist" className="text-white data-[state=active]:text-virtualis-gold">Coding Worklist</TabsTrigger>
          <TabsTrigger value="cdi" className="text-white data-[state=active]:text-virtualis-gold">CDI Review</TabsTrigger>
          <TabsTrigger value="encoder" className="text-white data-[state=active]:text-virtualis-gold">3M Encoder</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:text-virtualis-gold">Coding Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="worklist" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white tech-font">Coding Worklist</CardTitle>
                  <CardDescription className="text-white/60">Priority-based encounter coding queue</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="Search encounters..." 
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
                    <TableHead className="text-virtualis-gold tech-font">Encounter ID</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Patient</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Admit Date</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Discharge</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Service</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Priority</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Complexity</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">MS-DRG</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Coder</TableHead>
                    <TableHead className="text-virtualis-gold tech-font">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingEncounters.map((encounter) => (
                    <TableRow key={encounter.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white tech-font font-medium">{encounter.id}</TableCell>
                      <TableCell className="text-white">{encounter.patient}</TableCell>
                      <TableCell className="text-white">{encounter.admitDate}</TableCell>
                      <TableCell className="text-white">{encounter.discharge}</TableCell>
                      <TableCell className="text-white">{encounter.service}</TableCell>
                      <TableCell className={getPriorityColor(encounter.priority)}>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{encounter.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getComplexityBadge(encounter.complexity)}>{encounter.complexity}</span>
                      </TableCell>
                      <TableCell className="text-white font-mono">{encounter.msdrg}</TableCell>
                      <TableCell className="text-white">{encounter.coder}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="glass-button text-xs">
                            Code
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 text-xs">
                            Review
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

        <TabsContent value="cdi" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Clinical Documentation Improvement</CardTitle>
              <CardDescription className="text-white/60">AI-powered CDI opportunities and physician queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">CDI Analytics Engine</h3>
                <p className="text-white/60 mb-4">Automated clinical documentation analysis and improvement recommendations</p>
                <Button className="glass-button">Review CDI Opportunities</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encoder" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">3M™ Encoder Integration</CardTitle>
              <CardDescription className="text-white/60">Advanced medical coding with 3M encoding technology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">3M Encoder Pro</h3>
                <p className="text-white/60 mb-4">Professional coding software with advanced validation</p>
                <Button className="glass-button">Launch Encoder</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Coding Performance Analytics</CardTitle>
              <CardDescription className="text-white/60">Comprehensive coding metrics and benchmarking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileSearch className="h-12 w-12 text-virtualis-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics Dashboard</h3>
                <p className="text-white/60 mb-4">Coding productivity, accuracy, and financial impact metrics</p>
                <Button className="glass-button">View Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodingDashboard;
