import { useState, useRef, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { toast } from 'sonner';

export interface ElevenLabsMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const useElevenLabsAmbient = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ElevenLabsMessage[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('[ElevenLabs] ✓ Connected');
      setIsConnected(true);
      toast.success('Alis AI Connected', {
        description: 'Voice assistant is ready to help',
      });
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] ✗ Disconnected');
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
    },
    onMessage: (message) => {
      console.log('[ElevenLabs] Message:', message);
      
      // Handle different message types
      if (message.type === 'user_transcript') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'user',
          content: message.message,
          timestamp: new Date(),
        }]);
        setIsListening(false);
      } else if (message.type === 'agent_response') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: message.message,
          timestamp: new Date(),
        }]);
      }
    },
    onError: (error) => {
      console.error('[ElevenLabs] ✗ Error:', error);
      toast.error('Connection Error', {
        description: error.message || 'Failed to connect to voice assistant',
      });
    },
  });

  // Monitor speaking state from conversation hook
  useEffect(() => {
    setIsSpeaking(conversation.isSpeaking || false);
  }, [conversation.isSpeaking]);

  const startAmbientMode = async (agentId: string) => {
    try {
      console.log('[ElevenLabs] Starting ambient mode with agent:', agentId);
      setCurrentAgentId(agentId);
      
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation with the agent ID
      const conversationId = await conversation.startSession({ 
        agentId 
      });
      
      console.log('[ElevenLabs] ✓ Session started:', conversationId);
      setIsListening(true);
      
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
      setIsSpeaking(false);
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
    isSpeaking,
    messages,
    status: conversation.status,
    currentAgentId,
    
    // Controls
    startAmbientMode,
    stopAmbientMode,
    setVolume,
  };
};
