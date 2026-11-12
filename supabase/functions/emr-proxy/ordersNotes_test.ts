import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { mapOrder, mapNote, notePdfSource } from "./ordersNotes.ts";

Deno.test("an order sent from Virtualis One shows its VO-ORD reference", () => {
  const o = mapOrder({
    id: "sr1", status: "active", intent: "order", priority: "routine",
    code: { text: "CT Head without contrast" }, authoredOn: "2026-11-12T17:47:00+00:00",
    identifier: [{ system: "urn:virtualis:order-id", value: "VO-ORD-000003" }],
    reasonCode: [{ text: "Headache" }], note: [{ text: "No contrast" }],
  });
  assertEquals(o.sourceId, "VO-ORD-000003");
  assertEquals(o.name, "CT Head without contrast");
  assertEquals(o.indication, "Headache");
  assertEquals(o.details, "No contrast");
});

Deno.test("an order placed in the hospital's own EMR has no Virtualis reference", () => {
  assertEquals(mapOrder({ id: "sr2", identifier: [{ system: "urn:hospital:order", value: "12345" }] }).sourceId, null);
});

Deno.test("note list never carries the PDF bytes", () => {
  const n = mapNote({
    id: "d1", status: "current", docStatus: "final", type: { text: "Progress note" },
    identifier: [{ system: "urn:virtualis:note-id", value: "VO-NOTE-000004" }],
    content: [{ attachment: { contentType: "application/pdf", data: "JVBERi0x" } }],
  });
  assertEquals(n.sourceId, "VO-NOTE-000004");
  assertEquals(n.hasPdf, true);
  assertEquals(JSON.stringify(n).includes("JVBERi0x"), false);
});

Deno.test("note PDF comes from inline data, a Binary link, or nowhere", () => {
  assertEquals(notePdfSource({ content: [{ attachment: { contentType: "application/pdf", data: "AAA" } }] }), { data: "AAA" });
  assertEquals(notePdfSource({ content: [{ attachment: { contentType: "application/pdf", url: "Binary/b-1" } }] }), { binaryId: "b-1" });
  assertEquals(notePdfSource({ content: [{ attachment: { contentType: "text/plain", data: "AAA" } }] }), null);
  assertEquals(notePdfSource({ content: [{ attachment: { contentType: "application/pdf", url: "https://elsewhere/x.pdf" } }] }), null);
});
