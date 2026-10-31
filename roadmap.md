# Roadmap

- [x] Add a sidebar link to the Epic Sandbox Test page (/epic-test) so it's reachable from the app
- [x] Diagnose sidebar flashing: infinite auth subscription loop (~200 profiles req/s) in EnterpriseAuthContext
- [x] Fix: run auth effect once, throttle activity expiry updates, guard duplicate profile fetches
- [x] Verify fix in preview (network request count should drop to near zero when idle) — confirmed 2,591 -> 0 idle requests
- [x] Fix /epic-test MRN search: "Failed to send a request to the Edge Function" — root cause was missing hospital_id + raw-array response parsing
- [x] Fix /epic-test MRN search: page now sends hospital_id (sandbox HAPI hospital) and parses raw array responses
- [x] IRIS addendum: mrn_identifier_system column, system|mrn search, labs/vitals/imaging/$everything reads, block create_order via gateway
- [x] Strict MRN match (never show a different person) + test
- [x] Separate IRIS demo hospital (isc-hlthdemo); HAPI kept for plumbing only; 401 = connection unavailable
- [x] /epic-test: retry once on dropped connection, plain-language message instead of "Failed to send a request to the Edge Function"
- [ ] Confirm on-screen MRN search after the retry change — needs a signed-in preview session (auth is external/unmanaged, agent can't mint one)
