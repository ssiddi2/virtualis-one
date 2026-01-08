import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EMROperation = 
  | 'health_check' | 'search_patients' | 'get_patient' | 'update_patient'
  | 'get_lab_results' | 'get_medications' | 'get_allergies' | 'get_conditions'
  | 'get_vitals' | 'get_encounters' | 'get_immunizations' | 'get_documents'
  | 'get_procedures' | 'create_order' | 'cancel_order';

interface EMRRequest {
  hospital_id: string;
  operation: EMROperation;
  params?: Record<string, any>;
}

// Generate JWT for Epic SMART Backend Services (JWT Bearer flow)
async function generateEpicJWT(clientId: string, privateKeyPem: string, tokenUrl: string): Promise<string> {
  // Parse the PEM private key
  const privateKey = await jose.importPKCS8(privateKeyPem, 'RS384');
  
  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomUUID();
  
  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'RS384', typ: 'JWT' })
    .setIssuer(clientId)
    .setSubject(clientId)
    .setAudience(tokenUrl)
    .setJti(jti)
    .setIssuedAt(now)
    .setExpirationTime(now + 300) // 5 minutes
    .sign(privateKey);
  
  return jwt;
}

// Get OAuth token - supports both client_secret and jwt_bearer methods
async function getAccessToken(
  credentials: any, 
  clientSecret: string,
  privateKey: string | null
): Promise<string> {
  const tokenUrl = credentials.base_url.includes('interconnect') 
    ? credentials.base_url.replace(/\/api\/FHIR\/R4.*$/, '/oauth2/token')
    : `${credentials.base_url}/oauth2/token`;

  let body: URLSearchParams;

  if (credentials.auth_method === 'jwt_bearer' && privateKey) {
    // Epic SMART Backend Services - JWT Bearer assertion
    console.log('Using JWT Bearer authentication for Epic');
    const assertion = await generateEpicJWT(credentials.client_id, privateKey, tokenUrl);
    
    body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: assertion,
      scope: credentials.scopes?.join(' ') || 'system/*.read',
    });
  } else {
    // Standard client credentials flow
    console.log('Using client_secret authentication');
    body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: credentials.client_id,
      client_secret: clientSecret,
      scope: credentials.scopes?.join(' ') || 'patient/*.read user/*.read',
    });
  }

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('OAuth token error:', errorText);
    throw new Error(`OAuth failed: ${errorText}`);
  }

  const { access_token } = await tokenResponse.json();
  return access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let userId: string | null = null;
  let hospitalId: string | null = null;
  let operation: string | null = null;

  try {
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
    userId = user.id;

    const reqBody = await req.json() as EMRRequest;
    hospitalId = reqBody.hospital_id;
    operation = reqBody.operation;
    const params = reqBody.params || {};

    console.log(`EMR Proxy: ${operation} for hospital ${hospitalId} by user ${userId}`);

    // Fetch EMR credentials
    const { data: credentials, error: credError } = await supabase
      .from('emr_credentials')
      .select('*')
      .eq('hospital_id', hospitalId)
      .eq('is_active', true)
      .single();

    if (credError || !credentials) {
      await logEMRAccess(supabase, userId, hospitalId, operation, null, 'error', 'EMR not configured');
      return new Response(JSON.stringify({ error: 'EMR not configured for this hospital' }), { 
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Decrypt secrets
    let clientSecret = '';
    let privateKey: string | null = null;

    if (credentials.client_secret_encrypted) {
      const { data: decrypted } = await supabase.rpc('decrypt_emr_secret', {
        encrypted: credentials.client_secret_encrypted
      });
      clientSecret = decrypted || credentials.client_secret_encrypted;
    }

    if (credentials.private_key_encrypted) {
      const { data: decryptedKey } = await supabase.rpc('decrypt_emr_secret', {
        encrypted: credentials.private_key_encrypted
      });
      privateKey = decryptedKey || credentials.private_key_encrypted;
    }

    // Get OAuth token
    let access_token: string;
    try {
      access_token = await getAccessToken(credentials, clientSecret, privateKey);
    } catch (oauthError: any) {
      await supabase.from('emr_credentials').update({
        last_health_check: new Date().toISOString(),
        last_health_status: 'down'
      }).eq('id', credentials.id);

      await logEMRAccess(supabase, userId, hospitalId, operation, null, 'error', 'OAuth failed');
      return new Response(JSON.stringify({ 
        error: 'EMR authentication failed',
        details: oauthError.message
      }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }

    const fhirHeaders = {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json',
    };

    // Execute operation
    const result = await executeOperation(operation, params, credentials.base_url, fhirHeaders);
    
    // Log successful access
    await logEMRAccess(supabase, userId, hospitalId, operation, params.patientId || params.id, 'success');

    // Update health status on successful call
    if (operation === 'health_check') {
      await supabase.from('emr_credentials').update({
        last_health_check: new Date().toISOString(),
        last_health_status: result.status
      }).eq('id', credentials.id);
    }

    console.log(`EMR Proxy: ${operation} completed successfully`);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('EMR Proxy error:', error);
    if (userId && hospitalId && operation) {
      await logEMRAccess(supabase, userId, hospitalId, operation, null, 'error', error.message);
    }
    
    // Parse FHIR OperationOutcome if present
    const errorResponse = parseFHIRError(error);
    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.status || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function executeOperation(
  operation: EMROperation, 
  params: Record<string, any>, 
  baseUrl: string, 
  headers: Record<string, string>
): Promise<any> {
  const start = Date.now();

  switch (operation) {
    case 'health_check': {
      const response = await fetch(`${baseUrl}/metadata`, { headers });
      return { 
        status: response.ok ? 'healthy' : 'degraded', 
        latencyMs: Date.now() - start,
        capabilities: response.ok ? await response.json() : null
      };
    }

    case 'search_patients': {
      const searchParams = new URLSearchParams();
      if (params.name) searchParams.set('name', params.name);
      if (params.mrn) searchParams.set('identifier', params.mrn);
      if (params.dob) searchParams.set('birthdate', params.dob);
      if (params.family) searchParams.set('family', params.family);
      if (params.given) searchParams.set('given', params.given);
      searchParams.set('_count', params.count || '50');
      
      const response = await fetch(`${baseUrl}/Patient?${searchParams}`, { headers });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapFhirPatient(e.resource));
    }

    case 'get_patient': {
      const response = await fetch(`${baseUrl}/Patient/${params.id}`, { headers });
      return mapFhirPatient(await handleFHIRResponse(response));
    }

    case 'update_patient': {
      const response = await fetch(`${baseUrl}/Patient/${params.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(params.data),
      });
      return mapFhirPatient(await handleFHIRResponse(response));
    }

    case 'get_lab_results': {
      const searchParams = new URLSearchParams({ patient: params.patientId, _sort: '-date', _count: '100' });
      if (params.code) searchParams.set('code', params.code);
      if (params.date) searchParams.set('date', params.date);
      
      const response = await fetch(`${baseUrl}/DiagnosticReport?${searchParams}`, { headers });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapLabResult(e.resource, params.patientId));
    }

    case 'get_medications': {
      const searchParams = new URLSearchParams({ patient: params.patientId, _count: '100' });
      if (params.status) searchParams.set('status', params.status);
      
      const response = await fetch(`${baseUrl}/MedicationRequest?${searchParams}`, { headers });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapMedication(e.resource));
    }

    case 'get_allergies': {
      const response = await fetch(
        `${baseUrl}/AllergyIntolerance?patient=${params.patientId}&_count=100`, 
        { headers }
      );
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapAllergy(e.resource));
    }

    case 'get_conditions': {
      const searchParams = new URLSearchParams({ patient: params.patientId, _count: '100' });
      if (params.category) searchParams.set('category', params.category);
      if (params.clinicalStatus) searchParams.set('clinical-status', params.clinicalStatus);
      
      const response = await fetch(`${baseUrl}/Condition?${searchParams}`, { headers });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapCondition(e.resource));
    }

    case 'get_vitals': {
      const response = await fetch(
        `${baseUrl}/Observation?patient=${params.patientId}&category=vital-signs&_sort=-date&_count=100`,
        { headers }
      );
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapVitalSign(e.resource));
    }

    case 'get_encounters': {
      const searchParams = new URLSearchParams({ patient: params.patientId, _sort: '-date', _count: '50' });
      if (params.status) searchParams.set('status', params.status);
      if (params.type) searchParams.set('type', params.type);
      
      const response = await fetch(`${baseUrl}/Encounter?${searchParams}`, { headers });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapEncounter(e.resource));
    }

    case 'get_immunizations': {
      const response = await fetch(
        `${baseUrl}/Immunization?patient=${params.patientId}&_sort=-date&_count=100`,
        { headers }
      );
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapImmunization(e.resource));
    }

    case 'get_documents': {
      const searchParams = new URLSearchParams({ patient: params.patientId, _sort: '-date', _count: '50' });
      if (params.type) searchParams.set('type', params.type);
      if (params.category) searchParams.set('category', params.category);
      
      const response = await fetch(`${baseUrl}/DocumentReference?${searchParams}`, { headers });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapDocument(e.resource));
    }

    case 'get_procedures': {
      const searchParams = new URLSearchParams({ patient: params.patientId, _sort: '-date', _count: '100' });
      if (params.status) searchParams.set('status', params.status);
      
      const response = await fetch(`${baseUrl}/Procedure?${searchParams}`, { headers });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapProcedure(e.resource));
    }

    case 'create_order': {
      const response = await fetch(`${baseUrl}/ServiceRequest`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          resourceType: 'ServiceRequest',
          status: 'active',
          intent: 'order',
          priority: params.priority || 'routine',
          code: { coding: [{ system: params.codeSystem, code: params.code, display: params.description }] },
          subject: { reference: `Patient/${params.patientId}` },
          requester: params.requesterId ? { reference: `Practitioner/${params.requesterId}` } : undefined,
          reasonCode: params.indication ? [{ text: params.indication }] : undefined,
          note: params.notes ? [{ text: params.notes }] : undefined,
        }),
      });
      return await handleFHIRResponse(response);
    }

    case 'cancel_order': {
      const response = await fetch(`${baseUrl}/ServiceRequest/${params.orderId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify([
          { op: 'replace', path: '/status', value: 'revoked' }
        ]),
      });
      return await handleFHIRResponse(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function handleFHIRResponse(response: Response): Promise<any> {
  const data = await response.json();
  
  if (!response.ok) {
    const error: any = new Error(data.issue?.[0]?.diagnostics || 'FHIR request failed');
    error.status = response.status;
    error.operationOutcome = data;
    throw error;
  }
  
  return data;
}

function parseFHIRError(error: any): { error: string; code?: string; details?: any; status: number } {
  if (error.operationOutcome) {
    const issue = error.operationOutcome.issue?.[0];
    return {
      error: issue?.diagnostics || error.message,
      code: issue?.code,
      details: error.operationOutcome,
      status: error.status || 500
    };
  }
  return { error: error.message, status: 500 };
}

async function logEMRAccess(
  supabase: any,
  userId: string,
  hospitalId: string,
  operation: string,
  patientId: string | null,
  status: 'success' | 'error',
  errorMessage?: string
) {
  try {
    await supabase.from('audit_log').insert({
      user_id: userId,
      hospital_id: hospitalId,
      patient_id: patientId,
      action: `EMR_${operation.toUpperCase()}`,
      resource_type: 'emr_api',
      new_values: { operation, status, error: errorMessage, timestamp: new Date().toISOString() }
    });
  } catch (e) {
    console.error('Failed to log EMR access:', e);
  }
}

// FHIR Resource Mappers
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
    address: fhir.address?.[0] ? {
      line: fhir.address[0].line?.join(', '),
      city: fhir.address[0].city,
      state: fhir.address[0].state,
      postalCode: fhir.address[0].postalCode
    } : null,
    active: fhir.active ?? true
  };
}

function mapLabResult(fhir: any, patientId: string) {
  return {
    id: fhir.id,
    patientId,
    code: fhir.code?.coding?.[0]?.code || '',
    name: fhir.code?.text || fhir.code?.coding?.[0]?.display || '',
    value: fhir.conclusion || '',
    status: fhir.status,
    effectiveDate: fhir.effectiveDateTime,
    issuedDate: fhir.issued,
    performer: fhir.performer?.[0]?.display,
    category: fhir.category?.[0]?.coding?.[0]?.display
  };
}

function mapMedication(fhir: any) {
  return {
    id: fhir.id,
    name: fhir.medicationCodeableConcept?.text || fhir.medicationCodeableConcept?.coding?.[0]?.display || '',
    code: fhir.medicationCodeableConcept?.coding?.[0]?.code,
    status: fhir.status,
    intent: fhir.intent,
    dosage: fhir.dosageInstruction?.[0]?.text,
    route: fhir.dosageInstruction?.[0]?.route?.text,
    frequency: fhir.dosageInstruction?.[0]?.timing?.code?.text,
    prescriber: fhir.requester?.display,
    authoredOn: fhir.authoredOn,
    reasonCode: fhir.reasonCode?.[0]?.text
  };
}

function mapAllergy(fhir: any) {
  return {
    id: fhir.id,
    allergen: fhir.code?.text || fhir.code?.coding?.[0]?.display || '',
    code: fhir.code?.coding?.[0]?.code,
    type: fhir.type,
    category: fhir.category?.[0],
    criticality: fhir.criticality,
    clinicalStatus: fhir.clinicalStatus?.coding?.[0]?.code,
    verificationStatus: fhir.verificationStatus?.coding?.[0]?.code,
    onsetDate: fhir.onsetDateTime,
    reactions: fhir.reaction?.map((r: any) => ({
      manifestation: r.manifestation?.[0]?.text || r.manifestation?.[0]?.coding?.[0]?.display,
      severity: r.severity
    }))
  };
}

function mapCondition(fhir: any) {
  return {
    id: fhir.id,
    name: fhir.code?.text || fhir.code?.coding?.[0]?.display || '',
    code: fhir.code?.coding?.[0]?.code,
    codeSystem: fhir.code?.coding?.[0]?.system,
    clinicalStatus: fhir.clinicalStatus?.coding?.[0]?.code,
    verificationStatus: fhir.verificationStatus?.coding?.[0]?.code,
    severity: fhir.severity?.coding?.[0]?.display,
    category: fhir.category?.[0]?.coding?.[0]?.display,
    onsetDate: fhir.onsetDateTime,
    recordedDate: fhir.recordedDate,
    recorder: fhir.recorder?.display
  };
}

function mapVitalSign(fhir: any) {
  return {
    id: fhir.id,
    code: fhir.code?.coding?.[0]?.code,
    name: fhir.code?.text || fhir.code?.coding?.[0]?.display || '',
    value: fhir.valueQuantity?.value,
    unit: fhir.valueQuantity?.unit,
    effectiveDate: fhir.effectiveDateTime,
    status: fhir.status,
    interpretation: fhir.interpretation?.[0]?.coding?.[0]?.code
  };
}

function mapEncounter(fhir: any) {
  return {
    id: fhir.id,
    status: fhir.status,
    class: fhir.class?.code,
    type: fhir.type?.[0]?.text || fhir.type?.[0]?.coding?.[0]?.display,
    serviceType: fhir.serviceType?.text,
    priority: fhir.priority?.coding?.[0]?.display,
    startDate: fhir.period?.start,
    endDate: fhir.period?.end,
    reasonCode: fhir.reasonCode?.[0]?.text,
    location: fhir.location?.[0]?.location?.display,
    participant: fhir.participant?.map((p: any) => ({
      type: p.type?.[0]?.coding?.[0]?.display,
      name: p.individual?.display
    }))
  };
}

function mapImmunization(fhir: any) {
  return {
    id: fhir.id,
    vaccine: fhir.vaccineCode?.text || fhir.vaccineCode?.coding?.[0]?.display || '',
    code: fhir.vaccineCode?.coding?.[0]?.code,
    status: fhir.status,
    occurrenceDate: fhir.occurrenceDateTime,
    site: fhir.site?.text,
    route: fhir.route?.text,
    lotNumber: fhir.lotNumber,
    manufacturer: fhir.manufacturer?.display,
    performer: fhir.performer?.[0]?.actor?.display
  };
}

function mapDocument(fhir: any) {
  return {
    id: fhir.id,
    status: fhir.status,
    type: fhir.type?.text || fhir.type?.coding?.[0]?.display,
    category: fhir.category?.[0]?.text || fhir.category?.[0]?.coding?.[0]?.display,
    date: fhir.date,
    author: fhir.author?.[0]?.display,
    description: fhir.description,
    contentType: fhir.content?.[0]?.attachment?.contentType,
    url: fhir.content?.[0]?.attachment?.url
  };
}

function mapProcedure(fhir: any) {
  return {
    id: fhir.id,
    name: fhir.code?.text || fhir.code?.coding?.[0]?.display || '',
    code: fhir.code?.coding?.[0]?.code,
    status: fhir.status,
    performedDate: fhir.performedDateTime || fhir.performedPeriod?.start,
    performer: fhir.performer?.[0]?.actor?.display,
    location: fhir.location?.display,
    reasonCode: fhir.reasonCode?.[0]?.text,
    outcome: fhir.outcome?.text
  };
}
