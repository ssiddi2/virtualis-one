
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import ChatListSidebar from './ChatListSidebar';
import EnhancedConsultDialog from './EnhancedConsultDialog';
import { 
  Brain,
  MessageSquare,
  Plus,
  Users,
  Stethoscope,
  AlertTriangle,
  Clock,
  User,
  Phone,
  Video
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole: string;
  timestamp: Date;
  acuity: 'critical' | 'urgent' | 'routine';
  patientName?: string;
  delivered?: boolean;
  read?: boolean;
}

interface VirtualisChatLayoutProps {
  hospitalId?: string;
}

const VirtualisChatLayout = ({ hospitalId }: VirtualisChatLayoutProps) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [activeThreadId, setActiveThreadId] = useState<string>('1');
  const [consultDialogOpen, setConsultDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Patient in Room 405 showing signs of respiratory distress. O2 sat dropping to 88%. Immediate consultation needed.',
      sender: 'Dr. Johnson',
      senderRole: 'Emergency Medicine',
      timestamp: new Date(Date.now() - 5 * 60000),
      acuity: 'critical',
      patientName: 'Frank Jones',
      delivered: true
    },
    {
      id: '2',
      content: 'On my way to assess the patient. ETA 3 minutes.',
      sender: 'Dr. Smith',
      senderRole: 'Infectious Disease',
      timestamp: new Date(Date.now() - 2 * 60000),
      acuity: 'critical',
      delivered: true,
      read: true
    }
  ]);

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'urgent': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'routine': return 'border-l-green-500 bg-green-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getAcuityHaloColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'ring-2 ring-red-500/50 ring-offset-2 ring-offset-blue-900/50';
      case 'urgent': return 'ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-blue-900/50';
      case 'routine': return 'ring-2 ring-green-500/50 ring-offset-2 ring-offset-blue-900/50';
      default: return 'ring-2 ring-gray-500/50 ring-offset-2 ring-offset-blue-900/50';
    }
  };

  const getAcuityIcon = (acuity: string) => {
    switch (acuity) {
      case 'critical': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'urgent': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'routine': return <MessageSquare className="h-3 w-3 text-green-500" />;
      default: return <MessageSquare className="h-3 w-3 text-gray-500" />;
    }
  };

  const handleThreadSelect = (threadId: string) => {
    setActiveThreadId(threadId);
    // In a real app, you'd load messages for this thread
  };

  const handleNewChat = () => {
    setConsultDialogOpen(true);
  };

  const handleConsultSubmit = (consultRequest: any) => {
    toast({
      title: "Consultation Request Sent",
      description: `${consultRequest.urgency.toUpperCase()} priority consult requested for ${consultRequest.specialty || consultRequest.provider}`,
    });
    
    // Add the consultation request as a new message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: `Consultation requested: ${consultRequest.clinicalQuestion}`,
      sender: profile?.first_name || user?.email || 'Current User',
      senderRole: 'Physician',
      timestamp: new Date(),
      acuity: consultRequest.urgency,
      patientName: consultRequest.patientId ? 'Selected Patient' : undefined,
      delivered: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setConsultDialogOpen(false);
  };

  if (!hospitalId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">No Hospital Selected</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      {/* Chat List Sidebar */}
      <ChatListSidebar
        activeThreadId={activeThreadId}
        onThreadSelect={handleThreadSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 backdrop-blur-xl bg-blue-500/20 border-b border-blue-300/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 backdrop-blur-sm bg-blue-600/30 rounded-lg border border-blue-400/30">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Virtualis Chat</h1>
                <p className="text-white/70 text-sm">Frank Jones - Infectious Disease</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Video className="h-4 w-4 mr-1" />
                Video
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`
                p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg border-l-4
                ${message.acuity === 'critical' ? 'border-l-red-500 bg-red-500/5' : 
                  message.acuity === 'urgent' ? 'border-l-yellow-500 bg-yellow-500/5' : 
                  'border-l-green-500 bg-green-500/5'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className={`h-10 w-10 ${
                    message.acuity === 'critical' ? 'ring-2 ring-red-500/50 ring-offset-2 ring-offset-blue-900/50' :
                    message.acuity === 'urgent' ? 'ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-blue-900/50' :
                    'ring-2 ring-green-500/50 ring-offset-2 ring-offset-blue-900/50'
                  }`}>
                    <AvatarFallback className="bg-blue-600/50 text-white text-sm">
                      {message.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    {message.acuity === 'critical' ? <AlertTriangle className="h-3 w-3 text-red-500" /> :
                     message.acuity === 'urgent' ? <Clock className="h-3 w-3 text-yellow-500" /> :
                     <MessageSquare className="h-3 w-3 text-green-500" />}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{message.sender}</span>
                    <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs">
                      {message.senderRole}
                    </Badge>
                    <span className="text-xs text-white/60">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {message.patientName && (
                    <div className="text-xs text-blue-300 mb-2">
                      Patient: {message.patientName}
                    </div>
                  )}
                  
                  <p className="text-white/90 mb-2">{message.content}</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    {message.delivered && (
                      <span className="text-green-400">delivered ✓</span>
                    )}
                    {message.read && (
                      <span className="text-blue-400">read ✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Button with Virtualis Logo */}
        <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3">
          <Button
            onClick={() => setConsultDialogOpen(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full w-16 h-16 shadow-2xl backdrop-blur-sm border border-orange-300/30 p-0 overflow-hidden group transition-all duration-300 hover:scale-110"
          >
            <img 
              src="/lovable-uploads/b0a1d2d7-905e-4bca-a277-2b91f740f891.png" 
              alt="Virtualis" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </Button>
          <div className="backdrop-blur-sm bg-white/10 rounded-full px-3 py-1 text-white text-xs text-center border border-white/20">
            Consult
          </div>
        </div>
      </div>

      {/* Enhanced Consultation Dialog */}
      <EnhancedConsultDialog
        open={consultDialogOpen}
        onClose={() => setConsultDialogOpen(false)}
        onSubmit={handleConsultSubmit}
      />
    </div>
  );
};

export default VirtualisChatLayout;
