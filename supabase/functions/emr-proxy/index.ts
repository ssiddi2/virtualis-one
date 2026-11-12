import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";
import { gatewayFetch, gatewayWriteback } from "./gatewayFetch.ts";
import { classifyGatewayReply } from "./gatewayRefusal.ts";
import { OrderInput, NoteInput, parseInput, buildOrderPayload, buildNotePayload, signedAtNow } from "./writeback.ts";
import { buildMrnIdentifier, filterByMrn, displayMrn } from "./mrnMatch.ts";
import { buildCensus, roomFor } from "./census.ts";
import { mapDiagnosticReport } from "./reports.ts";
import { mapOrder, mapNote, notePdfSource } from "./ordersNotes.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EMROperation = 
  | 'health_check' | 'search_patients' | 'get_patient' | 'update_patient'
  | 'get_lab_results' | 'get_medications' | 'get_allergies' | 'get_conditions'
  | 'get_vitals' | 'get_encounters' | 'get_immunizations' | 'get_documents'
  | 'get_procedures' | 'get_imaging' | 'get_diagnostic_reports' | 'get_everything' | 'get_census'
  | 'get_orders' | 'get_notes' | 'get_note_pdf'
  | 'create_order' | 'create_note' | 'cancel_order';

interface OpContext {
  viaGateway: boolean;
  mrnIdentifierSystem: string | null;
  tenant: string | null;
  userId: string;
  hospitalId: string;
  supabase: any;
}

interface EMRRequest {
  hospital_id: string;
  operation: EMROperation;
  params?: Record<string, any>;
}

// Unified FHIR caller: routes either directly to a hospital FHIR server or
// through the Virtualis FHIR Gateway, depending on the hospital's configuration.
type FhirCaller = (
  method: 'GET' | 'POST' | 'PUT' | 'PATCH',
  fhirPath: string,
  query?: Record<string, string>,
  body?: string
) => Promise<Response>;

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

    // Build the FHIR caller. Hospitals with gateway_tenant set route through the
    // Virtualis FHIR Gateway (fixed egress IP for hospital firewalls; the gateway
    // holds the hospital OAuth credentials), so no token exchange happens here.
    // All other hospitals keep the existing direct connection behavior.
    let fhirCall: FhirCaller;

    if (credentials.gateway_tenant) {
      const tenant = credentials.gateway_tenant as string;
      console.log(`EMR Proxy: routing via FHIR gateway tenant ${tenant}`);
      fhirCall = async (method, fhirPath, query, body) => {
        const res = await gatewayFetch(tenant, method, fhirPath, query, body);
        if (res.status < 400 || res.status >= 500) return res;
        const verdict = classifyGatewayReply(res.status, await res.clone().text());
        if (verdict.kind === 'not_set_up') {
          throw Object.assign(new Error('connection_unavailable'), {
            connectionUnavailable: true, gatewayStatus: verdict.status, gatewayError: verdict.error ?? null,
          });
        }
        if (verdict.kind === 'refused' || verdict.kind === 'too_large') {
          throw Object.assign(new Error(`The EMR gateway refused the request (HTTP ${verdict.status}): ${verdict.error}`), { status: 502 });
        }
        return res;
      };
    } else {
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

      const baseUrl = credentials.base_url;
      fhirCall = (method, fhirPath, query, body) => {
        const qs = query && Object.keys(query).length ? `?${new URLSearchParams(query)}` : '';
        return fetch(`${baseUrl}/${fhirPath}${qs}`, {
          method,
          headers: fhirHeaders,
          body: body || undefined,
        });
      };
    }

    // Execute operation
    const result = await executeOperation(operation, params, fhirCall, {
      viaGateway: !!credentials.gateway_tenant,
      mrnIdentifierSystem: credentials.mrn_identifier_system || null,
      tenant: credentials.gateway_tenant || null,
      userId: userId!,
      hospitalId: hospitalId!,
      supabase,
    });
    
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
    if (error?.writebackUnavailable) {
      console.log('EMR Proxy: gateway write-back route not available yet');
      return new Response(JSON.stringify({ error: 'writeback_unavailable', sourceId: error.sourceId, message: 'Sending to the EMR is not switched on yet — the hospital connection is still being set up.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (error?.connectionUnavailable) {
      // Only the gateway's status and short error code are logged — never a body with patient data.
      console.log(`EMR Proxy: gateway tenant not authorized yet (connection unavailable) status=${error.gatewayStatus ?? '?'} error=${error.gatewayError ?? 'none'}`);
      return new Response(JSON.stringify({ error: 'connection_unavailable', message: 'EMR connection unavailable — the hospital connection is still being set up.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
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
  fhirCall: FhirCaller,
  ctx: OpContext
): Promise<any> {
  const start = Date.now();

  switch (operation) {
    case 'health_check': {
      const response = await fhirCall('GET', 'metadata');
      return { 
        status: response.ok ? 'healthy' : 'degraded', 
        latencyMs: Date.now() - start,
        capabilities: response.ok ? await response.json() : null
      };
    }

    case 'search_patients': {
      const query: Record<string, string> = {};
      if (params.name) query.name = params.name;
      // IRIS keys identifiers by system; a bare MRN returns nothing there.
      // The system always comes from the hospital's credentials row.
      if (params.mrn) {
        query.identifier = buildMrnIdentifier(String(params.mrn), ctx.mrnIdentifierSystem);
      }
      if (params.dob) query.birthdate = params.dob;
      if (params.family) query.family = params.family;
      if (params.given) query.given = params.given;
      query._count = String(params.count || '50');
      
      const response = await fhirCall('GET', 'Patient', query);
      const bundle = await handleFHIRResponse(response);
      let resources = (bundle.entry || []).map((e: any) => e.resource).filter((r: any) => r?.resourceType === 'Patient');
      // Never show a different person: only keep patients that actually carry this MRN.
      if (params.mrn) resources = filterByMrn(resources, String(params.mrn), ctx.mrnIdentifierSystem);
      const mapped = resources.map((r: any) => mapFhirPatient(r, ctx.mrnIdentifierSystem));
      // Display the MRN the patient matched on, not some other identifier.
      if (params.mrn) mapped.forEach((m: any) => { m.mrn = String(params.mrn); });
      return mapped;
    }

    case 'get_census': {
      // Live patient list for the hospital. Only for connections with an MRN
      // identifier system (real hospital tenants); plumbing sandboxes have none.
      if (!ctx.mrnIdentifierSystem) return { error: 'census_not_supported' };
      const [patientRes, encounterRes] = await Promise.all([
        fhirCall('GET', 'Patient', { _count: '200' }),
        fhirCall('GET', 'Encounter', { _count: '500' }),
      ]);
      const patientBundle = await handleFHIRResponse(patientRes);
      const encounterBundle = await handleFHIRResponse(encounterRes);
      const patients = (patientBundle.entry || []).map((e: any) => e.resource).filter((r: any) => r?.resourceType === 'Patient');
      const encounters = (encounterBundle.entry || []).map((e: any) => e.resource).filter((r: any) => r?.resourceType === 'Encounter');
      return { patients: buildCensus(patients, encounters, ctx.mrnIdentifierSystem) };
    }

    case 'get_patient': {
      const response = await fhirCall('GET', `Patient/${params.id}`);
      return mapFhirPatient(await handleFHIRResponse(response), ctx.mrnIdentifierSystem);
    }

    case 'update_patient': {
      const response = await fhirCall('PATCH', `Patient/${params.id}`, {}, JSON.stringify(params.data));
      return mapFhirPatient(await handleFHIRResponse(response));
    }

    case 'get_lab_results': {
      const query: Record<string, string> = { patient: params.patientId, _sort: '-date', _count: '200' };
      if (params.code) query.code = params.code;
      if (params.date) query.date = params.date;
      
      if (ctx.viaGateway) {
        // Gateway (IRIS): labs are Observations with category=laboratory
        const { _sort: _ignored, ...obsQuery } = query; // IRIS rejects _sort=date on Observation
        const response = await fhirCall('GET', 'Observation', { ...obsQuery, category: 'laboratory' });
        const bundle = await handleFHIRResponse(response);
        return (bundle.entry || []).map((e: any) => mapLabObservation(e.resource, params.patientId));
      }
      const response = await fhirCall('GET', 'DiagnosticReport', query);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapLabResult(e.resource, params.patientId));
    }

    case 'get_medications': {
      const query: Record<string, string> = { patient: params.patientId, _count: '100' };
      if (params.status) query.status = params.status;
      
      const response = await fhirCall('GET', 'MedicationRequest', query);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapMedication(e.resource));
    }

    case 'get_allergies': {
      const response = await fhirCall('GET', 'AllergyIntolerance', { patient: params.patientId, _count: '100' });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapAllergy(e.resource));
    }

    case 'get_conditions': {
      const query: Record<string, string> = { patient: params.patientId, _count: '100' };
      if (params.category) query.category = params.category;
      if (params.clinicalStatus) query['clinical-status'] = params.clinicalStatus;
      
      const response = await fhirCall('GET', 'Condition', query);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapCondition(e.resource));
    }

    case 'get_vitals': {
      const vq: Record<string, string> = { patient: params.patientId, category: 'vital-signs', _count: '200' };
      if (!ctx.viaGateway) vq._sort = '-date'; // IRIS rejects _sort=date
      const response = await fhirCall('GET', 'Observation', vq);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapVitalSign(e.resource));
    }

    case 'get_encounters': {
      const query: Record<string, string> = { patient: params.patientId, _count: '50' };
      if (!ctx.viaGateway) query._sort = '-date'; // IRIS rejects _sort=date
      if (params.status) query.status = params.status;
      if (params.type) query.type = params.type;
      
      const response = await fhirCall('GET', 'Encounter', query);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapEncounter(e.resource));
    }

    case 'get_immunizations': {
      const iq: Record<string, string> = { patient: params.patientId, _count: '100' };
      if (!ctx.viaGateway) iq._sort = '-date'; // IRIS rejects _sort=date
      const response = await fhirCall('GET', 'Immunization', iq);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapImmunization(e.resource));
    }

    case 'get_diagnostic_reports': {
      // Lab panels (result → Observations) and radiology reads (imagingStudy → ImagingStudy).
      if (!params.patientId) throw Object.assign(new Error('patientId is required'), { status: 400 });
      const response = await fhirCall('GET', 'DiagnosticReport', { patient: params.patientId, _count: '100' });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || [])
        .map((e: any) => e.resource)
        .filter((r: any) => r?.resourceType === 'DiagnosticReport')
        .map(mapDiagnosticReport);
    }

    case 'get_documents': {
      const query: Record<string, string> = { patient: params.patientId, _sort: '-date', _count: '50' };
      if (params.type) query.type = params.type;
      if (params.category) query.category = params.category;
      
      const response = await fhirCall('GET', 'DocumentReference', query);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapDocument(e.resource));
    }

    case 'get_procedures': {
      const query: Record<string, string> = { patient: params.patientId, _sort: '-date', _count: '100' };
      if (params.status) query.status = params.status;
      
      const response = await fhirCall('GET', 'Procedure', query);
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => mapProcedure(e.resource));
    }

    case 'get_imaging': {
      if (!params.patientId) throw Object.assign(new Error('patientId is required'), { status: 400 });
      const response = await fhirCall('GET', 'ImagingStudy', { patient: params.patientId, _count: '100' });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => ({
        id: e.resource.id,
        status: e.resource.status,
        started: e.resource.started,
        modality: e.resource.modality?.map((m: any) => m.code).join(', ') || e.resource.series?.[0]?.modality?.code,
        description: e.resource.description || e.resource.procedureCode?.[0]?.text,
        numberOfSeries: e.resource.numberOfSeries,
        numberOfInstances: e.resource.numberOfInstances,
      }));
    }

    case 'get_orders': {
      // Orders (ServiceRequest) for the live chart, including ones sent from Virtualis One.
      if (!params.patientId) throw Object.assign(new Error('patientId is required'), { status: 400 });
      const response = await fhirCall('GET', 'ServiceRequest', { patient: params.patientId, _count: '100' });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => e.resource)
        .filter((r: any) => r?.resourceType === 'ServiceRequest').map(mapOrder);
    }

    case 'get_notes': {
      // Clinical notes (DocumentReference) for the live chart; PDFs are left out of the list.
      if (!params.patientId) throw Object.assign(new Error('patientId is required'), { status: 400 });
      const response = await fhirCall('GET', 'DocumentReference', { patient: params.patientId, _count: '100' });
      const bundle = await handleFHIRResponse(response);
      return (bundle.entry || []).map((e: any) => e.resource)
        .filter((r: any) => r?.resourceType === 'DocumentReference').map(mapNote);
    }

    case 'get_note_pdf': {
      // One note's PDF, only if the note belongs to the patient whose chart is open.
      if (!params.patientId || !params.noteId) throw Object.assign(new Error('patientId and noteId are required'), { status: 400 });
      const doc = await handleFHIRResponse(await fhirCall('GET', `DocumentReference/${encodeURIComponent(params.noteId)}`));
      if (doc?.subject?.reference !== `Patient/${params.patientId}`) {
        throw Object.assign(new Error('This note does not belong to this patient'), { status: 404 });
      }
      const src = notePdfSource(doc);
      if (!src) return { error: 'no_pdf' };
      if ('data' in src) return { contentType: 'application/pdf', data: src.data };
      const bin = await handleFHIRResponse(await fhirCall('GET', `Binary/${encodeURIComponent(src.binaryId)}`));
      return bin?.data ? { contentType: 'application/pdf', data: bin.data } : { error: 'no_pdf' };
    }

    case 'get_everything': {
      const response = await fhirCall('GET', `Patient/${params.patientId}/$everything`);
      return await handleFHIRResponse(response);
    }

    case 'create_order': {
      // Gateway hospitals: LiveMed write-back payload (PUT /orders) through the gateway.
      if (ctx.viaGateway) {
        const input = parseInput(OrderInput, params);
        return await runWriteback('order', input.clientRequestId, input.patientId, fhirCall, ctx,
          (sign) => buildOrderPayload(input, sign));
      }
      const response = await fhirCall('POST', 'ServiceRequest', {}, JSON.stringify({
        resourceType: 'ServiceRequest',
        status: 'active',
        intent: 'order',
        priority: params.priority || 'routine',
        code: { coding: [{ system: params.codeSystem, code: params.code, display: params.description }] },
        subject: { reference: `Patient/${params.patientId}` },
        requester: params.requesterId ? { reference: `Practitioner/${params.requesterId}` } : undefined,
        reasonCode: params.indication ? [{ text: params.indication }] : undefined,
        note: params.notes ? [{ text: params.notes }] : undefined,
      }));
      return await handleFHIRResponse(response);
    }

    case 'create_note': {
      // Signed note as a PDF (PUT /notes) through the gateway. Gateway hospitals only.
      if (!ctx.viaGateway) {
        throw Object.assign(new Error('create_note is only available for gateway-connected hospitals'), { status: 501 });
      }
      const input = parseInput(NoteInput, params);
      return await runWriteback('note', input.clientRequestId, input.patientId, fhirCall, ctx,
        (sign) => buildNotePayload(input, sign));
    }

    case 'cancel_order': {
      const response = await fhirCall('PATCH', `ServiceRequest/${params.orderId}`, {}, JSON.stringify([
        { op: 'replace', path: '/status', value: 'revoked' }
      ]));
      return await handleFHIRResponse(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// Sends one order/note to the hospital via the gateway write-back route.
// The MRN is read from the hospital's own Patient record (never trusted from the client),
// and each send gets a stable source id from emr_writebacks so a retried request
// re-sends the same sourceOrderId/sourceNoteId instead of creating a duplicate.
async function runWriteback(
  kind: 'order' | 'note',
  clientRequestId: string,
  patientId: string,
  fhirCall: FhirCaller,
  ctx: OpContext,
  build: (sign: { mrn: string; userId: string; sourceId: string; signedAt: string }) => Record<string, unknown>,
): Promise<any> {
  if (!ctx.tenant) throw Object.assign(new Error('Hospital is not connected through the gateway'), { status: 501 });

  const patient = await handleFHIRResponse(await fhirCall('GET', `Patient/${encodeURIComponent(patientId)}`));
  const mrn = displayMrn(patient, ctx.mrnIdentifierSystem);
  if (!mrn) throw Object.assign(new Error("This patient has no MRN under the hospital's identifier system"), { status: 422 });

  const sb = ctx.supabase;
  const lookup = () => sb.from('emr_writebacks').select('*')
    .eq('user_id', ctx.userId).eq('client_request_id', clientRequestId).maybeSingle();
  let { data: row } = await lookup();
  if (!row) {
    const ins = await sb.from('emr_writebacks')
      .insert({ hospital_id: ctx.hospitalId, user_id: ctx.userId, kind, client_request_id: clientRequestId })
      .select('*').single();
    row = ins.data ?? (await lookup()).data;
    if (!row) throw new Error('Could not record the write-back');
  }
  if (row.kind !== kind) throw Object.assign(new Error('Request id already used for a different item'), { status: 409 });
  if (row.status === 'sent') return { status: 'sent', sourceId: row.source_id, duplicate: true };

  const body = JSON.stringify(build({ mrn, userId: ctx.userId, sourceId: row.source_id, signedAt: signedAtNow() }));
  if (body.length > 1024 * 1024) throw Object.assign(new Error('Too large to send (1 MB limit)'), { status: 413 });

  const res = await gatewayWriteback(ctx.tenant, kind === 'order' ? 'orders' : 'notes', body);
  const text = await res.text();
  const mark = (status: string, extra: Record<string, unknown> = {}) =>
    sb.from('emr_writebacks').update({ status, response_status: res.status, ...extra }).eq('id', row.id);

  const verdict = classifyGatewayReply(res.status, text);
  if (verdict.kind === 'not_set_up') {
    await mark('unavailable', { error: verdict.error ? `gateway: ${verdict.error}` : null });
    throw Object.assign(new Error('writeback_unavailable'), { writebackUnavailable: true, sourceId: row.source_id });
  }
  // Gateway refusals never reach the hospital, so nothing was created and a retry
  // with the same source id is safe.
  if (verdict.kind === 'too_large') {
    await mark('failed', { error: `gateway: ${verdict.error}` });
    throw Object.assign(new Error(`The ${kind} is too large to send — nothing was sent to the EMR.`), { status: 413 });
  }
  if (verdict.kind === 'refused') {
    await mark('failed', { error: `gateway: ${verdict.error}` });
    throw Object.assign(
      new Error(`The EMR gateway turned down the ${kind} (HTTP ${verdict.status}: ${verdict.error}) — nothing was sent to the EMR.`),
      { status: 502 });
  }
  if (!res.ok) {
    await mark('failed', { error: `HTTP ${res.status}` });
    const detail = (() => { try { const j = JSON.parse(text); return j.error || j.message || ''; } catch { return text.slice(0, 200); } })();
    throw Object.assign(new Error(`The EMR did not accept the ${kind} (HTTP ${res.status})${detail ? `: ${detail}` : ''}`),
      { status: res.status >= 500 ? 502 : 422 });
  }
  await mark('sent', { error: null });
  let emr: unknown = null;
  try { emr = text ? JSON.parse(text) : null; } catch { /* non-JSON acknowledgement */ }
  return { status: 'sent', sourceId: row.source_id, emr };
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
  return { error: error.message, status: error.status || 500 };
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
function mapFhirPatient(fhir: any, mrnSystem: string | null = null) {
  const name = fhir.name?.[0] || {};
  return {
    id: fhir.id,
    mrn: displayMrn(fhir, mrnSystem),
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

function mapLabObservation(fhir: any, patientId: string) {
  const q = fhir.valueQuantity;
  return {
    id: fhir.id,
    patientId,
    code: fhir.code?.coding?.[0]?.code || '',
    name: fhir.code?.text || fhir.code?.coding?.[0]?.display || '',
    value: q ? `${q.value}${q.unit ? ' ' + q.unit : ''}` : (fhir.valueString || fhir.valueCodeableConcept?.text || ''),
    status: fhir.status,
    effectiveDate: fhir.effectiveDateTime,
    issuedDate: fhir.issued,
    performer: fhir.performer?.[0]?.display,
    category: 'laboratory',
    referenceRange: fhir.referenceRange?.[0]?.text
      || (fhir.referenceRange?.[0]?.low || fhir.referenceRange?.[0]?.high
        ? `${fhir.referenceRange[0].low?.value ?? ''}-${fhir.referenceRange[0].high?.value ?? ''}` : undefined),
    interpretation: fhir.interpretation?.[0]?.coding?.[0]?.code || fhir.interpretation?.[0]?.coding?.[0]?.display || fhir.interpretation?.[0]?.text,
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
    name: fhir.medicationCodeableConcept?.text || fhir.medicationCodeableConcept?.coding?.[0]?.display || fhir.medicationReference?.display || '',
    code: fhir.medicationCodeableConcept?.coding?.[0]?.code,
    status: fhir.status,
    intent: fhir.intent,
    dosage: fhir.dosageInstruction?.[0]?.text || (() => {
      const d = fhir.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity;
      return d ? `${d.value} ${d.unit || ''}`.trim() : undefined;
    })(),
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
    // Blood pressure arrives as systolic/diastolic components; text values (e.g. O2 device) as valueString.
    value: fhir.valueQuantity?.value ?? (fhir.component?.length
      ? fhir.component.map((c: any) => c.valueQuantity?.value).filter((v: any) => v !== undefined).join('/')
      : (fhir.valueString ?? fhir.valueCodeableConcept?.text)),
    unit: fhir.valueQuantity?.unit ?? fhir.component?.[0]?.valueQuantity?.unit,
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
    location: roomFor(fhir),
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
