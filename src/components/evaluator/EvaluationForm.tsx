'use client';

import React, { useState, useEffect } from 'react';
import { enqueueEvaluation } from '@/lib/offline/db';
import { EvaluationIngestPayload, UserRole } from '@/types/database';
import { InteractiveCertifiedEvaluation, calculateEgraScore, calculateEgmaScore } from './InteractiveCertifiedEvaluation';
import { BookOpen, Calculator, CheckCircle2, Save, Sparkles, Copy, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface StudentOption {
  codigo_anonimo: string;
  tipo_grupo: string;
  cet_origen: string;
  nombre_escuela: string;
  escuela_actual_id?: string;
}

interface EvaluationFormProps {
  isOnline: boolean;
  currentRole: UserRole;
  onEvaluationSubmitted?: () => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ isOnline, currentRole, onEvaluationSubmitted }) => {
  const [instrument, setInstrument] = useState<'EGRA' | 'EGMA'>('EGRA');
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [codigoAnonimo, setCodigoAnonimo] = useState<string>('');
  const [evaluadorNombre, setEvaluadorNombre] = useState<string>('');
  const [gradoEvaluado, setGradoEvaluado] = useState<number>(2);
  const [observaciones, setObservaciones] = useState<string>('');

  // Sticky Batch Session state
  const [stickySession, setStickySession] = useState<boolean>(false);
  const [sessionSchool, setSessionSchool] = useState<string>('');

  // Calculated scores from interactive test items
  const [egraScores, setEgraScores] = useState<any>({
    recon_letras: 0,
    sonido_letras: 0,
    palabras_simples: 0,
    pseudopalabras: 0,
    lectura_pasaje: 0,
    comprension_directa: 0,
    comprension_auditiva: 0,
  });

  const [egmaScores, setEgmaScores] = useState<any>({
    identificacion_numeros: 0,
    comparacion_cantidades: 0,
    secuencias_numericas: 0,
    operaciones_suma: 0,
    operaciones_resta: 0,
    problemas_verbales: 0,
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Load students dynamically
  useEffect(() => {
    setLoadingStudents(true);
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (data.estudiantes && data.estudiantes.length > 0) {
          const options: StudentOption[] = data.estudiantes.map((s: any) => ({
            codigo_anonimo: s.codigo_anonimo,
            tipo_grupo: s.tipo_grupo,
            cet_origen: s.cet_origen,
            nombre_escuela: s.nombre_escuela,
            escuela_actual_id: s.escuela_actual_id,
          }));
          setStudentOptions(options);
          if (!codigoAnonimo) {
            setCodigoAnonimo(options[0].codigo_anonimo);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, []);

  // Pre-fill from URL parameters if provided (e.g. /evaluar?evaluador=Lic.+Maria)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlEvaluador = params.get('evaluador');
      const urlEscuela = params.get('escuela');
      const urlEstudiante = params.get('estudiante');

      if (urlEvaluador) setEvaluadorNombre(urlEvaluador);
      if (urlEscuela) setSessionSchool(urlEscuela);
      if (urlEstudiante) setCodigoAnonimo(urlEstudiante);
    }
  }, []);

  const totalScoreCalculated = instrument === 'EGRA'
    ? calculateEgraScore(egraScores).score_total
    : calculateEgmaScore(egmaScores).score_total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigoAnonimo || !evaluadorNombre.trim()) {
      alert('Por favor seleccione un código de estudiante e ingrese el nombre del evaluador.');
      return;
    }

    setSaving(true);
    setSuccessMessage(null);

    const selectedStudent = studentOptions.find(s => s.codigo_anonimo === codigoAnonimo);

    const payload: EvaluationIngestPayload = {
      instrumento: instrument,
      codigo_anonimo: codigoAnonimo,
      tipo_grupo: (selectedStudent?.tipo_grupo as any) || 'Programa',
      evaluador_nombre: evaluadorNombre.trim(),
      grado_evaluado: gradoEvaluado,
      escuela_actual_id: selectedStudent?.escuela_actual_id || 'escuela-san-pedro',
      respuestas: instrument === 'EGRA' ? egraScores : egmaScores,
      scoring_calculado: {
        score_total: totalScoreCalculated,
        sub_scores: instrument === 'EGRA' ? egraScores : egmaScores,
      },
      observaciones_evaluador: observaciones,
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

        if (!res.ok) throw new Error('Error al guardar en el servidor');
        setSuccessMessage(`Prueba ${instrument} guardada e indexada en tiempo real.`);
      } else {
        await enqueueEvaluation(payload);
        setSuccessMessage(`Prueba ${instrument} guardada LOCALMENTE. Se sincronizará al detectar internet.`);
      }

      if (onEvaluationSubmitted) onEvaluationSubmitted();

      // If Sticky Session is active, keep evaluator and school, reset student only
      if (!stickySession) {
        setObservaciones('');
      } else {
        setObservaciones('');
        // Pick next student in line if available
        const currentIdx = studentOptions.findIndex(s => s.codigo_anonimo === codigoAnonimo);
        if (currentIdx >= 0 && currentIdx + 1 < studentOptions.length) {
          setCodigoAnonimo(studentOptions[currentIdx + 1].codigo_anonimo);
        }
      }
    } catch {
      setSuccessMessage('No se pudo enviar online. Guardado en cola local.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/evaluar?evaluador=${encodeURIComponent(evaluadorNombre)}&escuela=${encodeURIComponent(sessionSchool)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm space-y-6">
      {/* Header & Sticky Session Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Consola Móvil de Evaluación Certificada</h2>
            <span className="bg-proninez-green/10 text-proninez-green text-xs px-2.5 py-0.5 rounded-full font-bold border border-proninez-green/20">
              Ítems EGRA / EGMA Reales
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Aplicación ítem por ítem en tiempo real para evaluaciones estandarizadas de lectura y matemáticas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            title="Copiar enlace preconfigurado para evaluadores"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-proninez-green" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace de Sesión'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sticky Session Bar */}
        <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
            <input
              type="checkbox"
              checked={stickySession}
              onChange={(e) => setStickySession(e.target.checked)}
              className="w-4 h-4 text-proninez-teal rounded focus:ring-proninez-teal"
            />
            <span>Fijar sesión para evaluar varios estudiantes consecutivamente en lote</span>
          </label>

          {stickySession && (
            <span className="text-[11px] bg-white text-proninez-teal px-2.5 py-1 rounded-lg border border-teal-200 font-bold flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-proninez-teal" />
              Modo Lote Activo
            </span>
          )}
        </div>

        {/* Top Controls: Instrument, Evaluator, Student */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Instrumento Certificado
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInstrument('EGRA')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  instrument === 'EGRA'
                    ? 'bg-proninez-teal text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>EGRA (Lectura)</span>
              </button>

              <button
                type="button"
                onClick={() => setInstrument('EGMA')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  instrument === 'EGMA'
                    ? 'bg-proninez-green text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>EGMA (Mate)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Evaluador de Campo
            </label>
            <input
              type="text"
              required
              placeholder="Nombre del evaluador"
              value={evaluadorNombre}
              onChange={(e) => setEvaluadorNombre(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Estudiante a Evaluar
            </label>
            <select
              value={codigoAnonimo}
              onChange={(e) => setCodigoAnonimo(e.target.value)}
              disabled={loadingStudents}
              className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 font-mono font-bold"
            >
              {studentOptions.map(st => (
                <option key={st.codigo_anonimo} value={st.codigo_anonimo}>
                  {st.codigo_anonimo} ({st.tipo_grupo} - {st.nombre_escuela})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real Certified Items Interactive Component */}
        <InteractiveCertifiedEvaluation
          instrument={instrument}
          onScoresCalculated={(scores) => {
            if (instrument === 'EGRA') setEgraScores(scores);
            else setEgmaScores(scores);
          }}
        />

        {/* Observations */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Observaciones Cualitativas de Campo
          </label>
          <textarea
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-proninez-teal"
            placeholder="Comentarios sobre fatiga del niño, distracciones o contexto de la prueba..."
          />
        </div>

        {/* Total Score & Submission Bar */}
        <div className="p-4 rounded-2xl bg-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-proninez-teal" />
            <div>
              <div className="text-xs text-gray-400 font-semibold">Calificación Total Calculada ({instrument})</div>
              <div className="text-2xl font-black text-white">
                {totalScoreCalculated}% <span className="text-xs text-gray-400 font-normal">/ 100%</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !codigoAnonimo || !evaluadorNombre.trim()}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white transition-all shadow-lg disabled:opacity-50 ${
              instrument === 'EGRA' ? 'bg-proninez-teal hover:bg-proninez-teal/90' : 'bg-proninez-green hover:bg-proninez-green/90'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : `Guardar Evaluación ${instrument}`}</span>
          </button>
        </div>
      </form>

      {/* Success Notification */}
      {successMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-green-50 border border-green-200 text-proninez-green text-xs flex items-center gap-3 font-bold">
          <CheckCircle2 className="w-5 h-5 text-proninez-green shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
