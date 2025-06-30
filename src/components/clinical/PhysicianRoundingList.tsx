
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Clock, 
  AlertTriangle, 
  Stethoscope,
  FileText,
  ClipboardCheck,
  Home,
  Search,
  Filter,
  Bell,
  Activity
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useClinicalOrders } from '@/hooks/useClinicalOrders';

const PhysicianRoundingList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const { data: patients } = usePatients();
  const { data: clinicalOrders } = useClinicalOrders();

  // Mock rounding data - in real implementation, this would come from the database
  const roundingPatients = patients?.map(patient => {
    const patientOrders = clinicalOrders?.filter(order => order.patient_id === patient.id) || [];
    const pendingOrders = patientOrders.filter(order => order.status === 'active').length;
    const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
    const los = patient.admission_date ? 
      Math.floor((new Date().getTime() - new Date(patient.admission_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return {
      ...patient,
      age,
      los,
      pendingOrders,
      acuity: Math.floor(Math.random() * 3) + 1, // Mock acuity 1-3
      lastRounded: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      tasks: [
        { type: 'notes', count: Math.floor(Math.random() * 3) },
        { type: 'orders', count: pendingOrders },
        { type: 'discharge', count: patient.status === 'discharge_pending' ? 1 : 0 }
      ]
    };
  }) || [];

  const filteredPatients = roundingPatients.filter(patient => {
    const matchesSearch = patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.room_number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getAcuityColor = (acuity: number) => {
    switch (acuity) {
      case 1: return 'bg-green-600 text-white';
      case 2: return 'bg-yellow-600 text-white';
      case 3: return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getAcuityLabel = (acuity: number) => {
    switch (acuity) {
      case 1: return 'Stable';
      case 2: return 'Monitoring';
      case 3: return 'Critical';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-full mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Physician Rounding List</h1>
            <p className="text-white/70">Patient census and rounding workflow • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Bell className="h-4 w-4 mr-2" />
              Alerts ({filteredPatients.filter(p => p.acuity === 3).length})
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{filteredPatients.length}</div>
            <div className="text-xs text-white/70">Total Patients</div>
          </div>
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{filteredPatients.filter(p => p.acuity === 3).length}</div>
            <div className="text-xs text-white/70">Critical</div>
          </div>
          <div className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{filteredPatients.filter(p => p.acuity === 2).length}</div>
            <div className="text-xs text-white/70">Monitoring</div>
          </div>
          <div className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{filteredPatients.filter(p => p.acuity === 1).length}</div>
            <div className="text-xs text-white/70">Stable</div>
          </div>
          <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{filteredPatients.reduce((sum, p) => sum + p.tasks.reduce((taskSum, task) => taskSum + task.count, 0), 0)}</div>
            <div className="text-xs text-white/70">Pending Tasks</div>
          </div>
          <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{filteredPatients.filter(p => p.status === 'discharge_pending').length}</div>
            <div className="text-xs text-white/70">Discharge Ready</div>
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
            {['all', 'icu', 'med-surg', 'emergency'].map((unit) => (
              <Button
                key={unit}
                variant={selectedUnit === unit ? "default" : "outline"}
                onClick={() => setSelectedUnit(unit)}
                className={selectedUnit === unit 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
                }
              >
                <Filter className="h-4 w-4 mr-2" />
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Rounding List Table */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-400/30 hover:bg-blue-500/10">
                  <TableHead className="text-white font-semibold">Acuity</TableHead>
                  <TableHead className="text-white font-semibold">Patient</TableHead>
                  <TableHead className="text-white font-semibold">Room</TableHead>
                  <TableHead className="text-white font-semibold">Age</TableHead>
                  <TableHead className="text-white font-semibold">LOS</TableHead>
                  <TableHead className="text-white font-semibold">Last Rounded</TableHead>
                  <TableHead className="text-white font-semibold">Pending Tasks</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Actions</TableHead>
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
                        {getAcuityLabel(patient.acuity)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-medium">{patient.first_name} {patient.last_name}</div>
                      <div className="text-white/60 text-xs">{patient.mrn}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{patient.room_number || 'Unassigned'}</div>
                      <div className="text-white/60 text-xs">Bed {patient.bed_number || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{patient.age}y</div>
                      <div className="text-white/60 text-xs">{patient.gender || 'U'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-medium">{patient.los} days</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white text-sm">
                        {patient.lastRounded.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-white/60 text-xs">
                        {patient.lastRounded.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {patient.tasks.map((task, index) => (
                          task.count > 0 && (
                            <Badge key={index} className="bg-orange-600 text-white text-xs">
                              {task.type}: {task.count}
                            </Badge>
                          )
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        patient.status === 'active' ? 'bg-green-600 text-white' :
                        patient.status === 'discharge_pending' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }>
                        {patient.status === 'discharge_pending' ? 'Discharge Ready' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white p-1">
                          <User className="h-3 w-3" />
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white p-1">
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white p-1">
                          <Stethoscope className="h-3 w-3" />
                        </Button>
                        {patient.status === 'discharge_pending' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white p-1">
                            <Home className="h-3 w-3" />
                          </Button>
                        )}
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

export default PhysicianRoundingList;
