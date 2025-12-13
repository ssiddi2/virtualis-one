import type { Patient, Order, LabResult } from '../types';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
}

export interface EMRAdapter {
  connect(): Promise<{ success: boolean; error?: string }>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<HealthStatus>;
  searchPatients(query: { name?: string; mrn?: string; dob?: string }): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient>;
  createOrder(order: Order): Promise<Order>;
  getLabResults(patientId: string): Promise<LabResult[]>;
}
