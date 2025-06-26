import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Activity,
  Search,
  RefreshCw,
  Heart,
  Thermometer,
  Stethoscope,
  Download,
  Send
} from 'lucide-react';

export interface ERPatientTrackerProps {
  hospitalId?: string | null;
}

const ERPatientTracker: React.FC<ERPatientTrackerProps> = ({ hospitalId }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Mock patient data
  const [patients] = useState([
    {
      id: 'ER001',
      name: 'John Smith',
      age: 45,
      chiefComplaint: 'Chest pain',
      triageLevel: 'Critical',
      arrivalTime: '10:30 AM',
      waitTime: '15 min',
      status: 'In Treatment',
      assignedTo: 'Dr. Johnson',
      vitals: { bp: '140/90', hr: '95', temp: '98.6°F', spo2: '98%' }
    },
    {
      id: 'ER002',
      name: 'Sarah Davis',
      age: 32,
      chiefComplaint: 'Severe headache',
      triageLevel: 'Urgent',
      arrivalTime: '11:15 AM',
      waitTime: '45 min',
      status: 'Waiting',
      assignedTo: 'Dr. Williams',
      vitals: { bp: '120/80', hr: '88', temp: '99.1°F', spo2: '99%' }
    },
    {
      id: 'ER003',
      name: 'Michael Brown',
      age: 28,
      chiefComplaint: 'Laceration on hand',
      triageLevel: 'Non-urgent',
      arrivalTime: '12:00 PM',
      waitTime: '90 min',
      status: 'Registered',
      assignedTo: 'Nurse Peterson',
      vitals: { bp: '118/75', hr: '72', temp: '98.4°F', spo2: '100%' }
    }
  ]);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "Patient tracker data has been updated with latest information.",
      });
      setIsRefreshing(false);
    }, 2000);
  };

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated and is ready for download.`,
      });
      setIsGeneratingReport(false);
      
      // Simulate file download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${reportType} Report Data`));
      element.setAttribute('download', `${reportType.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  const handlePatientAction = (patientId: string, action: string) => {
    toast({
      title: `Patient ${action}`,
      description: `Action "${action}" completed for patient ${patientId}`,
    });
  };

  const getTriageBadgeColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-600/20 text-red-300 border-red-600/30';
      case 'Urgent': return 'bg-orange-600/20 text-orange-300 border-orange-600/30';
      case 'Non-urgent': return 'bg-green-600/20 text-green-300 border-green-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'In Treatment': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      case 'Waiting': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30';
      case 'Registered': return 'bg-purple-600/20 text-purple-300 border-purple-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hospitalId) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Select a Hospital</h2>
          <p className="text-white/70">Please select a hospital from the EMR dashboard to view patient tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Emergency Department Tracker</h1>
            <p className="text-white/70">Real-time patient monitoring and workflow management</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleGenerateReport('ED Status Report')}
              disabled={isGeneratingReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Generate Report
            </Button>
            <Button 
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{patients.length}</div>
              <p className="text-xs text-slate-400">Active in ED</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Critical Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1</div>
              <p className="text-xs text-slate-400">Immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Average Wait</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">50m</div>
              <p className="text-xs text-slate-400">Current average</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Bed Occupancy</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">75%</div>
              <p className="text-xs text-slate-400">12 of 16 beds</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Patient Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Search by name, ID, or complaint..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{patient.name}</h3>
                      <p className="text-slate-400">{patient.age} years • ID: {patient.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getTriageBadgeColor(patient.triageLevel)}>
                        {patient.triageLevel}
                      </Badge>
                      <Badge className={getStatusBadgeColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">Wait: {patient.waitTime}</div>
                    <div className="text-slate-400 text-sm">Arrived: {patient.arrivalTime}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Chief Complaint</h4>
                    <p className="text-slate-400">{patient.chiefComplaint}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Assigned To</h4>
                    <p className="text-slate-400">{patient.assignedTo}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Vital Signs</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-400" />
                        <span className="text-slate-400">BP: {patient.vitals.bp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-green-400" />
                        <span className="text-slate-400">HR: {patient.vitals.hr}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-orange-400" />
                        <span className="text-slate-400">Temp: {patient.vitals.temp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3 text-blue-400" />
                        <span className="text-slate-400">SpO2: {patient.vitals.spo2}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handlePatientAction(patient.id, 'Update Status')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Update Status
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePatientAction(patient.id, 'View Chart')}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    View Chart
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePatientAction(patient.id, 'Order Labs')}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Order Labs
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePatientAction(patient.id, 'Discharge')}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Discharge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening new patient registration..." })}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                New Patient
              </Button>
              <Button 
                onClick={() => handleGenerateReport('Bed Status Report')}
                disabled={isGeneratingReport}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Activity className="h-4 w-4 mr-2" />
                Bed Management
              </Button>
              <Button 
                onClick={() => handleGenerateReport('Triage Summary')}
                disabled={isGeneratingReport}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Triage Summary
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening staff assignment panel..." })}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Staff Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ERPatientTracker;
