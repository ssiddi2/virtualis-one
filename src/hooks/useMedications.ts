
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Medication = Tables<'medications'>;
type MedicationInsert = TablesInsert<'medications'>;

export const useMedications = (patientId?: string) => {
  return useQuery({
    queryKey: ['medications', patientId],
    queryFn: async () => {
      let query = supabase
        .from('medications')
        .select(`
          *,
          provider:profiles!medications_prescribed_by_fkey(first_name, last_name, role),
          patient:patients(first_name, last_name, mrn)
        `)
        .order('prescribed_at', { ascending: false });
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateMedication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (medication: MedicationInsert) => {
      const { data, error } = await supabase
        .from('medications')
        .insert(medication)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
};
