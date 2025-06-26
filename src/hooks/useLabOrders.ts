
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type LabOrder = Tables<'lab_orders'>;
type LabOrderInsert = TablesInsert<'lab_orders'>;

export const useLabOrders = (patientId?: string) => {
  return useQuery({
    queryKey: ['lab_orders', patientId],
    queryFn: async () => {
      let query = supabase
        .from('lab_orders')
        .select(`
          *,
          provider:profiles!lab_orders_ordered_by_fkey(first_name, last_name, role),
          patient:patients(first_name, last_name, mrn)
        `)
        .order('ordered_at', { ascending: false });
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateLabOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: LabOrderInsert) => {
      const { data, error } = await supabase
        .from('lab_orders')
        .insert(order)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab_orders'] });
    },
  });
};
