
import { supabase } from '@/lib/supabase';

interface GenerateNoteRequest {
  noteType: string;
  summary: string;
  patientData?: any;
}

export const generateClinicalNote = async (request: GenerateNoteRequest): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-clinical-note', {
      body: request
    });

    if (error) {
      throw error;
    }

    return data.generatedNote;
  } catch (error) {
    console.error('Error generating clinical note:', error);
    throw new Error('Failed to generate clinical note. Please try again.');
  }
};

export const generateAIInsights = async (patientId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-insights', {
      body: { patientId }
    });

    if (error) {
      throw error;
    }

    return data.insights;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw new Error('Failed to generate AI insights.');
  }
};
