// Virtualis FHIR Gateway client (Deno).
// Signs each request with HMAC-SHA256 over "<timestamp>\n<METHOD>\n<canonical path>\n<sha256hex(body)>".
// The gateway forwards to hospital FHIR servers from one fixed egress IP and holds
// the hospital OAuth credentials, so the edge function never calls hospitals directly.

const GATEWAY_URL = Deno.env.get('FHIR_GATEWAY_URL')!;          // e.g. https://abc123.execute-api.us-east-1.amazonaws.com/v1
const GATEWAY_KEY = Deno.env.get('FHIR_GATEWAY_API_KEY')!;      // from Virtualis (API Gateway key)
const GATEWAY_HMAC = Deno.env.get('FHIR_GATEWAY_HMAC_SECRET')!; // from Virtualis (Secrets Manager hmac_secret)

const enc = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

async function sha256hex(s: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))]
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacHex(secret: string, msg: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg)))]
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

/** tenant = the gateway's tenant slug for this hospital (stored on emr_credentials as gateway_tenant). */
export async function gatewayFetch(
  tenant: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH',
  fhirPath: string,
  query: Record<string, string> = {},
  body = ''
): Promise<Response> {
  const path = `/v1/tenants/${enc(tenant)}/fhir/${fhirPath.replace(/^\/+/, '')}`;
  const pairs = Object.entries(query).map(([k, v]) => `${enc(k)}=${enc(v)}`).sort();
  const canonical = pairs.length ? `${path}?${pairs.join('&')}` : path;
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = await hmacHex(GATEWAY_HMAC, `${ts}\n${method}\n${canonical}\n${await sha256hex(body)}`);
  const url = `${GATEWAY_URL.replace(/\/v1$/, '')}${canonical}`;
  return fetch(url, {
    method,
    headers: {
      'x-api-key': GATEWAY_KEY,
      'x-virtualis-timestamp': ts,
      'x-virtualis-signature': sig,
      'Accept': 'application/fhir+json',
      ...(body ? { 'Content-Type': 'application/fhir+json' } : {}),
    },
    body: body || undefined,
  });
}
