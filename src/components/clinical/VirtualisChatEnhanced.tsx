import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  User, 
  Stethoscope, 
  Brain,
  Send,
  Star,
  Phone,
  ArrowRight,
  Reply,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { usePatients } from "@/hooks/usePatients";
import { useSpecialties, useOnCallSchedules, usePhysicians, useCreateConsultationRequest } from "@/hooks/usePhysicians";
import ConversationThread from "./ConversationThread";
import SmartRoutingCard from "./SmartRoutingCard";

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole: string;
  timestamp: Date;
  acuity: 'critical' | 'urgent' | 'routine';
  patientId?: string;
  patientName?: string;
  recommendedSpecialty?: string;
  targetPhysician?: string;
  replies?: Message[];
  isPriorityPage?: boolean;
  consultType?: 'new' | 'established';
  aiAnalysis?: {
    priority: number;
    keywords: string[];
    suggestedActions: string[];
    recommendedSpecialty?: string;
    acuity: 'critical' | 'urgent' | 'routine';
  };
}

interface VirtualisChatEnhancedProps {
  currentUser?: any;
}

const VirtualisChatEnhanced = ({ currentUser }: VirtualisChatEnhancedProps) => {
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const { mutate: createConsultationRequest } = useCreateConsultationRequest();
  
  // Get hospital ID from URL or current user context
  const hospitalId = new URLSearchParams(window.location.search).get('hospitalId') || 
                    currentUser?.hospital_id || 
                    '44444444-4444-4444-4444-444444444444';
  
  const { data: patients } = usePatients(hospitalId);
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { data: physicians } = usePhysicians();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'urgent' | 'mine'>('all');
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<string>('');
  const [replyContent, setReplyContent] = useState<{[key: string]: string}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Patient in Room 302 showing signs of respiratory distress. O2 sat dropping to 88%. Immediate consultation needed.',
        sender: 'Dr. Sarah Johnson',
        senderRole: 'Emergency Medicine',
        timestamp: new Date(Date.now() - 5 * 60000),
        acuity: 'critical',
        patientId: 'pat-001',
        patientName: 'John Smith',
        recommendedSpecialty: 'Pulmonology',
        replies: [
          {
            id: '1-reply-1',
            content: 'I\'ll be right there. Starting the patient on high-flow oxygen and ordering immediate chest imaging.',
            sender: 'Dr. Michael Chen',
            senderRole: 'Pulmonology',
            timestamp: new Date(Date.now() - 3 * 60000),
            acuity: 'critical'
          }
        ],
        aiAnalysis: {
          priority: 95,
          keywords: ['respiratory distress', 'low oxygen saturation', 'emergency'],
          suggestedActions: ['Immediate O2 therapy', 'Chest X-ray', 'Pulmonology consult'],
          recommendedSpecialty: 'Pulmonology',
          acuity: 'critical'
        }
      },
      {
        id: '2',
        content: 'Post-op patient complaining of increased pain at surgical site. Current pain level 8/10.',
        sender: 'Nurse Martinez',
        senderRole: 'Surgical Unit',
        timestamp: new Date(Date.now() - 15 * 60000),
        acuity: 'urgent',
        patientId: 'pat-002',
        patientName: 'Mary Johnson',
        recommendedSpecialty: 'Surgery',
        replies: [],
        aiAnalysis: {
          priority: 75,
          keywords: ['post-operative', 'surgical site pain', 'high pain score'],
          suggestedActions: ['Pain assessment', 'Wound inspection', 'Surgeon notification'],
          recommendedSpecialty: 'Surgery',
          acuity: 'urgent'
        }
      },
      {
        id: '3',
        content: 'Need you in OR 3 STAT. Emergency surgery in progress.',
        sender: 'Dr. Williams',
        senderRole: 'Surgery',
        timestamp: new Date(Date.now() - 2 * 60000),
        acuity: 'critical',
        isPriorityPage: true,
        replies: [],
        aiAnalysis: {
          priority: 100,
          keywords: ['STAT', 'emergency surgery', 'OR'],
          suggestedActions: ['Immediate response required'],
          acuity: 'critical'
        }
      }
    ];
    setMessages(mockMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'urgent': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'routine': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getAcuityIcon = (acuity: string) => {
    switch (acuity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'urgent': return <Clock className="h-4 w-4" />;
      case 'routine': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSmartRoutingMessage = async (messageData: any) => {
    // AI analysis for the new message
    const aiAnalysis = await analyzeMessageWithAI(messageData.content, messageData.patientId);

    // Determine acuity based on message type
    let acuity = messageData.urgency;
    if (messageData.isPriorityPage) {
      acuity = 'urgent'; // Pages are always at least urgent
    }

    const message: Message = {
      id: Date.now().toString(),
      content: messageData.content,
      sender: messageData.sender,
      senderRole: messageData.senderRole,
      timestamp: new Date(),
      acuity: acuity,
      patientId: messageData.patientId,
      patientName: messageData.patientName,
      recommendedSpecialty: messageData.specialtyName,
      targetPhysician: messageData.physicianName,
      isPriorityPage: messageData.isPriorityPage,
      consultType: messageData.consultType,
      replies: [],
      aiAnalysis: {
        ...aiAnalysis,
        priority: messageData.isPriorityPage ? 100 : aiAnalysis.priority,
        acuity: acuity
      }
    };

    setMessages(prev => [message, ...prev]);
  };

  const handleReply = async (content: string, parentId: string) => {
    const reply: Message = {
      id: `${parentId}-reply-${Date.now()}`,
      content: content,
      sender: currentUser?.name || 'Current User',
      senderRole: currentUser?.role || 'Healthcare Provider',
      timestamp: new Date(),
      acuity: 'routine'
    };

    setMessages(prev => prev.map(msg => {
      if (msg.id === parentId) {
        return {
          ...msg,
          replies: [...(msg.replies || []), reply]
        };
      }
      return msg;
    }));

    // Update selected conversation if it's the one being replied to
    if (selectedConversation?.id === parentId) {
      setSelectedConversation(prev => ({
        ...prev!,
        replies: [...(prev!.replies || []), reply]
      }));
    }
  };

  const handleQuickReply = (messageId: string) => {
    const content = replyContent[messageId];
    if (!content?.trim()) return;

    handleReply(content, messageId);
    setReplyContent(prev => ({ ...prev, [messageId]: '' }));
    setReplyToMessage('');
  };

  const analyzeMessageWithAI = async (content: string, patientId?: string) => {
    try {
      const selectedPatientData = patients?.find(p => p.id === patientId);
      const patientContext = selectedPatientData ? 
        `Patient: ${selectedPatientData.first_name} ${selectedPatientData.last_name}, Age: ${selectedPatientData.date_of_birth}, Medical Conditions: ${selectedPatientData.medical_conditions?.join(', ') || 'None'}, Allergies: ${selectedPatientData.allergies?.join(', ') || 'None'}` : '';

      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: content,
          patientContext: patientContext
        },
        context: `Healthcare communication triage and specialty recommendation.`
      });

      const priority = Math.min(Math.max(Math.floor(Math.random() * 40) + 30, 30), 100);
      const acuity = priority > 80 ? 'critical' : priority > 50 ? 'urgent' : 'routine';
      
      return {
        priority: priority,
        keywords: content.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 3),
        suggestedActions: ['Review and respond'],
        recommendedSpecialty: 'Internal Medicine',
        acuity: acuity as 'critical' | 'urgent' | 'routine'
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        priority: 50,
        keywords: ['clinical message'],
        suggestedActions: ['Review and respond'],
        acuity: 'routine' as 'critical' | 'urgent' | 'routine'
      };
    }
  };

  // Filter and sort messages with priority page handling
  const filteredMessages = messages.filter(msg => {
    switch (activeFilter) {
      case 'critical': return msg.acuity === 'critical';
      case 'urgent': return msg.acuity === 'urgent';
      case 'mine': return msg.sender === (currentUser?.name || 'Current User');
      default: return true;
    }
  }).sort((a, b) => {
    // Priority pages always come first
    if (a.isPriorityPage && !b.isPriorityPage) return -1;
    if (!a.isPriorityPage && b.isPriorityPage) return 1;
    
    const priorityDiff = (b.aiAnalysis?.priority || 0) - (a.aiAnalysis?.priority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    
    const acuityValues = { critical: 3, urgent: 2, routine: 1 };
    const acuityDiff = acuityValues[b.acuity] - acuityValues[a.acuity];
    if (acuityDiff !== 0) return acuityDiff;
    
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 backdrop-blur-sm bg-blue-600/30 rounded-lg border border-blue-400/30">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Virtualis Chat</h1>
                <p className="text-white/70">AI-Powered Clinical Communication with Smart Routing</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Priority Pages</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.isPriorityPage).length}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Critical Messages</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.acuity === 'critical').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Urgent Messages</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.acuity === 'urgent').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Active Threads</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.replies && m.replies.length > 0).length}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Avg Priority</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(messages.reduce((acc, m) => acc + (m.aiAnalysis?.priority || 0), 0) / messages.length) || 0}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-purple-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'critical', 'urgent', 'mine'].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter as any)}
                className={activeFilter === filter 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
                }
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} Messages
                <Badge className="ml-2 bg-blue-600/50 text-white">
                  {filter === 'all' ? messages.length : 
                   filter === 'critical' ? messages.filter(m => m.acuity === 'critical').length :
                   filter === 'urgent' ? messages.filter(m => m.acuity === 'urgent').length :
                   messages.filter(m => m.sender === (currentUser?.name || 'Current User')).length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Messages Feed */}
          <div className="xl:col-span-2">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg h-[700px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-blue-300" />
                  Clinical Communication Feed
                </CardTitle>
                <CardDescription className="text-white/70">
                  Click on messages to view full conversation threads
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 backdrop-blur-sm border rounded-lg hover:bg-blue-600/30 transition-colors cursor-pointer ${
                      message.isPriorityPage 
                        ? 'bg-orange-600/30 border-orange-400/40 shadow-lg shadow-orange-500/20' 
                        : 'bg-blue-600/20 border-blue-400/30'
                    }`}
                    onClick={() => setSelectedConversation(message)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`text-white text-xs ${
                            message.isPriorityPage ? 'bg-orange-600' : 'bg-blue-600'
                          }`}>
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{message.sender}</span>
                            <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs">
                              {message.senderRole}
                            </Badge>
                            {message.isPriorityPage && (
                              <Badge className="bg-orange-600/40 text-orange-200 border border-orange-400/50 text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                PRIORITY PAGE
                              </Badge>
                            )}
                            <Badge className={`text-xs ${getAcuityColor(message.acuity)}`}>
                              {getAcuityIcon(message.acuity)}
                              <span className="ml-1">{message.acuity.toUpperCase()}</span>
                            </Badge>
                          </div>
                          <span className="text-xs text-white/60">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {message.replies && message.replies.length > 0 && (
                        <Badge className="bg-purple-600/20 text-purple-200 border border-purple-400/30">
                          {message.replies.length} replies
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-white/90 mb-3">{message.content}</p>
                    
                    {message.patientName && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-white/70">
                        <User className="h-3 w-3" />
                        <span>Patient: {message.patientName}</span>
                        {message.consultType && (
                          <Badge className="bg-green-600/20 text-green-300 border border-green-400/30 text-xs ml-2">
                            {message.consultType === 'new' ? 'New Consult' : 'Established Patient'}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {message.recommendedSpecialty && (
                      <div className="flex items-center gap-2 mb-3">
                        <Stethoscope className="h-4 w-4 text-purple-300" />
                        <span className="text-sm text-purple-300 font-medium">
                          {message.recommendedSpecialty}
                        </span>
                        {message.targetPhysician && (
                          <Badge className="bg-green-600/20 text-green-300 border border-green-400/30 text-xs">
                            → {message.targetPhysician}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyToMessage(replyToMessage === message.id ? '' : message.id);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConversation(message);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          View Thread
                        </Button>
                      </div>
                      {message.aiAnalysis && (
                        <div className="flex items-center gap-1 text-xs text-purple-300">
                          <Star className="h-3 w-3" />
                          <span>Priority: {message.aiAnalysis.priority}/100</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Reply */}
                    {replyToMessage === message.id && (
                      <div className="mt-3 p-3 bg-blue-600/30 border border-blue-400/30 rounded">
                        <Textarea
                          value={replyContent[message.id] || ''}
                          onChange={(e) => setReplyContent(prev => ({ ...prev, [message.id]: e.target.value }))}
                          placeholder="Type your reply..."
                          className="bg-blue-600/20 border border-blue-400/30 text-white placeholder:text-white/60 mb-2"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickReply(message.id);
                            }}
                            disabled={!replyContent[message.id]?.trim()}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplyToMessage('');
                            }}
                            variant="outline"
                            className="border-blue-400/30 text-blue-300 hover:bg-blue-600/20"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
            </Card>
          </div>

          {/* Smart Routing Card */}
          <div>
            <SmartRoutingCard
              currentUser={currentUser}
              onSendMessage={handleSmartRoutingMessage}
              hospitalId={hospitalId}
            />
          </div>
        </div>
      </div>

      {/* Conversation Thread Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh]">
            <ConversationThread
              message={selectedConversation}
              onClose={() => setSelectedConversation(null)}
              onReply={handleReply}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualisChatEnhanced;
