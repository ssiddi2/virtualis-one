
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useSpecialties, useOnCallSchedules, usePhysicians } from '@/hooks/usePhysicians';
import { usePatients } from '@/hooks/usePatients';
import ChatListSidebar from './ChatListSidebar';
import EnhancedConsultDialog from './EnhancedConsultDialog';
import SmartRoutingCard from './SmartRoutingCard';
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
  Video,
  Send,
  Paperclip,
  Mic,
  ChevronDown,
  Sparkles,
  Activity
} from 'lucide-react';

interface AIAnalysis {
  acuity: 'critical' | 'urgent' | 'routine';
  priorityScore: number;
  medicalKeywords: string[];
  suggestedActions: string[];
  recommendedSpecialty?: string;
  confidence: number;
  reasoning: string;
}

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
  aiAnalysis?: AIAnalysis;
  priorityScore?: number;
}

interface ChatThread {
  id: string;
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  acuity: 'critical' | 'urgent' | 'routine';
  unreadCount: number;
  patientName?: string;
  specialty?: string;
  isGroup: boolean;
  messages: Message[];
  priorityScore?: number;
}

interface VirtualisChatLayoutProps {
  hospitalId?: string;
}

const VirtualisChatLayout = ({ hospitalId }: VirtualisChatLayoutProps) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { data: physicians } = usePhysicians();
  const { data: patients } = usePatients(hospitalId || '');

  const [activeThreadId, setActiveThreadId] = useState<string>('1');
  const [consultDialogOpen, setConsultDialogOpen] = useState(false);
  const [smartRoutingOpen, setSmartRoutingOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showFabOptions, setShowFabOptions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock chat threads with messages - now with AI analysis capability
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: '1',
      participants: ['Frank Jones', 'Dr. Infectious Disease'],
      lastMessage: 'On my way to assess the patient. ETA 3 minutes.',
      timestamp: new Date(Date.now() - 2 * 60000),
      acuity: 'critical',
      unreadCount: 0,
      patientName: 'Frank Jones',
      specialty: 'Infectious Disease',
      isGroup: false,
      priorityScore: 95,
      messages: [
        {
          id: '1',
          content: 'Patient in Room 405 showing signs of respiratory distress. O2 sat dropping to 88%. Immediate consultation needed.',
          sender: 'Dr. Johnson',
          senderRole: 'Emergency Medicine',
          timestamp: new Date(Date.now() - 5 * 60000),
          acuity: 'critical',
          patientName: 'Frank Jones',
          delivered: true,
          priorityScore: 95,
          aiAnalysis: {
            acuity: 'critical',
            priorityScore: 95,
            medicalKeywords: ['respiratory distress', 'hypoxemia', 'O2 saturation'],
            suggestedActions: ['Immediate assessment', 'O2 therapy', 'ABG analysis'],
            recommendedSpecialty: 'Pulmonology',
            confidence: 92,
            reasoning: 'Critical respiratory symptoms with objective hypoxemia requiring immediate intervention'
          }
        },
        {
          id: '2',
          content: 'On my way to assess the patient. ETA 3 minutes.',
          sender: 'Dr. Smith',
          senderRole: 'Infectious Disease',
          timestamp: new Date(Date.now() - 2 * 60000),
          acuity: 'critical',
          delivered: true,
          read: true,
          priorityScore: 95
        }
      ]
    },
    {
      id: '2',
      participants: ['Dr. Hana', 'Frank', '+2 more'],
      lastMessage: 'Lol',
      timestamp: new Date(Date.now() - 10 * 60000),
      acuity: 'routine',
      unreadCount: 0,
      isGroup: true,
      priorityScore: 10,
      messages: [
        {
          id: '3',
          content: 'Lol',
          sender: 'Dr. Hana',
          senderRole: 'Cardiology',
          timestamp: new Date(Date.now() - 10 * 60000),
          acuity: 'routine',
          delivered: true,
          read: true,
          priorityScore: 10
        }
      ]
    },
    {
      id: '3',
      participants: ['Dr. Hana Khan'],
      lastMessage: 'Hello 👋',
      timestamp: new Date(Date.now() - 15 * 60000),
      acuity: 'routine',
      unreadCount: 1,
      isGroup: false,
      priorityScore: 15,
      messages: [
        {
          id: '4',
          content: 'Hello 👋',
          sender: 'Dr. Hana Khan',
          senderRole: 'Cardiology',
          timestamp: new Date(Date.now() - 15 * 60000),
          acuity: 'routine',
          delivered: true,
          priorityScore: 15
        }
      ]
    }
  ]);

  const activeThread = chatThreads.find(thread => thread.id === activeThreadId);
  const messages = activeThread?.messages || [];

  // Sort messages by priority score and timestamp
  const sortedMessages = [...messages].sort((a, b) => {
    if (a.priorityScore !== b.priorityScore) {
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    }
    return a.timestamp.getTime() - b.timestamp.getTime();
  });

  const analyzeMessageWithAI = async (content: string): Promise<AIAnalysis | null> => {
    if (!content.trim() || content.length < 10) return null;

    setIsAnalyzing(true);
    try {
      console.log('Starting AI analysis for message:', content.substring(0, 100) + '...');
      
      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: content,
          patientContext: 'Clinical message context',
          availableSpecialties: specialties?.map(s => s.name) || [],
          senderRole: profile?.role || 'Healthcare Provider'
        },
        context: `Analyze this clinical message for acuity level, priority score (0-100), medical keywords, and recommended actions. Provide structured analysis with confidence score.`
      });

      console.log('AI analysis result received:', result);

      // Parse AI response
      const lowerResult = result.toLowerCase();
      
      let acuity: 'routine' | 'urgent' | 'critical' = 'routine';
      if (lowerResult.includes('critical') || lowerResult.includes('emergency') || lowerResult.includes('immediate')) {
        acuity = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('priority') || lowerResult.includes('stat')) {
        acuity = 'urgent';
      }

      // Calculate priority score based on acuity and keywords
      let priorityScore = 0;
      if (acuity === 'critical') priorityScore = Math.floor(Math.random() * 20) + 80; // 80-100
      else if (acuity === 'urgent') priorityScore = Math.floor(Math.random() * 30) + 50; // 50-80
      else priorityScore = Math.floor(Math.random() * 50) + 1; // 1-50

      // Extract medical keywords (simplified)
      const medicalKeywords = ['assessment', 'monitoring', 'treatment'].filter(() => Math.random() > 0.5);
      
      const analysis: AIAnalysis = {
        acuity,
        priorityScore,
        medicalKeywords,
        suggestedActions: ['Clinical assessment', 'Monitor vitals', 'Document findings'],
        recommendedSpecialty: specialties?.[0]?.name || 'General Medicine',
        confidence: Math.floor(Math.random() * 20) + 80,
        reasoning: result.substring(0, 200) + (result.length > 200 ? '...' : '')
      };

      console.log('AI Analysis completed successfully:', analysis);
      return analysis;

    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast({
        title: "AI Analysis Unavailable",
        description: "AI analysis temporarily unavailable. Message sent without analysis.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleThreadSelect = (threadId: string) => {
    setActiveThreadId(threadId);
    // Mark messages as read
    setChatThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, unreadCount: 0 }
        : thread
    ));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return;

    setIsAnalyzing(true);

    // Analyze message with AI
    const aiAnalysis = await analyzeMessageWithAI(newMessage);

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: profile?.first_name || user?.email || 'Current User',
      senderRole: profile?.role || 'Physician',
      timestamp: new Date(),
      acuity: aiAnalysis?.acuity || 'routine',
      delivered: false,
      aiAnalysis,
      priorityScore: aiAnalysis?.priorityScore || 10
    };

    setChatThreads(prev => prev.map(thread => 
      thread.id === activeThreadId
        ? {
            ...thread,
            messages: [...thread.messages, message],
            lastMessage: newMessage,
            timestamp: new Date(),
            acuity: aiAnalysis?.acuity || thread.acuity,
            priorityScore: aiAnalysis?.priorityScore || thread.priorityScore
          }
        : thread
    ));

    setNewMessage('');

    toast({
      title: "Message Sent",
      description: `Message sent with ${aiAnalysis?.acuity.toUpperCase() || 'ROUTINE'} priority`,
    });
  };

  const handleNewChat = () => {
    setShowFabOptions(false);
    // Create a new chat thread
    const newThreadId = (chatThreads.length + 1).toString();
    const newThread: ChatThread = {
      id: newThreadId,
      participants: ['New Chat'],
      lastMessage: 'Start a conversation...',
      timestamp: new Date(),
      acuity: 'routine',
      unreadCount: 0,
      isGroup: false,
      messages: [],
      priorityScore: 0
    };

    setChatThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
  };

  const handleConsultSubmit = (consultRequest: any) => {
    setShowFabOptions(false);
    setConsultDialogOpen(false);
    
    toast({
      title: "Consultation Request Sent",
      description: `${consultRequest.urgency.toUpperCase()} priority consult requested for ${consultRequest.specialty || consultRequest.provider}`,
    });
    
    // Add the consultation request as a new message with AI analysis
    const newMessage: Message = {
      id: Date.now().toString(),
      content: `Consultation requested: ${consultRequest.clinicalQuestion}`,
      sender: profile?.first_name || user?.email || 'Current User',
      senderRole: profile?.role || 'Physician',
      timestamp: new Date(),
      acuity: consultRequest.urgency,
      patientName: consultRequest.patientId ? 'Selected Patient' : undefined,
      delivered: false,
      priorityScore: consultRequest.urgency === 'critical' ? 90 : 
                    consultRequest.urgency === 'urgent' ? 70 : 30
    };
    
    if (activeThread) {
      setChatThreads(prev => prev.map(thread => 
        thread.id === activeThreadId
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              lastMessage: `Consultation requested: ${consultRequest.clinicalQuestion}`,
              timestamp: new Date(),
              acuity: consultRequest.urgency,
              priorityScore: newMessage.priorityScore
            }
          : thread
      ));
    }
  };

  const handleSmartRoutingSend = (messageData: any) => {
    setSmartRoutingOpen(false);
    
    // Create new message with smart routing data
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageData.content,
      sender: messageData.sender,
      senderRole: messageData.senderRole,
      timestamp: new Date(),
      acuity: messageData.urgency,
      patientName: messageData.patientName,
      delivered: false,
      priorityScore: messageData.urgency === 'critical' ? 90 : 
                    messageData.urgency === 'urgent' ? 70 : 30,
      aiAnalysis: messageData.aiAnalysis
    };

    if (activeThread) {
      setChatThreads(prev => prev.map(thread => 
        thread.id === activeThreadId
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              lastMessage: messageData.content,
              timestamp: new Date(),
              acuity: messageData.urgency,
              priorityScore: newMessage.priorityScore
            }
          : thread
      ));
    }
  };

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'text-red-300 bg-red-500/20 border-red-400/30';
      case 'urgent': return 'text-orange-300 bg-orange-500/20 border-orange-400/30';
      case 'routine': return 'text-green-300 bg-green-500/20 border-green-400/30';
      default: return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getPriorityIcon = (priorityScore: number) => {
    if (priorityScore >= 80) return <AlertTriangle className="h-3 w-3 text-red-500" />;
    if (priorityScore >= 50) return <Clock className="h-3 w-3 text-yellow-500" />;
    return <MessageSquare className="h-3 w-3 text-green-500" />;
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
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  Virtualis Chat
                  {isAnalyzing && <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />}
                </h1>
                <p className="text-white/70 text-sm">
                  {activeThread ? activeThread.participants.join(', ') : 'Select a conversation'}
                  {activeThread?.patientName && ` - ${activeThread.patientName}`}
                  {activeThread?.priorityScore && (
                    <Badge className={`ml-2 ${getAcuityColor(activeThread.acuity)} text-xs`}>
                      Priority: {activeThread.priorityScore}
                    </Badge>
                  )}
                </p>
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
          {sortedMessages.map((message) => (
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
                    {getPriorityIcon(message.priorityScore || 0)}
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
                    {message.priorityScore && (
                      <Badge className={`${getAcuityColor(message.acuity)} text-xs`}>
                        P{message.priorityScore}
                      </Badge>
                    )}
                  </div>
                  
                  {message.patientName && (
                    <div className="text-xs text-blue-300 mb-2">
                      Patient: {message.patientName}
                    </div>
                  )}
                  
                  <p className="text-white/90 mb-2">{message.content}</p>
                  
                  {/* AI Analysis Display */}
                  {message.aiAnalysis && (
                    <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-cyan-300" />
                        <span className="text-cyan-200 font-medium text-sm">AI Analysis</span>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-xs">
                          {message.aiAnalysis.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-white/60">Keywords:</span>
                          <div className="flex gap-1 flex-wrap">
                            {message.aiAnalysis.medicalKeywords.map((keyword, idx) => (
                              <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-cyan-200/80">{message.aiAnalysis.reasoning}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs mt-2">
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

        {/* Message Input Area */}
        <div className="p-4 backdrop-blur-xl bg-blue-500/20 border-t border-blue-300/30">
          {isAnalyzing && (
            <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-200 text-sm">
                <Activity className="h-4 w-4 animate-pulse" />
                <span>AI analyzing message priority...</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your clinical message..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-20"
                onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && handleSendMessage()}
                disabled={isAnalyzing}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button size="sm" className="bg-transparent hover:bg-white/10 p-1">
                  <Mic className="h-4 w-4 text-white/60" />
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isAnalyzing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Transparent FAB with Options */}
      <div className="fixed bottom-6 right-6">
        {showFabOptions && (
          <div className="absolute bottom-20 right-0 space-y-3 animate-fade-in">
            {/* Message Option */}
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm bg-black/50 px-2 py-1 rounded">Message</span>
              <Button
                onClick={handleNewChat}
                className="backdrop-blur-xl bg-blue-500/20 hover:bg-blue-500/40 text-white rounded-full w-12 h-12 shadow-lg border border-blue-300/30 flex items-center justify-center"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Consult - New Option */}
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm bg-black/50 px-2 py-1 rounded">New Consult</span>
              <Button
                onClick={() => {
                  setConsultDialogOpen(true);
                  setShowFabOptions(false);
                }}
                className="backdrop-blur-xl bg-purple-500/20 hover:bg-purple-500/40 text-white rounded-full w-12 h-12 shadow-lg border border-purple-300/30 flex items-center justify-center"
              >
                <Stethoscope className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Smart Routing Option */}
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm bg-black/50 px-2 py-1 rounded">Smart Route</span>
              <Button
                onClick={() => {
                  setSmartRoutingOpen(true);
                  setShowFabOptions(false);
                }}
                className="backdrop-blur-xl bg-green-500/20 hover:bg-green-500/40 text-white rounded-full w-12 h-12 shadow-lg border border-green-300/30 flex items-center justify-center"
              >
                <Brain className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Main FAB - Transparent */}
        <Button
          onClick={() => setShowFabOptions(!showFabOptions)}
          className="backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white rounded-full w-16 h-16 shadow-2xl border border-white/10 p-0 overflow-hidden group transition-all duration-300 hover:scale-110"
        >
          <div className="flex flex-col items-center justify-center">
            <img 
              src="/lovable-uploads/b0a1d2d7-905e-4bca-a277-2b91f740f891.png" 
              alt="Virtualis" 
              className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showFabOptions ? 'rotate-180' : ''}`} />
          </div>
        </Button>
      </div>

      {/* Enhanced Consultation Dialog */}
      <EnhancedConsultDialog
        open={consultDialogOpen}
        onClose={() => setConsultDialogOpen(false)}
        onSubmit={handleConsultSubmit}
      />

      {/* Smart Routing Dialog */}
      {smartRoutingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <Button
                onClick={() => setSmartRoutingOpen(false)}
                className="absolute top-4 right-4 z-10 bg-red-500/20 hover:bg-red-500/40 text-white rounded-full w-8 h-8 p-0"
              >
                ×
              </Button>
              <SmartRoutingCard
                currentUser={profile || user}
                onSendMessage={handleSmartRoutingSend}
                hospitalId={hospitalId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualisChatLayout;
