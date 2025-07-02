
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
      <div className="flex justify-between items-center bg-card p-6 rounded-lg border border-border mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Patients</h1>
          <p className="text-muted-foreground">Your assigned patients and clinical workflow</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-foreground">{myPatients.length} Active Patients</p>
          <p className="text-sm text-muted-foreground">Dr. {profile?.first_name} {profile?.last_name}</p>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="bg-card border border-critical/20 bg-critical/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-critical" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between bg-critical/10 p-3 rounded border border-critical/20">
                <div>
                  <p className="font-medium text-foreground text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleOpenChart(alert.patientId)}
                  className="text-xs"
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background border border-input"
        />
      </div>

      {/* Patient List */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-sm font-medium">My Patient List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Room</th>
                <th>Admission</th>
                <th>Conditions</th>
                <th>Last Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`status-indicator ${getUrgencyColor(patient) === 'bg-red-500' ? 'status-critical' : getUrgencyColor(patient) === 'bg-yellow-500' ? 'status-warning' : 'status-normal'}`}></div>
                      <div>
                        <p className="font-medium text-foreground">{patient.first_name} {patient.last_name}</p>
                        <p className="text-xs text-muted-foreground">MRN: {patient.mrn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-foreground font-medium">
                    {patient.room_number || 'Not assigned'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {patient.admission_date ? 
                          new Date(patient.admission_date).toLocaleDateString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {patient.medical_conditions?.slice(0, 2).map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {patient.medical_conditions && patient.medical_conditions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{patient.medical_conditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="text-muted-foreground text-sm">
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
                  <td>
                    <div className="flex gap-1">
                      <Button 
                        size="sm"
                        onClick={() => handleOpenChart(patient.id)}
                        className="p-2"
                        title="Open Chart"
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="secondary"
                        onClick={() => handleViewLabs(patient.id)}
                        className="p-2"
                        title="View Labs"
                      >
                        <TestTube className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddNote(patient.id)}
                        className="p-2"
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
