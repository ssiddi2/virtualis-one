
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Microscope,
  FileText,
  TrendingUp,
  Users,
  Beaker,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LISDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const labResults = [
    { id: 1, patient: 'John Smith', test: 'Complete Blood Count', status: 'completed', priority: 'routine', timestamp: '2 hours ago' },
    { id: 2, patient: 'Sarah Johnson', test: 'Liver Function Panel', status: 'pending', priority: 'urgent', timestamp: '30 minutes ago' },
    { id: 3, patient: 'Mike Wilson', test: 'Cardiac Enzymes', status: 'critical', priority: 'stat', timestamp: '15 minutes ago' },
    { id: 4, patient: 'Lisa Davis', test: 'Thyroid Function', status: 'completed', priority: 'routine', timestamp: '4 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      default: return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'urgent': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'routine': return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const handleResultClick = (result: any) => {
    toast({
      title: "Lab Result",
      description: `Viewing ${result.test} for ${result.patient}`,
    });
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white">
                Laboratory Information System
              </h1>
              <p className="text-white/80 text-lg">
                Comprehensive Lab Management & Results
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
                  <p className="text-sm text-white/70">Pending Tests</p>
                  <p className="text-2xl font-bold text-white">23</p>
                </div>
                <Clock className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Completed Today</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Critical Results</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Turnaround Time</p>
                  <p className="text-2xl font-bold text-white">2.4h</p>
                </div>
                <TrendingUp className="h-8 w-8 text-sky-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="results" className="text-white data-[state=active]:bg-white/20">
              <FileText className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="instruments" className="text-white data-[state=active]:bg-white/20">
              <Beaker className="h-4 w-4 mr-2" />
              Instruments
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-white data-[state=active]:bg-white/20">
              <Shield className="h-4 w-4 mr-2" />
              Quality Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Recent Lab Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {labResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{result.patient}</span>
                        <div className="flex gap-2">
                          <Badge className={`text-xs ${getPriorityColor(result.priority)}`}>
                            {result.priority.toUpperCase()}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                            {result.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-white/70">{result.test}</p>
                      <p className="text-xs text-white/50">{result.timestamp}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Lab Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <Beaker className="h-6 w-6 text-sky-300 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">98.2%</div>
                      <div className="text-xs text-white/70">Accuracy Rate</div>
                    </div>
                    <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <Clock className="h-6 w-6 text-green-300 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">2.4h</div>
                      <div className="text-xs text-white/70">Avg. TAT</div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Lab Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {labResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg cursor-pointer hover:bg-blue-500/25 transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="h-4 w-4 text-blue-300" />
                            <span className="font-medium text-white">{result.patient}</span>
                            <Badge className={`text-xs ${getPriorityColor(result.priority)}`}>
                              {result.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-white/80">{result.test}</p>
                          <p className="text-xs text-white/50">{result.timestamp}</p>
                        </div>
                        <Badge className={`${getStatusColor(result.status)}`}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instruments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Hematology Analyzer', 'Chemistry Analyzer', 'Microbiology System'].map((instrument) => (
                <Card key={instrument} className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Microscope className="h-5 w-5 text-sky-300" />
                      {instrument}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Status</span>
                        <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Queue</span>
                        <span className="text-white">5 samples</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Quality Control Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <Shield className="h-8 w-8 text-green-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">99.1%</div>
                    <div className="text-sm text-white/70">QC Pass Rate</div>
                  </div>
                  <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">0.2%</div>
                    <div className="text-sm text-white/70">Error Rate</div>
                  </div>
                  <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">95.8%</div>
                    <div className="text-sm text-white/70">Efficiency</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LISDashboard;
