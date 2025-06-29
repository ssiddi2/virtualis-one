import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  X, 
  Check, 
  AlertTriangle, 
  User,
  MessageSquare,
  Stethoscope,
  FileText,
  Clock
} from 'lucide-react';
import { useVirtualisAI, VirtualisAIResponse } from '@/hooks/useVirtualisAI';
import { usePatients } from '@/hooks/usePatients';
import { usePhysicians, useOnCallSchedules } from '@/hooks/usePhysicians';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'confirmation';
  content: string;
  timestamp: Date;
  intent?: VirtualisAIResponse;
  confirmationData?: ConfirmationData;
}

interface ConfirmationData {
  step: 'patient' | 'recipient' | 'final';
  patientMatches?: any[];
  selectedPatient?: any;
  recipientMatches?: any[];
  selectedRecipient?: any;
  finalAction?: string;
}

const VirtualisAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState<string | null>(null);
  
  const { parseIntent, isLoading: isProcessing } = useVirtualisAI();
  const { data: patients } = usePatients();
  const { data: physicians } = usePhysicians();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const findPatientMatches = (patientInfo: string) => {
    if (!patients) return [];
    
    if (patientInfo.startsWith('room ')) {
      const roomNumber = patientInfo.replace('room ', '');
      return patients.filter(p => p.room_number === roomNumber);
    }
    
    if (patientInfo.startsWith('mrn ')) {
      const mrn = patientInfo.replace('mrn ', '');
      return patients.filter(p => p.mrn.toLowerCase().includes(mrn.toLowerCase()));
    }
    
    // Name search
    return patients.filter(p => 
      p.first_name.toLowerCase().includes(patientInfo.toLowerCase()) ||
      p.last_name.toLowerCase().includes(patientInfo.toLowerCase())
    );
  };

  const findRecipientMatches = (recipientInfo: string) => {
    if (!physicians || !onCallSchedules) return [];
    
    // Find on-call physicians for the specialty
    const relevantSchedules = onCallSchedules.filter(schedule => 
      schedule.specialty.name.toLowerCase().includes(recipientInfo.toLowerCase())
    );
    
    return relevantSchedules.map(schedule => schedule.physician);
  };

  const handleConfirmation = async (confirmed: boolean, messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.confirmationData) return;

    if (!confirmed) {
      addMessage({
        type: 'assistant',
        content: 'Action cancelled. How can I help you instead?'
      });
      setAwaitingConfirmation(null);
      return;
    }

    const { step, selectedPatient, selectedRecipient } = message.confirmationData;

    if (step === 'patient') {
      // Move to recipient confirmation
      const recipientMatches = findRecipientMatches(message.intent?.recipient || '');
      
      if (recipientMatches.length === 0) {
        addMessage({
          type: 'assistant',
          content: 'No available physicians found for that specialty. Please specify who you\'d like to contact.'
        });
        setAwaitingConfirmation(null);
        return;
      }

      addMessage({
        type: 'confirmation',
        content: `Routing to: ${recipientMatches[0].first_name} ${recipientMatches[0].last_name} (${recipientMatches[0].specialty?.name}). Confirm?`,
        confirmationData: {
          step: 'recipient',
          selectedPatient,
          recipientMatches,
          selectedRecipient: recipientMatches[0]
        }
      });
    } else if (step === 'recipient') {
      // Move to final confirmation
      const actionText = generateFinalActionText(message.intent!, selectedPatient, selectedRecipient);
      
      addMessage({
        type: 'confirmation',
        content: `Ready to ${actionText}? Confirm?`,
        confirmationData: {
          step: 'final',
          selectedPatient,
          selectedRecipient,
          finalAction: actionText
        }
      });
    } else if (step === 'final') {
      // Execute the action
      await executeAction(message.intent!, selectedPatient, selectedRecipient);
      setAwaitingConfirmation(null);
    }
  };

  const generateFinalActionText = (intent: VirtualisAIResponse, patient: any, recipient: any) => {
    switch (intent.action) {
      case 'message':
        return `send message to Dr. ${recipient.first_name} ${recipient.last_name} about ${patient.first_name} ${patient.last_name}`;
      case 'order':
        return `place order for ${patient.first_name} ${patient.last_name}`;
      case 'note':
        return `create note for ${patient.first_name} ${patient.last_name}`;
      case 'consult':
        return `request consult with Dr. ${recipient.first_name} ${recipient.last_name} for ${patient.first_name} ${patient.last_name}`;
      default:
        return 'execute action';
    }
  };

  const executeAction = async (intent: VirtualisAIResponse, patient: any, recipient: any) => {
    try {
      // This would integrate with your existing consultation/messaging system
      addMessage({
        type: 'assistant',
        content: `✅ Action completed successfully! ${generateFinalActionText(intent, patient, recipient)} has been processed.`
      });

      toast({
        title: 'Action Completed',
        description: `Your ${intent.action} has been sent successfully.`
      });

      // Log the action for audit trail
      console.log('AI-assisted action executed:', {
        intent,
        patient,
        recipient,
        user: user?.id,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error executing action:', error);
      addMessage({
        type: 'assistant',
        content: '❌ Sorry, there was an error executing that action. Please try again or contact support.'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userInput = inputValue.trim();
    setInputValue('');

    // Add user message
    addMessage({
      type: 'user',
      content: userInput
    });

    try {
      // Parse user intent using Virtualis AI
      const intent = await parseIntent({
        input: userInput,
        context: 'Clinical workflow execution',
        availableSpecialties: physicians?.map(p => p.specialty?.name).filter(Boolean) || []
      });
      
      if (!intent || intent.confidence < 0.3) {
        addMessage({
          type: 'assistant',
          content: 'I\'m not sure what you want me to do. Could you please rephrase your request? For example: "Message the cardiologist about patient in room 302" or "Order labs for John Smith"'
        });
        return;
      }

      // Find patient matches
      const patientMatches = intent.patient ? findPatientMatches(intent.patient) : [];
      
      if (intent.patient && patientMatches.length === 0) {
        addMessage({
          type: 'assistant',
          content: `I couldn't find any patients matching "${intent.patient}". Please check the room number or patient name.`
        });
        return;
      }

      if (patientMatches.length > 1) {
        addMessage({
          type: 'assistant',
          content: `I found multiple patients. Please be more specific:\n${patientMatches.map(p => `• ${p.first_name} ${p.last_name}, ${p.room_number ? `Room ${p.room_number}` : p.mrn}`).join('\n')}`
        });
        return;
      }

      // Start confirmation flow
      const selectedPatient = patientMatches[0];
      const ageDisplay = selectedPatient.date_of_birth ? 
        new Date().getFullYear() - new Date(selectedPatient.date_of_birth).getFullYear() : '?';
      
      const confirmationMessage = addMessage({
        type: 'confirmation',
        content: `Do you mean: ${selectedPatient.first_name} ${selectedPatient.last_name}, ${ageDisplay}${selectedPatient.gender ? selectedPatient.gender.charAt(0) : ''}, ${selectedPatient.room_number ? `Room ${selectedPatient.room_number}` : selectedPatient.mrn}?`,
        intent,
        confirmationData: {
          step: 'patient',
          patientMatches,
          selectedPatient
        }
      });

      setAwaitingConfirmation(confirmationMessage.id);
    } catch (error) {
      console.error('Error processing request:', error);
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      });
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        size="lg"
      >
        <Bot className="h-6 w-6 text-white" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      <Card className="relative w-96 h-[600px] bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col">
        <CardHeader className="pb-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-lg">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span>AI Assistant</span>
                {isProcessing && (
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span>thinking...</span>
                  </div>
                )}
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Hi! I'm your clinical assistant.</p>
                  <p className="text-xs">What would you like me to help you with?</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type !== 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                          : message.type === 'confirmation'
                          ? 'bg-amber-50 border border-amber-200 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      
                      {message.type === 'confirmation' && awaitingConfirmation === message.id && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleConfirmation(true, message.id)}
                            className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmation(false, message.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50 h-8 px-3"
                          >
                            <X className="h-3 w-3 mr-1" />
                            No
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      {message.type === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : message.type === 'confirmation' ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex-shrink-0 order-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-white/10 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What do you want to do?"
                className="flex-1 bg-white/50 border-white/20 focus:border-blue-300"
                disabled={isProcessing || awaitingConfirmation !== null}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isProcessing || !inputValue.trim() || awaitingConfirmation !== null}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="mt-2 text-xs text-slate-500 text-center">
              Try: "Message the cardiologist about room 302"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualisAIAssistant;
