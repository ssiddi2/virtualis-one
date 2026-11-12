import { supabase } from '@/integrations/supabase/client';

// Outcome of a call to the hospital EMR connection (emr-proxy edge function).
export type EmrResult<T> =
  | { kind: 'ok'; data: T }
  | { kind: 'not_configured' }   // hospital has no EMR connection: use local records
  | { kind: 'unavailable' }      // gateway tenant not authorized yet (401/403 upstream)
  | { kind: 'unsupported' };     // connection exists but cannot list patients (plumbing sandbox)

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
    if (status === 404) return { kind: 'not_configured' };
    let message = error.message;
    try {
      const body = await (error as any)?.context?.json?.();
      if (body?.error) message = body.error;
    } catch { /* body already read or not JSON */ }
    throw new Error(message || 'EMR request failed');
  }
  if (data?.error === 'connection_unavailable') return { kind: 'unavailable' };
  if (data?.error === 'writeback_unavailable') return { kind: 'unavailable' };
  if (data?.error === 'census_not_supported') return { kind: 'unsupported' };
  return { kind: 'ok', data: data as T };
}
