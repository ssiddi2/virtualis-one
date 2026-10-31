import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildMrnIdentifier, filterByMrn } from "./mrnMatch.ts";

const SYS = "urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.14";

Deno.test("MRN search sends system|mrn using the hospital's system", () => {
  assertEquals(buildMrnIdentifier("4100206", SYS), `${SYS}|4100206`);
});

Deno.test("a returned patient whose identifiers lack the MRN is dropped (no match)", () => {
  const other = { id: "x", identifier: [{ system: SYS, value: "9999999" }] };
  assertEquals(filterByMrn([other], "4100206", SYS), []);
});

Deno.test("same MRN value under a different system is not a match", () => {
  const p = { id: "y", identifier: [{ system: "urn:other", value: "4100206" }] };
  assertEquals(filterByMrn([p], "4100206", SYS), []);
});

Deno.test("patient with the MRN under the hospital system is kept", () => {
  const p = { id: "1", identifier: [{ system: SYS, value: "4100206" }] };
  assertEquals(filterByMrn([p], "4100206", SYS).map((x) => x.id), ["1"]);
});
