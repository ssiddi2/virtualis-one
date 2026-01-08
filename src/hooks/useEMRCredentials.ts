import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type EMRVendor = 'epic' | 'cerner' | 'meditech' | 'allscripts' | 'fhir';
export type EMROperation = 
  | 'health_check' | 'search_patients' | 'get_patient' | 'update_patient'
  | 'get_lab_results' | 'get_medications' | 'get_allergies' | 'get_conditions'
  | 'get_vitals' | 'get_encounters' | 'get_immunizations' | 'get_documents'
  | 'get_procedures' | 'create_order' | 'cancel_order';

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
  auth_method?: 'client_secret' | 'jwt_bearer';
  private_key?: string;
}

async function invokeEMRProxy<T>(hospitalId: string, operation: EMROperation, params?: Record<string, any>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('emr-proxy', {
    body: { hospital_id: hospitalId, operation, params }
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export function useEMRCredentials(hospitalId: string) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  return {
    loading,

    // Credential Management
    async getCredentials(): Promise<EMRCredentials | null> {
      const { data } = await supabase
        .from('emr_credentials')
        .select('*')
        .eq('hospital_id', hospitalId)
        .eq('is_active', true)
        .maybeSingle();
      return data as EMRCredentials | null;
    },

    async saveCredentials(credentials: EMRCredentials): Promise<boolean> {
      setLoading(true);
      try {
        // Build the upsert object
        const upsertData: Record<string, any> = {
          hospital_id: credentials.hospital_id,
          vendor: credentials.vendor,
          base_url: credentials.base_url,
          client_id: credentials.client_id,
          scopes: credentials.scopes || ['patient/*.read', 'system/*.read'],
          tenant_id: credentials.tenant_id,
          is_active: true,
          auth_method: credentials.auth_method || 'client_secret',
        };

        // Only set client_secret_encrypted if provided
        if (credentials.client_secret) {
          upsertData.client_secret_encrypted = credentials.client_secret;
        }

        // Only set private_key_encrypted if provided
        if (credentials.private_key) {
          upsertData.private_key_encrypted = credentials.private_key;
        }

        const { error } = await supabase
          .from('emr_credentials')
          .upsert(upsertData as any, { onConflict: 'hospital_id,vendor' });

        if (error) throw error;
        toast({ title: 'EMR credentials saved securely' });
        return true;
      } catch (error: any) {
        toast({ title: 'Failed to save credentials', description: error.message, variant: 'destructive' });
        return false;
      } finally {
        setLoading(false);
      }
    },

    // Connection Test
    async testConnection(): Promise<{ success: boolean; status?: string; latencyMs?: number }> {
      setLoading(true);
      try {
        const result = await invokeEMRProxy<{ status: string; latencyMs: number }>(hospitalId, 'health_check');
        return { success: result.status === 'healthy', status: result.status, latencyMs: result.latencyMs };
      } catch {
        return { success: false, status: 'down' };
      } finally {
        setLoading(false);
      }
    },

    // Patient Operations
    searchPatients: (query: { name?: string; mrn?: string; dob?: string }) =>
      invokeEMRProxy<any[]>(hospitalId, 'search_patients', query),

    getPatient: (patientId: string) =>
      invokeEMRProxy<any>(hospitalId, 'get_patient', { id: patientId }),

    updatePatient: (patientId: string, data: any) =>
      invokeEMRProxy<any>(hospitalId, 'update_patient', { id: patientId, data }),

    // Clinical Data Operations
    getLabResults: (patientId: string, options?: { code?: string; date?: string }) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_lab_results', { patientId, ...options }),

    getMedications: (patientId: string, status?: string) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_medications', { patientId, status }),

    getAllergies: (patientId: string) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_allergies', { patientId }),

    getConditions: (patientId: string, options?: { category?: string; clinicalStatus?: string }) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_conditions', { patientId, ...options }),

    getVitals: (patientId: string) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_vitals', { patientId }),

    getEncounters: (patientId: string, options?: { status?: string; type?: string }) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_encounters', { patientId, ...options }),

    getImmunizations: (patientId: string) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_immunizations', { patientId }),

    getDocuments: (patientId: string, options?: { type?: string; category?: string }) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_documents', { patientId, ...options }),

    getProcedures: (patientId: string, status?: string) =>
      invokeEMRProxy<any[]>(hospitalId, 'get_procedures', { patientId, status }),

    // Order Operations
    createOrder: (order: { patientId: string; code: string; description: string; priority?: string; indication?: string }) =>
      invokeEMRProxy<any>(hospitalId, 'create_order', order),

    cancelOrder: (orderId: string) =>
      invokeEMRProxy<any>(hospitalId, 'cancel_order', { orderId }),
  };
}
