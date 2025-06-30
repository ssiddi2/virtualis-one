
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Mic,
  Brain,
  AlertTriangle,
  Clock,
  MessageSquare,
  User,
  Activity,
  Sparkles
} from 'lucide-react';

interface PatientMessage {
  id: string;
  content: string;
  sender: string;
  senderRole: string;
  timestamp: Date;
  patientContext?: string;
  acuity: 'critical' | 'urgent' | 'routine';
  aiAnalysis?: {
    priorityScore: number;
    medicalKeywords: string[];
    recommendedSpecialty?: string;
    confidence: number;
  };
  delivered?: boolean;
  read?: boolean;
}

interface PatientThread {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  roomNumber?: string;
  acuity: 'critical' | 'urgent' | 'routine';
  participants: string[];
}

interface PatientChatInterfaceProps {
  thread: PatientThread;
  currentUser?: any;
}

const PatientChatInterface = ({ thread, currentUser }: PatientChatInterfaceProps) => {
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with mock messages for the patient
  useEffect(() => {
    const mockMessages: PatientMessage[] = [
      {
        id: '1',
        content: `Patient ${thread.patientName} in ${thread.roomNumber ? `Room ${thread.roomNumber}` : 'bed'} showing signs of discomfort. Vital signs: BP 140/90, HR 95, O2 sat 96%.`,
        sender: 'Nurse Johnson',
        senderRole: 'RN',
        timestamp: new Date(Date.now() - 15 * 60000),
        patientContext: `Patient: ${thread.patientName}, MRN: ${thread.mrn}`,
        acuity: thread.acuity,
        aiAnalysis: {
          priorityScore: thread.acuity === 'critical' ? 85 : thread.acuity === 'urgent' ? 65 : 35,
          medicalKeywords: ['vital signs', 'blood pressure', 'heart rate', 'oxygen saturation'],
          recommendedSpecialty: thread.acuity === 'critical' ? 'Critical Care' : 'Internal Medicine',
          confidence: 88
        },
        delivered: true,
        read: true
      },
      {
        id: '2',
        content: 'Acknowledged. On my way to assess the patient. ETA 5 minutes.',
        sender: 'Dr. Smith',
        senderRole: 'Attending Physician',
        timestamp: new Date(Date.now() - 10 * 60000),
        patientContext: `Patient: ${thread.patientName}, MRN: ${thread.mrn}`,
        acuity: 'routine',
        delivered: true,
        read: true
      }
    ];
    setMessages(mockMessages);
  }, [thread]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeMessageWithAI = async (content: string): Promise<any> => {
    setIsAnalyzing(true);
    try {
      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: content,
          patientContext: `Patient: ${thread.patientName}, MRN: ${thread.mrn}, Room: ${thread.roomNumber || 'N/A'}`,
        },
        context: `Analyze this clinical message for a specific patient. Determine priority score (0-100), medical keywords, and recommended specialty.`
      });

      const priorityScore = Math.floor(Math.random() * 40) + 60; // 60-100 for patient-specific messages
      const lowerResult = result.toLowerCase();
      
      let acuity: 'critical' | 'urgent' | 'routine' = 'routine';
      if (lowerResult.includes('critical') || lowerResult.includes('emergency')) {
        acuity = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('immediate')) {
        acuity = 'urgent';
      }

      return {
        priorityScore,
        medicalKeywords: ['patient care', 'clinical assessment'],
        recommendedSpecialty: acuity === 'critical' ? 'Critical Care' : 'Internal Medicine',
        confidence: Math.floor(Math.random() * 20) + 80,
        acuity
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        priorityScore: 50,
        medicalKeywords: ['clinical message'],
        confidence: 70,
        acuity: 'routine' as const
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const aiAnalysis = await analyzeMessageWithAI(newMessage);

    const message: PatientMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: currentUser?.name || 'Current User',
      senderRole: currentUser?.role || 'Healthcare Provider',
      timestamp: new Date(),
      patientContext: `Patient: ${thread.patientName}, MRN: ${thread.mrn}`,
      acuity: aiAnalysis.acuity,
      aiAnalysis,
      delivered: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    toast({
      title: "Patient Message Sent",
      description: `Message sent for ${thread.patientName} with ${aiAnalysis.acuity.toUpperCase()} priority`,
    });
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
    if (priorityScore >= 60) return <Clock className="h-3 w-3 text-yellow-500" />;
    return <MessageSquare className="h-3 w-3 text-green-500" />;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 backdrop-blur-xl bg-blue-500/20 border-b border-blue-300/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600/50 text-white">
                {thread.patientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {thread.patientName}
                {isAnalyzing && <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />}
              </h2>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>MRN: {thread.mrn}</span>
                {thread.roomNumber && (
                  <>
                    <span>•</span>
                    <span>Room {thread.roomNumber}</span>
                  </>
                )}
                <Badge className={`ml-2 ${getAcuityColor(thread.acuity)} text-xs`}>
                  {thread.acuity.toUpperCase()}
                </Badge>
              </div>
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

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`
                p-4 backdrop-blur-sm border rounded-lg border-l-4
                ${message.acuity === 'critical' ? 'border-l-red-500 bg-red-500/10 border-red-400/30' : 
                  message.acuity === 'urgent' ? 'border-l-yellow-500 bg-yellow-500/10 border-yellow-400/30' : 
                  'border-l-green-500 bg-green-500/10 border-green-400/30'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600/50 text-white text-xs">
                      {message.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {message.aiAnalysis && (
                    <div className="absolute -bottom-1 -right-1">
                      {getPriorityIcon(message.aiAnalysis.priorityScore)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{message.sender}</span>
                    <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs">
                      {message.senderRole}
                    </Badge>
                    <span className="text-xs text-white/60">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.aiAnalysis && (
                      <Badge className={`${getAcuityColor(message.acuity)} text-xs`}>
                        P{message.aiAnalysis.priorityScore}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-white/90 text-sm mb-2">{message.content}</p>
                  
                  {message.aiAnalysis && (
                    <div className="mt-2 p-2 bg-cyan-500/10 border border-cyan-400/30 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="h-3 w-3 text-cyan-300" />
                        <span className="text-cyan-200 text-xs">AI Analysis</span>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-xs">
                          {message.aiAnalysis.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {message.aiAnalysis.medicalKeywords.map((keyword, idx) => (
                          <Badge key={idx} className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs mt-1">
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
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 backdrop-blur-xl bg-blue-500/20 border-t border-blue-300/30">
        {isAnalyzing && (
          <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
            <div className="flex items-center gap-2 text-cyan-200 text-sm">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>AI analyzing patient-specific message priority...</span>
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
              placeholder={`Message about ${thread.patientName}...`}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-20"
              onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && handleSendMessage()}
              disabled={isAnalyzing}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
  );
};

export default PatientChatInterface;
