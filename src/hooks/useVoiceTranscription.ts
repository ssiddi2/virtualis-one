
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TranscriptionResult {
  text: string;
  confidence?: number;
}

export const useVoiceTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<TranscriptionResult | null> => {
    setIsTranscribing(true);
    setError(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data URL prefix
        };
      });
      reader.readAsDataURL(audioBlob);
      const audioData = await base64Promise;

      // Send to Supabase Edge Function for transcription
      const { data, error: functionError } = await supabase.functions.invoke('voice-transcription', {
        body: { audio: audioData }
      });

      if (functionError) {
        throw functionError;
      }

      if (!data?.text) {
        throw new Error('No transcription result received');
      }

      return {
        text: data.text,
        confidence: data.confidence || 0.95
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transcription failed';
      setError(errorMessage);
      console.error('Voice transcription error:', err);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  return {
    transcribeAudio,
    isTranscribing,
    error
  };
};
