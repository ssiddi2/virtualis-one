import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type EMRVendor = 'epic' | 'cerner' | 'meditech' | 'allscripts' | 'fhir';

export interface EMRCredentials {
  id?: string;
  hospital_id: string;
  vendor: EMRVendor;
  base_url: string;
  client_id: string;
  client_secret?: string;
  scopes?: string[];
  tenant_id?: string;
  is_active?: boolean;
  last_health_check?: string;
  last_health_status?: 'healthy' | 'degraded' | 'down';
}

export function useEMRCredentials(hospitalId: string) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCredentials = async (): Promise<EMRCredentials | null> => {
    const { data, error } = await supabase
      .from('emr_credentials')
      .select('*')
      .eq('hospital_id', hospitalId)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) {
      console.error('Failed to fetch EMR credentials:', error);
      return null;
    }
    return data as EMRCredentials | null;
  };

  const saveCredentials = async (credentials: EMRCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('emr_credentials')
        .upsert({
          hospital_id: credentials.hospital_id,
          vendor: credentials.vendor,
          base_url: credentials.base_url,
          client_id: credentials.client_id,
          client_secret_encrypted: credentials.client_secret || '',
          scopes: credentials.scopes || ['patient/*.read', 'user/*.read'],
          tenant_id: credentials.tenant_id,
          is_active: true,
        }, { onConflict: 'hospital_id,vendor' });

      if (error) throw error;
      toast({ title: 'EMR credentials saved securely' });
      return true;
    } catch (error: any) {
      toast({ title: 'Failed to save credentials', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (): Promise<{ success: boolean; status?: string; latencyMs?: number }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('emr-proxy', {
        body: { hospital_id: hospitalId, operation: 'health_check' }
      });
      
      if (error) throw error;
      return { success: data.status === 'healthy', status: data.status, latencyMs: data.latencyMs };
    } catch (error: any) {
      return { success: false, status: 'down' };
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async (query: { name?: string; mrn?: string; dob?: string }) => {
    const { data, error } = await supabase.functions.invoke('emr-proxy', {
      body: { hospital_id: hospitalId, operation: 'search_patients', params: query }
    });
    if (error) throw error;
    return data;
  };

  const getPatient = async (patientId: string) => {
    const { data, error } = await supabase.functions.invoke('emr-proxy', {
      body: { hospital_id: hospitalId, operation: 'get_patient', params: { id: patientId } }
    });
    if (error) throw error;
    return data;
  };

  const getLabResults = async (patientId: string) => {
    const { data, error } = await supabase.functions.invoke('emr-proxy', {
      body: { hospital_id: hospitalId, operation: 'get_lab_results', params: { patientId } }
    });
    if (error) throw error;
    return data;
  };

  return {
    loading,
    getCredentials,
    saveCredentials,
    testConnection,
    searchPatients,
    getPatient,
    getLabResults,
  };
}