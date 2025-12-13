import type { EMRAdapter } from './base';
import type { EMRConfig, Patient, Order, LabResult } from '../types';

export class AllscriptsAdapter implements EMRAdapter {
  private accessToken?: string;

  constructor(private config: EMRConfig) {}

  async connect() {
    try {
      const res = await fetch(`${this.config.baseUrl}/oauth/token`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grant_type: 'client_credentials', client_id: this.config.clientId, client_secret: this.config.clientSecret }),
      });
      if (!res.ok) return { success: false, error: `Auth failed: ${res.status}` };
      this.accessToken = (await res.json()).access_token;
      return { success: true };
    } catch (e) { return { success: false, error: (e as Error).message }; }
  }

  async disconnect() { this.accessToken = undefined; }
  async healthCheck() { return { status: this.accessToken ? 'healthy' as const : 'down' as const, latencyMs: 100 }; }

  async searchPatients(): Promise<Patient[]> { return []; }
  async getPatient(id: string): Promise<Patient> { return { id, mrn: id, firstName: '', lastName: '', dob: '', gender: 'unknown' }; }
  async createOrder(order: Order): Promise<Order> { return { ...order, id: `AS-${Date.now()}` }; }
  async getLabResults(): Promise<LabResult[]> { return []; }
}
