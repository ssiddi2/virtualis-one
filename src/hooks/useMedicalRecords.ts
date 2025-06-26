
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type MedicalRecord = Tables<'medical_records'>;
type MedicalRecordInsert = TablesInsert<'medical_records'>;

export const useMedicalRecords = (patientId?: string) => {
  return useQuery({
    queryKey: ['medical_records', patientId],
    queryFn: async () => {
      let query = supabase
        .from('medical_records')
        .select(`
          *,
          provider:profiles!medical_records_provider_id_fkey(first_name, last_name, role)
        `)
        .order('created_at', { ascending: false });
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: MedicalRecordInsert) => {
      const { data, error } = await supabase
        .from('medical_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical_records'] });
    },
  });
};
