import { supabase } from '@/integrations/supabase/client';

// Outcome of a call to the hospital EMR connection (emr-proxy edge function).
export type EmrResult<T> =
  | { kind: 'ok'; data: T }
  | { kind: 'not_configured' }   // hospital has no EMR connection: use local records
  | { kind: 'unavailable' }      // gateway tenant not set up yet (401/403, or 404 unknown tenant)
  | { kind: 'unsupported' };     // connection exists but cannot list patients (plumbing sandbox)

const NOT_CONFIGURED = 'EMR not configured for this hospital';

export async function callEmr<T = any>(
  hospitalId: string,
  operation: string,
  params: Record<string, any> = {},
): Promise<EmrResult<T>> {
  const invoke = () =>
    supabase.functions.invoke('emr-proxy', { body: { hospital_id: hospitalId, operation, params } });

  let { data, error } = await invoke();
  // Transient network drop (request never reached the server): retry once.
  if (error?.name === 'FunctionsFetchError') {
    await new Promise((r) => setTimeout(r, 800));
    ({ data, error } = await invoke());
  }
  if (error?.name === 'FunctionsFetchError') {
    throw new Error('Could not reach the EMR service (network dropped). Please try again.');
  }
  if (error) {
    const status = (error as any)?.context?.status;
    let message = error.message;
    let body: any = null;
    try {
      body = await (error as any)?.context?.json?.();
      if (body?.error) message = body.error;
    } catch { /* body already read or not JSON */ }
    // Only the proxy's own "no connection" reply means local records; a 404 from the
    // hospital (e.g. a missing record) is a real error, not a missing connection.
    if (status === 404 && body?.error === NOT_CONFIGURED) return { kind: 'not_configured' };
    throw new Error(message || 'EMR request failed');
  }
  if (data?.error === 'connection_unavailable') return { kind: 'unavailable' };
  if (data?.error === 'writeback_unavailable') return { kind: 'unavailable' };
  if (data?.error === 'census_not_supported') return { kind: 'unsupported' };
  return { kind: 'ok', data: data as T };
}
