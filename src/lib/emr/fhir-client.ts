import { CircuitBreaker } from './circuit-breaker';
import type { EMRConfig } from './types';

export class FHIRClient {
  private accessToken?: string;
  private tokenExpiry?: Date;
  private circuitBreaker = new CircuitBreaker();

  constructor(private config: EMRConfig) {}

  private async getToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }
    const response = await fetch(`${this.config.baseUrl}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        scope: this.config.scopes.join(' '),
      }),
    });
    if (!response.ok) throw new Error(`Token failed: ${response.status}`);
    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in - 60) * 1000);
    return this.accessToken!;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.circuitBreaker.execute(async () => {
      const token = await this.getToken();
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/fhir+json',
          Accept: 'application/fhir+json',
          ...options.headers,
        },
      });
      if (!response.ok) throw new Error(`FHIR failed: ${response.status}`);
      return response.json();
    });
  }
}
