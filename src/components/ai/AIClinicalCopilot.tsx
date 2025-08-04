
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useToast } from '@/hooks/use-toast';
import { useAmbientEMR } from '@/hooks/useAmbientEMR';
import AmbientControlPanel from '@/components/ambient/AmbientControlPanel';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'confirmed' | 'executed' | 'cancelled';
  action?: {
    type: string;
    details: any;
    requiresConfirmation: boolean;
  };
}

interface AIClinicalCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  currentPatient?: any;
  context?: {
    location?: string;
    unit?: string;
    role?: string;
  };
}

const AIClinicalCopilot = ({ 
  isOpen, 
  onClose, 
  currentPatient,
  context 
}: AIClinicalCopilotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAmbientPanel, setShowAmbientPanel] = useState(false);
  const { callAI, isLoading } = useAIAssistant();
  const { toast } = useToast();
  const { isConnected: isAmbientConnected } = useAmbientEMR();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Hello! I'm your AI Clinical Co-pilot. I can help you with:
        
• Patient management ("Switch to patient in room 404")
• Lab orders ("Order CBC for current patient")  
• Clinical notes ("Create progress note")
• Medication orders ("Start Lasix 40mg daily")
• Imaging ("Order chest X-ray")

${currentPatient ? `Current patient: ${currentPatient.first_name} ${currentPatient.last_name}` : 'No patient selected'}
${context?.location ? `Location: ${context.location}` : ''}

What can I help you with?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentPatient, context]);

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: command,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Process with AI
      const response = await callAI({
        type: 'clinical_note',
        data: {
          command,
          currentPatient,
          context,
          intent: 'clinical_copilot'
        },
        context: `Clinical Co-pilot Command Processing. Current patient: ${currentPatient?.first_name} ${currentPatient?.last_name}. Location: ${context?.location || 'Unknown'}`
      });

      // Parse AI response and create appropriate message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response || 'I understand your request. Let me help you with that.',
        timestamp: new Date()
      };

      // Detect if this requires confirmation
      const requiresConfirmation = detectConfirmationNeeded(command);
      if (requiresConfirmation) {
        aiMessage.action = {
          type: detectActionType(command),
          details: parseActionDetails(command),
          requiresConfirmation: true
        };
        aiMessage.status = 'pending';
      }

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI Co-pilot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const detectConfirmationNeeded = (command: string): boolean => {
    const confirmationKeywords = ['order', 'start', 'stop', 'discharge', 'admit', 'schedule'];
    return confirmationKeywords.some(keyword => 
      command.toLowerCase().includes(keyword)
    );
  };

  const detectActionType = (command: string): string => {
    if (command.toLowerCase().includes('lab') || command.toLowerCase().includes('cbc')) return 'lab_order';
    if (command.toLowerCase().includes('medication') || command.toLowerCase().includes('med')) return 'medication_order';
    if (command.toLowerCase().includes('note') || command.toLowerCase().includes('document')) return 'clinical_note';
    if (command.toLowerCase().includes('x-ray') || command.toLowerCase().includes('ct') || command.toLowerCase().includes('mri')) return 'imaging_order';
    return 'general_action';
  };

  const parseActionDetails = (command: string): any => {
    // Simple parsing - in production this would be more sophisticated
    return {
      originalCommand: command,
      extractedEntities: {
        // This would contain parsed patient names, room numbers, medication names, etc.
      }
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const command = input.trim();
    setInput('');
    await processCommand(command);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const confirmAction = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'confirmed' }
          : msg
      )
    );
    toast({
      title: "Action Confirmed",
      description: "Your request is being processed...",
    });
  };

  const cancelAction = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'cancelled' }
          : msg
      )
    );
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'ai': return <Bot className="h-4 w-4 text-blue-400" />;
      case 'system': return <AlertCircle className="h-4 w-4 text-orange-400" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 border-none bg-transparent overflow-hidden">
        <div className="relative h-full">
          {/* Futuristic glassmorphism container */}
          <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-cyan-900/20 rounded-2xl border border-white/20 shadow-2xl">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 blur-sm"></div>
            
            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-cyan-400" />
                  <div className="absolute inset-0 animate-pulse bg-cyan-400/30 rounded-full blur-md"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AI Clinical Co-pilot
                  </h2>
                  <p className="text-white/60 text-sm">
                    {currentPatient ? `${currentPatient.first_name} ${currentPatient.last_name}` : 'No patient selected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isAmbientConnected && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                    <Zap className="h-3 w-3 mr-1" />
                    Ambient
                  </Badge>
                )}
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                  <Activity className="h-3 w-3 mr-1" />
                  Online
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAmbientPanel(!showAmbientPanel)}
                  className="text-white/60 hover:text-white hover:bg-white/5"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex h-[calc(80vh-200px)]">
              {/* Messages Area */}
              <div className="flex-1 p-6">
                <ScrollArea className="h-full">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type !== 'user' && (
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            {getMessageIcon(message.type)}
                          </div>
                          {message.type === 'ai' && (
                            <div className="absolute inset-0 animate-pulse bg-blue-400/30 rounded-full blur-sm"></div>
                          )}
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`p-4 rounded-2xl backdrop-blur-sm border ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-white'
                              : message.type === 'ai'
                              ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/20 text-white'
                              : 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-400/20 text-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                            {getStatusIcon(message.status)}
                          </div>
                          
                          {/* Action confirmation buttons */}
                          {message.action?.requiresConfirmation && message.status === 'pending' && (
                            <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                              <Button
                                size="sm"
                                onClick={() => confirmAction(message.id)}
                                className="bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 text-green-400"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelAction(message.id)}
                                className="bg-red-600/20 hover:bg-red-600/30 border border-red-400/30 text-red-400"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-white/40 mt-1 px-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 animate-pulse" />
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="ml-2 text-sm">Processing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              </div>

              {/* Ambient Control Panel */}
              {showAmbientPanel && (
                <div className="w-80 border-l border-white/10 p-4">
                  <AmbientControlPanel />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="relative p-6 border-t border-white/10">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your command... (e.g., 'Order CBC for patient in room 404')"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm rounded-xl h-12 pr-12"
                    disabled={isProcessing}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsListening(!isListening)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/5"
                  >
                    {isListening ? <Mic className="h-4 w-4 text-red-400 animate-pulse" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
                
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-none h-12 px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-center mt-3">
                <p className="text-xs text-white/40">
                  Press Ctrl+Space to open • Enter to send • Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIClinicalCopilot;
