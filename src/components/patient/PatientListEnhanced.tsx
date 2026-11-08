
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, User, ArrowLeft, FileText, Stethoscope, TestTube, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospitalPatients, chartPathFor, RosterPatient } from '@/hooks/useHospitalPatients';
import RosterSourceNotice from '@/components/patient/RosterSourceNotice';

const PatientListEnhanced = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { patients, isLoading, source, error, hospitalName, refetch } = useHospitalPatients();

  const term = searchTerm.toLowerCase();
  const filteredPatients = patients.filter(patient =>
    (patient.first_name || '').toLowerCase().includes(term) ||
    (patient.last_name || '').toLowerCase().includes(term) ||
    (patient.mrn || '').toLowerCase().includes(term)
  );

  const handlePatientClick = (patient: RosterPatient) => {
    navigate(chartPathFor(patient));
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Patient Management</h1>
              <p className="text-white/70">Access patient charts, notes, and clinical tools</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
        </div>

        <RosterSourceNotice source={source} hospitalName={hospitalName} error={error} onRetry={() => refetch()} />

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/50"
          />
        </div>

        {/* Patient List */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white">
              {isLoading ? 'Loading patients…' : `Patients (${filteredPatients.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-blue-400/30">
                  <TableHead className="text-white">Patient</TableHead>
                  <TableHead className="text-white">MRN</TableHead>
                  <TableHead className="text-white">Room</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Chart Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.id} 
                    className="border-blue-400/20 hover:bg-blue-500/20 cursor-pointer transition-colors"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <TableCell>
                      <div className="text-white font-medium">
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className="text-white/60 text-sm">
                        {patient.date_of_birth}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{patient.mrn || '—'}</TableCell>
                    <TableCell className="text-white">{patient.room_number || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={
                        patient.status === 'active' ? 'bg-green-600 text-white' :
                        patient.status === 'discharged' ? 'bg-gray-600 text-white' :
                        'bg-blue-600 text-white'
                      }>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-white/80">
                        Click anywhere to open chart
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientListEnhanced;
