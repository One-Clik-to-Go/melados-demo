'use client';

import React, { useState, useEffect } from 'react';
import { Escuela, Estudiante, UserRole, TipoGrupo } from '@/types/database';
import { UserRecord } from '@/app/api/admin/users/route';
import {
  School, Users, BookOpen, ShieldCheck, Plus, RefreshCw,
  Search, CheckCircle2, UserPlus, FileText, Calendar, Filter, Sparkles
} from 'lucide-react';

interface EvaluationItem {
  id: string;
  instrumento: 'EGRA' | 'EGMA';
  codigo_anonimo: string;
  tipo_grupo: TipoGrupo;
  evaluador: string;
  escuela_id: string;
  grado: number;
  score_total: number;
  fecha: string;
  observaciones?: string;
}

export const ManagementPortal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ESCUELAS' | 'EVALUADORES' | 'ESTUDIANTES' | 'PRUEBAS'>('ESCUELAS');

  // Data States
  const [schools, setSchools] = useState<Escuela[]>([]);
  const [evaluators, setEvaluators] = useState<UserRecord[]>([]);
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);

  // Loading & Toast States
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States - School
  const [schoolName, setSchoolName] = useState('');
  const [schoolRegion, setSchoolRegion] = useState('Veraguas - Cañazas');
  const [submittingSchool, setSubmittingSchool] = useState(false);

  // Form States - Evaluator
  const [evalEmail, setEvalEmail] = useState('');
  const [evalName, setEvalName] = useState('');
  const [evalRole, setEvalRole] = useState<UserRole>('EVALUADOR');
  const [submittingEval, setSubmittingEval] = useState(false);

  // Form States - Student
  const [studentCode, setStudentCode] = useState('');
  const [studentGroup, setStudentGroup] = useState<TipoGrupo>('Programa');
  const [studentCet, setStudentCet] = useState('CET Cañazas');
  const [studentGrade, setStudentGrade] = useState<number>(2);
  const [studentSchoolId, setStudentSchoolId] = useState('');
  const [submittingStudent, setSubmittingStudent] = useState(false);

  // Filter - Evaluations
  const [evalSearch, setEvalSearch] = useState('');
  const [filterInstrument, setFilterInstrument] = useState<'TODOS' | 'EGRA' | 'EGMA'>('TODOS');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools');
      const data = await res.json();
      if (data.escuelas) setSchools(data.escuelas);
    } catch {}
  };

  const fetchEvaluators = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setEvaluators(data.users);
    } catch {}
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.estudiantes) setStudents(data.estudiantes);
    } catch {}
  };

  const fetchEvaluations = async () => {
    try {
      const res = await fetch('/api/evaluations/list');
      const data = await res.json();
      if (data.evaluaciones) setEvaluations(data.evaluaciones);
    } catch {}
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchSchools(), fetchEvaluators(), fetchStudents(), fetchEvaluations()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Submit School
  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName) return;
    setSubmittingSchool(true);
    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_escuela: schoolName, sede_region: schoolRegion }),
      });
      const data = await res.json();
      if (data.escuela) {
        setSchools(prev => [...prev, data.escuela]);
        setSchoolName('');
        showToast(`Escuela "${data.escuela.nombre_escuela}" registrada exitosamente.`);
      }
    } catch {
      showToast('Error al guardar la escuela.');
    } finally {
      setSubmittingSchool(false);
    }
  };

  // Submit Evaluator
  const handleAddEvaluator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalEmail) return;
    setSubmittingEval(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: evalEmail, role: evalRole, displayName: evalName }),
      });
      if (res.ok) {
        showToast(`Colaborador ${evalEmail} registrado con éxito.`);
        setEvalEmail('');
        setEvalName('');
        fetchEvaluators();
      }
    } catch {
      showToast('Error al registrar colaborador.');
    } finally {
      setSubmittingEval(false);
    }
  };

  // Submit Student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode) return;
    setSubmittingStudent(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_anonimo: studentCode,
          tipo_grupo: studentGroup,
          cet_origen: studentCet,
          grado_actual: studentGrade,
          escuela_actual_id: studentSchoolId || (schools[0]?.id_escuela || 'escuela-san-pedro'),
        }),
      });
      const data = await res.json();
      if (data.estudiante) {
        setStudents(prev => [data.estudiante, ...prev]);
        setStudentCode('');
        showToast(`Estudiante ${studentCode} registrado exitosamente.`);
      }
    } catch {
      showToast('Error al registrar estudiante.');
    } finally {
      setSubmittingStudent(false);
    }
  };

  const filteredEvaluations = evaluations.filter(ev => {
    const matchesSearch = ev.codigo_anonimo.toLowerCase().includes(evalSearch.toLowerCase()) ||
                          ev.evaluador.toLowerCase().includes(evalSearch.toLowerCase());
    const matchesInst = filterInstrument === 'TODOS' || ev.instrumento === filterInstrument;
    return matchesSearch && matchesInst;
  });

  return (
    <div className="space-y-6">
      {/* Portal Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Centro de Gestión y Configuración</h2>
            <span className="bg-proninez-teal/10 text-proninez-teal text-xs px-2.5 py-0.5 rounded-full font-bold border border-proninez-teal/20">
              Administración General
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestión completa de escuelas, equipo de campo, cohorte de estudiantes y auditoría de pruebas aplicadas.
          </p>
        </div>

        <button
          onClick={refreshAll}
          disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Todo</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-proninez-green flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold gap-1">
        <button
          onClick={() => setActiveSubTab('ESCUELAS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeSubTab === 'ESCUELAS' ? 'bg-proninez-teal text-white shadow-md' : 'text-gray-600 hover:bg-white'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Escuelas e Instituciones ({schools.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('EVALUADORES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeSubTab === 'EVALUADORES' ? 'bg-proninez-green text-white shadow-md' : 'text-gray-600 hover:bg-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Equipo y Evaluadores ({evaluators.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ESTUDIANTES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeSubTab === 'ESTUDIANTES' ? 'bg-proninez-pink text-white shadow-md' : 'text-gray-600 hover:bg-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Cohorte Estudiantes ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PRUEBAS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeSubTab === 'PRUEBAS' ? 'bg-gradient-to-r from-proninez-teal to-proninez-green text-white shadow-md' : 'text-gray-600 hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Auditoría de Pruebas ({evaluations.length})</span>
        </button>
      </div>

      {/* Tab 1: Gestión de Escuelas */}
      {activeSubTab === 'ESCUELAS' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
          <form onSubmit={handleAddSchool} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-proninez-teal" />
              <span>Registrar Nueva Escuela o Centro Educativo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Nombre completo de la escuela"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
              />
              <input
                type="text"
                placeholder="Sede / Región (ej. Veraguas - Cañazas)"
                value={schoolRegion}
                onChange={(e) => setSchoolRegion(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
              />
            </div>
            <button
              type="submit"
              disabled={submittingSchool}
              className="bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submittingSchool ? 'Guardando...' : 'Guardar Escuela'}</span>
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">ID Identificador</th>
                  <th className="py-3 px-4">Nombre de la Escuela</th>
                  <th className="py-3 px-4">Sede / Región</th>
                  <th className="py-3 px-4 text-right">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schools.map(s => (
                  <tr key={s.id_escuela} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-500">{s.id_escuela}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{s.nombre_escuela}</td>
                    <td className="py-3 px-4 text-gray-600">{s.sede_region}</td>
                    <td className="py-3 px-4 text-right">
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
      )}

      {/* Tab 2: Gestión de Evaluadores */}
      {activeSubTab === 'EVALUADORES' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
          <form onSubmit={handleAddEvaluator} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-proninez-green" />
              <span>Registrar Colaborador o Aplicador de Campo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="email"
                required
                placeholder="Correo institucional"
                value={evalEmail}
                onChange={(e) => setEvalEmail(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
              />
              <input
                type="text"
                placeholder="Nombre completo"
                value={evalName}
                onChange={(e) => setEvalName(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
              />
              <select
                value={evalRole}
                onChange={(e) => setEvalRole(e.target.value as UserRole)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-bold"
              >
                <option value="EVALUADOR">Permiso: EVALUADOR (Campo EGRA/EGMA)</option>
                <option value="ADMIN">Permiso: ADMIN (Administrador)</option>
                <option value="VIEWER">Permiso: REPORTE / AUDITOR</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submittingEval}
              className="bg-proninez-green hover:bg-proninez-green/90 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submittingEval ? 'Guardando...' : 'Guardar Colaborador'}</span>
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Permiso</th>
                  <th className="py-3 px-4 text-right">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluators.map(u => (
                  <tr key={u.uid} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{u.displayName || u.email.split('@')[0]}</td>
                    <td className="py-3 px-4 font-mono text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="bg-teal-50 text-proninez-teal border border-teal-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-gray-400 font-medium">Habilitado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Gestión de Estudiantes */}
      {activeSubTab === 'ESTUDIANTES' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
          <form onSubmit={handleAddStudent} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-proninez-pink" />
              <span>Registrar Nuevo Estudiante a la Cohorte</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="Código Anónimo (ej. EST-P2026-1050)"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono focus:outline-none focus:border-proninez-pink"
              />
              <select
                value={studentGroup}
                onChange={(e) => setStudentGroup(e.target.value as TipoGrupo)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-bold"
              >
                <option value="Programa">Grupo Programa CET</option>
                <option value="Control">Grupo Control</option>
              </select>
              <select
                value={studentGrade}
                onChange={(e) => setStudentGrade(Number(e.target.value))}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-bold"
              >
                <option value={2}>2do Grado</option>
                <option value={6}>6to Grado</option>
              </select>
              <select
                value={studentSchoolId}
                onChange={(e) => setStudentSchoolId(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-semibold"
              >
                {schools.map(s => (
                  <option key={s.id_escuela} value={s.id_escuela}>{s.nombre_escuela}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submittingStudent}
              className="bg-proninez-pink hover:bg-proninez-pink/90 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submittingStudent ? 'Guardando...' : 'Guardar Estudiante'}</span>
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Código Anónimo</th>
                  <th className="py-3 px-4">Grupo de Estudio</th>
                  <th className="py-3 px-4">Grado</th>
                  <th className="py-3 px-4">CET Origen</th>
                  <th className="py-3 px-4 text-right">Escuela Asignada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map(st => (
                  <tr key={st.id_estudiante} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{st.codigo_anonimo}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        st.tipo_grupo === 'Programa' ? 'bg-teal-50 text-proninez-teal border border-teal-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {st.tipo_grupo}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">{st.grado_actual}° Grado</td>
                    <td className="py-3 px-4 text-gray-600">{st.cet_origen}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800">{st.nombre_escuela || 'Escuela Rural'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Auditoría de Pruebas */}
      {activeSubTab === 'PRUEBAS' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
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
                  <th className="py-3 px-4">Prueba</th>
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4">Evaluador de Campo</th>
                  <th className="py-3 px-4">Puntaje Global</th>
                  <th className="py-3 px-4 text-right">Fecha de Aplicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvaluations.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        ev.instrumento === 'EGRA' ? 'bg-teal-50 text-proninez-teal border-teal-200' : 'bg-green-50 text-proninez-green border-green-200'
                      }`}>
                        {ev.instrumento} (Grado {ev.grado}°)
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{ev.codigo_anonimo}</td>
                    <td className="py-3 px-4 font-medium text-gray-700">{ev.evaluador}</td>
                    <td className="py-3 px-4 font-mono font-black text-proninez-teal text-sm">
                      {ev.score_total}%
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500 font-mono text-[11px]">
                      {new Date(ev.fecha).toLocaleDateString('es-PA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
