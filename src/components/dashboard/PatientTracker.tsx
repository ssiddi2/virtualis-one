
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User,
  Activity,
  MapPin,
  Calendar,
  Search,
  Filter,
  Heart,
  Thermometer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PatientTracker = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const patients = [
    {
      id: 1,
      name: 'John Smith',
      mrn: 'MRN-001234',
      room: 'ER-101',
      status: 'critical',
      condition: 'Chest Pain',
      admissionTime: '08:30 AM',
      vitals: { hr: 95, bp: '140/90', temp: 98.6, spo2: 98 },
      physician: 'Dr. Johnson'
    },
    {
      id: 2,
      name: 'Sarah Davis',
      mrn: 'MRN-001235',
      room: 'ICU-201',
      status: 'stable',
      condition: 'Post-Op Monitoring',
      admissionTime: '06:15 AM',
      vitals: { hr: 72, bp: '120/80', temp: 98.2, spo2: 99 },
      physician: 'Dr. Wilson'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      mrn: 'MRN-001236',
      room: 'Room-305',
      status: 'observation',
      condition: 'Fever Investigation',
      admissionTime: '10:45 AM',
      vitals: { hr: 88, bp: '130/85', temp: 101.2, spo2: 97 },
      physician: 'Dr. Martinez'
    },
    {
      id: 4,
      name: 'Lisa Wilson',
      mrn: 'MRN-001237',
      room: 'ER-102',
      status: 'discharge',
      condition: 'Minor Laceration',
      admissionTime: '11:20 AM',
      vitals: { hr: 78, bp: '115/75', temp: 98.4, spo2: 99 },
      physician: 'Dr. Brown'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'stable': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'observation': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'discharge': return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'stable': return <CheckCircle className="h-4 w-4" />;
      case 'observation': return <Clock className="h-4 w-4" />;
      case 'discharge': return <User className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.mrn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handlePatientClick = (patient: any) => {
    toast({
      title: "Patient Details",
      description: `Viewing details for ${patient.name}`,
    });
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="h-12 w-12 text-sky-300 animate-pulse" />
            <div>
              <h1 className="text-4xl font-bold text-white">
                Patient Tracker
              </h1>
              <p className="text-white/80 text-lg">
                Real-time Patient Monitoring & Status Updates
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Patients</p>
                  <p className="text-2xl font-bold text-white">{patients.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Critical</p>
                  <p className="text-2xl font-bold text-white">
                    {patients.filter(p => p.status === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Stable</p>
                  <p className="text-2xl font-bold text-white">
                    {patients.filter(p => p.status === 'stable').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Observation</p>
                  <p className="text-2xl font-bold text-white">
                    {patients.filter(p => p.status === 'observation').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search patients by name or MRN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'critical', 'stable', 'observation', 'discharge'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    onClick={() => setSelectedFilter(filter)}
                    className={selectedFilter === filter 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white" 
                      : "bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
                    }
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg cursor-pointer hover:bg-blue-500/25 transition-colors"
              onClick={() => handlePatientClick(patient)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-sky-300" />
                    <div>
                      <div className="font-semibold">{patient.name}</div>
                      <div className="text-sm text-white/70">{patient.mrn}</div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(patient.status)} text-xs`}>
                    {getStatusIcon(patient.status)}
                    <span className="ml-1">{patient.status.toUpperCase()}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span>{patient.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="h-4 w-4" />
                    <span>{patient.admissionTime}</span>
                  </div>
                </div>
                
                <div className="p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                  <div className="text-sm font-medium text-white mb-1">Condition</div>
                  <div className="text-white/80">{patient.condition}</div>
                  <div className="text-xs text-white/60 mt-1">Attending: {patient.physician}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="h-3 w-3 text-red-300" />
                      <span className="text-xs text-white/70">HR</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{patient.vitals.hr}</div>
                  </div>
                  <div className="text-center p-2 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="h-3 w-3 text-blue-300" />
                      <span className="text-xs text-white/70">BP</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{patient.vitals.bp}</div>
                  </div>
                  <div className="text-center p-2 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Thermometer className="h-3 w-3 text-yellow-300" />
                      <span className="text-xs text-white/70">Temp</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{patient.vitals.temp}°F</div>
                  </div>
                  <div className="text-center p-2 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="h-3 w-3 text-green-300" />
                      <span className="text-xs text-white/70">SpO2</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{patient.vitals.spo2}%</div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                  View Full Chart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientTracker;
