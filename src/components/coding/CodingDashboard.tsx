
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePatients } from "@/hooks/usePatients";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useNavigate } from "react-router-dom";
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
  Zap,
  Code,
  Stethoscope
} from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { toast } from "sonner";

interface CodingDashboardProps {
  hospitalId?: string | null;
}

const CodingDashboard = ({ hospitalId }: CodingDashboardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: patients } = usePatients(hospitalId || undefined);
  const { callAI, isLoading } = useAIAssistant();
  const [selectedEncounters, setSelectedEncounters] = useState([]);

  // Generate hospital-specific coding encounters
  const generateCodingEncounters = () => {
    if (!patients || !hospitalId) return [];
    
    const codingScenarios = {
      '11111111-1111-1111-1111-111111111111': {
        name: 'Metropolitan General Hospital',
        services: ['Internal Medicine', 'Cardiology', 'Emergency Medicine', 'Surgery'],
        complexityDistribution: ['High', 'Medium', 'Medium', 'Low'],
        msdrgs: ['247', '292', '469', '871']
      },
      '22222222-2222-2222-2222-222222222222': {
        name: 'Riverside Medical Center',
        services: ['Emergency Medicine', 'Trauma Surgery', 'ICU', 'Orthopedics'],
        complexityDistribution: ['High', 'High', 'Medium', 'Medium'],
        msdrgs: ['469', '853', '247', '491']
      },
      '33333333-3333-3333-3333-333333333333': {
        name: 'Sunset Community Hospital',
        services: ['Family Medicine', 'Pediatrics', 'Obstetrics', 'General Surgery'],
        complexityDistribution: ['Low', 'Low', 'Medium', 'Medium'],
        msdrgs: ['871', '794', '765', '392']
      },
      '44444444-4444-4444-4444-444444444444': {
        name: 'Bay Area Medical Complex',
        services: ['Neurosurgery', 'Cardiac Surgery', 'Oncology', 'Transplant'],
        complexityDistribution: ['High', 'High', 'High', 'Medium'],
        msdrgs: ['023', '216', '469', '853']
      },
      '55555555-5555-5555-5555-555555555555': {
        name: 'Texas Heart Institute',
        services: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology', 'Heart Transplant'],
        complexityDistribution: ['High', 'High', 'Medium', 'High'],
        msdrgs: ['216', '247', '266', '001']
      }
    };

    const scenario = codingScenarios[hospitalId as keyof typeof codingScenarios];
    if (!scenario) return [];

    const priorities = ['High', 'Medium', 'Low'];
    const coders = ['Sarah Wilson', 'Mike Chen', 'Lisa Rodriguez', 'Unassigned'];
    
    return patients.map((patient, index) => ({
      id: `ENC-${hospitalId.slice(0, 8)}-${String(index + 1).padStart(3, '0')}`,
      patient: `${patient.first_name} ${patient.last_name}`,
      patientId: patient.id,
      admitDate: new Date(patient.admission_date || new Date()).toISOString().split('T')[0],
      discharge: patient.discharge_date ? new Date(patient.discharge_date).toISOString().split('T')[0] : 'Ongoing',
      service: scenario.services[index % scenario.services.length],
      priority: priorities[index % priorities.length],
      coder: coders[index % coders.length],
      complexity: scenario.complexityDistribution[index % scenario.complexityDistribution.length],
      msdrg: scenario.msdrgs[index % scenario.msdrgs.length],
      hospital: scenario.name,
      mrn: patient.mrn,
      status: index === 0 ? 'In Progress' : index === 1 ? 'Completed' : 'Pending'
    }));
  };

  const codingEncounters = generateCodingEncounters();

  const codingMetrics = {
    totalEncounters: codingEncounters.length,
    pendingCoding: codingEncounters.filter(e => e.status === 'Pending').length,
    completedToday: codingEncounters.filter(e => e.status === 'Completed').length,
    cdiOpportunities: Math.floor(codingEncounters.length * 0.3),
    codingAccuracy: "97.8%",
    avgCodingTime: "8.2 min"
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-400";
      case "In Progress": return "text-blue-400";
      case "Pending": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const handleAIMedicalCoding = async (encounter: any) => {
    try {
      const encounterData = `
        Encounter: ${encounter.id}
        Patient: ${encounter.patient} (MRN: ${encounter.mrn})
        Service: ${encounter.service}
        Admission: ${encounter.admitDate}
        Discharge: ${encounter.discharge}
        Complexity: ${encounter.complexity}
        Current MS-DRG: ${encounter.msdrg}
        Hospital: ${encounter.hospital}
      `;

      const result = await callAI({
        type: 'medical_coding',
        data: {
          procedure: encounter.service,
          diagnosis: `${encounter.service} encounter`,
          context: encounterData
        },
        context: `Medical coding analysis for ${encounter.patient} at ${encounter.hospital}`
      });

      toast.success(`AI coding analysis completed for ${encounter.patient}`);
      console.log('AI Medical Coding Result:', result);
    } catch (error) {
      toast.error('Failed to complete AI coding analysis');
      console.error('AI coding error:', error);
    }
  };

  if (!hospitalId) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white max-w-md rounded-xl shadow-lg">
          <CardContent className="p-8 text-center">
            <Code className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hospital Selected</h3>
            <p className="text-white/70 mb-4">
              Please select a hospital from the EMR Dashboard to view coding data.
            </p>
            <Button onClick={() => navigate('/emr')} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
              Go to EMR Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentHospital = codingEncounters[0]?.hospital || 'Selected Hospital';

  return (
    <div className="min-h-screen p-6 space-y-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">3M Coding & CDI Platform</h1>
          <p className="text-white/60">{currentHospital} - AI-powered clinical documentation improvement</p>
        </div>
        <div className="flex gap-3">
          <Button className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white hover:bg-blue-500/30 rounded-xl">
            <Download className="h-4 w-4" />
            Export Coding Report
          </Button>
          <Button className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white hover:bg-blue-500/30 rounded-xl">
            <Zap className="h-4 w-4" />
            Run 3M Encoder
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Total Encounters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.totalEncounters}</div>
            <p className="text-xs text-blue-400">This month</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Coding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.pendingCoding}</div>
            <p className="text-xs text-yellow-400">Requires attention</p>
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
            <div className="text-2xl font-bold text-white">{codingMetrics.completedToday}</div>
            <p className="text-xs text-green-400">On track</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              CDI Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.cdiOpportunities}</div>
            <p className="text-xs text-blue-400">Revenue potential</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Coding Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.codingAccuracy}</div>
            <p className="text-xs text-green-400">Above benchmark</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Avg Coding Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{codingMetrics.avgCodingTime}</div>
            <p className="text-xs text-green-400">Efficient workflow</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Coding Worklist - {currentHospital}</CardTitle>
              <CardDescription className="text-white/60">Priority-based AI-enhanced encounter coding</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search encounters..." 
                  className="backdrop-blur-xl bg-blue-600/20 border border-blue-400/30 text-white placeholder:text-white/60 pl-10 w-64 px-4 py-3 rounded-xl transition-all duration-200"
                />
              </div>
              <Button size="sm" className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 text-white hover:bg-blue-500/30 rounded-xl">
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
                <TableHead className="text-white">Encounter ID</TableHead>
                <TableHead className="text-white">Patient</TableHead>
                <TableHead className="text-white">MRN</TableHead>
                <TableHead className="text-white">Service</TableHead>
                <TableHead className="text-white">Admit Date</TableHead>
                <TableHead className="text-white">Priority</TableHead>
                <TableHead className="text-white">Complexity</TableHead>
                <TableHead className="text-white">MS-DRG</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codingEncounters.map((encounter) => (
                <TableRow key={encounter.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{encounter.id}</TableCell>
                  <TableCell className="text-white">
                    <Button 
                      variant="link" 
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                      onClick={() => navigate(`/patient/${encounter.patientId}`)}
                    >
                      {encounter.patient}
                    </Button>
                  </TableCell>
                  <TableCell className="text-white font-mono text-sm">{encounter.mrn}</TableCell>
                  <TableCell className="text-white">{encounter.service}</TableCell>
                  <TableCell className="text-white">{encounter.admitDate}</TableCell>
                  <TableCell className={getPriorityColor(encounter.priority)}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{encounter.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getComplexityBadge(encounter.complexity)}>{encounter.complexity}</Badge>
                  </TableCell>
                  <TableCell className="text-white font-mono">{encounter.msdrg}</TableCell>
                  <TableCell className={getStatusColor(encounter.status)}>
                    {encounter.status}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAIMedicalCoding(encounter)}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xs"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Code
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
    </div>
  );
};

export default CodingDashboard;
