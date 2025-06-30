
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePatients } from '@/hooks/usePatients';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  User, 
  RefreshCw,
  Bed,
  Phone,
  Search,
  Filter
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface ERPatientTrackerProps {
  hospitalId?: string;
}

const ERPatientTracker: React.FC<ERPatientTrackerProps> = ({ hospitalId }) => {
  const { toast } = useToast();
  const { data: patients, isLoading } = usePatients();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const mockERPatients = [
    {
      id: '1',
      name: 'Smith, John',
      mrn: 'MRN001234',
      age: 45,
      gender: 'M',
      chiefComplaint: 'Chest pain',
      acuity: 2,
      arrivalTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      room: 'ER-101',
      bed: 'A',
      vitals: { bp: '140/90', hr: 88, temp: 98.6, spo2: 96, rr: 18 },
      status: 'In Treatment',
      nurse: 'Williams, S.',
      physician: 'Dr. Johnson',
      los: '2h 15m',
      disposition: 'Pending'
    },
    {
      id: '2',
      name: 'Johnson, Sarah',
      mrn: 'MRN001235',
      age: 28,
      gender: 'F',
      chiefComplaint: 'Severe headache',
      acuity: 3,
      arrivalTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      room: 'ER-102',
      bed: 'B',
      vitals: { bp: '120/80', hr: 72, temp: 99.1, spo2: 98, rr: 16 },
      status: 'Awaiting Results',
      nurse: 'Thompson, M.',
      physician: 'Dr. Wilson',
      los: '1h 30m',
      disposition: 'Pending'
    },
    {
      id: '3',
      name: 'Brown, Michael',
      mrn: 'MRN001236',
      age: 65,
      gender: 'M',
      chiefComplaint: 'Difficulty breathing',
      acuity: 1,
      arrivalTime: new Date(Date.now() - 30 * 60 * 1000),
      room: 'ER-103',
      bed: 'C',
      vitals: { bp: '160/95', hr: 110, temp: 100.2, spo2: 89, rr: 24 },
      status: 'Critical',
      nurse: 'Davis, K.',
      physician: 'Dr. Martinez',
      los: '30m',
      disposition: 'ICU'
    },
    {
      id: '4',
      name: 'Wilson, Lisa',
      mrn: 'MRN001237',
      age: 34,
      gender: 'F',
      chiefComplaint: 'Minor laceration',
      acuity: 4,
      arrivalTime: new Date(Date.now() - 45 * 60 * 1000),
      room: 'ER-104',
      bed: 'D',
      vitals: { bp: '115/75', hr: 78, temp: 98.4, spo2: 99, rr: 14 },
      status: 'Ready for Discharge',
      nurse: 'Garcia, R.',
      physician: 'Dr. Brown',
      los: '45m',
      disposition: 'Home'
    }
  ];

  const getAcuityColor = (acuity: number) => {
    switch (acuity) {
      case 1: return 'bg-red-600 text-white hover:bg-red-700';
      case 2: return 'bg-orange-600 text-white hover:bg-orange-700';
      case 3: return 'bg-yellow-600 text-white hover:bg-yellow-700';
      case 4: return 'bg-green-600 text-white hover:bg-green-700';
      case 5: return 'bg-blue-600 text-white hover:bg-blue-700';
      default: return 'bg-gray-600 text-white hover:bg-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-900/20';
      case 'in treatment': return 'text-blue-400 bg-blue-900/20';
      case 'awaiting results': return 'text-yellow-400 bg-yellow-900/20';
      case 'ready for discharge': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Emergency department data has been updated.",
      });
    }, 1500);
  };

  const filteredPatients = mockERPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'critical' && patient.acuity <= 2) ||
                         (selectedFilter === 'routine' && patient.acuity > 2);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white">Loading emergency department data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Emergency Department - Patient Tracker</h1>
            <p className="text-white/70">Real-time patient monitoring • {new Date().toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {refreshing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{mockERPatients.length}</div>
            <div className="text-xs text-white/70">Total Patients</div>
          </div>
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{mockERPatients.filter(p => p.acuity <= 2).length}</div>
            <div className="text-xs text-white/70">Critical/Urgent</div>
          </div>
          <div className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">15</div>
            <div className="text-xs text-white/70">Available Beds</div>
          </div>
          <div className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">42m</div>
            <div className="text-xs text-white/70">Avg Wait Time</div>
          </div>
          <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">3</div>
            <div className="text-xs text-white/70">Pending Discharge</div>
          </div>
          <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">2</div>
            <div className="text-xs text-white/70">Admits Pending</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search by name, MRN, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'critical', 'routine'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter)}
                className={selectedFilter === filter 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
                }
              >
                <Filter className="h-4 w-4 mr-2" />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Patient Table */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-400/30 hover:bg-blue-500/10">
                  <TableHead className="text-white font-semibold">Acuity</TableHead>
                  <TableHead className="text-white font-semibold">Patient</TableHead>
                  <TableHead className="text-white font-semibold">Room/Bed</TableHead>
                  <TableHead className="text-white font-semibold">Chief Complaint</TableHead>
                  <TableHead className="text-white font-semibold">Arrival</TableHead>
                  <TableHead className="text-white font-semibold">LOS</TableHead>
                  <TableHead className="text-white font-semibold">Vitals</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Care Team</TableHead>
                  <TableHead className="text-white font-semibold">Disposition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.id} 
                    className="border-blue-400/20 hover:bg-blue-500/10 cursor-pointer"
                  >
                    <TableCell>
                      <Badge className={`${getAcuityColor(patient.acuity)} font-bold text-sm px-2 py-1`}>
                        {patient.acuity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-medium">{patient.name}</div>
                      <div className="text-white/60 text-xs">{patient.mrn} • {patient.age}{patient.gender}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-white">
                        <Bed className="h-4 w-4" />
                        {patient.room}-{patient.bed}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white text-sm">{patient.chiefComplaint}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white text-sm">{patient.arrivalTime.toLocaleTimeString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-medium">{patient.los}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-white space-y-1">
                        <div>BP: {patient.vitals.bp}</div>
                        <div>HR: {patient.vitals.hr} | SpO2: {patient.vitals.spo2}%</div>
                        <div>T: {patient.vitals.temp}°F | RR: {patient.vitals.rr}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(patient.status)} text-xs px-2 py-1`}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-white space-y-1">
                        <div>MD: {patient.physician}</div>
                        <div>RN: {patient.nurse}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white text-sm font-medium">{patient.disposition}</div>
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

export default ERPatientTracker;
