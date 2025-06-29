
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Brain, 
  User, 
  Stethoscope, 
  AlertTriangle,
  Clock,
  Lightbulb,
  Users,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OnCallPhysicianCard from './OnCallPhysicianCard';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'specialty_suggestion' | 'physician_recommendation';
  content: string;
  timestamp: Date;
  specialty?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  physicians?: any[];
  confidence?: number;
}

interface VirtualisChatEnhancedProps {
  currentUser?: any;
}

const VirtualisChatEnhanced = ({ currentUser }: VirtualisChatEnhancedProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m Virtualis AI Clinical Assistant. I can help you with clinical decision support, specialty consultations, and connecting you with on-call physicians. What can I assist you with today?',
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock on-call physicians data
  const mockOnCallPhysicians = {
    cardiology: [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        specialty: 'Interventional Cardiology',
        phone: '(555) 123-4567',
        location: 'Cath Lab 2',
        shift_end: '6:00 AM',
        availability: 'available' as const,
        response_time: '5-10 min'
      },
      {
        id: '2',
        name: 'Dr. Michael Rodriguez',
        specialty: 'Cardiothoracic Surgery',
        phone: '(555) 234-5678',
        location: 'OR Suite 3',
        shift_end: '7:00 AM',
        availability: 'in_surgery' as const,
        response_time: '15-20 min'
      }
    ],
    neurology: [
      {
        id: '3',
        name: 'Dr. Emily Watson',
        specialty: 'Stroke Neurology',
        phone: '(555) 345-6789',
        location: 'Neuro ICU',
        shift_end: '8:00 AM',
        availability: 'available' as const,
        response_time: '3-7 min'
      }
    ],
    emergency: [
      {
        id: '4',
        name: 'Dr. James Park',
        specialty: 'Emergency Medicine',
        phone: '(555) 456-7890',
        location: 'ED Bay 1',
        shift_end: '6:00 AM',
        availability: 'busy' as const,
        response_time: '10-15 min'
      }
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeMessageForSpecialty = (message: string): { specialty: string; urgency: string; confidence: number } | null => {
    const lowerMessage = message.toLowerCase();
    
    // Cardiology keywords
    if (lowerMessage.includes('chest pain') || lowerMessage.includes('cardiac') || lowerMessage.includes('heart') || 
        lowerMessage.includes('mi') || lowerMessage.includes('stemi') || lowerMessage.includes('arrhythmia')) {
      const urgency = lowerMessage.includes('stemi') || lowerMessage.includes('acute') ? 'critical' : 
                    lowerMessage.includes('chest pain') ? 'high' : 'medium';
      return { specialty: 'cardiology', urgency, confidence: 0.85 };
    }
    
    // Neurology keywords
    if (lowerMessage.includes('stroke') || lowerMessage.includes('seizure') || lowerMessage.includes('neuro') ||
        lowerMessage.includes('headache') || lowerMessage.includes('weakness') || lowerMessage.includes('altered mental')) {
      const urgency = lowerMessage.includes('stroke') || lowerMessage.includes('seizure') ? 'critical' : 'high';
      return { specialty: 'neurology', urgency, confidence: 0.82 };
    }
    
    // Emergency keywords
    if (lowerMessage.includes('trauma') || lowerMessage.includes('emergency') || lowerMessage.includes('urgent') ||
        lowerMessage.includes('critical') || lowerMessage.includes('code')) {
      return { specialty: 'emergency', urgency: 'critical', confidence: 0.90 };
    }

    return null;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Analyze message for specialty recommendation
    const specialtyAnalysis = analyzeMessageForSpecialty(newMessage);

    setTimeout(() => {
      if (specialtyAnalysis) {
        // Add AI specialty suggestion
        const specialtySuggestion: Message = {
          id: (Date.now() + 1).toString(),
          type: 'specialty_suggestion',
          content: `Based on your clinical scenario, I recommend consulting with ${specialtyAnalysis.specialty}. The urgency level appears to be ${specialtyAnalysis.urgency}.`,
          timestamp: new Date(),
          specialty: specialtyAnalysis.specialty,
          urgency: specialtyAnalysis.urgency as any,
          confidence: specialtyAnalysis.confidence
        };

        setMessages(prev => [...prev, specialtySuggestion]);

        // Add on-call physician recommendations
        setTimeout(() => {
          const physicians = mockOnCallPhysicians[specialtyAnalysis.specialty as keyof typeof mockOnCallPhysicians] || [];
          
          if (physicians.length > 0) {
            const physicianRecommendation: Message = {
              id: (Date.now() + 2).toString(),
              type: 'physician_recommendation',
              content: `Here are the on-call ${specialtyAnalysis.specialty} specialists currently available:`,
              timestamp: new Date(),
              specialty: specialtyAnalysis.specialty,
              physicians: physicians
            };

            setMessages(prev => [...prev, physicianRecommendation]);
          }
          setIsTyping(false);
        }, 1000);
      } else {
        // Regular AI response
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I understand your query about "${newMessage}". Based on the clinical context, I can help you with differential diagnosis, treatment recommendations, or connect you with the appropriate specialist. Would you like me to provide more specific clinical guidance or suggest a consultation?`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleContactPhysician = (physicianId: string) => {
    const physician = Object.values(mockOnCallPhysicians).flat().find(p => p.id === physicianId);
    if (physician) {
      toast({
        title: "Contacting Physician",
        description: `Connecting you with ${physician.name} at ${physician.phone}`,
      });
      
      // Add system message about contact
      const contactMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `📞 Initiating contact with ${physician.name}. They typically respond within ${physician.response_time}. You can also call directly at ${physician.phone}.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, contactMessage]);
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'high': return 'bg-orange-500/20 text-orange-200 border-orange-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-6xl mx-auto">
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 shadow-2xl h-[calc(100vh-3rem)]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Virtualis AI Clinical Assistant</h1>
                <p className="text-sm text-white/70 font-normal">Intelligent clinical decision support with specialist routing</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col h-[calc(100%-5rem)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {/* Regular message */}
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
                        : message.type === 'specialty_suggestion'
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30'
                        : message.type === 'physician_recommendation'
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30'
                        : 'bg-blue-600/30 border border-blue-400/30'
                    } backdrop-blur-sm`}>
                      <div className="flex items-start gap-3">
                        {message.type !== 'user' && (
                          <div className="mt-1">
                            {message.type === 'specialty_suggestion' ? (
                              <Lightbulb className="h-4 w-4 text-orange-300" />
                            ) : message.type === 'physician_recommendation' ? (
                              <Users className="h-4 w-4 text-green-300" />
                            ) : (
                              <Brain className="h-4 w-4 text-blue-300" />
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-white">{message.content}</p>
                          
                          {/* Specialty and urgency badges */}
                          {message.specialty && message.urgency && (
                            <div className="flex gap-2 mt-2">
                              <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                                <Stethoscope className="h-3 w-3 mr-1" />
                                {message.specialty}
                              </Badge>
                              <Badge className={getUrgencyColor(message.urgency)}>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {message.urgency} urgency
                              </Badge>
                              {message.confidence && (
                                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                                  {Math.round(message.confidence * 100)}% confidence
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                            <Clock className="h-3 w-3" />
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* On-call physicians cards */}
                  {message.physicians && message.physicians.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {message.physicians.map((physician) => (
                        <OnCallPhysicianCard
                          key={physician.id}
                          physician={physician}
                          onContact={handleContactPhysician}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-blue-600/30 border border-blue-400/30 backdrop-blur-sm p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Brain className="h-4 w-4 text-blue-300 animate-pulse" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-blue-400/30 pt-4">
              <div className="flex gap-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe your clinical scenario or ask for specialist consultation..."
                  className="flex-1 bg-blue-600/20 border-blue-400/30 text-white placeholder:text-white/50 resize-none"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setNewMessage('Patient with chest pain, needs cardiology consult')}
                  className="border-blue-400/30 text-white hover:bg-blue-500/20"
                >
                  Chest Pain Consult
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setNewMessage('Possible stroke patient, urgent neurology needed')}
                  className="border-blue-400/30 text-white hover:bg-blue-500/20"
                >
                  Stroke Alert
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setNewMessage('Complex case, need multi-specialty input')}
                  className="border-blue-400/30 text-white hover:bg-blue-500/20"
                >
                  Multi-Specialty
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VirtualisChatEnhanced;
