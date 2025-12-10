import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';

type LabOrderInsert = TablesInsert<'lab_orders'>;

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

export const useCreateMultipleLabOrders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orders: LabOrderInsert[]) => {
      const { data, error } = await supabase
        .from('lab_orders')
        .insert(orders)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab_orders'] });
    },
  });
};
