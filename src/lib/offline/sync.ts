import { getQueuedEvaluations, removeQueuedEvaluation } from './db';
import { UserRole } from '@/types/database';
import { getMockTokenForRole } from '@/lib/auth/rbac';

export interface SyncResult {
  total: number;
  synced: number;
  failed: number;
  errors: string[];
}

export async function processOfflineQueue(role: UserRole = 'EVALUADOR'): Promise<SyncResult> {
  const queue = await getQueuedEvaluations();
  const result: SyncResult = {
    total: queue.length,
    synced: 0,
    failed: 0,
    errors: [],
  };

  if (queue.length === 0) return result;

  for (const item of queue) {
    try {
      const payload = JSON.parse(item.payload_json);
      const res = await fetch('/api/evaluations/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getMockTokenForRole(role),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await removeQueuedEvaluation(item.id_transaccion);
        result.synced++;
      } else {
        const errorData = await res.json().catch(() => ({}));
        result.failed++;
        result.errors.push(`Error en tx ${item.id_transaccion}: ${errorData.error || res.statusText}`);
      }
    } catch (err: any) {
      result.failed++;
      result.errors.push(`Fallo de red en tx ${item.id_transaccion}: ${err.message}`);
    }
  }

  // Dispatch custom browser event to refresh UI counters
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('proninez-sync-complete', { detail: result }));
  }

  return result;
}
