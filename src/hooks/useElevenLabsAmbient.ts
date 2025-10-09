import { useState } from 'react';
import { useConversation } from '@11labs/react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAlisAI } from '@/contexts/AlisAIContext';

export interface ElevenLabsMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const useElevenLabsAmbient = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ElevenLabsMessage[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateContext, triggerDialog } = useAlisAI();
  
  // Client tools for agent to call
  const clientTools = {
    navigate_to_patient_chart: async ({ patientId, mrn }: { patientId?: string; mrn?: string }) => {
      console.log('[ElevenLabs] Client tool: navigate_to_patient_chart', { patientId, mrn });
      
      // Add action message
      setMessages(prev => [...prev, {
        id: `action-${Date.now()}`,
        type: 'system',
        content: `🔄 Opening patient chart ${patientId ? `for patient ${patientId}` : ''}`,
        timestamp: new Date(),
      }]);
      
      if (patientId) {
        navigate(`/patients/${patientId}`);
        updateContext({ currentPatient: { id: patientId, mrn } });
        toast.success('Opened patient chart', { description: `Patient ID: ${patientId}` });
        return `Successfully opened patient chart for patient ${patientId}`;
      }
      
      return 'Error: Patient ID required';
    },
    
    navigate_to_page: async ({ page }: { page: string }) => {
      console.log('[ElevenLabs] Client tool: navigate_to_page', { page });
      
      // Add action message
      setMessages(prev => [...prev, {
        id: `action-${Date.now()}`,
        type: 'system',
        content: `🔄 Navigating to ${page}`,
        timestamp: new Date(),
      }]);
      
      const validPages: Record<string, string> = {
        'dashboard': '/',
        'cpoe': '/cpoe',
        'clinical': '/clinical',
        'patients': '/patients',
        'my-patients': '/my-patients',
        'ambient': '/ambient',
      };
      
      if (validPages[page.toLowerCase()]) {
        navigate(validPages[page.toLowerCase()]);
        toast.success('Navigated', { description: `Opened ${page} page` });
        return `Successfully navigated to ${page}`;
      }
      
      return `Error: Unknown page "${page}". Available pages: ${Object.keys(validPages).join(', ')}`;
    },
    
    open_order_dialog: async ({ orderType, patientId }: { orderType: string; patientId?: string }) => {
      console.log('[ElevenLabs] Client tool: open_order_dialog', { orderType, patientId });
      
      // Add action message
      setMessages(prev => [...prev, {
        id: `action-${Date.now()}`,
        type: 'system',
        content: `🔄 Opening ${orderType} order dialog`,
        timestamp: new Date(),
      }]);
      
      const validOrderTypes = ['lab', 'medication', 'imaging', 'nursing'];
      
      if (!validOrderTypes.includes(orderType.toLowerCase())) {
        return `Error: Invalid order type "${orderType}". Valid types: ${validOrderTypes.join(', ')}`;
      }
      
      // Navigate to CPOE if not already there
      navigate('/cpoe');
      
      // Trigger the dialog through context
      triggerDialog?.(orderType, patientId);
      
      toast.success('Opening order dialog', { description: `${orderType} order` });
      return `Successfully opened ${orderType} order dialog`;
    },
    
    switch_room: async ({ roomNumber }: { roomNumber: string }) => {
      console.log('[ElevenLabs] Client tool: switch_room', { roomNumber });
      
      // Add action message
      setMessages(prev => [...prev, {
        id: `action-${Date.now()}`,
        type: 'system',
        content: `🔄 Switching to room ${roomNumber}`,
        timestamp: new Date(),
      }]);
      
      updateContext({ currentRoom: roomNumber });
      toast.success('Switched room', { description: `Room ${roomNumber}` });
      return `Successfully switched to room ${roomNumber}`;
    },
    
    search_patients: async ({ query }: { query: string }) => {
      console.log('[ElevenLabs] Client tool: search_patients', { query });
      
      // Add action message
      setMessages(prev => [...prev, {
        id: `action-${Date.now()}`,
        type: 'system',
        content: `🔍 Searching for patients: "${query}"`,
        timestamp: new Date(),
      }]);
      
      // Navigate to patients page with search
      navigate(`/patients?search=${encodeURIComponent(query)}`);
      toast.success('Searching patients', { description: query });
      return `Searching for patients: ${query}`;
    },
  };
  
  const conversation = useConversation({
    clientTools,
    onConnect: () => {
      console.log('[ElevenLabs] ✓ Connected');
      setIsConnected(true);
      setIsListening(true);
      toast.success('Alis AI Connected', {
        description: 'Voice assistant is ready to help',
      });
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] ✗ Disconnected');
      setIsConnected(false);
      setIsListening(false);
    },
    onMessage: (message) => {
      console.log('[ElevenLabs] Message:', message);
      
      // Message format: { message: string, source: 'user' | 'ai' }
      const msgType = message.source === 'user' ? 'user' : 'assistant';
      
      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random()}`,
        type: msgType,
        content: message.message,
        timestamp: new Date(),
      }]);
    },
    onError: (error) => {
      console.error('[ElevenLabs] ✗ Error:', error);
      const errorMessage = typeof error === 'string' ? error : 'Failed to connect to voice assistant';
      toast.error('Connection Error', {
        description: errorMessage,
      });
    },
  });

  const startAmbientMode = async (agentId: string) => {
    try {
      console.log('[ElevenLabs] Starting ambient mode with agent:', agentId);
      setCurrentAgentId(agentId);
      
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get signed URL from our edge function
      console.log('[ElevenLabs] Fetching signed URL...');
      const { data, error } = await supabase.functions.invoke('elevenlabs-session', {
        body: { agentId }
      });

      if (error) {
        console.error('[ElevenLabs] ✗ Failed to get signed URL:', error);
        throw new Error(error.message || 'Failed to generate session URL');
      }

      if (!data?.signed_url) {
        throw new Error('No signed URL received from server');
      }

      console.log('[ElevenLabs] ✓ Got signed URL, starting session...');
      
      // Start the conversation with signed URL
      const conversationId = await conversation.startSession({ 
        signedUrl: data.signed_url 
      });
      
      console.log('[ElevenLabs] ✓ Session started:', conversationId);
      
    } catch (error) {
      console.error('[ElevenLabs] ✗ Failed to start:', error);
      toast.error('Failed to Start', {
        description: error instanceof Error ? error.message : 'Could not start voice assistant',
      });
      throw error;
    }
  };

  const stopAmbientMode = async () => {
    try {
      console.log('[ElevenLabs] Stopping ambient mode');
      await conversation.endSession();
      setIsConnected(false);
      setIsListening(false);
      setCurrentAgentId(null);
      
      toast.info('Alis AI Disconnected', {
        description: 'Voice assistant has been stopped',
      });
    } catch (error) {
      console.error('[ElevenLabs] ✗ Failed to stop:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      await conversation.setVolume({ volume: Math.max(0, Math.min(1, volume)) });
    } catch (error) {
      console.error('[ElevenLabs] ✗ Failed to set volume:', error);
    }
  };

  return {
    // State
    isConnected,
    isListening,
    isSpeaking: conversation.isSpeaking || false,
    messages,
    status: conversation.status,
    currentAgentId,
    
    // Controls
    startAmbientMode,
    stopAmbientMode,
    setVolume,
  };
};
