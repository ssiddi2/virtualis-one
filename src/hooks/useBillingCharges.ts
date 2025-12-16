
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBillingCharges = (hospitalId?: string) => {
  return useQuery({
    queryKey: ['billing-charges', hospitalId],
    queryFn: async () => {
      let query = supabase
        .from('billing_charges')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            mrn
          )
        `)
        .order('service_date', { ascending: false });
      
      if (hospitalId) {
        query = query.eq('hospital_id', hospitalId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    enabled: true,
  });
};
