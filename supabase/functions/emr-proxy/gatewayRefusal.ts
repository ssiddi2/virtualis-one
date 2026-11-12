// How to read a Virtualis gateway reply (FHIR and write-back routes share the contract):
// - 2xx: the hospital's reply, passed through unchanged.
// - Any 4xx whose body is JSON with a string `error`: the GATEWAY refused the request
//   (bad signature, unknown tenant 404, wrong method 405, body too large 413, ...).
//   Nothing reached the hospital, so a retry with the same source id is safe.
// - 401/403 always mean the tenant isn't authorized yet ("still being set up").
// - Anything else: the hospital's own reply, passed through unchanged.

export type GatewayVerdict =
  | { kind: 'ok' }
  | { kind: 'not_set_up'; status: number; error?: string }   // 401/403, or 404 unknown tenant
  | { kind: 'too_large'; status: number; error: string }     // 413
  | { kind: 'refused'; status: number; error: string }       // other gateway 4xx (e.g. 405)
  | { kind: 'emr_error'; status: number };                   // hospital's own error, passed through

export function gatewayErrorOf(text: string): string | null {
  try {
    const j = JSON.parse(text);
    return j && typeof j === 'object' && !Array.isArray(j) && typeof j.error === 'string' && j.error ? j.error : null;
  } catch {
    return null;
  }
}

export function classifyGatewayReply(status: number, text: string): GatewayVerdict {
  if (status >= 200 && status < 300) return { kind: 'ok' };
  const error = status >= 400 && status < 500 ? gatewayErrorOf(text) : null;
  if (status === 401 || status === 403) return { kind: 'not_set_up', status, ...(error ? { error } : {}) };
  if (error === null) return { kind: 'emr_error', status };
  if (status === 404) return { kind: 'not_set_up', status, error };
  if (status === 413) return { kind: 'too_large', status, error };
  return { kind: 'refused', status, error };
}
