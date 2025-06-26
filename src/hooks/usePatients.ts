
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePatients = (hospitalId?: string) => {
  return useQuery({
    queryKey: ['patients', hospitalId],
    queryFn: async () => {
      console.log('Fetching patients for hospital:', hospitalId);
      
      let query = supabase
        .from('patients')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (hospitalId) {
        query = query.eq('hospital_id', hospitalId);
      }
      
      const { data, error } = await query;
      
      console.log('Patients query result:', { data, error, hospitalId });
      
      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} patients`);
      return data;
    },
    enabled: true,
  });
};

export const useCreatePatient = () => {
  return {
    mutateAsync: async (patientData: any) => {
      console.log('Creating patient:', patientData);
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating patient:', error);
        throw error;
      }
      
      console.log('Patient created:', data);
      return data;
    }
  };
};
