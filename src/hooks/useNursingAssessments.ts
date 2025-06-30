
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NursingAssessment {
  id: string;
  patient_id: string;
  nurse_id: string;
  assessment_type: string;
  assessment_data: any;
  vital_signs?: any;
  pain_scale?: number;
  mobility_status?: string;
  skin_integrity?: string;
  fall_risk_score?: number;
  created_at: string;
  updated_at: string;
}

export const useNursingAssessments = (patientId?: string) => {
  return useQuery({
    queryKey: ['nursing_assessments', patientId],
    queryFn: async () => {
      let query = supabase.from('nursing_assessments').select('*');
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as NursingAssessment[];
    },
  });
};

export const useCreateNursingAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assessment: Omit<NursingAssessment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('nursing_assessments')
        .insert(assessment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nursing_assessments'] });
    },
  });
};
