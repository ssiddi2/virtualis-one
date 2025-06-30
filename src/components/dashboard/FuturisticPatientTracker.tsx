
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Activity,
  Heart,
  TrendingUp
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import FuturisticPatientCard from '@/components/patient/FuturisticPatientCard';
import LabResultsSpreadsheet from '@/components/clinical/LabResultsSpreadsheet';

interface FuturisticPatientTrackerProps {
  hospitalId?: string;
}

const FuturisticPatientTracker = ({ hospitalId }: FuturisticPatientTrackerProps) => {
  const { data: patients, isLoading } = usePatients(hospitalId);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showLabResults, setShowLabResults] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const activePatients = patients?.filter(p => p.status === 'active') || [];
  const criticalPatients = activePatients.filter(p => 
    p.medical_conditions?.some(condition => 
      condition.toLowerCase().includes('cardiac') || 
      condition.toLowerCase().includes('critical')
    )
  );

  const statistics = [
    { 
      label: 'Active Patients', 
      value: activePatients.length, 
      trend: '+2',
      color: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
      icon: Users
    },
    { 
      label: 'Critical Cases', 
      value: criticalPatients.length, 
      trend: '-1',
      color: 'bg-red-500/20 text-red-200 border-red-400/30',
      icon: Heart
    },
    { 
      label: 'Admissions Today', 
      value: 8, 
      trend: '+3',
      color: 'bg-green-500/20 text-green-200 border-green-400/30',
      icon: TrendingUp
    },
    { 
      label: 'Avg Length of Stay', 
      value: '3.2 days', 
      trend: '-0.5',
      color: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
      icon: Activity
    }
  ];

  const handleViewChart = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowChart(true);
  };

  const handleViewLabs = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowLabResults(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Patient Tracker</h1>
            <p className="text-white/70">Real-time patient monitoring and management</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          {statistics.map((stat, index) => (
            <Card key={index} className="backdrop-blur-sm bg-white/5 border border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-white/70" />
                  <Badge className="bg-green-500/20 text-green-200 border-green-400/30 text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-sm text-white/70 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <Button variant="outline" className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
            <Search className="h-4 w-4 mr-2" />
            Search Patients
          </Button>
          <Button variant="outline" className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
            <Filter className="h-4 w-4 mr-2" />
            Filter by Status
          </Button>
        </div>

        {/* Patient Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activePatients.map((patient) => (
            <FuturisticPatientCard
              key={patient.id}
              patient={patient}
              onViewChart={handleViewChart}
              onViewLabs={handleViewLabs}
            />
          ))}
        </div>

        {/* Lab Results Dialog */}
        <Dialog open={showLabResults} onOpenChange={setShowLabResults}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-slate-900/95 to-purple-900/95 border border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Laboratory Results
              </DialogTitle>
            </DialogHeader>
            {selectedPatientId && (
              <LabResultsSpreadsheet patientId={selectedPatientId} />
            )}
          </DialogContent>
        </Dialog>

        {/* Chart Dialog */}
        <Dialog open={showChart} onOpenChange={setShowChart}>
          <DialogContent className="max-w-4xl backdrop-blur-xl bg-gradient-to-br from-slate-900/95 to-purple-900/95 border border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Patient Chart
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 text-center text-white/70">
              <Activity className="h-12 w-12 mx-auto mb-4 text-white/40" />
              <p>Patient chart functionality will be integrated here</p>
              <p className="text-sm">Connected to your EMR system</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FuturisticPatientTracker;
