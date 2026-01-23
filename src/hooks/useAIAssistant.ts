import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIRequest {
  type: 'clinical_note' | 'clinical_note_with_emr_data' | 'auto_generate_from_emr_only' | 'diagnosis_support' | 'medical_coding' | 'medication_check' | 'care_plan' | 'claims_review' | 'triage_assessment' | 'note_suggestions' | 'snf_billing' | 'denial_prediction' | 'real_time_coding' | 'universal_billing';
  data: any;
  context?: string;
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (request: AIRequest) => {
    setIsLoading(true);
    setError(null);

    console.log('[AI Assistant] Starting request:', request.type);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-assistant', {
        body: request
      });

      console.log('[AI Assistant] Response received:', { data, error: functionError });

      if (functionError) {
        console.error('[AI Assistant] Function error:', functionError);
        throw functionError;
      }
      
      if (data?.error) {
        console.error('[AI Assistant] Data error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.result) {
        console.error('[AI Assistant] No result in response:', data);
        throw new Error('No result received from AI assistant');
      }

      console.log('[AI Assistant] Success:', data.result?.substring?.(0, 100) || data.result);
      return data.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI assistant error';
      console.error('[AI Assistant] Error:', errorMessage, err);
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
