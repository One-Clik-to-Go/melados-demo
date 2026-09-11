'use client';

import React, { useState, useEffect } from 'react';
import {
  Play, Pause, RotateCcw, CheckCircle2, ArrowRight, ArrowLeft,
  X, Save, Award, Clock, BookOpen, Calculator, Sparkles, Check
} from 'lucide-react';
import {
  EGRA_LETRAS, EGRA_SONIDOS, EGRA_PALABRAS_SIMPLES, EGRA_PSEUDOPALABRAS,
  EGRA_PASAJE_TEXTO, EGRA_PREGUNTAS_LECTURA, EGRA_PREGUNTAS_AUDITIVA,
  EGMA_NUMEROS, EGMA_COMPARACION, EGMA_SECUENCIAS, EGMA_SUMAS, EGMA_RESTAS, EGMA_PROBLEMAS,
  calculateEgraScore, calculateEgmaScore
} from './InteractiveCertifiedEvaluation';

interface TestRunnerProps {
  instrument: 'EGRA' | 'EGMA';
  studentCode: string;
  schoolName: string;
  evaluatorName: string;
  onClose: () => void;
  onFinishEvaluation: (scores: any, totalScore: number) => void;
}

export const FullscreenTestRunner: React.FC<TestRunnerProps> = ({
  instrument,
  studentCode,
  schoolName,
  evaluatorName,
  onClose,
  onFinishEvaluation
}) => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Timer 60s
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  // EGRA Items States
  const [letrasStatus, setLetrasStatus] = useState<Record<number, boolean>>({});
  const [sonidosStatus, setSonidosStatus] = useState<Record<number, boolean>>({});
  const [palabrasStatus, setPalabrasStatus] = useState<Record<number, boolean>>({});
  const [pseudoStatus, setPseudoStatus] = useState<Record<number, boolean>>({});
  const [wordsMissed, setWordsMissed] = useState<Record<number, boolean>>({});
  const [respuestasLectura, setRespuestasLectura] = useState<Record<string, string>>({});
  const [respuestasAuditiva, setRespuestasAuditiva] = useState<Record<string, string>>({});

  // EGMA Items States
  const [numStatus, setNumStatus] = useState<Record<number, boolean>>({});
  const [compStatus, setCompStatus] = useState<Record<number, number>>({});
  const [seqStatus, setSeqStatus] = useState<Record<number, string>>({});
  const [sumasStatus, setSumasStatus] = useState<Record<number, boolean>>({});
  const [restasStatus, setRestasStatus] = useState<Record<number, boolean>>({});
  const [probStatus, setProbStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleStartTest = () => {
    setTestStarted(true);
    setTimerActive(true);
    setTimeLeft(60);
  };

  const toggleItem = (setter: React.Dispatch<React.SetStateAction<Record<number, boolean>>>, index: number) => {
    setter(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Compute calculated subscores
  const getEgraScores = () => {
    const correctLetras = Object.values(letrasStatus).filter(Boolean).length;
    const correctSonidos = Object.values(sonidosStatus).filter(Boolean).length;
    const correctPalabras = Object.values(palabrasStatus).filter(Boolean).length;
    const correctPseudo = Object.values(pseudoStatus).filter(Boolean).length;

    const pasajeWords = EGRA_PASAJE_TEXTO.split(' ');
    const missedCount = Object.values(wordsMissed).filter(Boolean).length;
    const correctPasaje = Math.max(0, pasajeWords.length - missedCount);

    let correctLectura = 0;
    EGRA_PREGUNTAS_LECTURA.forEach(q => {
      if (respuestasLectura[q.id] === q.correcta) correctLectura++;
    });

    let correctAuditiva = 0;
    EGRA_PREGUNTAS_AUDITIVA.forEach(q => {
      if (respuestasAuditiva[q.id] === q.correcta) correctAuditiva++;
    });

    return {
      recon_letras: correctLetras,
      sonido_letras: correctSonidos,
      palabras_simples: correctPalabras,
      pseudopalabras: correctPseudo,
      lectura_pasaje: correctPasaje,
      comprension_directa: correctLectura,
      comprension_auditiva: correctAuditiva,
    };
  };

  const getEgmaScores = () => {
    const correctNum = Object.values(numStatus).filter(Boolean).length;

    let correctComp = 0;
    EGMA_COMPARACION.forEach((item, idx) => {
      if (compStatus[idx] === item.mayor) correctComp++;
    });

    let correctSeq = 0;
    EGMA_SECUENCIAS.forEach((item, idx) => {
      if (seqStatus[idx] === item.correcta) correctSeq++;
    });

    const correctSumas = Object.values(sumasStatus).filter(Boolean).length;
    const correctRestas = Object.values(restasStatus).filter(Boolean).length;

    let correctProb = 0;
    EGMA_PROBLEMAS.forEach(p => {
      if (probStatus[p.id] === p.respuesta) correctProb++;
    });

    return {
      identificacion_numeros: correctNum,
      comparacion_cantidades: correctComp,
      secuencias_numericas: correctSeq,
      operaciones_suma: correctSumas,
      operaciones_resta: correctRestas,
      problemas_verbales: correctProb,
    };
  };

  const totalScore = instrument === 'EGRA'
    ? calculateEgraScore(getEgraScores()).score_total
    : calculateEgmaScore(getEgmaScores()).score_total;
  const subscores = instrument === 'EGRA' ? getEgraScores() : getEgmaScores();

  const totalSteps = instrument === 'EGRA' ? 7 : 6;

  const handleFinish = () => {
    onFinishEvaluation(subscores, totalScore);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col justify-between overflow-hidden animate-fade-in font-sans">
      {/* Top Navigation Bar */}
      <div className="bg-gray-900/90 backdrop-blur-md p-4 border-b border-gray-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
            instrument === 'EGRA' ? 'bg-proninez-teal' : 'bg-proninez-green'
          }`}>
            {instrument === 'EGRA' ? <BookOpen className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400">Prueba {instrument} • Estudiante {studentCode}</div>
            <div className="text-sm font-bold text-white">{schoolName}</div>
          </div>
        </div>

        {/* Stopwatch Timer */}
        {testStarted && (
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-2xl border border-gray-700">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-400 animate-bounce' : 'text-proninez-teal'}`} />
            <span className={`font-mono text-base font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className="text-gray-400 hover:text-white p-1"
            >
              {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Runner Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
        {!testStarted ? (
          /* START SCREEN */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl ${
              instrument === 'EGRA' ? 'bg-proninez-teal' : 'bg-proninez-green'
            }`}>
              {instrument === 'EGRA' ? <BookOpen className="w-10 h-10" /> : <Calculator className="w-10 h-10" />}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Prueba Estándar {instrument}
              </h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Modo examen interactivo diseñado para tablets y móviles. El temporizador de 60s iniciará automáticamente al presionar el botón.
              </p>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700 text-xs text-gray-300 space-y-2 text-left w-full max-w-md">
              <div className="flex justify-between">
                <span className="text-gray-400">Estudiante:</span>
                <span className="font-mono font-bold text-white">{studentCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Evaluador:</span>
                <span className="font-bold text-white">{evaluatorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Escuela:</span>
                <span className="font-bold text-white">{schoolName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartTest}
              className={`w-full max-w-md py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-3 transition-all shadow-2xl hover:scale-105 active:scale-95 ${
                instrument === 'EGRA' ? 'bg-proninez-teal hover:bg-proninez-teal/90' : 'bg-proninez-green hover:bg-proninez-green/90'
              }`}
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Iniciar Prueba / Comenzar Reloj</span>
            </button>
          </div>
        ) : (
          /* STEP BY STEP SUBTEST RUNNER */
          <div className="space-y-6">
            {/* Step Progress Header */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-b border-gray-800 pb-3">
              <span>Sub-prueba {currentStep + 1} de {totalSteps}</span>
              <span className="font-mono text-proninez-teal">{Math.round(((currentStep + 1) / totalSteps) * 100)}% Completado</span>
            </div>

            {/* Subtest Renderers */}
            {instrument === 'EGRA' ? (
              <>
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">1. Reconocimiento del Nombre de las Letras (100 ítems)</h3>
                    <p className="text-xs text-gray-400">Toque las letras que el niño lea CORRECTAMENTE:</p>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-gray-800 rounded-3xl border border-gray-700 font-mono text-center max-h-96 overflow-y-auto">
                      {EGRA_LETRAS.map((letra, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setLetrasStatus, idx)}
                          className={`py-3 rounded-xl text-sm font-bold transition-all ${
                            letrasStatus[idx] ? 'bg-proninez-teal text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {letra}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">2. Conocimiento del Sonido de las Letras (50 ítems)</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-gray-800 rounded-3xl border border-gray-700 font-mono text-center max-h-96 overflow-y-auto">
                      {EGRA_SONIDOS.map((snd, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setSonidosStatus, idx)}
                          className={`py-3 rounded-xl text-xs font-bold transition-all ${
                            sonidosStatus[idx] ? 'bg-proninez-green text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {snd}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">3. Lectura de Palabras Simples (50 palabras)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-gray-800 rounded-3xl border border-gray-700 text-center max-h-96 overflow-y-auto">
                      {EGRA_PALABRAS_SIMPLES.map((word, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setPalabrasStatus, idx)}
                          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all ${
                            palabrasStatus[idx] ? 'bg-proninez-pink text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">4. Lectura de Pseudopalabras (Palabras Inventadas - 50 ítems)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-gray-800 rounded-3xl border border-gray-700 text-center max-h-96 overflow-y-auto">
                      {EGRA_PSEUDOPALABRAS.map((word, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setPseudoStatus, idx)}
                          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all ${
                            pseudoStatus[idx] ? 'bg-proninez-teal text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">5. Lectura de Pasaje en Voz Alta</h3>
                    <p className="text-xs text-gray-400">Toque las palabras OMITIDAS o INCORRECTAS:</p>
                    <div className="p-5 bg-gray-800 rounded-3xl border border-gray-700 flex flex-wrap gap-2.5 text-sm leading-relaxed">
                      {EGRA_PASAJE_TEXTO.split(' ').map((word, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setWordsMissed, idx)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            wordsMissed[idx] ? 'bg-red-500 text-white line-through scale-105' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">6. Comprensión Lectora Directa (5 Preguntas)</h3>
                    <div className="space-y-4">
                      {EGRA_PREGUNTAS_LECTURA.map(q => (
                        <div key={q.id} className="p-4 bg-gray-800 rounded-2xl border border-gray-700 space-y-2">
                          <div className="text-xs font-bold text-white">{q.pregunta}</div>
                          <div className="flex flex-wrap gap-2">
                            {q.opciones.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setRespuestasLectura(prev => ({ ...prev, [q.id]: opt }))}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  respuestasLectura[q.id] === opt
                                    ? opt === q.correcta ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">7. Comprensión Auditiva (5 Preguntas)</h3>
                    <div className="space-y-4">
                      {EGRA_PREGUNTAS_AUDITIVA.map(q => (
                        <div key={q.id} className="p-4 bg-gray-800 rounded-2xl border border-gray-700 space-y-2">
                          <div className="text-xs font-bold text-white">{q.pregunta}</div>
                          <div className="flex flex-wrap gap-2">
                            {q.opciones.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setRespuestasAuditiva(prev => ({ ...prev, [q.id]: opt }))}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  respuestasAuditiva[q.id] === opt
                                    ? opt === q.correcta ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* EGMA Steps */
              <>
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">1. Identificación de Números (20 ítems)</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-10 gap-2 p-3 bg-gray-800 rounded-3xl border border-gray-700 font-mono text-center">
                      {EGMA_NUMEROS.map((num, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setNumStatus, idx)}
                          className={`py-4 rounded-xl text-base font-bold transition-all ${
                            numStatus[idx] ? 'bg-proninez-teal text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">2. Comparación de Cantidades (10 Pares)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {EGMA_COMPARACION.map((pair, idx) => (
                        <div key={idx} className="p-4 bg-gray-800 rounded-2xl border border-gray-700 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400">Par {idx + 1}:</span>
                          <div className="flex gap-2">
                            {[pair.n1, pair.n2].map(n => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setCompStatus(prev => ({ ...prev, [idx]: n }))}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                                  compStatus[idx] === n
                                    ? n === pair.mayor ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">3. Secuencias Numéricas (10 series)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {EGMA_SECUENCIAS.map((item, idx) => (
                        <div key={idx} className="p-4 bg-gray-800 rounded-2xl border border-gray-700 space-y-2">
                          <div className="text-sm font-mono font-bold text-white">{item.seq}</div>
                          <div className="flex gap-2">
                            {item.opciones.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSeqStatus(prev => ({ ...prev, [idx]: opt }))}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  seqStatus[idx] === opt
                                    ? opt === item.correcta ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">4. Operaciones Básicas de Suma (20 ejercicios)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-gray-800 rounded-3xl border border-gray-700 font-mono text-center">
                      {EGMA_SUMAS.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setSumasStatus, idx)}
                          className={`py-3 rounded-xl text-xs font-bold transition-all ${
                            sumasStatus[idx] ? 'bg-proninez-teal text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                        >
                          {item.eq} = {item.res}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">5. Operaciones Básicas de Resta (20 ejercicios)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-gray-800 rounded-3xl border border-gray-700 font-mono text-center">
                      {EGMA_RESTAS.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleItem(setRestasStatus, idx)}
                          className={`py-3 rounded-xl text-xs font-bold transition-all ${
                            restasStatus[idx] ? 'bg-proninez-green text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                        >
                          {item.eq} = {item.res}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">6. Problemas Verbales de Razonamiento (5 ejercicios)</h3>
                    <div className="space-y-4">
                      {EGMA_PROBLEMAS.map(p => (
                        <div key={p.id} className="p-4 bg-gray-800 rounded-2xl border border-gray-700 space-y-2">
                          <div className="text-xs font-bold text-white">{p.problema}</div>
                          <input
                            type="number"
                            value={probStatus[p.id] ?? ''}
                            onChange={(e) => setProbStatus(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                            placeholder="Respuesta del niño"
                            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm font-mono font-bold text-white w-40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      {testStarted && (
        <div className="bg-gray-900 border-t border-gray-800 p-4 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="text-center font-bold text-sm text-white">
            Puntaje Calculado: <span className="text-proninez-teal font-black">{totalScore}%</span>
          </div>

          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
              className="bg-proninez-teal hover:bg-proninez-teal/90 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <span>Siguiente Sub-prueba</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="bg-proninez-green hover:bg-proninez-green/90 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse"
            >
              <Save className="w-4 h-4" />
              <span>Finalizar y Guardar Prueba</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
