'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FileText, Search, Filter, RefreshCw, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminEvaluacionesPage() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [evalSearch, setEvalSearch] = useState('');
  const [filterInstrument, setFilterInstrument] = useState<'TODOS' | 'EGRA' | 'EGMA'>('TODOS');

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/evaluations/list');
      const data = await res.json();
      if (data.evaluaciones) setEvaluations(data.evaluaciones);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handlePurgeEvaluations = async () => {
    if (!confirm('¿Está seguro de que desea limpiar y borrar TODOS los registros de pruebas EGRA y EGMA? Esta acción es irreversible.')) {
      return;
    }

    setPurging(true);
    try {
      const res = await fetch('/api/evaluations/purge', { method: 'DELETE' });
      const data = await res.json();
      setToastMessage(data.message || 'Pruebas limpiadas exitosamente.');
      setEvaluations([]);
    } catch {
      setToastMessage('Error al limpiar registros de pruebas.');
    } finally {
      setPurging(false);
    }
  };

  const filteredEvaluations = evaluations.filter(ev => {
    const matchesSearch = ev.codigo_anonimo.toLowerCase().includes(evalSearch.toLowerCase()) ||
                          ev.evaluador.toLowerCase().includes(evalSearch.toLowerCase());
    const matchesInst = filterInstrument === 'TODOS' || ev.instrumento === filterInstrument;
    return matchesSearch && matchesInst;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs customItems={[
          { label: 'Inicio', href: '/' },
          { label: 'Panel de Administración', href: '/admin' },
          { label: 'Auditoría y Limpieza de Pruebas Evaluativas' }
        ]} />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Auditoría Global de Pruebas Aplicadas</h1>
              <span className="bg-gradient-to-r from-proninez-teal to-proninez-green text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                {evaluations.length} Pruebas Registradas
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Registro histórico de evaluaciones EGRA (Lectura) y EGMA (Matemáticas) con herramienta de limpieza.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePurgeEvaluations}
              disabled={purging || evaluations.length === 0}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{purging ? 'Limpiando...' : 'Limpiar Registros de Pruebas'}</span>
            </button>

            <button
              onClick={fetchEvaluations}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar Registro</span>
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-proninez-green flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filters & Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por código de estudiante o evaluador..."
                value={evalSearch}
                onChange={(e) => setEvalSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filtrar:
              </span>
              <button
                onClick={() => setFilterInstrument('TODOS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterInstrument === 'TODOS' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterInstrument('EGRA')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterInstrument === 'EGRA' ? 'bg-proninez-teal text-white' : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                EGRA
              </button>
              <button
                onClick={() => setFilterInstrument('EGMA')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterInstrument === 'EGMA' ? 'bg-proninez-green text-white' : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                EGMA
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Instrumento</th>
                  <th className="py-3 px-4">Código Anónimo Estudiante</th>
                  <th className="py-3 px-4">Evaluador Responsable</th>
                  <th className="py-3 px-4">Puntaje Global</th>
                  <th className="py-3 px-4 text-right">Fecha de Aplicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvaluations.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        ev.instrumento === 'EGRA' ? 'bg-teal-50 text-proninez-teal border-teal-200' : 'bg-green-50 text-proninez-green border-green-200'
                      }`}>
                        {ev.instrumento} (Grado {ev.grado || 2}°)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{ev.codigo_anonimo}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">{ev.evaluador}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-proninez-teal text-sm">
                      {ev.score_total}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-500 font-mono text-[11px]">
                      {new Date(ev.fecha).toLocaleDateString('es-PA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
