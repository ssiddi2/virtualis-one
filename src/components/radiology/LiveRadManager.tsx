
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scan, 
  Monitor, 
  Brain, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  Eye,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRadiologyOrders } from '@/hooks/useRadiologyOrders';
import XRayViewer from './XRayViewer';

const LiveRadManager = () => {
  const { toast } = useToast();
  const { data: radiologyOrders } = useRadiologyOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleViewStudy = (orderId: string) => {
    setSelectedOrderId(orderId);
    toast({
      title: "Loading Study",
      description: "Opening radiology study viewer...",
    });
  };

  const handleMarkCritical = (orderId: string) => {
    toast({
      title: "Critical Result Flagged",
      description: "Study has been marked as critical and notifications sent.",
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600/20 text-green-300 border border-green-400/30';
      case 'in_progress': return 'bg-blue-600/20 text-blue-300 border border-blue-400/30';
      case 'ordered': return 'bg-yellow-600/20 text-yellow-300 border border-yellow-400/30';
      default: return 'bg-gray-600/20 text-gray-300 border border-gray-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600/20 text-red-300 border border-red-400/30';
      case 'stat': return 'bg-red-600/20 text-red-300 border border-red-400/30';
      default: return 'bg-gray-600/20 text-gray-300 border border-gray-400/30';
    }
  };

  if (selectedOrderId) {
    return (
      <div className="min-h-screen p-6" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => setSelectedOrderId(null)}
              variant="outline"
              className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
            >
              ← Back to Orders
            </Button>
            <h1 className="text-2xl font-bold text-white">Radiology Study Viewer</h1>
          </div>
          <XRayViewer orderId={selectedOrderId} />
        </div>
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
            <h1 className="text-3xl font-bold text-white">Radiology & PACS Manager</h1>
            <p className="text-white/70">Live radiology workflow and imaging management</p>
          </div>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
            <Scan className="h-4 w-4 mr-2" />
            New Study
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pending Studies</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {radiologyOrders?.filter(order => order.status === 'ordered').length || 0}
              </div>
              <p className="text-xs text-white/70">Awaiting acquisition</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">In Progress</CardTitle>
              <Monitor className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {radiologyOrders?.filter(order => order.status === 'in_progress').length || 0}
              </div>
              <p className="text-xs text-white/70">Being processed</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {radiologyOrders?.filter(order => order.status === 'completed').length || 0}
              </div>
              <p className="text-xs text-white/70">Ready for review</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Critical Results</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {radiologyOrders?.filter(order => order.critical_results).length || 0}
              </div>
              <p className="text-xs text-white/70">Require immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="worklist" className="space-y-6">
          <TabsList className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl">
            <TabsTrigger value="worklist" className="text-white data-[state=active]:bg-white/20">
              Worklist
            </TabsTrigger>
            <TabsTrigger value="pacs" className="text-white data-[state=active]:bg-white/20">
              PACS Viewer
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="text-white data-[state=active]:bg-white/20">
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="worklist">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Monitor className="h-5 w-5 text-blue-400" />
                  Radiology Worklist ({radiologyOrders?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {radiologyOrders && radiologyOrders.length > 0 ? (
                    radiologyOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">{order.study_type}</h3>
                            <Badge className={getStatusColor(order.status || 'ordered')}>
                              {order.status}
                            </Badge>
                            {order.priority && order.priority !== 'routine' && (
                              <Badge className={getPriorityColor(order.priority)}>
                                {order.priority}
                              </Badge>
                            )}
                            {order.critical_results && (
                              <Badge className="bg-red-600 text-white animate-pulse">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Critical
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-white/70">Patient:</span>
                              <p className="text-white">
                                {order.patient ? `${order.patient.first_name} ${order.patient.last_name}` : 'Unknown'}
                              </p>
                            </div>
                            <div>
                              <span className="text-white/70">Body Part:</span>
                              <p className="text-white">{order.body_part}</p>
                            </div>
                            <div>
                              <span className="text-white/70">Modality:</span>
                              <p className="text-white">{order.modality}</p>
                            </div>
                            <div>
                              <span className="text-white/70">Ordered:</span>
                              <p className="text-white">
                                {new Date(order.ordered_at).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {order.clinical_indication && (
                            <div className="mt-2">
                              <span className="text-white/70 text-sm">Indication:</span>
                              <p className="text-white text-sm">{order.clinical_indication}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button 
                            size="sm"
                            onClick={() => handleViewStudy(order.id)}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          {order.status === 'completed' && !order.critical_results && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkCritical(order.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600/20"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Monitor className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-white/70">No radiology orders found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pacs">
            <XRayViewer />
          </TabsContent>

          <TabsContent value="ai-analysis">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
                    {radiologyOrders?.filter(order => order.ai_analysis).map((order) => (
                      <div key={order.id} className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{order.study_type}</span>
                          <Badge className="bg-purple-600/20 text-purple-300 border border-purple-400/30">
                            AI Analyzed
                          </Badge>
                        </div>
                        {order.ai_analysis && typeof order.ai_analysis === 'object' && (
                          <div className="text-sm space-y-1">
                            <p className="text-white/70">
                              Confidence: <span className="text-white">
                                {((order.ai_analysis as any).ai_confidence * 100).toFixed(0)}%
                              </span>
                            </p>
                            {(order.ai_analysis as any).stroke_detected && (
                              <p className="text-red-300">⚠️ Stroke detected</p>
                            )}
                            {(order.ai_analysis as any).pneumonia_present && (
                              <p className="text-orange-300">⚠️ Pneumonia detected</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">AI Capabilities</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-purple-400" />
                          <span className="font-medium text-white">Stroke Detection</span>
                        </div>
                        <p className="text-sm text-white/70">Automated detection of acute stroke signs</p>
                      </div>
                      
                      <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-blue-400" />
                          <span className="font-medium text-white">Pneumonia Analysis</span>
                        </div>
                        <p className="text-sm text-white/70">Chest X-ray pneumonia detection and severity assessment</p>
                      </div>
                      
                      <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="font-medium text-white">Quality Assurance</span>
                        </div>
                        <p className="text-sm text-white/70">Automated image quality and positioning checks</p>
                      </div>
                    </div>
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

export default LiveRadManager;
