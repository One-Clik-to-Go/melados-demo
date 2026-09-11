'use client';

import React, { useState, useEffect } from 'react';
import { getQueuedEvaluations } from '@/lib/offline/db';
import { processOfflineQueue, SyncResult } from '@/lib/offline/sync';
import { UserRole } from '@/types/database';
import { RefreshCw, CheckCircle2, CloudUpload, HardDrive } from 'lucide-react';

interface SyncStatusBannerProps {
  isOnline: boolean;
  currentRole: UserRole;
}

export const SyncStatusBanner: React.FC<SyncStatusBannerProps> = ({ isOnline, currentRole }) => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  const refreshCount = async () => {
    try {
      const queue = await getQueuedEvaluations();
      setPendingCount(queue.length);
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 5000);

    const handleSyncComplete = () => {
      refreshCount();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('proninez-sync-complete', handleSyncComplete);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('proninez-sync-complete', handleSyncComplete);
      }
    };
  }, []);

  const handleManualSync = async () => {
    if (pendingCount === 0 || isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await processOfflineQueue(currentRole);
      setLastSyncResult(res);
      await refreshCount();
    } catch (err: any) {
      console.error('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full mb-6">
      {/* Offline Alert / Pending Queue Banner */}
      {pendingCount > 0 ? (
        <div className="bg-blue-50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-proninez-blue/10 text-proninez-blue flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>Evaluaciones Guardadas en tu Dispositivo</span>
                <span className="bg-proninez-blue text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {pendingCount} {pendingCount === 1 ? 'evaluación' : 'evaluaciones'}
                </span>
              </h3>
              <p className="text-xs text-gray-600">
                Las pruebas tomadas en el campo están resguardadas de forma segura. Se enviarán automáticamente al conectarse a internet.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={!isOnline || isSyncing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              isOnline && !isSyncing
                ? 'bg-proninez-teal hover:bg-proninez-teal/90 text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Guardando en la nube...' : 'Enviar Ahora'}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between border border-gray-200 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-proninez-green" />
            <span>Toda la información está guardada y respaldada en el sistema principal.</span>
          </div>
          <button
            onClick={refreshCount}
            className="text-gray-400 hover:text-gray-700 flex items-center gap-1 text-[11px] font-semibold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Actualizar</span>
          </button>
        </div>
      )}

      {/* Sync Result Toast Alert */}
      {lastSyncResult && (
        <div className="mt-3 p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs flex items-center justify-between text-proninez-green font-semibold shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              ¡Listo! Se han enviado <strong>{lastSyncResult.synced}</strong> evaluaciones con éxito.
            </span>
          </div>
          <button
            onClick={() => setLastSyncResult(null)}
            className="text-gray-400 hover:text-gray-600 font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
