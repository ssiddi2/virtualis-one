
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  FileText, 
  Calendar, 
  TestTube,
  Scan,
  Pill,
  Activity,
  Search,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePatients } from '@/hooks/usePatients';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { Link } from 'react-router-dom';

const EMRDashboard = () => {
  const { toast } = useToast();
  const { data: patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredPatients = patients?.filter(patient => 
    patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleExportData = async () => {
    setIsExporting(true);
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Patient data has been exported successfully.",
      });
      setIsExporting(false);
      
      // Simulate file download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Patient EMR Data Export'));
      element.setAttribute('download', `emr_export_${new Date().toISOString().split('T')[0]}.csv`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "All EMR data has been synchronized with the latest updates.",
      });
      setIsRefreshing(false);
    }, 1500);
  };

  const handleQuickAction = (action: string, patientId?: string) => {
    const actions = {
      'new_patient': 'Opening new patient registration form...',
      'new_appointment': 'Opening appointment scheduling system...',
      'lab_results': 'Opening lab results interface...',
      'vital_signs': `Recording vital signs for patient...`,
      'medication_order': `Opening medication ordering system...`,
      'discharge': `Initiating discharge process...`
    };
    
    toast({
      title: "Action Initiated",
      description: actions[action as keyof typeof actions] || "Processing request...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'discharged': return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
      case 'admitted': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const activePatients = patients?.filter(p => p.status === 'active').length || 0;
  const admittedPatients = patients?.filter(p => p.status === 'admitted').length || 0;

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Electronic Medical Records</h1>
            <p className="text-white/70">Comprehensive patient care management system</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleRefreshData}
              disabled={isRefreshing}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
            >
              {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <Button 
              onClick={handleExportData}
              disabled={isExporting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExporting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Export Data
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{patients?.length || 0}</div>
              <p className="text-xs text-slate-400">
                {activePatients} active, {admittedPatients} admitted
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
              <p className="text-xs text-slate-400">
                12 completed, 12 scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pending Lab Results</CardTitle>
              <TestTube className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-slate-400">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Critical Alerts</CardTitle>
              <Activity className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-slate-400">
                Requiring immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Button 
                onClick={() => handleQuickAction('new_patient')}
                className="bg-blue-600 hover:bg-blue-700 flex-col h-auto py-3"
              >
                <Plus className="h-4 w-4 mb-1" />
                New Patient
              </Button>
              <Button 
                onClick={() => handleQuickAction('new_appointment')}
                className="bg-green-600 hover:bg-green-700 flex-col h-auto py-3"
              >
                <Calendar className="h-4 w-4 mb-1" />
                Schedule
              </Button>
              <Button 
                onClick={() => handleQuickAction('lab_results')}
                className="bg-orange-600 hover:bg-orange-700 flex-col h-auto py-3"
              >
                <TestTube className="h-4 w-4 mb-1" />
                Lab Results
              </Button>
              <Button 
                onClick={() => handleQuickAction('vital_signs')}
                className="bg-purple-600 hover:bg-purple-700 flex-col h-auto py-3"
              >
                <Activity className="h-4 w-4 mb-1" />
                Vitals
              </Button>
              <Button 
                onClick={() => handleQuickAction('medication_order')}
                className="bg-pink-600 hover:bg-pink-700 flex-col h-auto py-3"
              >
                <Pill className="h-4 w-4 mb-1" />
                Medications
              </Button>
              <Button 
                onClick={() => handleQuickAction('discharge')}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 flex-col h-auto py-3"
              >
                <FileText className="h-4 w-4 mb-1" />
                Discharge
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Search and List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Patient Directory</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search patients by name or MRN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.slice(0, 10).map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {patient.first_name[0]}{patient.last_name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {patient.first_name} {patient.last_name}
                        </div>
                        <div className="text-sm text-slate-400">
                          MRN: {patient.mrn} • DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                        </div>
                        {patient.room_number && (
                          <div className="text-sm text-slate-500">
                            Room: {patient.room_number}{patient.bed_number && ` Bed: ${patient.bed_number}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status || 'Active'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => toast({ title: "Quick View", description: `Opening quick view for ${patient.first_name} ${patient.last_name}` })}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Link to={`/patient/${patient.id}`}>
                          <Button 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            View Chart
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8">
                  {searchTerm ? 'No patients found matching your search.' : 'No patients available.'}
                </p>
              )}
            </div>
            {filteredPatients.length > 10 && (
              <div className="mt-4 text-center">
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                  Load More Patients ({filteredPatients.length - 10} remaining)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMRDashboard;
