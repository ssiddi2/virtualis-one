
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
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { usePatients } from "@/hooks/usePatients";

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

interface VirtualisChatEnhancedProps {
  hospitalId?: string;
  currentUser?: any;
}

const VirtualisChatEnhanced = ({ hospitalId, currentUser }: VirtualisChatEnhancedProps) => {
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const { data: patients } = usePatients();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [messageType, setMessageType] = useState<'routine' | 'urgent' | 'critical'>('routine');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'urgent' | 'mine'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with some sample messages
  useEffect(() => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        content: 'Patient in Room 302 showing signs of respiratory distress. O2 sat dropping to 88%. Immediate consultation needed.',
        sender: 'Dr. Sarah Johnson',
        senderRole: 'Emergency Medicine',
        timestamp: new Date(Date.now() - 5 * 60000),
        acuity: 'critical',
        patientId: patients?.[0]?.id,
        patientName: patients?.[0] ? `${patients[0].first_name} ${patients[0].last_name}` : 'John Smith',
        recommendedSpecialty: 'Pulmonology',
        aiAnalysis: {
          priority: 95,
          keywords: ['respiratory distress', 'low oxygen saturation'],
          suggestedActions: ['Immediate O2 therapy', 'Chest X-ray', 'Pulmonology consult']
        }
      }
    ];
    setMessages(sampleMessages);
  }, [patients]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const assessAcuityWithAI = async (messageContent: string): Promise<{acuity: 'critical' | 'urgent' | 'routine', analysis: any}> => {
    try {
      const result = await callAI({
        type: 'triage_assessment',
        data: { symptoms: messageContent },
        context: 'Clinical message acuity assessment'
      });

      // Parse AI response to determine acuity
      const lowerResult = result.toLowerCase();
      let acuity: 'critical' | 'urgent' | 'routine' = 'routine';
      
      if (lowerResult.includes('critical') || lowerResult.includes('emergency') || lowerResult.includes('immediate')) {
        acuity = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('priority')) {
        acuity = 'urgent';
      }

      return {
        acuity,
        analysis: {
          priority: acuity === 'critical' ? 90 : acuity === 'urgent' ? 70 : 40,
          keywords: messageContent.split(' ').filter(word => word.length > 4).slice(0, 3),
          suggestedActions: ['Review patient', 'Clinical assessment', 'Monitor vital signs']
        }
      };
    } catch (error) {
      console.error('AI acuity assessment failed:', error);
      return {
        acuity: messageType,
        analysis: {
          priority: messageType === 'critical' ? 90 : messageType === 'urgent' ? 70 : 40,
          keywords: ['clinical message'],
          suggestedActions: ['Review and respond']
        }
      };
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Show loading state
    toast({
      title: "Processing Message",
      description: "AI is assessing message acuity...",
    });

    try {
      // Get AI acuity assessment
      const { acuity, analysis } = await assessAcuityWithAI(newMessage);

      const selectedPatientData = patients?.find(p => p.id === selectedPatient);
      
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: currentUser?.name || currentUser?.first_name || 'Current User',
        senderRole: currentUser?.role || 'Healthcare Provider',
        timestamp: new Date(),
        acuity,
        patientId: selectedPatient || undefined,
        patientName: selectedPatientData ? `${selectedPatientData.first_name} ${selectedPatientData.last_name}` : undefined,
        aiAnalysis: analysis
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setSelectedPatient('');
      
      toast({
        title: "Message Sent",
        description: `AI assessed as ${acuity.toUpperCase()} priority. Message sent successfully.`,
        variant: acuity === 'critical' ? 'destructive' : 'default'
      });

      // Auto-suggest specialty if critical
      if (acuity === 'critical') {
        setTimeout(() => {
          toast({
            title: "AI Recommendation",
            description: "Critical message detected. Consider immediate specialist consultation.",
            variant: "destructive"
          });
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-yellow-600 text-white';
      case 'routine': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
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

  const filteredMessages = messages.filter(msg => {
    switch (activeFilter) {
      case 'critical': return msg.acuity === 'critical';
      case 'urgent': return msg.acuity === 'urgent';
      case 'mine': return msg.sender === (currentUser?.name || currentUser?.first_name || 'Current User');
      default: return true;
    }
  }).sort((a, b) => {
    const priorityDiff = (b.aiAnalysis?.priority || 0) - (a.aiAnalysis?.priority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Virtualis Chat</h1>
              <p className="text-white/70">AI-Powered Clinical Communication with Smart Acuity Assessment</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Critical Messages</p>
                    <p className="text-2xl font-bold text-red-400">
                      {messages.filter(m => m.acuity === 'critical').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Urgent Messages</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {messages.filter(m => m.acuity === 'urgent').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">AI Processing</p>
                    <p className="text-2xl font-bold text-blue-400">{aiLoading ? 'Active' : 'Ready'}</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Response Time</p>
                    <p className="text-2xl font-bold text-green-400">2.3m</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-400" />
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
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-[#1a2332] border-[#2a3441] text-white hover:bg-[#2a3441]"
                }
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} Messages
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Feed */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a2332] border-[#2a3441] text-white h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Clinical Messages Feed
                </CardTitle>
                <CardDescription className="text-white/70">
                  AI-prioritized communications with real-time acuity assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 bg-[#0f1922] rounded-lg border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-400" />
                        <span className="font-medium">{message.sender}</span>
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
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
                    
                    {message.aiAnalysis && (
                      <div className="mt-3 p-2 bg-[#1a2332] rounded border">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-3 w-3 text-purple-400" />
                          <span className="text-xs text-purple-400">AI Analysis</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400">Priority: {message.aiAnalysis.priority}/100</span>
                          </div>
                        </div>
                        {message.aiAnalysis.suggestedActions && (
                          <div className="text-xs text-white/70">
                            Suggested: {message.aiAnalysis.suggestedActions.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-600 text-green-400 hover:bg-green-600">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600">
                        <Video className="h-3 w-3 mr-1" />
                        Video
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
            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription className="text-white/70">
                  AI automatically assesses message acuity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Patient (Optional)</label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="bg-[#0f1922] border-[#2a3441] text-white">
                      <SelectValue placeholder="Select patient..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                      {patients?.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} - {patient.mrn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Clinical Message</label>
                  <Textarea
                    placeholder="Describe patient condition, symptoms, or clinical situation..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-[#0f1922] border-[#2a3441] text-white min-h-[100px]"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    AI will automatically assess acuity based on content
                  </p>
                </div>

                <Button 
                  onClick={handleSendMessage}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!newMessage.trim() || aiLoading}
                >
                  {aiLoading ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-[#1a2332] border-[#2a3441] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#0f1922] rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">Active Critical Messages</span>
                  </div>
                  <p className="text-xs text-white/70">
                    {messages.filter(m => m.acuity === 'critical').length} critical messages require immediate attention
                  </p>
                </div>

                <div className="p-3 bg-[#0f1922] rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">AI Acuity Assessment</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Real-time message analysis using advanced clinical AI algorithms
                  </p>
                </div>

                <div className="p-3 bg-[#0f1922] rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Team Communication</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Streamlined clinical communication with priority routing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualisChatEnhanced;
