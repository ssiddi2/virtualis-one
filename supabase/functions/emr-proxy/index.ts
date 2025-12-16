import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EMRRequest {
  hospital_id: string;
  operation: 'health_check' | 'search_patients' | 'get_patient' | 'get_lab_results' | 'create_order';
  params?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { hospital_id, operation, params } = await req.json() as EMRRequest;
    console.log(`EMR Proxy: ${operation} for hospital ${hospital_id}`);

    // Fetch EMR credentials
    const { data: credentials, error: credError } = await supabase
      .from('emr_credentials')
      .select('*')
      .eq('hospital_id', hospital_id)
      .eq('is_active', true)
      .single();

    if (credError || !credentials) {
      return new Response(JSON.stringify({ error: 'EMR not configured for this hospital' }), { 
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Decrypt client secret using database function
    const { data: decrypted, error: decryptError } = await supabase.rpc('decrypt_emr_secret', {
      encrypted: credentials.client_secret_encrypted
    });

    const clientSecret = decryptError ? credentials.client_secret_encrypted : decrypted;

    // Get OAuth token
    const tokenResponse = await fetch(`${credentials.base_url}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: credentials.client_id,
        client_secret: clientSecret,
        scope: credentials.scopes?.join(' ') || 'patient/*.read',
      }),
    });

    if (!tokenResponse.ok) {
      // Update health status
      await supabase.from('emr_credentials').update({
        last_health_check: new Date().toISOString(),
        last_health_status: 'down'
      }).eq('id', credentials.id);

      return new Response(JSON.stringify({ 
        error: 'EMR authentication failed',
        details: await tokenResponse.text()
      }), { 
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { access_token } = await tokenResponse.json();

    // Execute operation
    let result: any;
    const fhirHeaders = {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json',
    };

    switch (operation) {
      case 'health_check': {
        const start = Date.now();
        const response = await fetch(`${credentials.base_url}/metadata`, { headers: fhirHeaders });
        const latency = Date.now() - start;
        const status = response.ok ? 'healthy' : 'degraded';
        
        await supabase.from('emr_credentials').update({
          last_health_check: new Date().toISOString(),
          last_health_status: status
        }).eq('id', credentials.id);

        result = { status, latencyMs: latency, vendor: credentials.vendor };
        break;
      }

      case 'search_patients': {
        const searchParams = new URLSearchParams();
        if (params?.name) searchParams.set('name', params.name);
        if (params?.mrn) searchParams.set('identifier', params.mrn);
        if (params?.dob) searchParams.set('birthdate', params.dob);
        
        const response = await fetch(
          `${credentials.base_url}/Patient?${searchParams}`,
          { headers: fhirHeaders }
        );
        const bundle = await response.json();
        result = (bundle.entry || []).map((e: any) => mapFhirPatient(e.resource));
        break;
      }

      case 'get_patient': {
        const response = await fetch(
          `${credentials.base_url}/Patient/${params?.id}`,
          { headers: fhirHeaders }
        );
        result = mapFhirPatient(await response.json());
        break;
      }

      case 'get_lab_results': {
        const response = await fetch(
          `${credentials.base_url}/DiagnosticReport?patient=${params?.patientId}`,
          { headers: fhirHeaders }
        );
        const bundle = await response.json();
        result = (bundle.entry || []).map((e: any) => ({
          id: e.resource.id,
          code: e.resource.code?.coding?.[0]?.code || '',
          name: e.resource.code?.text || '',
          value: e.resource.conclusion || '',
          status: e.resource.status,
          effectiveDate: e.resource.effectiveDateTime,
        }));
        break;
      }

      case 'create_order': {
        const response = await fetch(`${credentials.base_url}/ServiceRequest`, {
          method: 'POST',
          headers: fhirHeaders,
          body: JSON.stringify({
            resourceType: 'ServiceRequest',
            status: 'active',
            intent: 'order',
            priority: params?.priority || 'routine',
            code: { coding: [{ code: params?.code, display: params?.description }] },
            subject: { reference: `Patient/${params?.patientId}` },
          }),
        });
        result = await response.json();
        break;
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown operation' }), { 
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    console.log(`EMR Proxy: ${operation} completed successfully`);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('EMR Proxy error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function mapFhirPatient(fhir: any) {
  const name = fhir.name?.[0] || {};
  return {
    id: fhir.id,
    mrn: fhir.identifier?.find((i: any) => i.type?.coding?.[0]?.code === 'MR')?.value || '',
    firstName: name.given?.join(' ') || '',
    lastName: name.family || '',
    dob: fhir.birthDate || '',
    gender: fhir.gender || 'unknown',
    phone: fhir.telecom?.find((t: any) => t.system === 'phone')?.value,
    email: fhir.telecom?.find((t: any) => t.system === 'email')?.value,
  };
}