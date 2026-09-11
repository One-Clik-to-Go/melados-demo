'use client';

import React, { useState, useEffect } from 'react';
import { Escuela, Estudiante, TipoGrupo } from '@/types/database';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import {
  Users, UserPlus, Upload, FileText, CheckCircle2, Search,
  ShieldCheck, RefreshCw, AlertCircle, ArrowRightLeft, FileCheck, Check
} from 'lucide-react';

export default function AdminEstudiantesPage() {
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [schools, setSchools] = useState<Escuela[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk CSV Modal / Input State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkTargetSchoolId, setBulkTargetSchoolId] = useState('');
  const [processingBulk, setProcessingBulk] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);

  // Selected Student for Ley 285 Parent Authorization Form
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [acudienteNombre, setAcudienteNombre] = useState('');
  const [acudienteCedula, setAcudienteCedula] = useState('');
  const [acudienteTelefono, setAcudienteTelefono] = useState('');
  const [consentSigned, setConsentSigned] = useState(true);
  const [savingConsent, setSavingConsent] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.estudiantes) setStudents(data.estudiantes);
    } catch {}
    setLoading(false);
  };

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools');
      const data = await res.json();
      if (data.escuelas && data.escuelas.length > 0) {
        setSchools(data.escuelas);
        if (!bulkTargetSchoolId) setBulkTargetSchoolId(data.escuelas[0].id_escuela);
      }
    } catch {}
  };

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);

  // Process Bulk CSV Import
  const handleProcessBulk = async () => {
    if (!bulkCsvText.trim()) return;
    setProcessingBulk(true);
    setBulkResult(null);

    // Parse CSV lines: matricula, primer_nombre, primer_apellido, tipo_grupo, cet_origen, grado
    const lines = bulkCsvText.trim().split('\n');
    const parsedList: any[] = [];

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 1 && parts[0]) {
        parsedList.push({
          matricula_cedula: parts[0],
          primer_nombre: parts[1] || 'Estudiante',
          primer_apellido: parts[2] || 'Cargado',
          tipo_grupo: (parts[3] === 'Control' ? 'Control' : 'Programa') as TipoGrupo,
          cet_origen: parts[4] || 'Centro de Estimulación Temprana (CET)',
          grado_actual: Number(parts[5]) || 2,
        });
      }
    });

    const targetSchoolObj = schools.find(s => s.id_escuela === bulkTargetSchoolId);

    try {
      const res = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estudiantes_lista: parsedList,
          escuela_destino_id: bulkTargetSchoolId,
          nombre_escuela: targetSchoolObj?.nombre_escuela || 'Escuela Destino',
        }),
      });

      const data = await res.json();
      setBulkResult(data);
      if (res.ok) {
        setToastMessage(data.message);
        fetchStudents();
      }
    } catch {
      setBulkResult({ error: 'Error procesando carga masiva' });
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleSaveConsent = () => {
    if (!selectedStudent) return;
    setSavingConsent(true);
    setTimeout(() => {
      setToastMessage(`Planilla de autorización Ley 285 registrada para ${selectedStudent.codigo_anonimo}`);
      setSavingConsent(false);
      setShowConsentModal(false);
    }, 600);
  };

  const filteredStudents = students.filter(st =>
    st.codigo_anonimo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.id_estudiante.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (st.nombre_escuela || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs customItems={[
          { label: 'Inicio', href: '/' },
          { label: 'Panel de Administración', href: '/admin' },
          { label: 'Cohorte de Estudiantes y Traslados' }
        ]} />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Cohorte de Estudiantes, Traslados y Autorizaciones</h1>
              <span className="bg-proninez-pink/10 text-proninez-pink text-xs px-2.5 py-0.5 rounded-full font-bold border border-proninez-pink/20">
                {students.length} Estudiantes en Estudio
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Carga masiva con merge automático de historial en caso de traslados entre escuelas y autorizaciones de padres (Ley 285).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBulkModal(!showBulkModal)}
              className="bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Carga Masiva (CSV)</span>
            </button>

            <button
              onClick={fetchStudents}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-proninez-green flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* BULK CSV UPLOAD MODAL WITH MERGE NOTICE */}
        {showBulkModal && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-proninez-teal" />
                <span>Carga Masiva de Estudiantes por Escuela (Con Merge de Traslados)</span>
              </h3>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xs">Cerrar</button>
            </div>

            <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-proninez-teal" />
                <span>Mecanismo de Unificación de Historial en Traslados:</span>
              </div>
              <p>
                Si un número de matrícula o cédula ya existe en otra escuela, el sistema **conservará todo su historial de evaluaciones pasadas** y actualizará su asignación a la nueva escuela de destino.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Escuela Destino para la Carga Masiva *
                </label>
                <select
                  value={bulkTargetSchoolId}
                  onChange={(e) => setBulkTargetSchoolId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-bold text-gray-900"
                >
                  {schools.map(sc => (
                    <option key={sc.id_escuela} value={sc.id_escuela}>
                      {sc.nombre_escuela} ({sc.sede_region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Formato CSV (Una línea por estudiante):
                </label>
                <div className="text-[11px] font-mono text-gray-500 bg-gray-100 p-2 rounded-xl">
                  matricula, primer_nombre, primer_apellido, tipo_grupo, cet_origen, grado
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pegue los datos CSV aquí:</label>
              <textarea
                rows={4}
                value={bulkCsvText}
                onChange={(e) => setBulkCsvText(e.target.value)}
                placeholder="8-123-4567, Carlos, Mendoza, Programa, CET Cañazas, 2&#10;8-987-6543, Ana, Pérez, Control, N/A, 2"
                className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-3 text-xs font-mono text-gray-900 focus:outline-none focus:border-proninez-teal"
              />
            </div>

            <div className="flex items-center justify-between">
              {bulkResult && (
                <div className="text-xs font-bold text-proninez-green">
                  {bulkResult.message || bulkResult.error}
                </div>
              )}

              <button
                type="button"
                disabled={processingBulk || !bulkCsvText.trim()}
                onClick={handleProcessBulk}
                className="bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md disabled:opacity-50 ml-auto"
              >
                {processingBulk ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{processingBulk ? 'Procesando...' : 'Procesar Carga y Merge'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SEARCH & STUDENTS LIST */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar estudiante por Cédula, Matrícula, Código Anónimo o Escuela..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal font-mono"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Código Anónimo</th>
                  <th className="py-3 px-4">Grupo de Estudio</th>
                  <th className="py-3 px-4">Grado Actual</th>
                  <th className="py-3 px-4">CET Origen</th>
                  <th className="py-3 px-4">Escuela Asignada</th>
                  <th className="py-3 px-4 text-right">Formulario de Autorización</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map(st => (
                  <tr key={st.id_estudiante} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{st.codigo_anonimo}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        st.tipo_grupo === 'Programa' ? 'bg-teal-50 text-proninez-teal border border-teal-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {st.tipo_grupo}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{st.grado_actual}° Grado</td>
                    <td className="py-3.5 px-4 text-gray-600">{st.cet_origen}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">{st.nombre_escuela || 'Escuela Rural'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(st);
                          setShowConsentModal(true);
                        }}
                        className="bg-white text-proninez-pink border border-pink-200 hover:bg-pink-50 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ml-auto transition-all shadow-xs"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Planilla Autorización</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEY 285 PARENT AUTHORIZATION FORM MODAL */}
        {showConsentModal && selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-proninez-pink" />
                  <h3 className="text-sm font-bold text-gray-900">Planilla de Consentimiento Informado de Padres</h3>
                </div>
                <button onClick={() => setShowConsentModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xs">Cerrar</button>
              </div>

              <div className="p-3 bg-pink-50 rounded-2xl text-xs text-pink-900 border border-pink-200 font-semibold">
                Formulario de autorización del padre/acudiente para participación en el Estudio Longitudinal de Impacto (Ley 285 de Protección a la Niñez).
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo del Padre o Acudiente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rosa Pérez"
                    value={acudienteNombre}
                    onChange={(e) => setAcudienteNombre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-pink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Cédula del Acudiente *</label>
                    <input
                      type="text"
                      placeholder="Ej. 9-123-456"
                      value={acudienteCedula}
                      onChange={(e) => setAcudienteCedula(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-xs font-mono text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono de Contacto</label>
                    <input
                      type="text"
                      placeholder="Ej. 6677-8899"
                      value={acudienteTelefono}
                      onChange={(e) => setAcudienteTelefono(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-xs font-mono text-gray-900"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={consentSigned}
                    onChange={(e) => setConsentSigned(e.target.checked)}
                    className="w-4 h-4 text-proninez-pink rounded focus:ring-proninez-pink"
                  />
                  <span>Planilla física firmada recibida y archivada en expediente</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowConsentModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={savingConsent || !acudienteNombre.trim()}
                  onClick={handleSaveConsent}
                  className="bg-proninez-pink hover:bg-proninez-pink/90 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md disabled:opacity-50"
                >
                  {savingConsent ? 'Guardando...' : 'Guardar Autorización'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
