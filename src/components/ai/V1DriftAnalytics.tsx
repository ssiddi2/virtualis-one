
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Activity, 
  Clock, 
  Users, 
  FileText, 
  TestTube, 
  Pill,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsData {
  totalCommands: number;
  avgResponseTime: number;
  activeUsers: number;
  successfulActions: number;
  topCommands: Array<{ command: string; count: number; category: string }>;
  usageByHour: Array<{ hour: number; commands: number }>;
  usageByRole: Array<{ role: string; commands: number; color: string }>;
}

const V1DriftAnalytics = ({ hospitalId }: { hospitalId: string }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    // Mock analytics data - replace with actual API call
    const mockData: AnalyticsData = {
      totalCommands: 1247,
      avgResponseTime: 1.8,
      activeUsers: 23,
      successfulActions: 1198,
      topCommands: [
        { command: "Write progress note", count: 156, category: "Documentation" },
        { command: "Review lab results", count: 134, category: "Labs" },
        { command: "Check medication interactions", count: 98, category: "Medications" },
        { command: "Notify care team", count: 87, category: "Communication" },
        { command: "Summary vital signs", count: 76, category: "Vitals" }
      ],
      usageByHour: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        commands: Math.floor(Math.random() * 50) + 10
      })),
      usageByRole: [
        { role: "Physician", commands: 467, color: "#3b82f6" },
        { role: "Nurse", commands: 389, color: "#10b981" },
        { role: "Pharmacist", commands: 234, color: "#f59e0b" },
        { role: "Administrator", commands: 157, color: "#8b5cf6" }
      ]
    };
    
    setAnalyticsData(mockData);
  }, [hospitalId, timeframe]);

  if (!analyticsData) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  const commandIcons: { [key: string]: any } = {
    "Documentation": FileText,
    "Labs": TestTube,
    "Medications": Pill,
    "Communication": Users,
    "Vitals": Activity
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">V1 Drift Analytics</h1>
            <p className="text-white/70">Clinical AI Assistant Usage Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(['24h', '7d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                timeframe === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Commands</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalCommands.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">{analyticsData.avgResponseTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{analyticsData.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round((analyticsData.successfulActions / analyticsData.totalCommands) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="usage" className="data-[state=active]:bg-slate-700">Usage Patterns</TabsTrigger>
          <TabsTrigger value="commands" className="data-[state=active]:bg-slate-700">Top Commands</TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-slate-700">Usage by Role</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Commands by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.usageByHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commands" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commands" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Most Used Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topCommands.map((cmd, index) => {
                  const IconComponent = commandIcons[cmd.category] || Activity;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{cmd.command}</p>
                          <p className="text-white/60 text-sm">{cmd.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{cmd.count}</p>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                          {Math.round((cmd.count / analyticsData.totalCommands) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Usage by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.usageByRole}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="role" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="commands" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default V1DriftAnalytics;
