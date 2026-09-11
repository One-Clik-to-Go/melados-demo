import { EvaluationIngestPayload, SyncQueueItem } from '@/types/database';

const DB_NAME = 'proninez_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'evaluaciones_queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id_transaccion' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function enqueueEvaluation(payload: EvaluationIngestPayload): Promise<SyncQueueItem> {
  const transactionId = payload.id_transaccion || `tx-${Date.now()}`;
  const instrumento = payload.instrumento || payload.evaluacion_academicas?.instrumento || 'EGRA';

  const item: SyncQueueItem = {
    id_transaccion: transactionId,
    tabla_destino: instrumento === 'EGRA' ? 'evaluaciones_egra' :
                  instrumento === 'EGMA' ? 'evaluaciones_egma' : 'evaluaciones_sdq',
    operacion_tipo: 'INSERT',
    payload_json: JSON.stringify(payload),
    creado_en: new Date().toISOString(),
    estado_sync: 'PENDIENTE',
    reintentos: 0,
  };

  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    // SSR Fallback (memory storage)
    const memoryQueue = getMemoryQueue();
    memoryQueue.push(item);
    saveMemoryQueue(memoryQueue);
    return item;
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

export async function getQueuedEvaluations(): Promise<SyncQueueItem[]> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return getMemoryQueue();
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('Failed to read IndexedDB, returning memory queue:', error);
    return getMemoryQueue();
  }
}

export async function removeQueuedEvaluation(id_transaccion: string): Promise<void> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    const memoryQueue = getMemoryQueue().filter(i => i.id_transaccion !== id_transaccion);
    saveMemoryQueue(memoryQueue);
    return;
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id_transaccion);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Memory fallbacks for SSR/safari private browsing
function getMemoryQueue(): SyncQueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('proninez_memory_queue');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMemoryQueue(queue: SyncQueueItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('proninez_memory_queue', JSON.stringify(queue));
  } catch {
    // Ignore
  }
}
