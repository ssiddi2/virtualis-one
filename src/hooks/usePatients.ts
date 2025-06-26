
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Patient = Tables<'patients'>;
type PatientInsert = TablesInsert<'patients'>;

export const usePatients = (hospitalId?: string) => {
  return useQuery({
    queryKey: ['patients', hospitalId],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by hospital if hospitalId is provided
      if (hospitalId) {
        query = query.eq('hospital_id', hospitalId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Patient[];
    },
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patient: PatientInsert) => {
      const { data, error } = await supabase
        .from('patients')
        .insert(patient)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
