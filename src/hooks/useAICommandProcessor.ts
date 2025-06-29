
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAIAssistant } from '@/hooks/useAIAssistant';

interface CommandResult {
  content: string;
  needsConfirmation: boolean;
  confirmationData?: any;
  action?: string;
  executionPlan?: string[];
}

interface PatientContext {
  id: string;
  name: string;
  room: string;
  age: number;
  conditions?: string[];
}

export const useAICommandProcessor = (hospitalId: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { callAI } = useAIAssistant();

  const processCommand = useCallback(async (
    input: string, 
    patientContext?: PatientContext,
    userRole?: string
  ): Promise<CommandResult> => {
    setIsProcessing(true);
    
    try {
      const context = patientContext 
        ? `Current patient: ${patientContext.name} (Room ${patientContext.room}, Age ${patientContext.age})`
        : 'No specific patient context';

      const systemPrompt = `You are V1 Drift, an advanced clinical AI assistant integrated into the Virtualis One™ EMR system. 
      
      Your role is to help healthcare professionals with:
      - Clinical documentation (H&P, progress notes, discharge summaries)
      - Lab and diagnostic review
      - Medication management and safety checks
      - Care team communication
      - Order entry and clinical workflows
      
      Context: ${context}
      User Role: ${userRole || 'Healthcare Provider'}
      Hospital ID: ${hospitalId}
      
      For any clinical action that modifies patient data, you MUST:
      1. Clearly explain what you will do
      2. Request confirmation before execution
      3. Provide specific details about the action
      
      Analyze this command and respond with a JSON object containing:
      {
        "content": "Your response to the user",
        "needsConfirmation": boolean,
        "action": "specific_action_type",
        "confirmationData": { details about the action },
        "executionPlan": ["step1", "step2", ...]
      }`;

      const result = await callAI({
        type: 'clinical_note',
        data: {
          command: input,
          context: context,
          systemPrompt: systemPrompt
        }
      });

      // Parse AI response
      try {
        const parsed = JSON.parse(result);
        return {
          content: parsed.content || result,
          needsConfirmation: parsed.needsConfirmation || false,
          confirmationData: parsed.confirmationData,
          action: parsed.action,
          executionPlan: parsed.executionPlan
        };
      } catch {
        // Fallback for non-JSON responses
        return {
          content: result,
          needsConfirmation: false
        };
      }

    } catch (error) {
      console.error('Command processing error:', error);
      return {
        content: "I apologize, but I encountered an error processing your request. Please try rephrasing your command or contact support if the issue persists.",
        needsConfirmation: false
      };
    } finally {
      setIsProcessing(false);
    }
  }, [callAI, hospitalId]);

  return {
    processCommand,
    isProcessing
  };
};
