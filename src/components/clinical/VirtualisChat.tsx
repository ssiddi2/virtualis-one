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
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { usePatients } from "@/hooks/usePatients";
import { useSpecialties, useOnCallSchedules } from "@/hooks/usePhysicians";
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
    recommendedSpecialty?: string;
    acuity: 'critical' | 'urgent' | 'routine';
  };
}

interface VirtualisChatProps {
  hospitalId?: string;
  currentUser?: any;
}

const VirtualisChat = ({ hospitalId, currentUser }: VirtualisChatProps) => {
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const { data: patients } = usePatients(hospitalId);
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'urgent' | 'mine'>('all');
  const [smartRoutingOpen, setSmartRoutingOpen] = useState(false);
  const [selectedMessageForRouting, setSelectedMessageForRouting] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    if (!hospitalId) return;
    
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
          suggestedActions: ['Confirm availability', 'Prepare discharge summary'],
          acuity: 'routine'
        }
      }
    ];
    setMessages(mockMessages);
  }, [hospitalId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'bg-red-600/30 text-red-100 border-red-500/50';
      case 'urgent': return 'bg-yellow-600/30 text-yellow-100 border-yellow-500/50';
      case 'routine': return 'bg-green-600/30 text-green-100 border-green-500/50';
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

  const analyzeMessageWithAI = async (content: string, patientId?: string) => {
    try {
      // Get patient context if available
      const selectedPatientData = patients?.find(p => p.id === patientId);
      const patientContext = selectedPatientData ? 
        `Patient: ${selectedPatientData.first_name} ${selectedPatientData.last_name}, Age: ${selectedPatientData.date_of_birth}, Medical Conditions: ${selectedPatientData.medical_conditions?.join(', ') || 'None'}, Allergies: ${selectedPatientData.allergies?.join(', ') || 'None'}` : '';

      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: content,
          patientContext: patientContext
        },
        context: `Healthcare communication triage and specialty recommendation. Analyze the clinical message and determine priority level (0-100), acuity (critical/urgent/routine), and recommend appropriate medical specialty for consultation. Consider patient context if provided.`
      });

      // Parse AI response to extract priority, acuity, and recommendations
      const priority = extractPriority(result);
      const acuity = extractAcuity(result, priority);
      const recommendedSpecialty = extractRecommendedSpecialty(result);
      
      const aiAnalysis = {
        priority: priority,
        keywords: extractKeywords(content),
        suggestedActions: extractSuggestedActions(result),
        recommendedSpecialty: recommendedSpecialty,
        acuity: acuity as 'critical' | 'urgent' | 'routine'
      };

      return aiAnalysis;
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback analysis based on keywords
      const priority = determineFallbackPriority(content);
      const acuity = priority > 80 ? 'critical' : priority > 50 ? 'urgent' : 'routine';
      
      return {
        priority: priority,
        keywords: extractKeywords(content),
        suggestedActions: ['Review and respond'],
        recommendedSpecialty: determineFallbackSpecialty(content),
        acuity: acuity as 'critical' | 'urgent' | 'routine'
      };
    }
  };

  const extractPriority = (aiResponse: string): number => {
    // Look for priority indicators in AI response
    const criticalKeywords = ['emergency', 'critical', 'immediate', 'urgent', 'distress', 'crisis'];
    const urgentKeywords = ['pain', 'concern', 'monitoring', 'follow-up', 'assessment'];
    
    const lowerResponse = aiResponse.toLowerCase();
    let priority = 30; // baseline routine priority
    
    criticalKeywords.forEach(keyword => {
      if (lowerResponse.includes(keyword)) priority += 30;
    });
    
    urgentKeywords.forEach(keyword => {
      if (lowerResponse.includes(keyword)) priority += 15;
    });
    
    return Math.min(priority, 100);
  };

  const extractAcuity = (aiResponse: string, priority: number): string => {
    const lowerResponse = aiResponse.toLowerCase();
    
    if (priority > 80 || lowerResponse.includes('critical') || lowerResponse.includes('emergency')) {
      return 'critical';
    } else if (priority > 50 || lowerResponse.includes('urgent') || lowerResponse.includes('immediate')) {
      return 'urgent';
    } else {
      return 'routine';
    }
  };

  const determineFallbackPriority = (content: string): number => {
    const lowerContent = content.toLowerCase();
    const criticalKeywords = ['emergency', 'critical', 'distress', 'dropping', 'immediate'];
    const urgentKeywords = ['pain', 'increased', 'concern', 'monitoring'];
    
    let priority = 30;
    criticalKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) priority += 25;
    });
    urgentKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) priority += 15;
    });
    
    return Math.min(priority, 100);
  };

  const extractKeywords = (content: string): string[] => {
    const keywords = [];
    const medicalTerms = ['pain', 'distress', 'emergency', 'urgent', 'critical', 'post-op', 'surgical', 'discharge', 'respiratory', 'oxygen', 'saturation'];
    medicalTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        keywords.push(term);
      }
    });
    return keywords.length > 0 ? keywords : ['clinical message'];
  };

  const extractSuggestedActions = (aiResponse: string): string[] => {
    const actions = [];
    if (aiResponse.toLowerCase().includes('consult')) actions.push('Request consultation');
    if (aiResponse.toLowerCase().includes('assessment')) actions.push('Clinical assessment');
    if (aiResponse.toLowerCase().includes('monitor')) actions.push('Monitor patient');
    if (aiResponse.toLowerCase().includes('immediate')) actions.push('Immediate intervention');
    return actions.length > 0 ? actions : ['Review and respond'];
  };

  const extractRecommendedSpecialty = (aiResponse: string): string | undefined => {
    const lowerResponse = aiResponse.toLowerCase();
    const specialtyMappings = [
      { keywords: ['heart', 'cardiac', 'chest pain', 'arrhythmia'], specialty: 'Cardiology' },
      { keywords: ['respiratory', 'breathing', 'lung', 'oxygen', 'pneumonia'], specialty: 'Pulmonology' },
      { keywords: ['surgery', 'surgical', 'post-op', 'operative', 'incision'], specialty: 'Surgery' },
      { keywords: ['neuro', 'seizure', 'stroke', 'headache', 'confusion'], specialty: 'Neurology' },
      { keywords: ['emergency', 'critical', 'trauma', 'urgent'], specialty: 'Emergency Medicine' },
      { keywords: ['infection', 'fever', 'sepsis', 'antibiotic'], specialty: 'Internal Medicine' },
      { keywords: ['bone', 'fracture', 'joint', 'orthopedic'], specialty: 'Orthopedics' },
      { keywords: ['imaging', 'scan', 'x-ray', 'mri', 'ct'], specialty: 'Radiology' }
    ];

    for (const mapping of specialtyMappings) {
      if (mapping.keywords.some(keyword => lowerResponse.includes(keyword))) {
        return mapping.specialty;
      }
    }

    return undefined;
  };

  const determineFallbackSpecialty = (content: string): string | undefined => {
    return extractRecommendedSpecialty(content);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Get AI analysis for the new message with patient context
    const aiAnalysis = await analyzeMessageWithAI(newMessage, selectedPatient);
    const selectedPatientData = patients?.find(p => p.id === selectedPatient);

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: currentUser?.name || 'Current User',
      senderRole: currentUser?.role || 'Healthcare Provider',
      timestamp: new Date(),
      acuity: aiAnalysis.acuity,
      patientId: selectedPatient || undefined,
      patientName: selectedPatientData ? `${selectedPatientData.first_name} ${selectedPatientData.last_name}` : undefined,
      recommendedSpecialty: aiAnalysis.recommendedSpecialty,
      aiAnalysis: aiAnalysis
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setSelectedPatient('');
    
    toast({
      title: "Message Sent",
      description: `AI determined ${aiAnalysis.acuity} acuity with ${aiAnalysis.priority}/100 urgency score.${aiAnalysis.recommendedSpecialty ? ` Recommends ${aiAnalysis.recommendedSpecialty} consultation.` : ''}`,
    });

    // Auto-suggest routing for critical/urgent messages
    if (aiAnalysis.acuity === 'critical' || aiAnalysis.acuity === 'urgent') {
      setTimeout(() => {
        toast({
          title: "Smart Routing Available",
          description: `AI recommends ${aiAnalysis.recommendedSpecialty || 'specialist'} consultation for this ${aiAnalysis.acuity} message.`,
          action: (
            <Button
              size="sm"
              onClick={() => handleSmartRouting(message)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Route Now
            </Button>
          ),
        });
      }, 2000);
    }
  };

  const handleSmartRouting = (message: Message) => {
    setSelectedMessageForRouting(message);
    setSmartRoutingOpen(true);
  };

  const handleSmartRoutingSend = (messageData: any) => {
    setSmartRoutingOpen(false);
    setSelectedMessageForRouting(null);
    
    toast({
      title: "Smart Routing Completed",
      description: `Message routed to ${messageData.specialty || messageData.physician}`,
    });
  };

  // Get on-call physician for a specialty
  const getOnCallPhysician = (specialtyName?: string) => {
    if (!specialtyName || !specialties || !onCallSchedules) return null;
    
    const specialty = specialties.find(s => s.name.toLowerCase().includes(specialtyName.toLowerCase()));
    if (!specialty) return null;
    
    const onCallSchedule = onCallSchedules.find(schedule => 
      schedule.specialty_id === specialty.id && schedule.is_primary
    );
    
    return onCallSchedule?.physician || null;
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

  if (!hospitalId) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">No Hospital Selected</CardTitle>
            <CardDescription className="text-white/70 text-center">
              Please select a hospital from the dashboard to access Virtualis Chat
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
              <p className="text-white/70">AI-Powered Clinical Communication with Acuity-Based Smart Routing</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Critical Acuity</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.acuity === 'critical').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Moderate Acuity</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.acuity === 'urgent').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Low Acuity</p>
                    <p className="text-2xl font-bold text-white">
                      {messages.filter(m => m.acuity === 'routine').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-300" />
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
                  AI-Prioritized Clinical Messages with Acuity Assessment
                </CardTitle>
                <CardDescription className="text-white/70">
                  Messages sorted by acuity level and AI priority score
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {filteredMessages.map((message) => {
                  const onCallPhysician = getOnCallPhysician(message.recommendedSpecialty);
                  
                  return (
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
                          <Badge className={`text-xs font-semibold border ${getAcuityColor(message.acuity)}`}>
                            {getAcuityIcon(message.acuity)}
                            <span className="ml-1">{message.acuity.toUpperCase()} ACUITY</span>
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
                          {onCallPhysician && (
                            <Badge className="bg-green-600/20 text-green-300 border border-green-400/30 text-xs ml-2">
                              On Call: {onCallPhysician.first_name} {onCallPhysician.last_name}
                            </Badge>
                          )}
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
                            <Badge className={`${getAcuityColor(message.aiAnalysis.acuity)} text-xs border font-semibold`}>
                              {message.aiAnalysis.acuity.toUpperCase()}
                            </Badge>
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
                        {onCallPhysician && (
                          <Button size="sm" variant="outline" className="border-green-400/30 text-green-300 hover:bg-green-600/20">
                            <Phone className="h-3 w-3 mr-1" />
                            Call {onCallPhysician.first_name}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                  AI will automatically determine acuity level and suggest specialist routing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Select Patient (Optional)</label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="bg-blue-600/20 border border-blue-400/30 text-white">
                      <SelectValue placeholder="Choose patient for context..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                      <SelectItem value="">No specific patient</SelectItem>
                      {patients?.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} - {patient.mrn}
                          {patient.room_number && ` (Room ${patient.room_number})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPatient && (
                    <p className="text-xs text-white/60 mt-1">
                      Patient context will help AI provide better acuity assessment and specialty recommendations
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Clinical Message</label>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Describe the clinical situation... AI will analyze urgency, determine acuity level (Critical/Moderate/Low), and recommend appropriate specialty consultation."
                    className="bg-blue-600/20 border border-blue-400/30 text-white placeholder:text-white/60 min-h-[100px]"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Brain className="h-3 w-3 text-purple-300" />
                    <p className="text-xs text-white/60">
                      AI will auto-determine: Acuity Level (Critical/Moderate/Low) → Priority Score → Specialty Recommendation → On-Call Routing
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || aiLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {aiLoading ? 'AI Analyzing Acuity...' : 'Send & AI Route'}
                </Button>
              </CardContent>
            </Card>

            {/* AI Routing Preview */}
            {selectedPatient && patients && (
              <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-300" />
                    Patient Context Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(() => {
                    const patient = patients.find(p => p.id === selectedPatient);
                    return patient ? (
                      <div className="text-sm text-white/80">
                        <p><span className="text-purple-300">Name:</span> {patient.first_name} {patient.last_name}</p>
                        <p><span className="text-purple-300">Room:</span> {patient.room_number || 'Not assigned'}</p>
                        <p><span className="text-purple-300">Conditions:</span> {patient.medical_conditions?.join(', ') || 'None listed'}</p>
                        <p><span className="text-purple-300">Allergies:</span> {patient.allergies?.join(', ') || 'None listed'}</p>
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30 justify-start">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Emergency Consult
                </Button>
                <Button className="w-full bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30 justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Discharge Planning
                </Button>
                <Button className="w-full bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30 justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team Conference
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
        onSend={handleSmartRoutingSend}
      />
    </div>
  );
};

export default VirtualisChat;
