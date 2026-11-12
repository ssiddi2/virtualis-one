import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callEmr } from '@/lib/emrProxy';

export const EMR_ORDER_TYPES = ['Imaging', 'Consult'] as const;
export const EMR_ORDER_PRIORITIES = ['routine', 'urgent'] as const;
export const EMR_NOTE_TYPES = [
  { code: 'CN', label: 'Consult note', title: 'Consult Note' },
  { code: 'PN', label: 'Progress note', title: 'Progress Note' },
] as const;

export interface EmrOrderInput {
  clientRequestId: string;
  patientId: string;
  orderType: (typeof EMR_ORDER_TYPES)[number];
  priority: (typeof EMR_ORDER_PRIORITIES)[number];
  orderName: string;
  indication: string;
  details: string;
}

export interface EmrNoteInput {
  clientRequestId: string;
  patientId: string;
  noteType: 'CN' | 'PN';
  noteData: string; // base64 PDF
}

export type WritebackOutcome =
  | { kind: 'sent'; sourceId: string }
  | { kind: 'unavailable' };

async function send(hospitalId: string, op: 'create_order' | 'create_note', params: object): Promise<WritebackOutcome> {
  const r = await callEmr<{ sourceId: string }>(hospitalId, op, params as Record<string, any>);
  if (r.kind === 'unavailable') return { kind: 'unavailable' };
  if (r.kind !== 'ok') throw new Error("This hospital isn't connected to an EMR.");
  return { kind: 'sent', sourceId: r.data.sourceId };
}

// Each dialog keeps one clientRequestId per item, so a retry re-sends the same
// sourceOrderId/sourceNoteId instead of creating a duplicate in the EMR.
// After a send, the open chart re-reads so the new item shows in Orders/Notes.
const useSend = <T,>(hospitalId: string | undefined, op: 'create_order' | 'create_note') => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: T) => send(hospitalId!, op, input as object),
    onSuccess: (r, input: any) => {
      if (r.kind === 'sent') qc.invalidateQueries({ queryKey: ['fhir-chart', hospitalId, input.patientId] });
    },
  });
};

export const useSendEmrOrder = (hospitalId?: string) => useSend<EmrOrderInput>(hospitalId, 'create_order');

export const useSendEmrNote = (hospitalId?: string) => useSend<EmrNoteInput>(hospitalId, 'create_note');
