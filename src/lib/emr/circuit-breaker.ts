type State = 'closed' | 'open' | 'half-open';

export class CircuitBreaker {
  private failures = 0;
  private lastFailure?: Date;
  private state: State = 'closed';

  constructor(private threshold = 5, private resetTimeMs = 30000) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const elapsed = Date.now() - (this.lastFailure?.getTime() || 0);
      if (elapsed > this.resetTimeMs) this.state = 'half-open';
      else throw new Error('Circuit breaker is open');
    }
    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private reset() { this.failures = 0; this.state = 'closed'; }
  
  private recordFailure() {
    this.failures++;
    this.lastFailure = new Date();
    if (this.failures >= this.threshold) this.state = 'open';
  }
}
