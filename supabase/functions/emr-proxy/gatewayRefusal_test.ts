import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { classifyGatewayReply } from "./gatewayRefusal.ts";

const gw = (error: string) => JSON.stringify({ error });

Deno.test("2xx is a normal reply", () => {
  assertEquals(classifyGatewayReply(200, '{"ok":true}').kind, 'ok');
});

Deno.test("401 and 403 mean the connection is still being set up, whatever the body", () => {
  assertEquals(classifyGatewayReply(401, gw('bad_signature')).kind, 'not_set_up');
  assertEquals(classifyGatewayReply(403, 'Forbidden').kind, 'not_set_up');
});

Deno.test("404 with an {error} body is an unknown tenant (still being set up)", () => {
  assertEquals(classifyGatewayReply(404, gw('unknown_tenant')).kind, 'not_set_up');
});

Deno.test("404 without an {error} body is the hospital's own reply", () => {
  const outcome = JSON.stringify({ resourceType: 'OperationOutcome', issue: [{ diagnostics: 'Patient not found' }] });
  assertEquals(classifyGatewayReply(404, outcome).kind, 'emr_error');
});

Deno.test("405 with an {error} body is a gateway refusal", () => {
  assertEquals(classifyGatewayReply(405, gw('method_not_allowed')), { kind: 'refused', status: 405, error: 'method_not_allowed' });
});

Deno.test("413 with an {error} body means the body was too large", () => {
  assertEquals(classifyGatewayReply(413, gw('payload_too_large')).kind, 'too_large');
});

Deno.test("any other 4xx with an {error} body is a gateway refusal", () => {
  assertEquals(classifyGatewayReply(400, gw('bad_request')).kind, 'refused');
  assertEquals(classifyGatewayReply(429, gw('rate_limited')).kind, 'refused');
});

Deno.test("5xx is never treated as a gateway refusal", () => {
  assertEquals(classifyGatewayReply(502, gw('upstream')).kind, 'emr_error');
});
