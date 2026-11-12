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
- [x] Patients + My Patients lists read live from the hospital EMR (gateway census) for gateway hospitals; local records only for others
- [x] Live patient chart (/patient-chart/fhir/:id): problems, meds, labs, vitals, imaging, visits from IRIS
- [x] Remember the chosen hospital across page reloads
- [x] Map Postman "FHIR-only patient reads" collection to chart tabs: labs grouped by panel, imaging shows the radiologist's impression + full report, new Immunizations tab, 200-row limits
- [ ] Saving notes/billing for live-EMR patients (notes table needs a local patient row) — not started
- [x] Confirm on-screen MRN search after the retry change — user searched MRN 4100206 in the preview and got "Found patient: Gerald Thomas Whitaker"; gateway logs show search_patients completed via tenant isc-hlthdemo
- [x] Write-back: "Place order" and "Write note" on the live chart send LiveMed payloads (PUT orders/notes) via the gateway; notes go as text PDFs like the samples

## Before write-back is finished
- [ ] Gateway rejects every request with 401 bad_signature since about 21:18 UTC Nov 12 (worked earlier that day; signing code unchanged) — waiting on Matt/Virtualis: was the HMAC secret rotated? If so, enter the new keys
- [x] Virtualis deploys the gateway write-back route — confirmed 17:38 UTC 2026-11-12 with safe requests: 401 bad_signature, 404 tenant_not_found, 404 writeback_target_not_found, 400 invalid_json
- [x] Treat any gateway 4xx with an {error} body as a gateway refusal (404 unknown tenant, 405, 413), on reads and write-backs
- [ ] Replace temporary orderedBy/signedBy (Virtualis One user id) with the real clinician id — waiting on Matt
- [ ] Encounter on orders: send an encounterId, or let IRIS use the patient's active inpatient encounter (today none is sent) — waiting on Matt
- [x] First real end-to-end send to IRIS (Matt said go, 17:47 UTC 2026-11-12): order VO-ORD-000003 → ServiceRequest/eNKmfA1rz6Sqb3Di8ek85JK3, note VO-NOTE-000004 → DocumentReference/e9lNE40aLnhqLvRaflTvKev3, both outcome created and read back from IRIS for MRN 4100206
- [ ] Reference numbers will collide with the Postman samples already in IRIS (VO-ORD-000123/125/126, VO-NOTE-000457/458) — a send with one of those would update the sample instead of creating a new item; waiting on Matt to pick a fix
- [ ] Confirm signedAt time zone (sent as UTC today) and whether more order types / note types are allowed (priorities: Matt chose routine + urgent only, even though the IRIS mapping doc also allows asap/stat)
- [ ] Hook the app's other order and note screens to the EMR for live patients (they still save locally only)
- [x] Show sent orders/notes in the app: Orders + Notes tabs on the live chart read from IRIS; View PDF opens the note as IRIS stores it
