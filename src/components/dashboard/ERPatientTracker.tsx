
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
  Heart,
  Thermometer,
  Droplets,
  Wind,
  RefreshCw
} from 'lucide-react';

interface ERPatientTrackerProps {
  hospitalId?: string;
}

const ERPatientTracker: React.FC<ERPatientTrackerProps> = ({ hospitalId }) => {
  const { toast } = useToast();
  const { data: patients, isLoading } = usePatients();
  const [refreshing, setRefreshing] = useState(false);

  const mockERPatients = [
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      chiefComplaint: 'Chest pain',
      acuity: 2,
      arrivalTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      room: 'ER-101',
      vitals: { bp: '140/90', hr: 88, temp: 98.6, spo2: 96 },
      status: 'In Treatment'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      age: 28,
      chiefComplaint: 'Severe headache',
      acuity: 3,
      arrivalTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      room: 'ER-102',
      vitals: { bp: '120/80', hr: 72, temp: 99.1, spo2: 98 },
      status: 'Awaiting Results'
    },
    {
      id: '3',
      name: 'Michael Brown',
      age: 65,
      chiefComplaint: 'Difficulty breathing',
      acuity: 1,
      arrivalTime: new Date(Date.now() - 30 * 60 * 1000),
      room: 'ER-103',
      vitals: { bp: '160/95', hr: 110, temp: 100.2, spo2: 89 },
      status: 'Critical'
    }
  ];

  const getAcuityColor = (acuity: number) => {
    switch (acuity) {
      case 1: return 'bg-red-600 text-white';
      case 2: return 'bg-orange-600 text-white';
      case 3: return 'bg-yellow-600 text-white';
      case 4: return 'bg-green-600 text-white';
      case 5: return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getAcuityIcon = (acuity: number) => {
    if (acuity <= 2) return <AlertTriangle className="h-4 w-4" />;
    if (acuity <= 3) return <Clock className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
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
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Emergency Department Tracker</h1>
            <p className="text-white/70">Real-time patient monitoring and bed management</p>
            {hospitalId && (
              <p className="text-white/50 text-sm">Hospital ID: {hospitalId}</p>
            )}
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-xl"
          >
            {refreshing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
              <User className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockERPatients.length}</div>
              <p className="text-xs text-white/60">Currently in ED</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {mockERPatients.filter(p => p.acuity <= 2).length}
              </div>
              <p className="text-xs text-white/60">High priority cases</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">45m</div>
              <p className="text-xs text-white/60">Current average</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Bed Capacity</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">85%</div>
              <p className="text-xs text-white/60">17 of 20 beds occupied</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <div className="grid gap-4">
          {mockERPatients.map((patient) => (
            <Card key={patient.id} className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      <div>
                        <h3 className="text-white font-semibold">{patient.name}</h3>
                        <p className="text-slate-400 text-sm">Age: {patient.age} | Room: {patient.room}</p>
                      </div>
                    </div>
                    <Badge className={`${getAcuityColor(patient.acuity)} flex items-center gap-1`}>
                      {getAcuityIcon(patient.acuity)}
                      Acuity {patient.acuity}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-white border-slate-600">
                      {patient.status}
                    </Badge>
                    <p className="text-slate-400 text-xs mt-1">
                      Arrived: {patient.arrivalTime.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">Chief Complaint</p>
                    <p className="text-white font-medium">{patient.chiefComplaint}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-red-400" />
                    <div>
                      <p className="text-slate-400 text-xs">Blood Pressure</p>
                      <p className="text-white font-medium">{patient.vitals.bp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    <div>
                      <p className="text-slate-400 text-xs">Heart Rate</p>
                      <p className="text-white font-medium">{patient.vitals.hr} bpm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-400" />
                    <div>
                      <p className="text-slate-400 text-xs">Temperature</p>
                      <p className="text-white font-medium">{patient.vitals.temp}°F</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-slate-400 text-xs">Oxygen Sat</p>
                      <p className="text-white font-medium">{patient.vitals.spo2}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ERPatientTracker;
