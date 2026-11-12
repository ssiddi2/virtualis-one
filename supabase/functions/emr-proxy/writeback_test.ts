import { assertEquals, assertThrows, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  OrderInput, NoteInput, parseInput, buildOrderPayload, buildNotePayload, signedAtNow,
} from "./writeback.ts";

const CRID = "6f1c1b7e-2c1a-4b6a-9b55-0f6a7a3c9d10";
const PDF = "JVBERi0xLjQKJSVFT0YK"; // "%PDF-1.4\n%%EOF\n"
const sign = { mrn: "4100206", userId: "user-uuid-1", sourceId: "VO-ORD-000123", signedAt: "2026-11-14T18:32:00+00:00" };

const order = {
  clientRequestId: CRID, patientId: "p1", orderType: "Imaging", priority: "urgent",
  orderName: "CT Head without contrast", indication: "Reassess for hemorrhagic conversion", details: "Compare to admission CT",
};

Deno.test("order payload has exactly the collection's fields, in order", () => {
  const p = buildOrderPayload(parseInput(OrderInput, order), sign);
  assertEquals(Object.keys(p), ["mrn", "orderType", "priority", "orderName", "indication", "details", "orderedBy", "signedAt", "sourceOrderId"]);
  assertEquals(p.sourceOrderId, "VO-ORD-000123");
});

Deno.test("orderedBy and signedBy are the signed-in Virtualis One user id", () => {
  assertEquals(buildOrderPayload(parseInput(OrderInput, order), sign).orderedBy, "user-uuid-1");
  const note = parseInput(NoteInput, { clientRequestId: CRID, patientId: "p1", noteType: "PN", noteData: PDF });
  assertEquals(buildNotePayload(note, { ...sign, sourceId: "VO-NOTE-000458" }).signedBy, "user-uuid-1");
});

Deno.test("only Imaging and Consult order types are accepted", () => {
  parseInput(OrderInput, { ...order, orderType: "Consult" });
  assertThrows(() => parseInput(OrderInput, { ...order, orderType: "Lab" }));
});

Deno.test("only routine and urgent priorities are accepted", () => {
  parseInput(OrderInput, { ...order, priority: "routine" });
  assertThrows(() => parseInput(OrderInput, { ...order, priority: "stat" }));
});

Deno.test("only CN and PN note types are accepted", () => {
  parseInput(NoteInput, { clientRequestId: CRID, patientId: "p1", noteType: "CN", noteData: PDF });
  assertThrows(() => parseInput(NoteInput, { clientRequestId: CRID, patientId: "p1", noteType: "DS", noteData: PDF }));
});

Deno.test("note data must be a base64 PDF", () => {
  assertThrows(() => parseInput(NoteInput, { clientRequestId: CRID, patientId: "p1", noteType: "PN", noteData: btoa("hello") }));
});

Deno.test("note payload has exactly the collection's fields, in order", () => {
  const n = parseInput(NoteInput, { clientRequestId: CRID, patientId: "p1", noteType: "CN", noteData: PDF });
  assertEquals(Object.keys(buildNotePayload(n, sign)), ["mrn", "noteType", "noteData", "signedBy", "signedAt", "sourceNoteId"]);
});

Deno.test("signedAt is ISO with an explicit offset, no milliseconds", () => {
  assertEquals(signedAtNow(new Date("2026-11-14T18:32:00.123Z")), "2026-11-14T18:32:00+00:00");
  assertMatch(signedAtNow(), /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\+00:00$/);
});
