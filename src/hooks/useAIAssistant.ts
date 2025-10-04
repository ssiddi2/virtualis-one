
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIRequest {
  type: 'clinical_note' | 'clinical_note_with_emr_data' | 'diagnosis_support' | 'medical_coding' | 'medication_check' | 'care_plan' | 'claims_review' | 'triage_assessment';
  data: any;
  context?: string;
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (request: AIRequest) => {
    console.log('AI Assistant: Starting request', request);
    setIsLoading(true);
    setError(null);

    try {
      console.log('AI Assistant: Calling Supabase function');
      const { data, error: functionError } = await supabase.functions.invoke('ai-assistant', {
        body: request
      });

      console.log('AI Assistant: Function response', { data, error: functionError });

      if (functionError) {
        console.error('AI Assistant: Function error', functionError);
        throw functionError;
      }
      
      if (data?.error) {
        console.error('AI Assistant: Data error', data.error);
        throw new Error(data.error);
      }

      if (!data?.result) {
        console.error('AI Assistant: No result in response', data);
        throw new Error('No result received from AI assistant');
      }

      console.log('AI Assistant: Success', data.result);
      return data.result;
    } catch (err) {
      console.error('AI Assistant: Error caught', err);
      const errorMessage = err instanceof Error ? err.message : 'AI assistant error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callAI,
    isLoading,
    error
  };
};
