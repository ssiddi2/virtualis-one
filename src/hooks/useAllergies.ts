
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AllergyReaction {
  id: string;
  patient_id: string;
  allergen: string;
  reaction_type: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  symptoms?: string;
  onset_date?: string;
  verified_by?: string;
  status: 'active' | 'inactive' | 'resolved';
  created_at: string;
  updated_at: string;
}

export const useAllergies = (patientId: string) => {
  return useQuery({
    queryKey: ['allergies', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allergies_adverse_reactions')
        .select(`
          *,
          verified_by_profile:profiles(first_name, last_name, role)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (AllergyReaction & { verified_by_profile?: any })[];
    },
  });
};

export const useCreateAllergy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (allergy: Omit<AllergyReaction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('allergies_adverse_reactions')
        .insert(allergy)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allergies'] });
    },
  });
};
