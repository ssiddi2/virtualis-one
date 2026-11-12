// Maps hospital orders (ServiceRequest) and notes (DocumentReference) for the
// live chart's Orders and Notes tabs. Note lists never carry the PDF itself;
// the PDF is fetched on its own when someone opens it.

const text = (cc: any) => cc?.text || cc?.coding?.[0]?.display || cc?.coding?.[0]?.code || null;

// The id we sent as sourceOrderId / sourceNoteId (VO-ORD-… / VO-NOTE-…), if any.
export function virtualisSourceId(fhir: any): string | null {
  const ids: any[] = fhir?.identifier || [];
  const hit = ids.find((i) => String(i?.system || '').includes('virtualis')) ||
    ids.find((i) => /^VO\d*-(ORD|NOTE)-/.test(String(i?.value || '')));
  return hit?.value ?? null;
}

export function mapOrder(fhir: any) {
  return {
    id: fhir.id,
    name: text(fhir.code) || 'Order',
    category: text(fhir.category?.[0]),
    status: fhir.status ?? null,
    intent: fhir.intent ?? null,
    priority: fhir.priority ?? null,
    authoredOn: fhir.authoredOn ?? null,
    orderedBy: fhir.requester?.display || fhir.requester?.identifier?.value || fhir.requester?.reference || null,
    indication: (fhir.reasonCode || []).map(text).filter(Boolean).join('; ') || null,
    details: (fhir.note || []).map((n: any) => n?.text).filter(Boolean).join('\n') || null,
    sourceId: virtualisSourceId(fhir),
    version: fhir.meta?.versionId ?? null,
  };
}

const pdfAttachment = (fhir: any) =>
  (fhir?.content || []).map((c: any) => c?.attachment).find((a: any) => a?.contentType === 'application/pdf') || null;

export function mapNote(fhir: any) {
  const att = pdfAttachment(fhir);
  return {
    id: fhir.id,
    type: text(fhir.type) || 'Note',
    category: text(fhir.category?.[0]),
    status: fhir.status ?? null,
    docStatus: fhir.docStatus ?? null,
    date: fhir.date ?? null,
    author: (fhir.author || []).map((a: any) => a?.display || a?.identifier?.value || a?.reference).filter(Boolean).join(', ') || null,
    description: fhir.description ?? null,
    hasPdf: !!att && (!!att.data || !!att.url),
    sourceId: virtualisSourceId(fhir),
    version: fhir.meta?.versionId ?? null,
  };
}

// Where a note's PDF lives: inline base64, a FHIR Binary to read, or nowhere.
export function notePdfSource(fhir: any): { data: string } | { binaryId: string } | null {
  const att = pdfAttachment(fhir);
  if (!att) return null;
  if (att.data) return { data: att.data };
  const m = String(att.url || '').match(/(?:^|\/)Binary\/([A-Za-z0-9\-.]+)$/);
  return m ? { binaryId: m[1] } : null;
}
