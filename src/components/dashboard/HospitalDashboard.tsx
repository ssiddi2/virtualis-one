
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Activity, 
  Heart, 
  TestTube, 
  Brain, 
  Calendar,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  Stethoscope
} from "lucide-react";

interface HospitalDashboardProps {
  hospitalId: string;
  user: any;
  onBack: () => void;
}

const mockHospitalData = {
  '1': {
    name: 'St. Mary\'s General Hospital',
    location: 'San Francisco, CA',
    emrType: 'Epic',
    stats: {
      totalPatients: 1247,
      activePatients: 89,
      todayAdmissions: 12,
      criticalPatients: 3,
      pendingLabs: 24,
      completedScans: 45,
      aiAlerts: 2
    },
    recentActivity: [
      { time: '2 min ago', action: 'New patient admitted', patient: 'John Doe', room: 'ICU-301' },
      { time: '8 min ago', action: 'Lab results ready', patient: 'Sarah Smith', type: 'Blood Panel' },
      { time: '15 min ago', action: 'AI Alert: Critical vitals', patient: 'Mike Johnson', priority: 'HIGH' }
    ],
    quickStats: [
      { label: 'Avg Wait Time', value: '12 min', trend: 'down', color: 'text-green-400' },
      { label: 'Bed Occupancy', value: '87%', trend: 'up', color: 'text-yellow-400' },
      { label: 'Staff Efficiency', value: '94%', trend: 'up', color: 'text-green-400' },
      { label: 'Patient Satisfaction', value: '4.8/5', trend: 'up', color: 'text-green-400' }
    ]
  },
  '2': {
    name: 'Regional Medical Center',
    location: 'Los Angeles, CA',
    emrType: 'Cerner',
    stats: {
      totalPatients: 892,
      activePatients: 67,
      todayAdmissions: 8,
      criticalPatients: 5,
      pendingLabs: 18,
      completedScans: 32,
      aiAlerts: 4
    },
    recentActivity: [
      { time: '1 min ago', action: 'Surgery completed', patient: 'Emma Wilson', room: 'OR-2' },
      { time: '5 min ago', action: 'Radiology scan ready', patient: 'Robert Davis', type: 'CT Scan' },
      { time: '12 min ago', action: 'Patient discharged', patient: 'Lisa Brown', priority: 'NORMAL' }
    ],
    quickStats: [
      { label: 'Avg Wait Time', value: '15 min', trend: 'up', color: 'text-yellow-400' },
      { label: 'Bed Occupancy', value: '92%', trend: 'up', color: 'text-red-400' },
      { label: 'Staff Efficiency', value: '91%', trend: 'down', color: 'text-yellow-400' },
      { label: 'Patient Satisfaction', value: '4.6/5', trend: 'up', color: 'text-green-400' }
    ]
  }
};

const HospitalDashboard = ({ hospitalId, user, onBack }: HospitalDashboardProps) => {
  const navigate = useNavigate();
  const [hospitalData, setHospitalData] = useState(mockHospitalData[hospitalId as keyof typeof mockHospitalData]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setHospitalData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          activePatients: prev.stats.activePatients + Math.floor(Math.random() * 3) - 1
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!hospitalData) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6">
        <div className="text-center">
          <h1 className="text-2xl text-white">Hospital not found</h1>
          <Button onClick={onBack} className="mt-4 glass-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to EMR Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" className="glass-nav-item border-white/20 hover:border-virtualis-gold/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to EMR Selection
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text tech-font">{hospitalData.name}</h1>
              <p className="text-white/70 tech-font">{hospitalData.location} • {hospitalData.emrType} EMR</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/ai-assistant')} className="glass-button">
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <div className="glass-badge success">
              <Activity className="h-4 w-4 mr-1" />
              LIVE
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Active Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{hospitalData.stats.activePatients}</div>
              <p className="text-white/60 text-sm">of {hospitalData.stats.totalPatients} total</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                Critical Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{hospitalData.stats.criticalPatients}</div>
              <p className="text-white/60 text-sm">require attention</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <TestTube className="h-5 w-5 text-green-400" />
                Lab Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{hospitalData.stats.completedScans}</div>
              <p className="text-white/60 text-sm">{hospitalData.stats.pendingLabs} pending</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Brain className="h-5 w-5 text-virtualis-gold" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-virtualis-gold">{hospitalData.stats.aiAlerts}</div>
              <p className="text-white/60 text-sm">alerts today</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => navigate('/patients')} className="w-full glass-button">
                <Users className="h-4 w-4 mr-2" />
                Patient Charts
              </Button>
              <Button onClick={() => navigate('/admission')} className="w-full glass-button">
                <FileText className="h-4 w-4 mr-2" />
                New Admission
              </Button>
              <Button onClick={() => navigate('/laboratory')} className="w-full glass-button">
                <TestTube className="h-4 w-4 mr-2" />
                Laboratory
              </Button>
              <Button onClick={() => navigate('/liverad')} className="w-full glass-button">
                <Brain className="h-4 w-4 mr-2" />
                LiveRad AI
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Activity className="h-5 w-5 text-virtualis-gold" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hospitalData.recentActivity?.map((activity, index) => (
                <div key={index} className="p-3 glass-nav-item">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{activity.action}</span>
                    <span className="text-white/60 text-xs">{activity.time}</span>
                  </div>
                  <p className="text-white/80 text-sm">{activity.patient}</p>
                  {activity.priority === 'HIGH' && (
                    <Badge className="glass-badge error mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      HIGH PRIORITY
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hospitalData.quickStats?.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-2 glass-nav-item">
                  <span className="text-white/70 text-sm">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                    <TrendingUp className={`h-3 w-3 ${stat.color}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Integration */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white tech-font flex items-center gap-2">
              <Brain className="h-6 w-6 text-virtualis-gold pulse-glow" />
              Clinical AI Assistant - Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => navigate('/ai-assistant')} className="glass-button">
                <Stethoscope className="h-4 w-4 mr-2" />
                Generate Clinical Note
              </Button>
              <Button className="glass-button">
                <Brain className="h-4 w-4 mr-2" />
                AI Diagnosis Assistant
              </Button>
              <Button className="glass-button">
                <Calendar className="h-4 w-4 mr-2" />
                Treatment Recommendations
              </Button>
            </div>
            <div className="mt-4 p-3 glass-nav-item">
              <p className="text-white/70 text-sm tech-font">
                💡 AI Assistant has analyzed {hospitalData.stats.activePatients} active patients and identified {hospitalData.stats.aiAlerts} priority cases requiring attention.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalDashboard;
