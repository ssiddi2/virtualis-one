const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
];

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  let sanitized = input.trim();
  DANGEROUS_PATTERNS.forEach(p => { sanitized = sanitized.replace(p, ''); });
  return sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = {} as T;
  for (const key in obj) {
    const v = obj[key];
    result[key] = typeof v === 'string' ? sanitizeInput(v) as T[typeof key] : 
                  typeof v === 'object' && v ? sanitizeObject(v) : v;
  }
  return result;
}

export const validators = {
  email: (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
  mrn: (m: string) => /^[A-Za-z0-9]{6,20}$/.test(m),
  phone: (p: string) => /^\+?[\d\s\-\(\)]{10,20}$/.test(p),
  uuid: (u: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u),
  icd10: (c: string) => /^[A-Z]\d{2}(\.\d{1,4})?$/.test(c),
  cpt: (c: string) => /^\d{5}$/.test(c),
};

class RateLimiter {
  private requests = new Map<string, number[]>();
  constructor(private max: number = 100, private windowMs: number = 60000) {}
  
  check(key: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const times = (this.requests.get(key) || []).filter(t => now - t < this.windowMs);
    if (times.length >= this.max) {
      return { allowed: false, retryAfter: Math.ceil((times[0] + this.windowMs - now) / 1000) };
    }
    times.push(now);
    this.requests.set(key, times);
    return { allowed: true };
  }
}

export const authRateLimiter = new RateLimiter(5, 300000);
export const apiRateLimiter = new RateLimiter(100, 60000);

const PREFIX = 'virtualis:';
export const secureStorage = {
  set: (k: string, v: any) => localStorage.setItem(PREFIX + k, JSON.stringify(v)),
  get: <T>(k: string): T | null => { try { return JSON.parse(localStorage.getItem(PREFIX + k) || 'null'); } catch { return null; } },
  remove: (k: string) => localStorage.removeItem(PREFIX + k),
  clear: () => Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k)),
};
