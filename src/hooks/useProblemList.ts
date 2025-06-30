
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProblemListItem {
  id: string;
  patient_id: string;
  problem_name: string;
  icd10_code?: string;
  status: 'active' | 'resolved' | 'inactive';
  onset_date?: string;
  resolved_date?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  provider_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useProblemList = (patientId: string) => {
  return useQuery({
    queryKey: ['problem_list', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problem_list')
        .select(`
          *,
          provider:profiles(first_name, last_name, role)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (ProblemListItem & { provider?: any })[];
    },
  });
};

export const useCreateProblemListItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (problem: Omit<ProblemListItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('problem_list')
        .insert(problem)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem_list'] });
    },
  });
};
