import { useState, useEffect, useCallback } from 'react';
import { AmbientVoiceProcessor } from '@/utils/AmbientVoiceProcessor';
import { WakeWordDetector } from '@/utils/WakeWordDetector';
import { ClinicalContextManager } from '@/utils/ClinicalContextManager';
import { VoiceCommandLibrary } from '@/utils/VoiceCommandLibrary';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AmbientMessage {
  id: string;
  type: string;
  content?: string;
  timestamp: Date;
  function_call?: any;
}

export const useAmbientEMR = (specialty?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [wakeWordActive, setWakeWordActive] = useState(false);
  const [messages, setMessages] = useState<AmbientMessage[]>([]);
  const [processor, setProcessor] = useState<AmbientVoiceProcessor | null>(null);
  const [wakeWordDetector, setWakeWordDetector] = useState<WakeWordDetector | null>(null);
  const [contextManager, setContextManager] = useState<ClinicalContextManager | null>(null);
  const [commandLibrary, setCommandLibrary] = useState<VoiceCommandLibrary | null>(null);
  const [currentContext, setCurrentContext] = useState<any>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMessage = useCallback((data: any) => {
    const message: AmbientMessage = {
      id: Date.now().toString(),
      type: data.type,
      content: data.content || data.delta,
      timestamp: new Date(),
      function_call: data.function
    };

    setMessages(prev => [...prev, message]);

    // Handle ambient function calls
    if (data.type === 'ambient_function_call') {
      handleAmbientFunction(data.function);
    }

    // Handle transcripts with voice command processing
    if (data.type === 'response.audio_transcript.delta') {
      console.log('Transcript:', data.delta);
      processVoiceCommand(data.delta);
    }

    // Handle voice activity
    if (data.type === 'input_audio_buffer.speech_started') {
      setIsListening(true);
    } else if (data.type === 'input_audio_buffer.speech_stopped') {
      setIsListening(false);
    }

    // Handle AI speaking status
    if (data.type === 'response.audio.delta') {
      setIsSpeaking(true);
      console.log('🔊 AI is speaking (audio delta received)');
    } else if (data.type === 'response.audio.done') {
      setIsSpeaking(false);
      console.log('✅ AI finished speaking');
    }

    // Handle function execution
    if (data.type === 'response.function_call_arguments.done') {
      const functionName = JSON.parse(data.arguments || '{}');
      setCurrentAction(`Executing: ${functionName.section || functionName.order_type || 'action'}`);
      setTimeout(() => setCurrentAction(''), 3000);
    }
  }, []);

  const processVoiceCommand = useCallback((transcript: string) => {
    if (!commandLibrary || !contextManager) return;

    // Check for room changes
    const roomNumber = contextManager.parseRoomFromCommand(transcript);
    if (roomNumber) {
      contextManager.updateRoom(roomNumber);
      toast({
        title: "Room Changed",
        description: `Switched to room ${roomNumber}`,
      });
      return;
    }

    // Check for workflow changes
    const workflowType = contextManager.parseWorkflowFromCommand(transcript);
    if (workflowType) {
      contextManager.updateWorkflowType(workflowType);
      toast({
        title: "Workflow Updated",
        description: `Switched to ${workflowType} workflow`,
      });
    }

    // Match voice commands
    const commandMatch = commandLibrary.matchCommand(transcript);
    if (commandMatch) {
      executeVoiceCommand(commandMatch.command, commandMatch.params);
    }
  }, [commandLibrary, contextManager, toast]);

  const executeVoiceCommand = useCallback((command: any, params?: any) => {
    const result = command.action(params);
    
    switch (result.type) {
      case 'navigate':
        navigate(result.destination);
        toast({
          title: "Navigation",
          description: `Opening ${result.destination.replace('/', '')}${result.section ? ` - ${result.section}` : ''}`,
        });
        break;
      
      case 'switch_room':
        if (contextManager) {
          contextManager.updateRoom(result.room);
        }
        break;
      
      case 'create_note':
        toast({
          title: "Creating Note",
          description: `Creating ${result.noteType} note`,
        });
        break;
      
      case 'create_order':
        toast({
          title: "Processing Order",
          description: `${result.priority ? result.priority + ' ' : ''}${result.orderType} order: ${result.details || result.medication || result.test}`,
        });
        break;
      
      case 'emergency_response':
        toast({
          title: "Emergency Response",
          description: `Initiating ${result.codeType} protocol`,
          variant: "destructive"
        });
        break;
      
      default:
        console.log('Unhandled command result:', result);
    }
  }, [navigate, toast, contextManager]);

  const handleAmbientFunction = useCallback((functionCall: any) => {
    console.log('Handling ambient function:', functionCall);

    switch (functionCall.section || functionCall.order_type || functionCall.note_type) {
      case 'patient_chart':
        navigate('/patients');
        toast({
          title: "Navigation",
          description: "Opening patient chart",
        });
        break;
      
      case 'lab_results':
        navigate('/clinical');
        toast({
          title: "Navigation", 
          description: "Opening lab results",
        });
        break;

      case 'medications':
        navigate('/cpoe');
        toast({
          title: "Navigation",
          description: "Opening medication orders",
        });
        break;

      case 'lab':
        toast({
          title: "Lab Order",
          description: `Processing lab order: ${functionCall.details}`,
        });
        break;

      case 'medication':
        toast({
          title: "Medication Order",
          description: `Processing medication order: ${functionCall.details}`,
        });
        break;

      case 'progress_note':
      case 'soap_note':
        toast({
          title: "Clinical Note",
          description: `Creating ${functionCall.note_type.replace('_', ' ')}`,
        });
        break;

      default:
        console.log('Unhandled function call:', functionCall);
    }
  }, [navigate, toast]);

  const startWakeWordDetection = useCallback(async () => {
    try {
      const detector = new WakeWordDetector(() => {
        startAmbientMode();
      });
      
      await detector.start();
      setWakeWordDetector(detector);
      setWakeWordActive(true);
      
      toast({
        title: "Wake Word Active",
        description: "Say 'Hey Virtualis' to activate ambient mode",
      });
    } catch (error) {
      console.error('Failed to start wake word detection:', error);
      toast({
        title: "Wake Word Failed",
        description: "Could not start wake word detection",
        variant: "destructive"
      });
    }
  }, []);

  const stopWakeWordDetection = useCallback(() => {
    wakeWordDetector?.stop();
    setWakeWordDetector(null);
    setWakeWordActive(false);
    
    toast({
      title: "Wake Word Stopped",
      description: "Wake word detection disabled",
    });
  }, [wakeWordDetector, toast]);

  const startAmbientMode = useCallback(async () => {
    try {
      // Initialize context manager
      const contextMgr = new ClinicalContextManager((context) => {
        setCurrentContext(context);
      });
      setContextManager(contextMgr);

      // Initialize command library
      const cmdLibrary = new VoiceCommandLibrary(specialty);
      setCommandLibrary(cmdLibrary);

      const voiceProcessor = new AmbientVoiceProcessor(
        handleMessage,
        setIsListening
      );

      await voiceProcessor.connect();
      setProcessor(voiceProcessor);
      setIsConnected(true);

      toast({
        title: "Ambient EMR Active",
        description: "Voice-controlled EMR is now listening",
      });
    } catch (error) {
      console.error('Failed to start ambient mode:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to ambient voice processor",
        variant: "destructive"
      });
    }
  }, [handleMessage, toast, specialty]);

  const stopAmbientMode = useCallback(() => {
    processor?.disconnect();
    setProcessor(null);
    setIsConnected(false);
    setIsListening(false);
    setContextManager(null);
    setCommandLibrary(null);
    setCurrentContext({});

    toast({
      title: "Ambient EMR Stopped",
      description: "Voice control has been disabled",
    });
  }, [processor, toast]);

  const sendVoiceCommand = useCallback((command: string) => {
    processor?.sendTextMessage(command);
    // Also process through command library
    processVoiceCommand(command);
  }, [processor, processVoiceCommand]);

  const updateClinicalContext = useCallback((contextUpdate: any) => {
    if (contextManager) {
      Object.entries(contextUpdate).forEach(([key, value]) => {
        switch (key) {
          case 'room':
            contextManager.updateRoom(value as string);
            break;
          case 'patient':
            contextManager.updatePatient(value);
            break;
          case 'unit':
            contextManager.updateUnit(value as string);
            break;
          case 'workflow':
            contextManager.updateWorkflowType(value as any);
            break;
          case 'role':
            contextManager.updatePhysicianRole(value as any);
            break;
          case 'specialty':
            contextManager.updateSpecialty(value as string);
            break;
        }
      });
    }
  }, [contextManager]);

  const getAvailableCommands = useCallback(() => {
    return commandLibrary?.getCommandHelp() || '';
  }, [commandLibrary]);

  useEffect(() => {
    return () => {
      processor?.disconnect();
      wakeWordDetector?.stop();
    };
  }, [processor, wakeWordDetector]);

  return {
    isConnected,
    isListening,
    isSpeaking,
    currentAction,
    wakeWordActive,
    messages,
    currentContext,
    startAmbientMode,
    stopAmbientMode,
    startWakeWordDetection,
    stopWakeWordDetection,
    sendVoiceCommand,
    updateClinicalContext,
    getAvailableCommands,
    processor,
    contextManager,
    commandLibrary
  };
};