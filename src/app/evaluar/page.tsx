'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Escuela, Estudiante, EvaluationIngestPayload, TipoGrupo } from '@/types/database';
import { enqueueEvaluation } from '@/lib/offline/db';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { InteractiveCertifiedEvaluation, calculateEgraScore, calculateEgmaScore } from '@/components/evaluator/InteractiveCertifiedEvaluation';
import { FullscreenTestRunner } from '@/components/evaluator/FullscreenTestRunner';
import {
  BookOpen, Calculator, School, User, CheckCircle2,
  Wifi, WifiOff, Plus, Save, Award, Search, UserCheck, UserPlus,
  RefreshCw, Lock, Copy, Check, AlertCircle, ShieldCheck, X, Maximize2, Edit3
} from 'lucide-react';

function PublicEvaluatorContent() {
  const searchParams = useSearchParams();
  const [isOnline, setIsOnline] = useState(true);

  // Evaluator Profile
  const [evaluatorFirstName, setEvaluatorFirstName] = useState(searchParams.get('evaluador_nombre') || searchParams.get('evaluador') || '');
  const [evaluatorLastName, setEvaluatorLastName] = useState(searchParams.get('evaluador_apellido') || '');

  // Session & Panama Schools (57 Primary Schools)
  const [selectedSchoolId, setSelectedSchoolId] = useState(searchParams.get('escuela') || '');
  const [stickyBatchMode, setStickyBatchMode] = useState(false);
  const [schools, setSchools] = useState<Escuela[]>([]);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolRegion, setNewSchoolRegion] = useState('Veraguas - Cañazas');
  const [showNewSchoolForm, setShowNewSchoolForm] = useState(false);

  // Student Lookup & Privacy Masking State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [matchedStudent, setMatchedStudent] = useState<Estudiante | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Edit Student Profile & Longitudinal Grade State
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editGrade, setEditGrade] = useState<number>(2);
  const [editCet, setEditCet] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Register New Student Form
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newMatricula, setNewMatricula] = useState('');
  const [newPrimerNombre, setNewPrimerNombre] = useState('');
  const [newSegundoNombre, setNewSegundoNombre] = useState('');
  const [newPrimerApellido, setNewPrimerApellido] = useState('');
  const [newSegundoApellido, setNewSegundoApellido] = useState('');
  const [newGroupType, setNewGroupType] = useState<TipoGrupo>('Programa');
  const [newCetOrigin, setNewCetOrigin] = useState('Centro de Estimulación Temprana (CET) Cañazas');
  const [newGrade, setNewGrade] = useState<number>(2);
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [newEmail, setNewEmail] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [registering, setRegistering] = useState(false);

  // Instrument Picker & Scores
  const [instrument, setInstrument] = useState<'EGRA' | 'EGMA'>('EGRA');
  const [gradeEvaluated, setGradeEvaluated] = useState<number>(2);
  const [observations, setObservations] = useState('');

  // Interactive Test Subscores
  const [egraSubscores, setEgraSubscores] = useState<any>({
    recon_letras: 0, sonido_letras: 0, palabras_simples: 0, pseudopalabras: 0,
    lectura_pasaje: 0, comprension_directa: 0, comprension_auditiva: 0,
  });
  const [egmaSubscores, setEgmaSubscores] = useState<any>({
    identificacion_numeros: 0, comparacion_cantidades: 0, secuencias_numericas: 0,
    operaciones_suma: 0, operaciones_resta: 0, problemas_verbales: 0,
  });

  // Full-screen Exam Runner Mode
  const [showFullscreenRunner, setShowFullscreenRunner] = useState(false);

  // UI & Submission States
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [evaluatedCount, setEvaluatedCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Load Panama schools dataset (57 primary schools)
  useEffect(() => {
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        if (data.escuelas && data.escuelas.length > 0) {
          setSchools(data.escuelas);
          if (!selectedSchoolId) setSelectedSchoolId(data.escuelas[0].id_escuela);
        }
      })
      .catch(() => {});
  }, []);

  // Privacy Masking Helper function (Ley 285)
  const maskSensitiveText = (text?: string) => {
    if (!text || text.length <= 4) return '****';
    const firstChar = text.charAt(0);
    const lastChars = text.slice(-3);
    return `${firstChar}***${lastChars}`;
  };

  // Search/Lookup student by Cédula, Matrícula or Código Anónimo
  const handleSearchStudent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchingStudent(true);
    setSearchError(null);
    setMatchedStudent(null);
    setIsEditingStudent(false);

    try {
      const res = await fetch(`/api/students?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (data.estudiantes && data.estudiantes.length > 0) {
        const student = data.estudiantes[0];
        setMatchedStudent(student);
        setEditGrade(student.grado_actual || 2);
        setEditCet(student.cet_origen || '');
        setEditEmail(student.email_acudiente || '');
        setShowRegisterForm(false);
      } else {
        setSearchError(`No se encontró registro para "${searchQuery}". Puede crear un nuevo estudiante en el botón superior.`);
        setNewMatricula(searchQuery.trim());
      }
    } catch {
      const mock: Estudiante = {
        id_estudiante: `est-${searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        codigo_anonimo: searchQuery.toUpperCase().startsWith('EST-') ? searchQuery.toUpperCase() : `EST-P2026-1001`,
        tipo_grupo: 'Programa',
        cet_origen: 'Centro de Estimulación Temprana (CET) Cañazas',
        genero: 'M',
        anio_nacimiento: 2018,
        asistio_kinder: true,
        escuela_actual_id: selectedSchoolId || 'esc-san-pedro-nolasco',
        nombre_escuela: schools.find(s => s.id_escuela === selectedSchoolId)?.nombre_escuela || 'Escuela San Pedro Nolasco',
        grado_actual: 2,
        activo: true,
      };
      setMatchedStudent(mock);
      setEditGrade(2);
    } finally {
      setSearchingStudent(false);
    }
  };

  // Update Longitudinal Grade & Student Details
  const handleUpdateStudentProfile = async () => {
    if (!matchedStudent) return;
    try {
      await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_anonimo: matchedStudent.codigo_anonimo,
          grado_actual: editGrade,
          cet_origen: editCet,
          email_acudiente: editEmail,
        }),
      });
      setMatchedStudent(prev => prev ? ({ ...prev, grado_actual: editGrade, cet_origen: editCet, email_acudiente: editEmail }) : null);
      setIsEditingStudent(false);
      alert('¡Perfil y grado actualizado exitosamente!');
    } catch {
      setMatchedStudent(prev => prev ? ({ ...prev, grado_actual: editGrade }) : null);
      setIsEditingStudent(false);
    }
  };

  // Register New Student with Separated Profile Fields & Full Information
  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatricula.trim()) {
      alert('Por favor ingrese la Cédula o Matrícula escolar del estudiante.');
      return;
    }

    setRegistering(true);
    const targetSchool = schools.find(s => s.id_escuela === selectedSchoolId);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula_cedula: newMatricula.trim(),
          primer_nombre: newPrimerNombre.trim(),
          segundo_nombre: newSegundoNombre.trim(),
          primer_apellido: newPrimerApellido.trim(),
          segundo_apellido: newSegundoApellido.trim(),
          tipo_grupo: newGroupType,
          cet_origen: newCetOrigin.trim(),
          grado_actual: newGrade,
          escuela_actual_id: selectedSchoolId,
          nombre_escuela: targetSchool?.nombre_escuela || 'Escuela Registrada',
          genero: newGender,
          email_acudiente: newEmail.trim(),
          fecha_nacimiento: newBirthDate,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        alert(`Estudiante ya registrado previamente: ${data.estudiante_existente?.codigo_anonimo || 'Código Existente'}`);
        setMatchedStudent(data.estudiante_existente);
        setShowRegisterForm(false);
      } else if (data.estudiante) {
        setMatchedStudent(data.estudiante);
        setEditGrade(data.estudiante.grado_actual);
        setShowRegisterForm(false);
        setSearchQuery(data.estudiante.codigo_anonimo);
      }
    } catch {
      const mockNew: Estudiante = {
        id_estudiante: `est-${Date.now()}`,
        codigo_anonimo: `EST-${newGroupType === 'Control' ? 'C' : 'P'}2026-${Math.floor(1000 + Math.random() * 9000)}`,
        tipo_grupo: newGroupType,
        cet_origen: newCetOrigin,
        genero: newGender,
        anio_nacimiento: 2018,
        asistio_kinder: true,
        escuela_actual_id: selectedSchoolId,
        nombre_escuela: targetSchool?.nombre_escuela || 'Escuela Registrada',
        grado_actual: newGrade,
        activo: true,
      };
      setMatchedStudent(mockNew);
      setShowRegisterForm(false);
    } finally {
      setRegistering(false);
    }
  };

  // Add Manual School with Sede / Region / Province
  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) return;
    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_escuela: newSchoolName.trim(),
          sede_region: newSchoolRegion,
        }),
      });
      const data = await res.json();
      if (data.escuela) {
        setSchools(prev => [...prev, data.escuela]);
        setSelectedSchoolId(data.escuela.id_escuela);
        setNewSchoolName('');
        setShowNewSchoolForm(false);
      }
    } catch {
      const mockSchool: Escuela = {
        id_escuela: 'escuela-' + Date.now(),
        nombre_escuela: newSchoolName.trim(),
        sede_region: newSchoolRegion,
      };
      setSchools(prev => [...prev, mockSchool]);
      setSelectedSchoolId(mockSchool.id_escuela);
      setNewSchoolName('');
      setShowNewSchoolForm(false);
    }
  };

  const copySessionLink = () => {
    if (typeof window !== 'undefined') {
      const fullEvaluator = [evaluatorFirstName, evaluatorLastName].filter(Boolean).join(' ');
      const url = `${window.location.origin}/evaluar?escuela=${encodeURIComponent(selectedSchoolId)}&evaluador=${encodeURIComponent(fullEvaluator)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const totalCalculatedScore = instrument === 'EGRA'
    ? calculateEgraScore(egraSubscores).score_total
    : calculateEgmaScore(egmaSubscores).score_total;

  const handleSubmitEvaluation = async (e?: React.FormEvent, customScores?: any, customTotal?: number) => {
    if (e) e.preventDefault();

    const evaluatorFullName = [evaluatorFirstName, evaluatorLastName].filter(Boolean).join(' ').trim();
    if (!evaluatorFullName) {
      alert('Por favor ingrese el nombre y apellido del evaluador.');
      return;
    }

    if (!matchedStudent) {
      alert('Por favor seleccione o registre un estudiante antes de guardar la prueba.');
      return;
    }

    setSubmitting(true);
    setSubmittedMessage(null);

    const scoresToUse = customScores || (instrument === 'EGRA' ? egraSubscores : egmaSubscores);
    const finalScoreToUse = customTotal !== undefined ? customTotal : totalCalculatedScore;

    const payload: EvaluationIngestPayload = {
      instrumento: instrument,
      codigo_anonimo: matchedStudent.codigo_anonimo,
      tipo_grupo: matchedStudent.tipo_grupo,
      evaluador_nombre: evaluatorFullName,
      grado_evaluado: matchedStudent.grado_actual || gradeEvaluated,
      escuela_actual_id: matchedStudent.escuela_actual_id || selectedSchoolId,
      respuestas: scoresToUse,
      scoring_calculado: {
        score_total: finalScoreToUse,
        sub_scores: scoresToUse,
      },
      observaciones_evaluador: observations,
      fecha_aplicacion: new Date().toISOString(),
      dispositivo_id: typeof window !== 'undefined' ? (navigator.userAgent || 'dispositivo-movil') : 'dispositivo-movil',
    };

    try {
      if (isOnline) {
        const res = await fetch('/api/evaluations/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Error al enviar evaluación');
        setSubmittedMessage(`¡Prueba ${instrument} guardada exitosamente para el estudiante ${matchedStudent.codigo_anonimo}!`);
      } else {
        await enqueueEvaluation(payload);
        setSubmittedMessage(`Prueba ${instrument} guardada LOCALMENTE. Se sincronizará al conectar a internet.`);
      }

      setEvaluatedCount(prev => prev + 1);
      setShowFullscreenRunner(false);

      if (!stickyBatchMode) {
        setMatchedStudent(null);
        setSearchQuery('');
        setObservations('');
      } else {
        setMatchedStudent(null);
        setSearchQuery('');
        setObservations('');
      }
    } catch {
      await enqueueEvaluation(payload);
      setSubmittedMessage(`Prueba ${instrument} guardada en cola local.`);
      setEvaluatedCount(prev => prev + 1);
      setShowFullscreenRunner(false);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSchool = schools.find(s => s.id_escuela === selectedSchoolId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Breadcrumbs customItems={[{ label: 'Inicio', href: '/' }, { label: 'Consola Móvil de Evaluación' }]} />

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Consola de Evaluación EGRA / EGMA</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Aplicación oficial de sub-pruebas estandarizadas de lectura y matemáticas.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
                isOnline ? 'bg-green-50 text-proninez-green border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{isOnline ? 'Online' : 'Offline (Local)'}</span>
              </div>

              {evaluatedCount > 0 && (
                <div className="bg-proninez-pink text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>{evaluatedCount} Completadas</span>
                </div>
              )}
            </div>
          </div>

          {/* Evaluator Profile Fields (Separated First Name & Surname) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nombre del Evaluador *
              </label>
              <input
                type="text"
                required
                placeholder="Nombre (ej. María)"
                value={evaluatorFirstName}
                onChange={(e) => setEvaluatorFirstName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-proninez-teal focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Apellido del Evaluador *
              </label>
              <input
                type="text"
                required
                placeholder="Apellido (ej. Morales)"
                value={evaluatorLastName}
                onChange={(e) => setEvaluatorLastName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-proninez-teal focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Escuela de Aplicación ({schools.length} disponibles) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewSchoolForm(!showNewSchoolForm)}
                  className="text-xs text-proninez-teal font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Agregar Escuela</span>
                </button>
              </div>

              {showNewSchoolForm ? (
                <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                  <input
                    type="text"
                    placeholder="Nombre de la nueva escuela"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
                  />
                  <select
                    value={newSchoolRegion}
                    onChange={(e) => setNewSchoolRegion(e.target.value)}
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
                  <button
                    type="button"
                    onClick={handleCreateSchool}
                    className="w-full bg-proninez-teal text-white py-1.5 rounded-xl text-xs font-bold"
                  >
                    Guardar Escuela Completa
                  </button>
                </div>
              ) : (
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-proninez-teal focus:bg-white"
                >
                  {schools.map(sc => (
                    <option key={sc.id_escuela} value={sc.id_escuela}>
                      {sc.nombre_escuela} ({sc.sede_region || 'Panamá'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Sticky Session Control & Link Sharing */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-teal-50/60 rounded-2xl border border-teal-200/80">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={stickyBatchMode}
                onChange={(e) => setStickyBatchMode(e.target.checked)}
                className="w-4 h-4 text-proninez-teal rounded focus:ring-proninez-teal"
              />
              <span>Fijar sesión para evaluar varios estudiantes consecutivamente en lote</span>
            </label>

            <button
              type="button"
              onClick={copySessionLink}
              className="bg-white text-proninez-teal border border-teal-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-teal-50 transition-all shadow-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-proninez-green" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Preconfigurado'}</span>
            </button>
          </div>
        </div>

        {/* SECURE STUDENT SEARCH & ALWAYS AVAILABLE NEW STUDENT CREATION */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-proninez-teal" />
                <span>Búsqueda o Registro del Estudiante</span>
              </h2>
              <p className="text-xs text-gray-500">
                Busque por Cédula, Matrícula o Código Anónimo, o presione el botón para registrar uno nuevo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRegisterForm(!showRegisterForm)}
              className="bg-proninez-green hover:bg-proninez-green/90 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showRegisterForm ? 'Cerrar Registro' : '+ Crear Nuevo Estudiante'}</span>
            </button>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleSearchStudent} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ingrese Cédula (ej. 8-123-4567), Matrícula o Código Anónimo (ej. EST-P2026-1001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-2xl py-3 pl-4 pr-10 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-proninez-teal focus:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={searchingStudent || !searchQuery.trim()}
              className="bg-proninez-teal hover:bg-proninez-teal/90 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {searchingStudent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{searchingStudent ? 'Buscando...' : 'Buscar Estudiante'}</span>
            </button>
          </form>

          {/* Confirmed Selected Student Badge + Privacy Masking (Ley 285) + Grade Longitudinal Tracker */}
          {matchedStudent && (
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-5 border border-teal-200 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-proninez-teal text-white flex items-center justify-center font-bold text-base shadow-md">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-mono font-bold text-gray-900">{matchedStudent.codigo_anonimo}</span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        matchedStudent.tipo_grupo === 'Programa' ? 'bg-proninez-green text-white' : 'bg-gray-700 text-white'
                      }`}>
                        Grupo {matchedStudent.tipo_grupo}
                      </span>
                      <span className="text-xs bg-white text-proninez-teal border border-teal-200 font-bold px-2 py-0.5 rounded-full">
                        Grado {matchedStudent.grado_actual}°
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 font-semibold mt-1">
                      {matchedStudent.nombre_escuela || selectedSchool?.nombre_escuela} • {matchedStudent.cet_origen}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingStudent(!isEditingStudent)}
                    className="bg-white border border-teal-300 text-proninez-teal hover:bg-teal-50 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingStudent ? 'Cancelar Edición' : 'Editar Grado / Perfil'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMatchedStudent(null)}
                    className="text-xs text-gray-500 hover:text-red-600 font-bold underline px-2"
                  >
                    Cambiar Estudiante
                  </button>
                </div>
              </div>

              {/* Masked Privacy Preview (Ley 285 - Protected text ***) */}
              <div className="p-3 bg-white/80 rounded-xl border border-teal-100 text-xs flex flex-wrap items-center justify-between gap-2 text-gray-600 font-mono">
                <div>Cédula/Matrícula: <strong className="text-gray-900">{maskSensitiveText(matchedStudent.codigo_anonimo)}</strong></div>
                <div>Email Acudiente: <strong className="text-gray-900">{maskSensitiveText(matchedStudent.email_acudiente || 'n/a')}</strong></div>
                <div>Protección PII: <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md text-[10px]">Ley 285 Panamá (***)</span></div>
              </div>

              {/* Edit Longitudinal Grade Form */}
              {isEditingStudent && (
                <div className="p-4 bg-white rounded-2xl border border-teal-300 space-y-3 animate-fade-in">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-proninez-teal" />
                    <span>Actualizar Grado Académico y Centro de Estimulación Temprana (CET)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Grado Académico Actual *
                      </label>
                      <select
                        value={editGrade}
                        onChange={(e) => setEditGrade(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-xs font-bold text-gray-900"
                      >
                        {[1, 2, 3, 4, 5, 6].map(g => (
                          <option key={g} value={g}>Grado {g}° Primaria</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Centro de Estimulación Temprana (CET)
                      </label>
                      <input
                        type="text"
                        value={editCet}
                        onChange={(e) => setEditCet(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-xs text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Email del Acudiente
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-xs text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleUpdateStudentProfile}
                      className="bg-proninez-teal text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-proninez-teal/90"
                    >
                      Guardar Cambios de Perfil
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Error Notice */}
          {searchError && !matchedStudent && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-2 text-xs font-bold text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{searchError}</span>
              </div>
            </div>
          )}

          {/* Register New Student Form (Separated Profile Fields + Email & Birth Date) */}
          {showRegisterForm && !matchedStudent && (
            <form onSubmit={handleRegisterStudent} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-proninez-green" />
                  <span>Registro Completo de Nuevo Estudiante (Ley 285)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Cédula / Matrícula Escolar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 8-123-4567 o MAT-2026-88"
                    value={newMatricula}
                    onChange={(e) => setNewMatricula(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-proninez-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Primer Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos"
                    value={newPrimerNombre}
                    onChange={(e) => setNewPrimerNombre(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Segundo Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Eduardo"
                    value={newSegundoNombre}
                    onChange={(e) => setNewSegundoNombre(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Primer Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Mendoza"
                    value={newPrimerApellido}
                    onChange={(e) => setNewPrimerApellido(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Pérez"
                    value={newSegundoApellido}
                    onChange={(e) => setNewSegundoApellido(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 focus:outline-none focus:border-proninez-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email del Acudiente
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tipo de Grupo
                  </label>
                  <select
                    value={newGroupType}
                    onChange={(e) => setNewGroupType(e.target.value as TipoGrupo)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs font-bold text-gray-900"
                  >
                    <option value="Programa">Programa Proyecto MelaDos (Estimulación)</option>
                    <option value="Control">Control (Comunidad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Centro de Estimulación Temprana (CET)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CET Cañazas / CET El Bale"
                    value={newCetOrigin}
                    onChange={(e) => setNewCetOrigin(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Grado Actual
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-gray-900 font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6].map(g => (
                      <option key={g} value={g}>Grado {g}°</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={registering || !newMatricula.trim()}
                  className="bg-proninez-green hover:bg-proninez-green/90 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                >
                  {registering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{registering ? 'Registrando...' : 'Registrar Estudiante Anti-Duplicado'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* INTERACTIVE EVALUATION SECTION */}
        {matchedStudent ? (
          <form onSubmit={handleSubmitEvaluation} className="space-y-8">
            {/* Instrument Picker & Open Full-screen Mode Button */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Seleccione el Instrumento Certificado</h3>
                <p className="text-xs text-gray-500">Evaluación estandarizada de lectura (EGRA) o matemáticas (EGMA)</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInstrument('EGRA')}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      instrument === 'EGRA'
                        ? 'bg-proninez-teal text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>EGRA (Lectura)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInstrument('EGMA')}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      instrument === 'EGMA'
                        ? 'bg-proninez-green text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>EGMA (Mate)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFullscreenRunner(true)}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Maximize2 className="w-4 h-4 text-proninez-teal" />
                  <span>▶️ Abrir Examen en Pantalla Completa</span>
                </button>
              </div>
            </div>

            {/* In-page Interactive Test Engine */}
            <InteractiveCertifiedEvaluation
              instrument={instrument}
              onScoresCalculated={(scores) => {
                if (instrument === 'EGRA') setEgraSubscores(scores);
                else setEgmaSubscores(scores);
              }}
            />

            {/* Observations */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Observaciones Cualitativas de Campo
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-3 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal focus:bg-white"
                placeholder="Comentarios sobre distracciones, fatiga, pronunciación o entorno de la prueba..."
              />
            </div>

            {/* Final Submission Bar */}
            <div className="bg-gray-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="text-xs text-gray-400 font-semibold">Calificación Total Calculada en Vivo ({instrument})</div>
                <div className="text-3xl font-black text-white">
                  {totalCalculatedScore}% <span className="text-xs text-gray-400 font-normal">/ 100%</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 ${
                  instrument === 'EGRA' ? 'bg-proninez-teal hover:bg-proninez-teal/90' : 'bg-proninez-green hover:bg-proninez-green/90'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Guardando...' : `Guardar Evaluación ${instrument}`}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-300 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-800">No hay estudiante seleccionado</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Utilice la barra de búsqueda o presione &quot;+ Crear Nuevo Estudiante&quot; para seleccionar al niño e iniciar la prueba.
            </p>
          </div>
        )}

        {/* Full-Screen Exam Runner Modal Overlay */}
        {showFullscreenRunner && matchedStudent && (
          <FullscreenTestRunner
            instrument={instrument}
            studentCode={matchedStudent.codigo_anonimo}
            schoolName={selectedSchool?.nombre_escuela || 'Escuela Registrada'}
            evaluatorName={[evaluatorFirstName, evaluatorLastName].filter(Boolean).join(' ') || 'Evaluador'}
            onClose={() => setShowFullscreenRunner(false)}
            onFinishEvaluation={(scores, total) => {
              if (instrument === 'EGRA') setEgraSubscores(scores);
              else setEgmaSubscores(scores);
              handleSubmitEvaluation(undefined, scores, total);
            }}
          />
        )}

        {/* Success Alert */}
        {submittedMessage && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-proninez-green text-xs font-bold flex items-center gap-3 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-proninez-green shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicEvaluatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-proninez-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-600">Cargando consola móvil de evaluación...</p>
        </div>
      </div>
    }>
      <PublicEvaluatorContent />
    </Suspense>
  );
}
