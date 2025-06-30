
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ClinicalOrder {
  id: string;
  patient_id: string;
  ordering_provider_id: string;
  order_type: 'medication' | 'lab' | 'imaging' | 'procedure' | 'nursing' | 'diet' | 'activity';
  order_details: any;
  priority: 'stat' | 'urgent' | 'routine';
  status: 'active' | 'completed' | 'cancelled' | 'discontinued';
  start_date: string;
  end_date?: string;
  frequency?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export const useClinicalOrders = (patientId?: string) => {
  return useQuery({
    queryKey: ['clinical_orders', patientId],
    queryFn: async () => {
      let query = supabase.from('clinical_orders').select(`
        *,
        ordering_provider:profiles!clinical_orders_ordering_provider_id_fkey(first_name, last_name, role)
      `);
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (ClinicalOrder & { ordering_provider: any })[];
    },
  });
};

export const useCreateClinicalOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: Omit<ClinicalOrder, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('clinical_orders')
        .insert(order)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical_orders'] });
    },
  });
};
