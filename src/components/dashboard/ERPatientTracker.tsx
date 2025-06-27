import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Search,
  Filter,
  Plus
} from "lucide-react";

interface ERPatientTrackerProps {
  hospitalId?: string | null;
}

const ERPatientTracker = ({ hospitalId }: ERPatientTrackerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data for ER patients
  const mockERPatients = [
    {
      id: "1",
      name: "John Smith",
      age: 45,
      chiefComplaint: "Chest pain",
      triageLevel: "2",
      arrivalTime: "14:30",
      status: "in-treatment",
      assignedTo: "Dr. Johnson",
      bedNumber: "ER-03"
    },
    {
      id: "2",
      name: "Maria Garcia",
      age: 32,
      chiefComplaint: "Severe headache",
      triageLevel: "3",
      arrivalTime: "15:15",
      status: "waiting",
      assignedTo: null,
      bedNumber: "Waiting"
    },
    {
      id: "3",
      name: "Robert Wilson",
      age: 67,
      chiefComplaint: "Difficulty breathing",
      triageLevel: "1",
      arrivalTime: "15:45",
      status: "critical",
      assignedTo: "Dr. Chen",
      bedNumber: "ER-01"
    },
    {
      id: "4",
      name: "Sarah Johnson",
      age: 28,
      chiefComplaint: "Ankle injury",
      triageLevel: "4",
      arrivalTime: "16:00",
      status: "discharged",
      assignedTo: "Dr. Rodriguez",
      bedNumber: "ER-05"
    }
  ];

  const getTriageColor = (level: string) => {
    switch (level) {
      case "1": return "bg-red-600";
      case "2": return "bg-orange-600";
      case "3": return "bg-yellow-600";
      case "4": return "bg-green-600";
      case "5": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-red-600";
      case "in-treatment": return "text-blue-600";
      case "waiting": return "text-amber-600";
      case "discharged": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const filteredPatients = mockERPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Activity className="h-8 w-8 text-red-500" />
              Emergency Department Tracker
            </h1>
            <p className="text-slate-600 mt-2">
              Real-time patient tracking and triage management
              {hospitalId && ` • Hospital ID: ${hospitalId}`}
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{mockERPatients.length}</div>
              <p className="text-xs text-slate-500">Currently in ED</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-red-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Critical Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockERPatients.filter(p => p.status === 'critical').length}
              </div>
              <p className="text-xs text-slate-500">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">In Treatment</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {mockERPatients.filter(p => p.status === 'in-treatment').length}
              </div>
              <p className="text-xs text-slate-500">Currently being treated</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Waiting</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockERPatients.filter(p => p.status === 'waiting').length}
              </div>
              <p className="text-xs text-slate-500">Awaiting treatment</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-300 text-slate-800 shadow-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-800 shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="critical">Critical</option>
            <option value="in-treatment">In Treatment</option>
            <option value="waiting">Waiting</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>

        {/* Patient List */}
        <Card className="bg-white border border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800">Patient Queue</CardTitle>
            <CardDescription className="text-slate-600">
              Live emergency department patient tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="p-4 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getTriageColor(patient.triageLevel)} text-white`}>
                          T{patient.triageLevel}
                        </Badge>
                        <div className="text-sm text-slate-500">{patient.arrivalTime}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{patient.name}</h4>
                        <p className="text-sm text-slate-600">Age: {patient.age} • {patient.chiefComplaint}</p>
                        <p className="text-sm text-slate-600">
                          Bed: {patient.bedNumber} • 
                          {patient.assignedTo ? ` Assigned to: ${patient.assignedTo}` : ' Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(patient.status)} border-current`}
                      >
                        {patient.status.toUpperCase()}
                      </Badge>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        View Chart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ERPatientTracker;
