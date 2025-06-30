import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Phone, Users, Activity, Brain, Stethoscope, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import ConsolidatedConsultDialog from './ConsolidatedConsultDialog';
import StreamlinedMessageDialog from './StreamlinedMessageDialog';
import FloatingActionButton from './FloatingActionButton';
import { useToast } from '@/hooks/use-toast';

interface VirtualisChatLayoutProps {
  hospitalId?: string;
}

const VirtualisChatLayout = ({ hospitalId }: VirtualisChatLayoutProps) => {
  const [showConsultDialog, setShowConsultDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const recentMessages = [
    {
      id: 1,
      type: 'consult',
      patient: 'Sarah Johnson',
      specialty: 'Cardiology',
      priority: 'critical',
      acuity: 'critical',
      time: '2 min ago',
      preview: 'Chest pain, elevated troponins, need urgent cardiology consult'
    },
    {
      id: 2,
      type: 'message',
      recipient: 'Nursing Team',
      priority: 'moderate',
      acuity: 'moderate',
      time: '5 min ago',
      preview: 'Patient in room 302 requesting pain medication'
    },
    {
      id: 3,
      type: 'consult',
      patient: 'Michael Chen',
      specialty: 'Neurology',
      priority: 'urgent',
      acuity: 'moderate',
      time: '12 min ago',
      preview: 'New onset confusion, possible stroke symptoms'
    }
  ];

  const statistics = [
    { label: 'Active Consultations', value: 12, trend: '+3' },
    { label: 'Messages Today', value: 47, trend: '+8' },
    { label: 'Avg Response Time', value: '4.2 min', trend: '-0.8' },
    { label: 'AI Recommendations', value: 23, trend: '+5' }
  ];

  const getAcuityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getAcuityIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'moderate': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600/30 text-red-100 border-red-500/50';
      case 'urgent': return 'bg-orange-600/30 text-orange-100 border-orange-500/50';
      case 'routine': return 'bg-blue-600/30 text-blue-100 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Virtualis Clinical Communications</h1>
              <p className="text-white/70">AI-powered clinical messaging and consultation platform</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {statistics.map((stat, index) => (
              <Card key={index} className="backdrop-blur-sm bg-white/5 border border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList className="bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="messages" className="text-white data-[state=active]:bg-white/20">
              <MessageSquare className="h-4 w-4 mr-2" />
              Recent Messages
            </TabsTrigger>
            <TabsTrigger value="consultations" className="text-white data-[state=active]:bg-white/20">
              <Stethoscope className="h-4 w-4 mr-2" />
              Active Consultations
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              <Brain className="h-4 w-4 mr-2" />
              AI Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Clinical Communications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {message.type === 'consult' ? (
                          <Stethoscope className="h-4 w-4 text-purple-400" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                        )}
                        <span className="font-medium">
                          {message.type === 'consult' ? `Consult: ${message.specialty}` : `Message to ${message.recipient}`}
                        </span>
                      </div>
                      <span className="text-sm text-white/60">{message.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getAcuityColor(message.acuity)} flex items-center gap-1 border text-xs`}>
                        {getAcuityIcon(message.acuity)}
                        {message.acuity.toUpperCase()}
                      </Badge>
                      <Badge className={`${getPriorityColor(message.priority)} text-xs border`}>
                        {message.priority.toUpperCase()}
                      </Badge>
                      {message.patient && (
                        <Badge className="bg-blue-600/30 text-blue-100 border-blue-500/50 text-xs">
                          {message.patient}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-white/80">{message.preview}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Active Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Stethoscope className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Active consultations will appear here</p>
                  <Button 
                    onClick={() => setShowConsultDialog(true)}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Request New Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Clinical Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white/90">Acuity Distribution</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <span>Critical</span>
                        </div>
                        <Badge className="bg-red-500/20 text-red-200 border-red-400/30">23%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-400" />
                          <span>Moderate</span>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">45%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span>Low</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-200 border-green-400/30">32%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white/90">AI Recommendations</h3>
                    <div className="text-sm text-white/70">
                      <p>• 94% accuracy in acuity assessment</p>
                      <p>• 87% specialty routing precision</p>
                      <p>• 23 AI-suggested consultations today</p>
                      <p>• Average response time: 4.2 minutes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onMessageClick={() => setShowMessageDialog(true)}
        onConsultClick={() => setShowConsultDialog(true)}
      />

      {/* Dialogs */}
      <ConsolidatedConsultDialog 
        open={showConsultDialog} 
        onClose={() => setShowConsultDialog(false)}
        hospitalId={hospitalId}
      />
      <StreamlinedMessageDialog 
        open={showMessageDialog} 
        onClose={() => setShowMessageDialog(false)}
        hospitalId={hospitalId}
      />
    </div>
  );
};

export default VirtualisChatLayout;
