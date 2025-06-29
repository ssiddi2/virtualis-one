import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Target,
  AlertTriangle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface RevenueAnalyticsProps {
  hospitalId: string;
}

const RevenueAnalytics = ({ hospitalId }: RevenueAnalyticsProps) => {
  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 1200000, collections: 1100000, denials: 45000 },
    { month: 'Feb', revenue: 1350000, collections: 1250000, denials: 38000 },
    { month: 'Mar', revenue: 1180000, collections: 1080000, denials: 52000 },
    { month: 'Apr', revenue: 1420000, collections: 1320000, denials: 41000 },
    { month: 'May', revenue: 1380000, collections: 1290000, denials: 35000 },
    { month: 'Jun', revenue: 1450000, collections: 1380000, denials: 29000 }
  ];

  const denialReasons = [
    { name: 'Missing Info', value: 35, color: '#ef4444' },
    { name: 'Auth Required', value: 28, color: '#f97316' },
    { name: 'Coding Error', value: 22, color: '#eab308' },
    { name: 'Duplicate', value: 15, color: '#3b82f6' }
  ];

  const predictiveMetrics = [
    {
      title: 'Predicted Revenue Loss',
      value: '$125,000',
      change: '-12%',
      trend: 'down',
      description: 'Next 30 days if current denial trend continues'
    },
    {
      title: 'Collection Opportunity',
      value: '$89,000',
      change: '+8%',
      trend: 'up',
      description: 'Recoverable amount from pending appeals'
    },
    {
      title: 'Days in A/R',
      value: '42.5',
      change: '-2.1',
      trend: 'up',
      description: 'Average days in accounts receivable'
    },
    {
      title: 'Cash Flow Risk',
      value: 'Medium',
      change: 'Stable',
      trend: 'neutral',
      description: 'Based on current payment patterns'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {predictiveMetrics.map((metric, index) => (
          <Card key={index} className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-white/70">{metric.title}</h3>
                {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-300" />}
                {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-300" />}
                {metric.trend === 'neutral' && <Target className="h-4 w-4 text-yellow-300" />}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
              <div className="flex items-center gap-2">
                <Badge className={
                  metric.trend === 'up' ? 'bg-green-500/20 text-green-200 border-green-400/30' :
                  metric.trend === 'down' ? 'bg-red-500/20 text-red-200 border-red-400/30' :
                  'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
                }>
                  {metric.change}
                </Badge>
              </div>
              <p className="text-xs text-white/60 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue Cycle Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.3} />
              <XAxis dataKey="month" stroke="#93c5fd" />
              <YAxis stroke="#93c5fd" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(30, 64, 175, 0.8)',
                  border: '1px solid rgba(147, 197, 253, 0.3)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Gross Revenue" />
              <Line type="monotone" dataKey="collections" stroke="#3b82f6" strokeWidth={3} name="Collections" />
              <Line type="monotone" dataKey="denials" stroke="#ef4444" strokeWidth={3} name="Denials" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Denial Analysis */}
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Denial Reasons Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={denialReasons}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {denialReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(30, 64, 175, 0.8)',
                    border: '1px solid rgba(147, 197, 253, 0.3)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {denialReasons.map((reason, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: reason.color }}
                    />
                    <span className="text-white text-sm">{reason.name}</span>
                  </div>
                  <span className="text-white/70 text-sm">{reason.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              AI Revenue Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-purple-600/20 border border-purple-400/30 rounded-lg">
              <h4 className="text-white font-semibold text-sm mb-1">High Priority</h4>
              <p className="text-white/80 text-sm">Address missing documentation for procedure code 99213. Potential recovery: $45,000</p>
            </div>
            <div className="p-3 bg-yellow-600/20 border border-yellow-400/30 rounded-lg">
              <h4 className="text-white font-semibold text-sm mb-1">Medium Priority</h4>
              <p className="text-white/80 text-sm">Optimize prior authorization workflow. Could reduce denials by 15%</p>
            </div>
            <div className="p-3 bg-blue-600/20 border border-blue-400/30 rounded-lg">
              <h4 className="text-white font-semibold text-sm mb-1">Process Improvement</h4>
              <p className="text-white/80 text-sm">Implement real-time eligibility verification to reduce claim rejections</p>
            </div>
            <div className="p-3 bg-green-600/20 border border-green-400/30 rounded-lg">
              <h4 className="text-white font-semibold text-sm mb-1">Success Metric</h4>
              <p className="text-white/80 text-sm">Collection rate improved by 8% this month vs. previous month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
