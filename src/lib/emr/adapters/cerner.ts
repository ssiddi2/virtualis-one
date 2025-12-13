import { FHIRClient } from '../fhir-client';
import type { EMRAdapter } from './base';
import type { EMRConfig, Patient, Order, LabResult } from '../types';

export class CernerAdapter implements EMRAdapter {
  private fhir: FHIRClient;

  constructor(config: EMRConfig) { this.fhir = new FHIRClient(config); }

  async connect() {
    try { await this.fhir.request('/metadata'); return { success: true }; }
    catch (e) { return { success: false, error: (e as Error).message }; }
  }

  async disconnect() {}

  async healthCheck() {
    const start = Date.now();
    try { await this.fhir.request('/metadata'); return { status: 'healthy' as const, latencyMs: Date.now() - start }; }
    catch { return { status: 'down' as const, latencyMs: Date.now() - start }; }
  }

  async searchPatients(query: { name?: string; mrn?: string }): Promise<Patient[]> {
    const params = new URLSearchParams();
    if (query.name) params.set('name', query.name);
    if (query.mrn) params.set('identifier', query.mrn);
    const bundle = await this.fhir.request<any>(`/Patient?${params}`);
    return (bundle.entry || []).map((e: any) => this.mapPatient(e.resource));
  }

  async getPatient(id: string): Promise<Patient> {
    return this.mapPatient(await this.fhir.request<any>(`/Patient/${id}`));
  }

  async createOrder(order: Order): Promise<Order> {
    const result = await this.fhir.request<any>('/ServiceRequest', {
      method: 'POST',
      body: JSON.stringify({
        resourceType: 'ServiceRequest', status: 'active', intent: 'order',
        code: { coding: [{ code: order.code }] }, subject: { reference: `Patient/${order.patientId}` },
      }),
    });
    return { ...order, id: result.id };
  }

  async getLabResults(patientId: string): Promise<LabResult[]> {
    const bundle = await this.fhir.request<any>(`/DiagnosticReport?patient=${patientId}`);
    return (bundle.entry || []).map((e: any) => ({
      id: e.resource.id, orderId: '', patientId, code: e.resource.code?.coding?.[0]?.code || '',
      name: e.resource.code?.text || '', value: e.resource.conclusion || '', unit: '', referenceRange: '',
      interpretation: 'normal' as const, collectedAt: e.resource.effectiveDateTime || '', resultedAt: e.resource.issued || '',
    }));
  }

  private mapPatient(p: any): Patient {
    return {
      id: p.id, mrn: p.identifier?.[0]?.value || '', firstName: p.name?.[0]?.given?.join(' ') || '',
      lastName: p.name?.[0]?.family || '', dob: p.birthDate || '', gender: p.gender || 'unknown',
    };
  }
}
