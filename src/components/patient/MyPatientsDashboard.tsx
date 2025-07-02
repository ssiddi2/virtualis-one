
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, TestTube, Activity, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/hooks/usePatients';

const MyPatientsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: allPatients, isLoading } = usePatients();

  // Filter patients assigned to current provider
  const myPatients = allPatients?.filter(patient => 
    patient.status === 'active' && 
    (patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Mock critical alerts for demo
  const criticalAlerts = [
    { patientId: 'pat-1-001', message: 'Critical lab value: Potassium 2.8', time: '10 min ago' },
    { patientId: 'pat-1-002', message: 'New chest pain complaint', time: '25 min ago' }
  ];

  const handleOpenChart = (patientId: string) => {
    navigate(`/epic-chart/${patientId}`);
  };

  const handleViewLabs = (patientId: string) => {
    navigate(`/laboratory?patient=${patientId}`);
  };

  const handleAddNote = (patientId: string) => {
    navigate(`/documentation/${patientId}`);
  };

  const getUrgencyColor = (patient: any) => {
    // Simple urgency logic based on room type
    if (patient.room_number?.includes('ICU')) return 'bg-red-500';
    if (patient.room_number?.includes('2') || patient.room_number?.includes('3')) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Patients</h1>
          <p className="text-white/70">Your assigned patients and clinical workflow</p>
        </div>
        <div className="text-right text-white">
          <p className="text-lg font-semibold">{myPatients.length} Active Patients</p>
          <p className="text-sm text-white/70">Dr. {profile?.first_name} {profile?.last_name}</p>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="backdrop-blur-xl bg-red-500/10 border border-red-300/30 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between bg-red-500/20 p-3 rounded-lg">
                <div className="text-white">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-white/60">{alert.time}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleOpenChart(alert.patientId)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
        <Input
          placeholder="Search your patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/50"
        />
      </div>

      {/* Patient List */}
      <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
        <CardHeader>
          <CardTitle className="text-white">My Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-blue-400/30">
                <TableHead className="text-white">Patient</TableHead>
                <TableHead className="text-white">Room</TableHead>
                <TableHead className="text-white">Admission</TableHead>
                <TableHead className="text-white">Conditions</TableHead>
                <TableHead className="text-white">Last Note</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPatients.map((patient) => (
                <TableRow key={patient.id} className="border-blue-400/20 hover:bg-blue-500/10">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getUrgencyColor(patient)}`}></div>
                      <div className="text-white">
                        <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                        <p className="text-sm text-white/60">MRN: {patient.mrn}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {patient.room_number || 'Not assigned'}
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/50" />
                      <span className="text-sm">
                        {patient.admission_date ? 
                          new Date(patient.admission_date).toLocaleDateString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {patient.medical_conditions?.slice(0, 2).map((condition, index) => (
                        <Badge key={index} className="bg-purple-600/20 text-purple-300 border-purple-400/30 text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {patient.medical_conditions && patient.medical_conditions.length > 2 && (
                        <Badge className="bg-gray-600/20 text-gray-300 border-gray-400/30 text-xs">
                          +{patient.medical_conditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/60 text-sm">
                    Progress note - 2h ago
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm"
                        onClick={() => handleOpenChart(patient.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2"
                        title="Open Chart"
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleViewLabs(patient.id)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2"
                        title="View Labs"
                      >
                        <TestTube className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddNote(patient.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2"
                        title="Add Note"
                      >
                        <Activity className="h-3 w-3" />
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

export default MyPatientsDashboard;
