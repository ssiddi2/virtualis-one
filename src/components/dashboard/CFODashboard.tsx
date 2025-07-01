
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Brain,
  Target,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface CFODashboardProps {
  hospitalId: string;
}

const CFODashboard = ({ hospitalId }: CFODashboardProps) => {
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('12-month');

  // Mock financial projection data
  const revenueProjections = [
    { month: 'Jan 2024', actual: 1200000, projected: 1180000, confidence: 94 },
    { month: 'Feb 2024', actual: 1150000, projected: 1160000, confidence: 92 },
    { month: 'Mar 2024', actual: 1300000, projected: 1280000, confidence: 96 },
    { month: 'Apr 2024', actual: 1250000, projected: 1240000, confidence: 95 },
    { month: 'May 2024', actual: 1180000, projected: 1190000, confidence: 93 },
    { month: 'Jun 2024', actual: 1320000, projected: 1310000, confidence: 97 },
    { month: 'Jul 2024', projected: 1280000, confidence: 94 },
    { month: 'Aug 2024', projected: 1350000, confidence: 92 },
    { month: 'Sep 2024', projected: 1290000, confidence: 91 },
    { month: 'Oct 2024', projected: 1400000, confidence: 89 },
    { month: 'Nov 2024', projected: 1320000, confidence: 88 },
    { month: 'Dec 2024', projected: 1450000, confidence: 87 }
  ];

  const payerMixData = [
    { name: 'Medicare', value: 35, amount: 4200000, color: '#3B82F6' },
    { name: 'Medicaid', value: 25, amount: 3000000, color: '#10B981' },
    { name: 'Commercial', value: 30, amount: 3600000, color: '#F59E0B' },
    { name: 'Self-Pay', value: 10, amount: 1200000, color: '#EF4444' }
  ];

  const denialTrends = [
    { month: 'Jan', denialRate: 8.5, recoveryRate: 85 },
    { month: 'Feb', denialRate: 7.2, recoveryRate: 88 },
    { month: 'Mar', denialRate: 6.8, recoveryRate: 92 },
    { month: 'Apr', denialRate: 7.5, recoveryRate: 87 },
    { month: 'May', denialRate: 6.1, recoveryRate: 94 },
    { month: 'Jun', denialRate: 5.8, recoveryRate: 96 }
  ];

  const handleGenerateExecutiveReport = async () => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      toast({
        title: "Executive Report Generated",
        description: "12-month financial projection report with CFO insights ready for download.",
      });
      setIsGeneratingReport(false);
      
      // Simulate file download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Executive Financial Report - 12 Month Projections'));
      element.setAttribute('download', `CFO_Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProjectedAnnualRevenue = () => {
    return revenueProjections.reduce((sum, month) => sum + (month.projected || month.actual || 0), 0);
  };

  const getAverageConfidence = () => {
    const totalConfidence = revenueProjections.reduce((sum, month) => sum + month.confidence, 0);
    return Math.round(totalConfidence / revenueProjections.length);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">CFO Financial Dashboard</h1>
                  <p className="text-white/70">Strategic financial insights and 12-month projections</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerateExecutiveReport}
                  disabled={isGeneratingReport}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                >
                  {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Executive Report
                </Button>
              </div>
            </div>

            {/* Executive KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Projected Annual Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(getProjectedAnnualRevenue())}</div>
                  <p className="text-xs text-green-200 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +8.5% vs last year
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Forecast Confidence</CardTitle>
                  <Target className="h-4 w-4 text-blue-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{getAverageConfidence()}%</div>
                  <p className="text-xs text-white/60">AI-powered accuracy</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Collection Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">94.2%</div>
                  <p className="text-xs text-green-200 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2.1% improvement
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Days in A/R</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">32</div>
                  <p className="text-xs text-orange-200 flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -3 days vs target
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Financial Projections Chart */}
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-blue-300" />
                  12-Month Revenue Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueProjections}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff80" />
                      <YAxis stroke="#ffffff80" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e3a8a', 
                          border: '1px solid #3b82f6', 
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="Actual Revenue"
                        connectNulls={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="projected" 
                        stroke="#F59E0B" 
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name="Projected Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="payer-mix" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <TabsTrigger value="payer-mix" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Payer Mix Analysis
                </TabsTrigger>
                <TabsTrigger value="denial-trends" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Denial Trends
                </TabsTrigger>
                <TabsTrigger value="roi-analysis" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  ROI Analysis
                </TabsTrigger>
                <TabsTrigger value="risk-assessment" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Risk Assessment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="payer-mix" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Payer Mix Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={payerMixData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {payerMixData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number, name: string) => [`${value}%`, name]}
                              contentStyle={{ 
                                backgroundColor: '#1e3a8a', 
                                border: '1px solid #3b82f6', 
                                borderRadius: '8px',
                                color: 'white'
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Payer Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {payerMixData.map((payer) => (
                        <div key={payer.name} className="flex items-center justify-between p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: payer.color }}
                            />
                            <span className="text-white font-medium">{payer.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{formatCurrency(payer.amount)}</div>
                            <div className="text-white/60 text-sm">{payer.value}% of volume</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="denial-trends" className="space-y-4">
                <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Denial Rate & Recovery Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={denialTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis dataKey="month" stroke="#ffffff80" />
                          <YAxis stroke="#ffffff80" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e3a8a', 
                              border: '1px solid #3b82f6', 
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Bar dataKey="denialRate" fill="#EF4444" name="Denial Rate %" />
                          <Bar dataKey="recoveryRate" fill="#10B981" name="Recovery Rate %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roi-analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Technology ROI</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                        <h4 className="font-medium text-white mb-2">AI Coding Implementation</h4>
                        <div className="flex justify-between">
                          <span className="text-white/70">Annual Savings:</span>
                          <span className="text-green-300 font-semibold">$540K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Implementation Cost:</span>
                          <span className="text-white">$180K</span>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-blue-400/30">
                          <span className="text-white font-medium">ROI:</span>
                          <span className="text-green-300 font-bold">300%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Process Improvements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Denial Management Optimization</h4>
                        <div className="flex justify-between">
                          <span className="text-white/70">Recovery Improvement:</span>
                          <span className="text-green-300 font-semibold">+$420K/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Reduced Appeals:</span>
                          <span className="text-white">-35%</span>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-blue-400/30">
                          <span className="text-white font-medium">Net Benefit:</span>
                          <span className="text-green-300 font-bold">$420K</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="risk-assessment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        Low Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-white/80">
                        <p>• Stable payer contracts</p>
                        <p>• Strong collection rates</p>
                        <p>• Consistent volume</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <AlertTriangle className="h-5 w-5 text-yellow-300" />
                        Medium Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-white/80">
                        <p>• Seasonal volume fluctuations</p>
                        <p>• Pending payer negotiations</p>
                        <p>• Staffing constraints</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Brain className="h-5 w-5 text-purple-300" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-white/80">
                        <p>• Optimize Q4 revenue capture</p>
                        <p>• Focus on commercial payer mix</p>
                        <p>• Enhance coding specificity</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CFODashboard;
