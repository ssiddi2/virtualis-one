import { useState } from 'react';
import { useConversation } from '@11labs/react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  
  const conversation = useConversation({
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
