
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VirtualisAIRequest {
  input: string;
  context?: string;
  availableSpecialties?: string[];
}

export interface VirtualisAIResponse {
  action: 'message' | 'order' | 'note' | 'consult' | 'lab' | 'radiology';
  patient?: string;
  recipient?: string;
  content: string;
  urgency: 'routine' | 'urgent' | 'critical';
  confidence: number;
}

export const useVirtualisAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseIntent = async (request: VirtualisAIRequest): Promise<VirtualisAIResponse | null> => {
    console.log('Virtualis AI: Starting intent parsing', request);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Virtualis AI: Calling Supabase function');
      const { data, error: functionError } = await supabase.functions.invoke('virtualis-ai', {
        body: request
      });

      console.log('Virtualis AI: Function response', { data, error: functionError });

      if (functionError) {
        console.error('Virtualis AI: Function error', functionError);
        throw functionError;
      }
      
      if (data?.error) {
        console.error('Virtualis AI: Data error', data.error);
        throw new Error(data.error);
      }

      if (!data?.result) {
        console.error('Virtualis AI: No result in response', data);
        throw new Error('No result received from Virtualis AI');
      }

      console.log('Virtualis AI: Success', data.result);
      return data.result as VirtualisAIResponse;
    } catch (err) {
      console.error('Virtualis AI: Error caught', err);
      const errorMessage = err instanceof Error ? err.message : 'Virtualis AI error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parseIntent,
    isLoading,
    error
  };
};
