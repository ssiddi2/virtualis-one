import { useState, useEffect, useCallback } from 'react';
import { AmbientVoiceProcessor } from '@/utils/AmbientVoiceProcessor';
import { WakeWordDetector } from '@/utils/WakeWordDetector';
import { ClinicalContextManager } from '@/utils/ClinicalContextManager';
import { VoiceCommandLibrary } from '@/utils/VoiceCommandLibrary';
import { toast } from '@/hooks/use-toast';
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
  const navigate = useNavigate();

  const addMessage = useCallback((msgData: Partial<AmbientMessage>) => {
    const message: AmbientMessage = {
      id: Date.now().toString() + Math.random(),
      type: msgData.type || 'unknown',
      content: msgData.content || '',
      timestamp: new Date(),
      function_call: msgData.function_call
    };
    
    setMessages(prev => [...prev, message]);
  }, []);

  const handleMessage = useCallback((data: any) => {
    console.log('[useAmbientEMR] 📨 Message:', data.type);
    
    // Handle transcription completed
    if (data.type === 'conversation.item.input_audio_transcription.completed') {
      const transcript = data.transcript || '';
      console.log('[useAmbientEMR] ✓ Transcription:', transcript);
      addMessage({
        type: 'user_speech',
        content: transcript,
      });
    }

    // Handle transcription failure - CRITICAL FOR DEBUGGING
    if (data.type === 'conversation.item.input_audio_transcription.failed') {
      console.error('[useAmbientEMR] ✗ Transcription failed:', data);
      toast({
        title: "Audio Issue",
        description: "Having trouble hearing you. Try speaking louder or check your microphone.",
        variant: "destructive",
      });
      addMessage({
        type: 'system_error',
        content: 'Transcription failed - please try again',
      });
    }

    // Handle voice activity detection
    if (data.type === 'input_audio_buffer.speech_started') {
      console.log('[useAmbientEMR] 🎤 Speech started');
      setIsListening(true);
    }

    if (data.type === 'input_audio_buffer.speech_stopped') {
      console.log('[useAmbientEMR] 🎤 Speech stopped');
      setIsListening(false);
    }

    // Handle AI speaking status
    if (data.type === 'response.audio.delta') {
      setIsSpeaking(true);
    }

    if (data.type === 'response.audio.done') {
      console.log('[useAmbientEMR] 🔊 AI finished speaking');
      setTimeout(() => setIsSpeaking(false), 500);
    }

    // Handle AI text transcript
    if (data.type === 'response.audio_transcript.delta') {
      const delta = data.delta || '';
      addMessage({
        type: 'assistant_speech',
        content: delta,
      });
    }

    // Handle function calls
    if (data.type === 'response.function_call_arguments.done') {
      const functionName = data.name || 'action';
      console.log('[useAmbientEMR] ⚡ Function call:', functionName);
      setCurrentAction(functionName);
      addMessage({
        type: 'ambient_function_call',
        content: `Executing: ${functionName}`,
        function_call: data,
      });

      executeFunctionCall(data);
    }

    // Handle response complete
    if (data.type === 'response.done') {
      console.log('[useAmbientEMR] ✓ Response complete');
      setCurrentAction('');
    }

    // Process voice commands from transcript
    if (data.type === 'response.audio_transcript.delta') {
      processVoiceCommand(data.delta);
    }

    // Handle ambient function calls
    if (data.type === 'ambient_function_call') {
      handleAmbientFunction(data.function);
    }
  }, []);

  const executeFunctionCall = useCallback((data: any) => {
    try {
      const functionArgs = JSON.parse(data.arguments || '{}');
      console.log('[useAmbientEMR] 🔧 Executing function:', functionArgs);
      handleAmbientFunction(functionArgs);
    } catch (error) {
      console.error('[useAmbientEMR] ✗ Failed to execute function:', error);
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
  }, [commandLibrary, contextManager]);

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
        console.log('[useAmbientEMR] Unhandled command result:', result);
    }
  }, [navigate, contextManager]);

  const handleAmbientFunction = useCallback((functionCall: any) => {
    console.log('[useAmbientEMR] 🎯 Handling ambient function:', functionCall);

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
        console.log('[useAmbientEMR] Unhandled function call:', functionCall);
    }
  }, [navigate]);

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
      console.error('[useAmbientEMR] ✗ Failed to start wake word:', error);
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
  }, [wakeWordDetector]);

  const startAmbientMode = useCallback(async () => {
    try {
      console.log('[useAmbientEMR] 🚀 Starting ambient mode...');
      
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

      console.log('[useAmbientEMR] ✓ Ambient mode active');
      toast({
        title: "Alis AI Connected",
        description: "Listening for your voice commands",
      });

      return true;
    } catch (error) {
      console.error('[useAmbientEMR] ✗ Failed to start ambient mode:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Could not connect to ambient voice processor",
        variant: "destructive"
      });
      return false;
    }
  }, [handleMessage, specialty]);

  const stopAmbientMode = useCallback(() => {
    console.log('[useAmbientEMR] 🛑 Stopping ambient mode...');
    
    processor?.disconnect();
    setProcessor(null);
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setCurrentAction('');
    setContextManager(null);
    setCommandLibrary(null);
    setCurrentContext({});

    console.log('[useAmbientEMR] ✓ Stopped');
    toast({
      title: "Alis AI Disconnected",
      description: "Voice mode deactivated",
    });
  }, [processor]);

  const sendVoiceCommand = useCallback((command: string) => {
    console.log('[useAmbientEMR] 💬 Sending command:', command);
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
