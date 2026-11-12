// LiveMed write-back payloads (orders + notes), exactly as in the LiveMed Postman collection.
// Only the values the collection uses are accepted until more are confirmed.
import { z } from "npm:zod@3.23.8";

export const ORDER_TYPES = ['Imaging', 'Consult'] as const;
export const ORDER_PRIORITIES = ['routine', 'urgent'] as const;
export const NOTE_TYPES = ['CN', 'PN'] as const; // CN = consult note, PN = progress note
// Gateway body cap is 1 MiB; leave room for the other JSON fields.
export const MAX_NOTE_BASE64 = 1_000_000;

const base = {
  clientRequestId: z.string().uuid(),
  patientId: z.string().trim().min(1).max(128),
};

export const OrderInput = z.object({
  ...base,
  orderType: z.enum(ORDER_TYPES),
  priority: z.enum(ORDER_PRIORITIES),
  orderName: z.string().trim().min(1).max(200),
  indication: z.string().trim().min(1).max(1000),
  details: z.string().trim().max(2000).default(''),
});
export type OrderInput = z.infer<typeof OrderInput>;

export const NoteInput = z.object({
  ...base,
  noteType: z.enum(NOTE_TYPES),
  noteData: z.string()
    .max(MAX_NOTE_BASE64, 'Note is too large to send (1 MB limit).')
    .regex(/^JVBERi[A-Za-z0-9+/]*={0,2}$/, 'noteData must be a base64-encoded PDF'),
});
export type NoteInput = z.infer<typeof NoteInput>;

/** Validate params; throws a 400 with a readable message on bad input. */
export function parseInput<T>(schema: z.ZodType<T, any, any>, params: unknown): T {
  const r = schema.safeParse(params);
  if (!r.success) {
    const msg = r.error.issues.map((i) => `${i.path.join('.') || 'input'}: ${i.message}`).join('; ');
    throw Object.assign(new Error(msg), { status: 400 });
  }
  return r.data;
}

/** ISO-8601 with an explicit offset and no milliseconds, e.g. 2026-11-14T18:32:00+00:00. */
export function signedAtNow(d = new Date()): string {
  return d.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

export interface SignContext { mrn: string; userId: string; sourceId: string; signedAt: string; }

export function buildOrderPayload(o: OrderInput, s: SignContext) {
  return {
    mrn: s.mrn,
    orderType: o.orderType,
    priority: o.priority,
    orderName: o.orderName,
    indication: o.indication,
    details: o.details,
    orderedBy: s.userId,
    signedAt: s.signedAt,
    sourceOrderId: s.sourceId,
  };
}

export function buildNotePayload(n: NoteInput, s: SignContext) {
  return {
    mrn: s.mrn,
    noteType: n.noteType,
    noteData: n.noteData,
    signedBy: s.userId,
    signedAt: s.signedAt,
    sourceNoteId: s.sourceId,
  };
}
