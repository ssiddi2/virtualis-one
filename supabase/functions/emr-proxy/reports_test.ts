import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { mapDiagnosticReport, impressionFrom } from "./reports.ts";

const b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));

Deno.test("radiology report keeps the radiologist's read and links to its imaging study", () => {
  const body = "CT head without contrast\n\nFINDINGS: No intracranial hemorrhage.\n\nIMPRESSION: Early ischemic change in the left insula. No hemorrhage.\n";
  const r = mapDiagnosticReport({
    id: "dr1",
    category: [{ coding: [{ code: "RAD" }] }],
    code: { text: "CT head without contrast" },
    conclusion: "Early ischemic change in the left insula. No hemorrhage.",
    presentedForm: [{ contentType: "text/plain", data: b64(body) }],
    imagingStudy: [{ reference: "ImagingStudy/img1" }],
  });
  assertEquals(r.kind, "imaging");
  assertEquals(r.imagingStudyIds, ["img1"]);
  assertEquals(r.conclusion, "Early ischemic change in the left insula. No hemorrhage.");
  assertEquals(r.reportText, body.trim());
});

Deno.test("lab report lists the observations in its panel", () => {
  const r = mapDiagnosticReport({
    id: "dr2",
    category: [{ coding: [{ code: "LAB" }] }],
    code: { text: "CBC" },
    result: [{ reference: "Observation/o1" }, { reference: "Observation/o2" }],
  });
  assertEquals(r.kind, "lab");
  assertEquals(r.name, "CBC");
  assertEquals(r.resultIds, ["o1", "o2"]);
});

Deno.test("impression falls back to the IMPRESSION section when there is no conclusion", () => {
  assertEquals(impressionFrom("FINDINGS: x\n\nIMPRESSION: Acute infarct.\n"), "Acute infarct.");
  assertEquals(impressionFrom("FINDINGS: only findings"), undefined);
});
