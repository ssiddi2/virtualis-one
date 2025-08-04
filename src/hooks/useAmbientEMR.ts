import { useState, useEffect, useCallback } from 'react';
import { AmbientVoiceProcessor } from '@/utils/AmbientVoiceProcessor';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AmbientMessage {
  id: string;
  type: string;
  content?: string;
  timestamp: Date;
  function_call?: any;
}

export const useAmbientEMR = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<AmbientMessage[]>([]);
  const [processor, setProcessor] = useState<AmbientVoiceProcessor | null>(null);
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

    // Handle transcripts
    if (data.type === 'response.audio_transcript.delta') {
      console.log('Transcript:', data.delta);
    }

    // Handle voice activity
    if (data.type === 'input_audio_buffer.speech_started') {
      setIsListening(true);
    } else if (data.type === 'input_audio_buffer.speech_stopped') {
      setIsListening(false);
    }
  }, []);

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

  const startAmbientMode = useCallback(async () => {
    try {
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
  }, [handleMessage, toast]);

  const stopAmbientMode = useCallback(() => {
    processor?.disconnect();
    setProcessor(null);
    setIsConnected(false);
    setIsListening(false);

    toast({
      title: "Ambient EMR Stopped",
      description: "Voice control has been disabled",
    });
  }, [processor, toast]);

  const sendVoiceCommand = useCallback((command: string) => {
    processor?.sendTextMessage(command);
  }, [processor]);

  useEffect(() => {
    return () => {
      processor?.disconnect();
    };
  }, [processor]);

  return {
    isConnected,
    isListening,
    messages,
    startAmbientMode,
    stopAmbientMode,
    sendVoiceCommand,
    processor
  };
};