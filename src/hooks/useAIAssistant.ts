
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIRequest {
  type: 'clinical_note' | 'diagnosis_support' | 'medical_coding' | 'medication_check' | 'care_plan' | 'claims_review';
  data: any;
  context?: string;
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (request: AIRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-assistant', {
        body: request
      });

      if (functionError) throw functionError;
      if (data.error) throw new Error(data.error);

      return data.result;
    } catch (err) {
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
