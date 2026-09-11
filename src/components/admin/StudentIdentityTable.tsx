'use client';

import React, { useState } from 'react';
import { Estudiante, UserRole } from '@/types/database';
import { ShieldCheck, Eye, EyeOff, Lock, AlertOctagon, Sparkles, Building2 } from 'lucide-react';

interface StudentIdentityTableProps {
  students: Estudiante[];
  currentRole: UserRole;
}

interface UnmaskedIdentity {
  nombre_completo: string;
  cedula: string;
}

export const StudentIdentityTable: React.FC<StudentIdentityTableProps> = ({ students, currentRole }) => {
  const [unmasked, setUnmasked] = useState<Record<string, UnmaskedIdentity>>({});
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [deniedError, setDeniedError] = useState<string | null>(null);

  const handleUnmaskIdentity = async (codigo: string) => {
    setDeniedError(null);
    if (unmasked[codigo]) {
      // Toggle hide
      const copy = { ...unmasked };
      delete copy[codigo];
      setUnmasked(copy);
      return;
    }

    setLoadingCode(codigo);
    try {
      const res = await fetch(`/api/admin/match-estudiante?codigo_anonimo=${codigo}`, {
        headers: {
          'x-user-role': currentRole,
          'Authorization': `Bearer role-${currentRole}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setDeniedError(data.error || 'Acceso denegado por Ley 285 de Protección a la Niñez');
      } else {
        setUnmasked(prev => ({
          ...prev,
          [codigo]: {
            nombre_completo: data.nombre_completo,
            cedula: data.cedula,
          },
        }));
      }
    } catch (err: any) {
      setDeniedError('Error consultando endpoint de resolución de identidad');
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Expedientes de la Cohorte Longitudinal</h2>
            <span className="bg-proninez-pink/20 text-rose-400 text-xs px-2.5 py-1 rounded-full font-bold border border-proninez-pink/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Ley 285 Decoupled Pattern
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Los datos visuales de la cohorte son 100% anónimos. La resolución de nombre y cédula requiere rol de Administrador.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100/80 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-600">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Rol Activo: <strong className="text-gray-900">{currentRole}</strong></span>
        </div>
      </div>

      {/* Security Denied Warning Toast */}
      {deniedError && (
        <div className="mb-6 p-4 rounded-2xl bg-proninez-pink/10 border border-proninez-pink/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="block text-rose-200">Acceso Denegado (Ley 285)</strong>
              <span>{deniedError}</span>
            </div>
          </div>
          <button onClick={() => setDeniedError(null)} className="text-rose-400 font-bold px-2">✕</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Código Anónimo</th>
              <th className="py-3.5 px-4">Grupo Científico</th>
              <th className="py-3.5 px-4">Origen CET / Escuela</th>
              <th className="py-3.5 px-4">Grado</th>
              <th className="py-3.5 px-4">Identidad Real (Ley 285)</th>
              <th className="py-3.5 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700/60">
            {students.map((student) => {
              const identity = unmasked[student.codigo_anonimo];
              const isLoading = loadingCode === student.codigo_anonimo;

              return (
                <tr key={student.id_estudiante} className="hover:bg-gray-100/40 transition-colors">
                  {/* Anonymous Code */}
                  <td className="py-4 px-4 font-mono font-bold text-proninez-teal">
                    {student.codigo_anonimo}
                  </td>

                  {/* Scientific Cohort */}
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      student.tipo_grupo === 'Programa'
                        ? 'bg-proninez-teal/20 text-proninez-teal border border-proninez-teal/30'
                        : 'bg-gray-200 text-gray-500 border border-gray-200'
                    }`}>
                      {student.tipo_grupo}
                    </span>
                  </td>

                  {/* Origin & School */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-700">{student.cet_origen}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      <span>{student.nombre_escuela || 'Escuela El Bale'}</span>
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="py-4 px-4 font-bold text-gray-600">
                    {student.grado_actual}° Primaria
                  </td>

                  {/* Ley 285 Identity Column */}
                  <td className="py-4 px-4">
                    {identity ? (
                      <div className="bg-proninez-pink/10 border border-proninez-pink/30 p-2 rounded-xl">
                        <div className="font-bold text-rose-200 text-xs">{identity.nombre_completo}</div>
                        <div className="text-[10px] text-rose-300/80 font-mono">Cédula: {identity.cedula}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic font-mono text-[11px] flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-slate-600" />
                        <span>[Aislado / Encriptado]</span>
                      </div>
                    )}
                  </td>

                  {/* Unmask Button */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleUnmaskIdentity(student.codigo_anonimo)}
                      disabled={isLoading}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                        identity
                          ? 'bg-gray-200 hover:bg-surface-600 text-gray-600'
                          : currentRole === 'ADMIN'
                          ? 'bg-proninez-pink hover:bg-proninez-pink text-white shadow-lg shadow-proninez-pink/20'
                          : 'bg-gray-200 hover:bg-surface-600 text-gray-500'
                      }`}
                    >
                      {identity ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ocultar</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isLoading ? 'Consultando...' : 'Desvelar Identidad'}</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
