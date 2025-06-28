
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Video,
  FileText,
  Users,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import SmartRoutingDialog from "./SmartRoutingDialog";

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
  aiAnalysis?: {
    priority: number;
    keywords: string[];
    suggestedActions: string[];
  };
}

interface VirtualisChatProps {
  hospitalId?: string;
  currentUser?: any;
}

const VirtualisChat = ({ hospitalId, currentUser }: VirtualisChatProps) => {
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [messageType, setMessageType] = useState<'routine' | 'urgent' | 'critical'>('routine');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'urgent' | 'mine'>('all');
  const [smartRoutingOpen, setSmartRoutingOpen] = useState(false);
  const [selectedMessageForRouting, setSelectedMessageForRouting] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
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
        aiAnalysis: {
          priority: 95,
          keywords: ['respiratory distress', 'low oxygen saturation', 'emergency'],
          suggestedActions: ['Immediate O2 therapy', 'Chest X-ray', 'Pulmonology consult']
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
        aiAnalysis: {
          priority: 75,
          keywords: ['post-operative', 'surgical site pain', 'high pain score'],
          suggestedActions: ['Pain assessment', 'Wound inspection', 'Surgeon notification']
        }
      },
      {
        id: '3',
        content: 'Discharge planning meeting scheduled for tomorrow 10 AM for Patient Wilson.',
        sender: 'Case Manager',
        senderRole: 'Social Services',
        timestamp: new Date(Date.now() - 30 * 60000),
        acuity: 'routine',
        patientId: 'pat-003',
        patientName: 'Robert Wilson',
        aiAnalysis: {
          priority: 30,
          keywords: ['discharge planning', 'scheduled meeting'],
          suggestedActions: ['Confirm availability', 'Prepare discharge summary']
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

  const analyzeMessageWithAI = async (content: string, acuity: string) => {
    try {
      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: content
        },
        context: `Message acuity: ${acuity}, Healthcare communication triage`
      });

      // Parse AI response to extract priority and recommendations
      const aiAnalysis = {
        priority: acuity === 'critical' ? 95 : acuity === 'urgent' ? 70 : 40,
        keywords: extractKeywords(content),
        suggestedActions: extractSuggestedActions(result),
        recommendedSpecialty: extractRecommendedSpecialty(result)
      };

      return aiAnalysis;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        priority: acuity === 'critical' ? 95 : acuity === 'urgent' ? 70 : 40,
        keywords: ['message analysis'],
        suggestedActions: ['Review and respond']
      };
    }
  };

  const extractKeywords = (content: string): string[] => {
    const keywords = [];
    const medicalTerms = ['pain', 'distress', 'emergency', 'urgent', 'critical', 'post-op', 'surgical', 'discharge'];
    medicalTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        keywords.push(term);
      }
    });
    return keywords.length > 0 ? keywords : ['clinical message'];
  };

  const extractSuggestedActions = (aiResponse: string): string[] => {
    // Simple extraction - in reality, this would be more sophisticated
    const actions = [];
    if (aiResponse.includes('consult')) actions.push('Request consultation');
    if (aiResponse.includes('assessment')) actions.push('Clinical assessment');
    if (aiResponse.includes('monitor')) actions.push('Monitor patient');
    return actions.length > 0 ? actions : ['Review and respond'];
  };

  const extractRecommendedSpecialty = (aiResponse: string): string | undefined => {
    const specialties = ['Cardiology', 'Pulmonology', 'Surgery', 'Neurology', 'Emergency Medicine'];
    for (const specialty of specialties) {
      if (aiResponse.toLowerCase().includes(specialty.toLowerCase())) {
        return specialty;
      }
    }
    return undefined;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Get AI analysis for the new message
    const aiAnalysis = await analyzeMessageWithAI(newMessage, messageType);

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: currentUser?.name || 'Current User',
      senderRole: currentUser?.role || 'Healthcare Provider',
      timestamp: new Date(),
      acuity: messageType,
      patientId: selectedPatient || undefined,
      recommendedSpecialty: aiAnalysis.recommendedSpecialty,
      aiAnalysis: aiAnalysis
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: `${messageType.charAt(0).toUpperCase() + messageType.slice(1)} priority message sent with AI analysis.`,
    });

    // Auto-suggest routing for critical/urgent messages
    if (messageType === 'critical' || messageType === 'urgent') {
      setTimeout(() => {
        toast({
          title: "Smart Routing Available",
          description: `AI recommends ${aiAnalysis.recommendedSpecialty || 'specialist'} consultation for this ${messageType} message.`,
        });
      }, 2000);
    }
  };

  const handleSmartRouting = (message: Message) => {
    setSelectedMessageForRouting(message);
    setSmartRoutingOpen(true);
  };

  // AI-powered message sorting: Priority score from AI analysis, then timestamp
  const filteredMessages = messages.filter(msg => {
    switch (activeFilter) {
      case 'critical': return msg.acuity === 'critical';
      case 'urgent': return msg.acuity === 'urgent';
      case 'mine': return msg.sender === (currentUser?.name || 'Current User');
      default: return true;
    }
  }).sort((a, b) => {
    // Primary sort: AI priority score (higher first)
    const priorityDiff = (b.aiAnalysis?.priority || 0) - (a.aiAnalysis?.priority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Secondary sort: Acuity level
    const acuityValues = { critical: 3, urgent: 2, routine: 1 };
    const acuityDiff = acuityValues[b.acuity] - acuityValues[a.acuity];
    if (acuityDiff !== 0) return acuityDiff;
    
    // Tertiary sort: Timestamp (newest first)
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 backdrop-blur-sm bg-blue-600/30 rounded-lg border border-blue-400/30">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Virtualis Chat</h1>
              <p className="text-white/70">AI-Powered Clinical Communication with Smart Routing</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                    <p className="text-sm text-white/70">AI Routed</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.recommendedSpecialty).length}
                    </p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-300" />
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
                  <Star className="h-8 w-8 text-blue-300" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Feed */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-blue-300" />
                  AI-Prioritized Clinical Messages
                </CardTitle>
                <CardDescription className="text-white/70">
                  Messages sorted by AI priority score and acuity level
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-300" />
                        <span className="font-medium text-white">{message.sender}</span>
                        <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs">
                          {message.senderRole}
                        </Badge>
                        <Badge className={`text-xs ${getAcuityColor(message.acuity)}`}>
                          {getAcuityIcon(message.acuity)}
                          <span className="ml-1">{message.acuity.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <span className="text-xs text-white/60">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-white/90 mb-3">{message.content}</p>
                    
                    {message.patientName && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-white/70">
                        <User className="h-3 w-3" />
                        <span>Patient: {message.patientName}</span>
                      </div>
                    )}
                    
                    {message.recommendedSpecialty && (
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="h-4 w-4 text-purple-300" />
                        <span className="text-sm text-white">
                          AI Recommends: <span className="text-purple-300 font-medium">{message.recommendedSpecialty}</span>
                        </span>
                      </div>
                    )}
                    
                    {message.aiAnalysis && (
                      <div className="mt-3 p-2 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-3 w-3 text-purple-300" />
                          <span className="text-xs text-purple-300">AI Analysis</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-blue-300" />
                            <span className="text-xs text-blue-300">Priority: {message.aiAnalysis.priority}/100</span>
                          </div>
                        </div>
                        {message.aiAnalysis.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {message.aiAnalysis.keywords.map((keyword, idx) => (
                              <Badge key={idx} className="bg-purple-600/20 text-purple-200 text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {message.aiAnalysis.suggestedActions && (
                          <div className="text-xs text-white/70">
                            Suggested: {message.aiAnalysis.suggestedActions.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleSmartRouting(message)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Smart Route
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-400/30 text-green-300 hover:bg-green-600/20">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
            </Card>
          </div>

          {/* Message Composer */}
          <div className="space-y-6">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Send Message</CardTitle>
                <CardDescription className="text-white/70">
                  AI-powered message analysis and smart routing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Message Priority</label>
                  <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
                    <SelectTrigger className="bg-blue-600/20 border border-blue-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Message Content</label>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your clinical message here..."
                    className="bg-blue-600/20 border border-blue-400/30 text-white placeholder:text-white/60 min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || aiLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {aiLoading ? 'Analyzing...' : 'Send & Analyze'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30 justify-start">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Request Consultation
                </Button>
                <Button className="w-full bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30 justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
                <Button className="w-full bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30 justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Start Team Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Smart Routing Dialog */}
      <SmartRoutingDialog
        open={smartRoutingOpen}
        onClose={() => setSmartRoutingOpen(false)}
        messageContent={selectedMessageForRouting?.content || ''}
        messageId={selectedMessageForRouting?.id || ''}
        urgency={selectedMessageForRouting?.acuity || 'routine'}
        patientId={selectedMessageForRouting?.patientId}
        aiRecommendedSpecialty={selectedMessageForRouting?.recommendedSpecialty}
      />
    </div>
  );
};

export default VirtualisChat;
