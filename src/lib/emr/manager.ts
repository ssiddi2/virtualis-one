import { withRetry } from './retry';
import { EpicAdapter } from './adapters/epic';
import { CernerAdapter } from './adapters/cerner';
import { MeditechAdapter } from './adapters/meditech';
import { AllscriptsAdapter } from './adapters/allscripts';
import type { EMRAdapter } from './adapters/base';
import type { EMRConfig } from './types';

export class EMRManager {
  private adapters = new Map<string, EMRAdapter>();

  async register(hospitalId: string, config: EMRConfig) {
    const adapter = this.createAdapter(config);
    const result = await withRetry(() => adapter.connect());
    if (result.success) this.adapters.set(hospitalId, adapter);
    return result;
  }

  async unregister(hospitalId: string) {
    const adapter = this.adapters.get(hospitalId);
    if (adapter) { await adapter.disconnect(); this.adapters.delete(hospitalId); }
  }

  get(hospitalId: string): EMRAdapter {
    const adapter = this.adapters.get(hospitalId);
    if (!adapter) throw new Error(`No EMR adapter for: ${hospitalId}`);
    return adapter;
  }

  private createAdapter(config: EMRConfig): EMRAdapter {
    const adapters: Record<string, new (c: EMRConfig) => EMRAdapter> = {
      epic: EpicAdapter, cerner: CernerAdapter, meditech: MeditechAdapter, allscripts: AllscriptsAdapter,
    };
    return new (adapters[config.vendor] || EpicAdapter)(config);
  }
}

export const emrManager = new EMRManager();
