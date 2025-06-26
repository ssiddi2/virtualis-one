
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type RadiologyOrder = Tables<'radiology_orders'>;
type RadiologyOrderInsert = TablesInsert<'radiology_orders'>;

export const useRadiologyOrders = (patientId?: string) => {
  return useQuery({
    queryKey: ['radiology_orders', patientId],
    queryFn: async () => {
      let query = supabase
        .from('radiology_orders')
        .select(`
          *,
          provider:profiles!radiology_orders_ordered_by_fkey(first_name, last_name, role),
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

export const useCreateRadiologyOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: RadiologyOrderInsert) => {
      const { data, error } = await supabase
        .from('radiology_orders')
        .insert(order)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology_orders'] });
    },
  });
};
