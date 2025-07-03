
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
import { useMedicalRecords } from '@/hooks/useMedicalRecords';

const MyPatientsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: allPatients, isLoading } = usePatients();
  const { data: medicalRecords } = useMedicalRecords();

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
    navigate(`/patient-chart/${patientId}`);
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
    <div className="space-y-6 p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div className="flex justify-between items-center clinical-card p-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Patients</h1>
          <p className="text-white/70">Your assigned patients and clinical workflow</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-white">{myPatients.length} Active Patients</p>
          <p className="text-sm text-white/70">Dr. {profile?.first_name} {profile?.last_name}</p>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="clinical-card border-red-400/20 bg-red-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between bg-red-900/20 p-3 rounded border border-red-400/20">
                <div>
                  <p className="font-medium text-white text-sm">{alert.message}</p>
                  <p className="text-xs text-white/60">{alert.time}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleOpenChart(alert.patientId)}
                  className="quick-action-btn quick-action-primary text-xs"
                >
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          placeholder="Search your patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>

      {/* Patient List */}
      <Card className="clinical-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm font-medium">My Patient List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="epic-lab-table">
            <thead>
              <tr>
                <th className="text-white">Patient</th>
                <th className="text-white">Room</th>
                <th className="text-white">Admission</th>
                <th className="text-white">Conditions</th>
                <th className="text-white">Last Note</th>
                <th className="text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="text-white">
                    <div className="flex items-center gap-3">
                      <div className={`status-indicator ${getUrgencyColor(patient) === 'bg-red-500' ? 'status-critical' : getUrgencyColor(patient) === 'bg-yellow-500' ? 'status-warning' : 'status-normal'}`}></div>
                      <div>
                        <p className="font-medium text-white">{patient.first_name} {patient.last_name}</p>
                        <p className="text-xs text-white/60">MRN: {patient.mrn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-white font-medium">
                    {patient.room_number || 'Not assigned'}
                  </td>
                  <td className="text-white">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/60" />
                      <span className="text-sm">
                        {patient.admission_date ? 
                          new Date(patient.admission_date).toLocaleDateString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="text-white">
                    <div className="flex flex-wrap gap-1">
                      {patient.medical_conditions?.slice(0, 2).map((condition, index) => (
                        <Badge key={index} className="bg-blue-600/20 border border-blue-400/30 text-white text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {patient.medical_conditions && patient.medical_conditions.length > 2 && (
                        <Badge className="bg-blue-600/20 border border-blue-400/30 text-white text-xs">
                          +{patient.medical_conditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="text-white/70 text-sm">
                    {(() => {
                      const patientRecords = medicalRecords?.filter(record => record.patient_id === patient.id);
                      const lastRecord = patientRecords?.[0];
                      if (lastRecord) {
                        const timeAgo = Math.floor((Date.now() - new Date(lastRecord.created_at!).getTime()) / (1000 * 60 * 60));
                        return `${lastRecord.encounter_type} - ${timeAgo}h ago`;
                      }
                      return 'No recent notes';
                    })()}
                  </td>
                  <td className="text-white">
                    <div className="flex gap-1">
                      <Button 
                        size="sm"
                        onClick={() => handleOpenChart(patient.id)}
                        className="quick-action-btn quick-action-primary p-2"
                        title="Open Chart"
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleViewLabs(patient.id)}
                        className="quick-action-btn quick-action-secondary p-2"
                        title="View Labs"
                      >
                        <TestTube className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddNote(patient.id)}
                        className="quick-action-btn quick-action-success p-2"
                        title="Add Note"
                      >
                        <Activity className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPatientsDashboard;
