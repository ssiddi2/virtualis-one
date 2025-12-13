import type { EMRAdapter } from './base';
import type { EMRConfig, Patient, Order, LabResult } from '../types';

export class MeditechAdapter implements EMRAdapter {
  private connected = false;

  constructor(private config: EMRConfig) {}

  async connect() { this.connected = true; return { success: true }; }
  async disconnect() { this.connected = false; }
  async healthCheck() { return { status: this.connected ? 'healthy' as const : 'down' as const, latencyMs: 50 }; }

  async searchPatients(): Promise<Patient[]> { return []; } // HL7 QBP^Q22
  async getPatient(id: string): Promise<Patient> {
    return { id, mrn: id, firstName: '', lastName: '', dob: '', gender: 'unknown' };
  }
  async createOrder(order: Order): Promise<Order> { return { ...order, id: `MT-${Date.now()}` }; } // HL7 ORM^O01
  async getLabResults(): Promise<LabResult[]> { return []; }
}
