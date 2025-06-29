
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Send, 
  User, 
  Bot, 
  Volume2, 
  Settings,
  Activity,
  FileText,
  TestTube,
  Pill,
  Users,
  Brain,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePatients } from '@/hooks/usePatients';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  needsConfirmation?: boolean;
  confirmationData?: any;
  isExecuting?: boolean;
}

interface V1DriftAssistantProps {
  hospitalId: string;
  patientId?: string;
  roomNumber?: string;
}

const V1DriftAssistant = ({ hospitalId, patientId, roomNumber }: V1DriftAssistantProps) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { data: patients } = usePatients(hospitalId);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${profile?.first_name || 'Doctor'}! I'm V1 Drift, your clinical AI assistant. I can help you with patient documentation, lab reviews, medication orders, and care coordination. What would you like to do today?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set current patient context
  useEffect(() => {
    if (patientId && patients) {
      const patient = patients.find(p => p.id === patientId);
      setCurrentPatient(patient);
    } else if (roomNumber && patients) {
      const patient = patients.find(p => p.room_number === roomNumber);
      setCurrentPatient(patient);
    }
  }, [patientId, roomNumber, patients]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processVoiceInput(audioBlob);
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert to base64 for transmission
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result as string;
        const audioData = base64Audio.split(',')[1];
        
        // Send to voice transcription service
        const response = await fetch('/api/transcribe-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: audioData })
        });
        
        const result = await response.json();
        if (result.text) {
          processUserInput(result.text);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      toast({
        title: "Transcription Error",
        description: "Unable to process voice input. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processUserInput = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Send to AI assistant for processing
      const response = await processAICommand(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        needsConfirmation: response.needsConfirmation,
        confirmationData: response.confirmationData
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again or rephrase your command.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processAICommand = async (input: string) => {
    // AI command processing logic
    const context = currentPatient ? `Patient: ${currentPatient.first_name} ${currentPatient.last_name} (Room ${currentPatient.room_number})` : '';
    
    // Mock AI processing - replace with actual AI service
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        if (input.toLowerCase().includes('write') && input.toLowerCase().includes('note')) {
          resolve({
            content: `I can help you write a clinical note${currentPatient ? ` for ${currentPatient.first_name} ${currentPatient.last_name}` : ''}. Would you like me to create a progress note, H&P, or discharge summary?`,
            needsConfirmation: true,
            confirmationData: { action: 'write_note', patient: currentPatient }
          });
        } else if (input.toLowerCase().includes('lab') || input.toLowerCase().includes('result')) {
          resolve({
            content: `I'll help you review lab results${currentPatient ? ` for ${currentPatient.first_name} ${currentPatient.last_name}` : ''}. Let me pull the latest lab data...`,
            needsConfirmation: false
          });
        } else {
          resolve({
            content: `I understand you want to: "${input}". Could you provide more details about what specific action you'd like me to take?`,
            needsConfirmation: false
          });
        }
      }, 1500);
    });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      processUserInput(inputText);
    }
  };

  const handleConfirmAction = (messageId: string, confirmed: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, needsConfirmation: false, isExecuting: confirmed }
        : msg
    ));

    if (confirmed) {
      // Execute the confirmed action
      const confirmedMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "Action confirmed and executed successfully. The documentation has been updated.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmedMessage]);
    }
  };

  const suggestionCommands = [
    { icon: FileText, text: "Write progress note for Room 205", category: "Documentation" },
    { icon: TestTube, text: "Review latest lab results", category: "Labs" },
    { icon: Pill, text: "Check medication interactions", category: "Medications" },
    { icon: Users, text: "Notify care team about patient status", category: "Communication" },
    { icon: Activity, text: "Summary of vital signs trends", category: "Vitals" }
  ];

  return (
    <div className="flex h-full max-h-screen">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  V1 Drift
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="h-4 w-4 text-cyan-400" />
                  </motion.div>
                </h2>
                <p className="text-sm text-blue-300">Clinical AI Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {currentPatient && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                  {currentPatient.first_name} {currentPatient.last_name} - Room {currentPatient.room_number}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVoiceMode(!voiceMode)}
                className={`border-white/20 ${voiceMode ? 'bg-blue-500/20 text-blue-300' : 'text-white/70'}`}
              >
                {voiceMode ? <Volume2 className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-slate-800/50 text-white border border-white/10'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.needsConfirmation && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmAction(message.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm & Execute
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfirmAction(message.id, false)}
                          className="border-white/20 text-white/70"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="p-2 bg-slate-700 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-slate-800/50 text-white border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="h-4 w-4 text-blue-400" />
                    </motion.div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-slate-800/30 backdrop-blur-sm">
          <form onSubmit={handleTextSubmit} className="flex gap-3">
            {voiceMode && (
              <Button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`p-3 transition-all ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            )}
            
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything about patient care, documentation, or clinical tasks..."
              className="flex-1 bg-slate-700/50 border-white/20 text-white placeholder:text-white/50"
              disabled={isProcessing || isListening}
            />
            
            <Button
              type="submit"
              disabled={!inputText.trim() || isProcessing || isListening}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Suggestions Sidebar */}
      <div className="w-80 bg-slate-800/30 backdrop-blur-sm border-l border-white/10 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Commands</h3>
        <div className="space-y-3">
          {suggestionCommands.map((cmd, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full text-left justify-start h-auto p-3 border-white/10 hover:bg-white/5"
                onClick={() => processUserInput(cmd.text)}
              >
                <cmd.icon className="h-4 w-4 mr-3 text-blue-400" />
                <div>
                  <div className="text-white text-sm">{cmd.text}</div>
                  <div className="text-white/50 text-xs">{cmd.category}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default V1DriftAssistant;
