
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  Bed,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building,
  UserCheck,
  Calendar,
  BarChart3,
  Shield,
  Heart
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useClinicalOrders } from '@/hooks/useClinicalOrders';

const HospitalCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('census');
  const { data: patients } = usePatients();
  const { data: clinicalOrders } = useClinicalOrders();

  // Mock real-time data that would come from hospital systems
  const hospitalMetrics = {
    totalBeds: 250,
    occupiedBeds: 186,
    availableBeds: 64,
    icuBeds: { total: 40, occupied: 32, available: 8 },
    erBeds: { total: 30, occupied: 24, available: 6 },
    surgicalSuites: { total: 12, occupied: 8, available: 4 },
    avgLOS: 4.2,
    dischargesPlanned: 23,
    admissionsPending: 15,
    transferRequests: 7,
    criticalAlerts: 12,
    safetyConcerns: 3,
    staffingRatio: 0.85 // 85% staffed
  };

  const departmentStatus = [
    { name: 'Emergency Department', capacity: 95, alerts: 3, color: 'bg-red-500' },
    { name: 'ICU', capacity: 80, alerts: 5, color: 'bg-orange-500' },
    { name: 'Medical/Surgical', capacity: 72, alerts: 2, color: 'bg-yellow-500' },
    { name: 'Pediatrics', capacity: 45, alerts: 0, color: 'bg-green-500' },
    { name: 'Maternity', capacity: 60, alerts: 1, color: 'bg-blue-500' },
    { name: 'Surgery', capacity: 67, alerts: 1, color: 'bg-purple-500' }
  ];

  const qualityMetrics = [
    { name: 'Patient Satisfaction', value: 4.3, target: 4.5, trend: 'up' },
    { name: 'Readmission Rate', value: 8.2, target: 7.5, trend: 'down' },
    { name: 'Hospital Acquired Infections', value: 2.1, target: 2.0, trend: 'stable' },
    { name: 'Mortality Index', value: 0.89, target: 0.85, trend: 'down' },
    { name: 'Length of Stay', value: 4.2, target: 4.0, trend: 'up' }
  ];

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return 'bg-red-500';
    if (capacity >= 80) return 'bg-orange-500';
    if (capacity >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-blue-400" />;
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
            <h1 className="text-2xl font-bold text-white">Hospital Command Center</h1>
            <p className="text-white/70">Real-time hospital operations and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-red-600 text-white">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {hospitalMetrics.criticalAlerts} Critical Alerts
            </Badge>
            <Badge className="bg-yellow-600 text-white">
              <Shield className="h-4 w-4 mr-1" />
              {hospitalMetrics.safetyConcerns} Safety Concerns
            </Badge>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{hospitalMetrics.occupiedBeds}</div>
            <div className="text-xs text-white/70">Occupied Beds</div>
            <div className="text-xs text-green-400">{hospitalMetrics.availableBeds} available</div>
          </div>
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{hospitalMetrics.icuBeds.occupied}</div>
            <div className="text-xs text-white/70">ICU Occupied</div>
            <div className="text-xs text-red-400">{hospitalMetrics.icuBeds.available} available</div>
          </div>
          <div className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{hospitalMetrics.erBeds.occupied}</div>
            <div className="text-xs text-white/70">ER Occupied</div>
            <div className="text-xs text-yellow-400">{hospitalMetrics.erBeds.available} available</div>
          </div>
          <div className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{hospitalMetrics.dischargesPlanned}</div>
            <div className="text-xs text-white/70">Discharges Today</div>
          </div>
          <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{hospitalMetrics.admissionsPending}</div>
            <div className="text-xs text-white/70">Pending Admits</div>
          </div>
          <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{(hospitalMetrics.staffingRatio * 100).toFixed(0)}%</div>
            <div className="text-xs text-white/70">Staffing Level</div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-blue-600/20 border border-blue-400/30 rounded-lg">
            <TabsTrigger value="census" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Patient Census
            </TabsTrigger>
            <TabsTrigger value="capacity" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Bed className="h-4 w-4 mr-2" />
              Bed Management
            </TabsTrigger>
            <TabsTrigger value="departments" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Building className="h-4 w-4 mr-2" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Quality Metrics
            </TabsTrigger>
            <TabsTrigger value="operations" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Operations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="census" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Current Census
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{hospitalMetrics.occupiedBeds}</div>
                    <div className="text-white/60">Total Patients</div>
                  </div>
                  <Progress value={(hospitalMetrics.occupiedBeds / hospitalMetrics.totalBeds) * 100} className="w-full" />
                  <div className="text-center text-white/60 text-sm">
                    {((hospitalMetrics.occupiedBeds / hospitalMetrics.totalBeds) * 100).toFixed(1)}% Occupancy
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Average Length of Stay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{hospitalMetrics.avgLOS}</div>
                    <div className="text-white/60">Days</div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                    <TrendingUp className="h-4 w-4 text-red-400" />
                    +0.3 from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Admissions:</span>
                    <span className="font-bold">18</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Discharges:</span>
                    <span className="font-bold">15</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Transfers:</span>
                    <span className="font-bold">7</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Pending:</span>
                    <span className="font-bold text-yellow-400">{hospitalMetrics.admissionsPending}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capacity" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Real-Time Bed Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Medical/Surgical Units</h3>
                    {['3A', '3B', '4A', '4B', '5A', '5B'].map((unit) => (
                      <div key={unit} className="flex items-center justify-between p-2 bg-blue-600/10 border border-blue-400/30 rounded">
                        <span className="text-white">Unit {unit}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm">28/32</span>
                          <div className={`w-3 h-3 rounded-full ${getCapacityColor(87)}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Critical Care</h3>
                    {['ICU', 'CCU', 'SICU', 'NICU'].map((unit) => (
                      <div key={unit} className="flex items-center justify-between p-2 bg-blue-600/10 border border-blue-400/30 rounded">
                        <span className="text-white">{unit}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm">8/10</span>
                          <div className={`w-3 h-3 rounded-full ${getCapacityColor(80)}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Specialty Units</h3>
                    {['Labor & Delivery', 'Pediatrics', 'Psychiatry', 'Rehabilitation'].map((unit) => (
                      <div key={unit} className="flex items-center justify-between p-2 bg-blue-600/10 border border-blue-400/30 rounded">
                        <span className="text-white">{unit}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm">6/12</span>
                          <div className={`w-3 h-3 rounded-full ${getCapacityColor(50)}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentStatus.map((dept) => (
                <Card key={dept.name} className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center justify-between">
                      {dept.name}
                      {dept.alerts > 0 && (
                        <Badge className="bg-red-600 text-white">
                          {dept.alerts} alerts
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Capacity:</span>
                      <span className="text-white font-bold">{dept.capacity}%</span>
                    </div>
                    <Progress value={dept.capacity} className="w-full" />
                    <div className={`w-full h-2 rounded-full ${dept.color}`}></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quality & Safety Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.name} className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-400/30 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{metric.name}</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-white font-bold">{metric.value}</div>
                          <div className="text-white/60 text-sm">Target: {metric.target}</div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          metric.value <= metric.target ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Surgical Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-white">
                    <span>OR Suites Available:</span>
                    <span className="font-bold">{hospitalMetrics.surgicalSuites.available}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Cases Today:</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Cases Remaining:</span>
                    <span className="font-bold">8</span>
                  </div>
                  <Progress value={(hospitalMetrics.surgicalSuites.occupied / hospitalMetrics.surgicalSuites.total) * 100} />
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Staffing Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-white">
                    <span>Overall Staffing:</span>
                    <span className="font-bold">{(hospitalMetrics.staffingRatio * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Nursing:</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Physicians:</span>
                    <span className="font-bold">88%</span>
                  </div>
                  <Progress value={hospitalMetrics.staffingRatio * 100} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HospitalCommandCenter;
