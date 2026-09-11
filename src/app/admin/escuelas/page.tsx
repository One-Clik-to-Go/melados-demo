'use client';

import React, { useState, useEffect } from 'react';
import { Escuela } from '@/types/database';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { School, Plus, RefreshCw, CheckCircle2, Search, MapPin } from 'lucide-react';

export default function AdminEscuelasPage() {
  const [schools, setSchools] = useState<Escuela[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState('');
  const [schoolRegion, setSchoolRegion] = useState('Veraguas - Cañazas');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schools');
      const data = await res.json();
      if (data.escuelas) setSchools(data.escuelas);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_escuela: schoolName.trim(), sede_region: schoolRegion }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setToastMessage(`Advertencia: Escuela ya registrada previamente: ${data.escuela?.nombre_escuela}`);
      } else if (data.escuela) {
        setSchools(prev => [...prev, data.escuela]);
        setSchoolName('');
        setToastMessage(`Escuela "${data.escuela.nombre_escuela}" registrada exitosamente.`);
      }
    } catch {
      setToastMessage('Error registrando escuela.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSchools = schools.filter(s =>
    s.nombre_escuela.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.sede_region.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs customItems={[
          { label: 'Inicio', href: '/' },
          { label: 'Panel de Administración', href: '/admin' },
          { label: 'Gestión de Escuelas Primarias' }
        ]} />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Catálogo de Escuelas Primarias de Panamá</h1>
              <span className="bg-proninez-teal/10 text-proninez-teal text-xs px-2.5 py-0.5 rounded-full font-bold border border-proninez-teal/20">
                {schools.length} Escuelas Registradas
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Catálogo oficial de escuelas asociadas al Estudio Longitudinal por provincia y comarca.
            </p>
          </div>

          <button
            onClick={fetchSchools}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar Catálogo</span>
          </button>
        </div>

        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-proninez-green flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Add New School Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <form onSubmit={handleAddSchool} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-proninez-teal" />
              <span>Registrar Nueva Escuela o Centro Educativo con Sede / Región</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo de la Escuela *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Escuela Barrio Colón"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sede / Región / Provincia *</label>
                <select
                  value={schoolRegion}
                  onChange={(e) => setSchoolRegion(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs font-semibold text-gray-900"
                >
                  <option value="Veraguas - Cañazas">Veraguas - Cañazas</option>
                  <option value="Veraguas - Santiago">Veraguas - Santiago</option>
                  <option value="Comarca Ngäbe-Buglé">Comarca Ngäbe-Buglé</option>
                  <option value="Chiriquí - David">Chiriquí - David</option>
                  <option value="Coclé - Penonomé">Coclé - Penonomé</option>
                  <option value="Panamá Centro">Panamá Centro</option>
                  <option value="Panamá Oeste">Panamá Oeste</option>
                  <option value="Colón">Colón</option>
                  <option value="Herrera">Herrera</option>
                  <option value="Los Santos">Los Santos</option>
                  <option value="Darién">Darién</option>
                  <option value="Bocas del Toro">Bocas del Toro</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !schoolName.trim()}
                className="bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? 'Guardando...' : 'Guardar Escuela'}</span>
              </button>
            </div>
          </form>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filtrar por nombre de escuela o provincia/región..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
            />
          </div>

          {/* Schools Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Identificador Único</th>
                  <th className="py-3 px-4">Nombre Oficial de la Escuela</th>
                  <th className="py-3 px-4">Sede / Provincia</th>
                  <th className="py-3 px-4 text-right">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSchools.map(s => (
                  <tr key={s.id_escuela} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gray-500">{s.id_escuela}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{s.nombre_escuela}</td>
                    <td className="py-3.5 px-4 text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-proninez-teal" />
                      <span>{s.sede_region}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-green-50 text-proninez-green border border-green-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        Activa
                      </span>
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
